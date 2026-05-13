from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from decimal import Decimal


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    currency: str = "INR"
    monthly_income: Optional[Decimal] = None
    primary_goal: Optional[str] = None
    risk_appetite: str = "moderate"


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    currency: Optional[str] = None
    monthly_income: Optional[Decimal] = None
    primary_goal: Optional[str] = None
    risk_appetite: Optional[str] = None


class UserResponse(UserBase):
    id: str
    avatar_url: Optional[str] = None
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class TokenRefresh(BaseModel):
    refresh_token: str
