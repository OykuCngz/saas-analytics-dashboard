from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AnalyticsEventBase(BaseModel):
    metric_name: str
    value: float
    category: str

class AnalyticsEventCreate(AnalyticsEventBase):
    pass

class AnalyticsEvent(AnalyticsEventBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True
