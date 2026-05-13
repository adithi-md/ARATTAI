from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class AgentType(str, Enum):
    EXPENSE_ANALYSIS = "expense_analysis"
    BUDGET_PLANNING = "budget_planning"
    SAVINGS_ADVISOR = "savings_advisor"
    INVESTMENT_EDUCATION = "investment_education"


class ChatMessage(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str
    agent_used: Optional[str] = None
    created_at: Optional[datetime] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    conversation_history: Optional[List[ChatMessage]] = []


class ChatResponse(BaseModel):
    message: str
    agent_used: str
    suggestions: Optional[List[str]] = []
    metadata: Optional[dict] = None


class InsightRequest(BaseModel):
    insight_type: AgentType
    parameters: Optional[dict] = {}


class InsightResponse(BaseModel):
    insight_type: str
    title: str
    description: str
    data: Optional[dict] = None
    recommendations: Optional[List[str]] = []
    generated_at: datetime
