from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from enum import Enum


class GoalCategory(str, Enum):
    EMERGENCY = "Emergency"
    TRAVEL = "Travel"
    PURCHASE = "Purchase"
    INVESTMENT = "Investment"
    OTHER = "Other"


class GoalBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    target_amount: Decimal = Field(..., gt=0, decimal_places=2)
    saved_amount: Decimal = Field(default=0, ge=0, decimal_places=2)
    deadline: Optional[date] = None
    category: Optional[GoalCategory] = None
    notes: Optional[str] = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    target_amount: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    saved_amount: Optional[Decimal] = Field(None, ge=0, decimal_places=2)
    deadline: Optional[date] = None
    category: Optional[GoalCategory] = None
    notes: Optional[str] = None
    is_completed: Optional[bool] = None


class GoalResponse(GoalBase):
    id: str
    user_id: str
    is_completed: bool
    progress_percentage: float
    monthly_contribution: Optional[Decimal] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class AddFundsRequest(BaseModel):
    amount: Decimal = Field(..., gt=0, decimal_places=2)
