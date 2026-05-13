from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from core.database import Base


class AIMessage(Base):
    __tablename__ = "ai_messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String(10), nullable=False)
    content = Column(Text, nullable=False)
    agent_used = Column(String(50))
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), index=True)
    
    __table_args__ = (
        CheckConstraint("role IN ('user', 'assistant')", name="check_role"),
    )
