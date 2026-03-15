from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from .database import Base

class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    id = Column(Integer, primary_key=True, index=True)
    metric_name = Column(String)
    value = Column(Float)
    category = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
