from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database, auth, cache
from .database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="EcoTrack SaaS API",
    description="Enterprise-grade sustainability analytics API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/", tags=["Health"])
def read_root():
    return {
        "message": "Welcome to EcoTrack API",
        "status": "healthy",
        "docs": "/docs"
    }

@app.get("/stats", response_model=List[schemas.AnalyticsEvent], tags=["Analytics"])
@cache.cache_response(expire_seconds=300)
async def get_stats(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):

    events = db.query(models.AnalyticsEvent).filter(models.AnalyticsEvent.company_id == current_user.company_id).all()
    if not events:
        # Seed initial data if DB is empty for this company
        initial_data = [
            models.AnalyticsEvent(metric_name="Carbon Offset", value=450.5, category="Environment", company_id=current_user.company_id),
            models.AnalyticsEvent(metric_name="Energy Saved", value=1200.0, category="Logistics", company_id=current_user.company_id),
            models.AnalyticsEvent(metric_name="Water Recovered", value=85.2, category="Resources", company_id=current_user.company_id)
        ]
        db.add_all(initial_data)
        db.commit()
        events = db.query(models.AnalyticsEvent).filter(models.AnalyticsEvent.company_id == current_user.company_id).all()
    
    # Convert SQLAlchemy objects to dicts for JSON serialization in cache decorator
    return [schemas.AnalyticsEvent.from_orm(e).dict() for e in events]

@app.post("/events", response_model=schemas.AnalyticsEvent, tags=["Analytics"])
def create_event(event: schemas.AnalyticsEventCreate, db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_event = models.AnalyticsEvent(**event.dict(), company_id=current_user.company_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    
    # Invalidate cache for this company so the dashboard reflects the new data
    cache.invalidate_company_cache(current_user.company_id)
    
    return db_event

@app.get("/recent-activity", response_model=schemas.AnalyticsEventPaginated, tags=["Analytics"])
@cache.cache_response(expire_seconds=60)
async def get_recent_activity(
    page: int = 1, 
    size: int = 5, 
    start_date: str = None, 
    end_date: str = None, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.AnalyticsEvent).filter(models.AnalyticsEvent.company_id == current_user.company_id)
    
    if start_date:
        query = query.filter(models.AnalyticsEvent.timestamp >= start_date)
    if end_date:
        query = query.filter(models.AnalyticsEvent.timestamp <= end_date)
        
    total = query.count()
    items = query.order_by(models.AnalyticsEvent.timestamp.desc()).offset((page - 1) * size).limit(size).all()
    
    result = {
        "items": [schemas.AnalyticsEvent.from_orm(i).dict() for i in items],
        "total": total,
        "page": page,
        "size": size
    }
    return result

import pandas as pd
import io
from fastapi import UploadFile, File

@app.post("/upload-csv", tags=["Analytics"])
async def upload_csv(
    file: UploadFile = File(...), 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")
    
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    
    required_cols = ['metric_name', 'value', 'category']
    if not all(col in df.columns for col in required_cols):
        raise HTTPException(status_code=400, detail=f"CSV must contain: {', '.join(required_cols)}")
    
    events = []
    for _, row in df.iterrows():
        event = models.AnalyticsEvent(
            metric_name=row['metric_name'],
            value=float(row['value']),
            category=row['category'],
            company_id=current_user.company_id
        )
        events.append(event)
    
    db.add_all(events)
    db.commit()
    
    # Invalidate cache
    cache.invalidate_company_cache(current_user.company_id)
    
    return {"message": f"Successfully uploaded {len(events)} events"}
