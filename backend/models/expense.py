from sqlalchemy import Column, String, Boolean, Numeric, Text, Date, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from core.database import Base


class Expense(Base):
    __tablename__ = "expenses"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    product_name = Column(String, nullable=False)
    category = Column(String(50), nullable=False, index=True)
    payment_method = Column(String(30))
    expense_date = Column(Date, nullable=False, index=True)
    notes = Column(Text)
    receipt_url = Column(Text)
    is_recurring = Column(Boolean, default=False)
    recurrence_interval = Column(String(10))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())
