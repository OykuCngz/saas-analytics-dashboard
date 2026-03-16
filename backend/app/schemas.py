from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class CompanyBase(BaseModel):
    name: str

class CompanyCreate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    company_name: str

class User(UserBase):
    id: int
    is_active: bool
    company_id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class AnalyticsEventBase(BaseModel):
    metric_name: str
    value: float
    category: str

class AnalyticsEventCreate(AnalyticsEventBase):
    pass

class AnalyticsEvent(AnalyticsEventBase):
    id: int
    timestamp: datetime
    company_id: int

    class Config:
        from_attributes = True

class AnalyticsEventPaginated(BaseModel):
    items: List[AnalyticsEvent]
    total: int
    page: int
    size: int
