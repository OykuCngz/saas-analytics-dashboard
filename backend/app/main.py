from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database
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

@app.get("/", tags=["Health"])
def read_root():
    return {
        "message": "Welcome to EcoTrack API",
        "status": "healthy",
        "docs": "/docs"
    }

@app.get("/stats", response_model=List[schemas.AnalyticsEvent], tags=["Analytics"])
def get_stats(db: Session = Depends(get_db)):

    events = db.query(models.AnalyticsEvent).all()
    if not events:
        # Seed initial data if DB is empty
        initial_data = [
            models.AnalyticsEvent(metric_name="Carbon Offset", value=450.5, category="Environment"),
            models.AnalyticsEvent(metric_name="Energy Saved", value=1200.0, category="Logistics"),
            models.AnalyticsEvent(metric_name="Water Recovered", value=85.2, category="Resources")
        ]
        db.add_all(initial_data)
        db.commit()
        events = db.query(models.AnalyticsEvent).all()
    
    return events

@app.post("/events", response_model=schemas.AnalyticsEvent, tags=["Analytics"])

def create_event(event: schemas.AnalyticsEventCreate, db: Session = Depends(get_db)):
    db_event = models.AnalyticsEvent(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
