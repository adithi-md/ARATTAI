from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from datetime import date, timedelta
import uuid

from core.database import get_db
from core.security import get_current_user_id
from models.user import User
from models.expense import Expense
from models.goal import Goal
from models.ai_message import AIMessage
from schemas.ai import ChatRequest, ChatResponse, InsightRequest, InsightResponse, ChatMessage

from agents.router_agent import RouterAgent
from agents.expense_agent import ExpenseAnalysisAgent
from agents.budget_agent import BudgetPlanningAgent
from agents.savings_agent import SavingsAdvisorAgent
from agents.investment_agent import InvestmentEducationAgent

router = APIRouter()

# Initialize agents
router_agent = RouterAgent()
expense_agent = ExpenseAnalysisAgent()
budget_agent = BudgetPlanningAgent()
savings_agent = SavingsAdvisorAgent()
investment_agent = InvestmentEducationAgent()


async def get_user_context(user_id: str, db: AsyncSession) -> dict:
    """Get user context for AI agents"""
    # Get user data
    result = await db.execute(select(User).where(User.id == uuid.UUID(user_id)))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Get recent expenses (last 90 days)
    ninety_days_ago = date.today() - timedelta(days=90)
    result = await db.execute(
        select(Expense)
        .where(
            Expense.user_id == uuid.UUID(user_id),
            Expense.expense_date >= ninety_days_ago,
        )
        .order_by(Expense.expense_date.desc())
    )
    expenses = result.scalars().all()
    
    # Get goals
    result = await db.execute(
        select(Goal).where(Goal.user_id == uuid.UUID(user_id))
    )
    goals = result.scalars().all()
    
    return {
        "user": {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "currency": user.currency,
            "monthly_income": user.monthly_income,
            "primary_goal": user.primary_goal,
            "risk_appetite": user.risk_appetite,
        },
        "expenses": [
            {
                "id": str(e.id),
                "amount": e.amount,
                "product_name": e.product_name,
                "category": e.category,
                "expense_date": e.expense_date.isoformat(),
                "payment_method": e.payment_method,
            }
            for e in expenses
        ],
        "goals": [
            {
                "id": str(g.id),
                "name": g.name,
                "target_amount": g.target_amount,
                "saved_amount": g.saved_amount,
                "deadline": g.deadline.isoformat() if g.deadline else None,
                "category": g.category,
            }
            for g in goals
        ],
    }


@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Chat with Arattai AI assistant"""
    # Get user context
    context = await get_user_context(user_id, db)
    
    # Route to appropriate agent
    agent_type = router_agent.route(request.message)
    
    # Execute agent
    try:
        if agent_type == "expense_analysis":
            analysis = await expense_agent.analyze(context["expenses"], context["user"])
            response_text = expense_agent.generate_response(analysis)
            
        elif agent_type == "budget_planning":
            budget_data = await budget_agent.create_budget(context["user"], context["expenses"])
            response_text = budget_agent.generate_response(budget_data)
            
        elif agent_type == "savings_advisor":
            savings_analysis = await savings_agent.analyze_goals(context["goals"], context["user"])
            response_text = savings_agent.generate_response(savings_analysis)
            
        elif agent_type == "investment_education":
            education_data = await investment_agent.educate(context["user"])
            response_text = investment_agent.generate_response(education_data)
            
        else:
            response_text = "I'm not sure how to help with that. Try asking about your expenses, budget, savings goals, or investments."
    
    except Exception as e:
        response_text = f"I encountered an error processing your request: {str(e)}"
        agent_type = "error"
    
    # Save messages to database
    user_message = AIMessage(
        user_id=uuid.UUID(user_id),
        role="user",
        content=request.message,
    )
    db.add(user_message)
    
    assistant_message = AIMessage(
        user_id=uuid.UUID(user_id),
        role="assistant",
        content=response_text,
        agent_used=agent_type,
    )
    db.add(assistant_message)
    
    await db.commit()
    
    # Generate suggestions
    suggestions = [
        "Analyze my spending this month",
        "Create a budget plan",
        "How can I save more?",
        "Tell me about investment options",
    ]
    
    return ChatResponse(
        message=response_text,
        agent_used=agent_type,
        suggestions=suggestions,
    )


@router.get("/chat/history", response_model=List[ChatMessage])
async def get_chat_history(
    limit: int = 50,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get chat history"""
    result = await db.execute(
        select(AIMessage)
        .where(AIMessage.user_id == uuid.UUID(user_id))
        .order_by(AIMessage.created_at.desc())
        .limit(limit)
    )
    messages = result.scalars().all()
    
    return [
        ChatMessage(
            role=msg.role,
            content=msg.content,
            agent_used=msg.agent_used,
            created_at=msg.created_at,
        )
        for msg in reversed(messages)
    ]


@router.post("/insights", response_model=InsightResponse)
async def get_ai_insight(
    request: InsightRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get specific AI insight"""
    context = await get_user_context(user_id, db)
    
    if request.insight_type == "expense_analysis":
        analysis = await expense_agent.analyze(context["expenses"], context["user"])
        return InsightResponse(
            insight_type="expense_analysis",
            title="Expense Analysis",
            description=expense_agent.generate_response(analysis),
            data=analysis,
            generated_at=date.today(),
        )
    
    elif request.insight_type == "budget_planning":
        budget_data = await budget_agent.create_budget(context["user"], context["expenses"])
        return InsightResponse(
            insight_type="budget_planning",
            title="Budget Plan",
            description=budget_agent.generate_response(budget_data),
            data=budget_data,
            generated_at=date.today(),
        )
    
    elif request.insight_type == "savings_advisor":
        savings_analysis = await savings_agent.analyze_goals(context["goals"], context["user"])
        return InsightResponse(
            insight_type="savings_advisor",
            title="Savings Advice",
            description=savings_agent.generate_response(savings_analysis),
            data=savings_analysis,
            generated_at=date.today(),
        )
    
    elif request.insight_type == "investment_education":
        education_data = await investment_agent.educate(context["user"])
        return InsightResponse(
            insight_type="investment_education",
            title="Investment Education",
            description=investment_agent.generate_response(education_data),
            data=education_data,
            generated_at=date.today(),
        )
    
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid insight type",
        )
