from pydantic import BaseModel, Field
from typing import Optional
from datetime import date, datetime
from decimal import Decimal
from enum import Enum


class ExpenseCategory(str, Enum):
    FOOD = "Food"
    TRANSPORT = "Transport"
    SHOPPING = "Shopping"
    ENTERTAINMENT = "Entertainment"
    EDUCATION = "Education"
    HEALTH = "Health"
    BILLS = "Bills"
    INVESTMENT = "Investment"
    OTHER = "Other"


class PaymentMethod(str, Enum):
    CASH = "Cash"
    UPI = "UPI"
    CARD = "Card"
    NET_BANKING = "Net Banking"


class RecurrenceInterval(str, Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class ExpenseBase(BaseModel):
    amount: Decimal = Field(..., gt=0, decimal_places=2)
    product_name: str = Field(..., min_length=1, max_length=200)
    category: ExpenseCategory
    payment_method: Optional[PaymentMethod] = None
    expense_date: date
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_recurring: bool = False
    recurrence_interval: Optional[RecurrenceInterval] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal] = Field(None, gt=0, decimal_places=2)
    product_name: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[ExpenseCategory] = None
    payment_method: Optional[PaymentMethod] = None
    expense_date: Optional[date] = None
    notes: Optional[str] = None
    receipt_url: Optional[str] = None
    is_recurring: Optional[bool] = None
    recurrence_interval: Optional[RecurrenceInterval] = None


class ExpenseResponse(ExpenseBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ExpenseSummary(BaseModel):
    total_amount: Decimal
    count: int
    category: Optional[str] = None
