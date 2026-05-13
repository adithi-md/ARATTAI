"""
Main FastAPI application with multi-agent system
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional

from agents.investment_agent import InvestmentAdvisorAgent
from agents.expense_agent import ExpenseIntelligenceAgent
from agents.goal_agent import GoalPlanningAgent
from agents.risk_agent import RiskMonitoringAgent

app = FastAPI(title="ARATTAI Multi-Agent System", version="1.0.0")

# CORS - Allow local development and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        "https://arattai.vercel.app",
        "https://arattai-*.vercel.app"
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize agents
investment_agent = InvestmentAdvisorAgent()
expense_agent = ExpenseIntelligenceAgent()
goal_agent = GoalPlanningAgent()
risk_agent = RiskMonitoringAgent()


# Request/Response Models
class UserProfile(BaseModel):
    name: str
    age: int
    monthly_income: float
    monthly_expenses: float
    bank_balance: float
    cash_in_hand: float
    existing_investments: float
    risk_appetite: str
    financial_goal: str


class ExpenseItem(BaseModel):
    amount: float
    category: str
    date: str
    description: Optional[str] = None


class GoalItem(BaseModel):
    name: str
    target_amount: float
    saved_amount: float
    deadline: Optional[str] = None


# API Endpoints

@app.get("/")
def root():
    return {
        "service": "ARATTAI Multi-Agent System",
        "version": "1.0.0",
        "agents": [
            "Investment Advisor",
            "Expense Intelligence",
            "Goal Planning",
            "Risk Monitoring"
        ]
    }


@app.post("/api/agents/investment/analyze")
def analyze_investment(profile: UserProfile):
    """Get investment recommendations from Investment Advisor Agent"""
    try:
        result = investment_agent.analyze_profile(profile.dict())
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/expense/analyze")
def analyze_expenses(profile: UserProfile, expenses: List[ExpenseItem]):
    """Get expense analysis from Expense Intelligence Agent"""
    try:
        expense_list = [e.dict() for e in expenses]
        result = expense_agent.analyze_expenses(expense_list, profile.dict())
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/goal/plan")
def plan_goal(profile: UserProfile, goal: GoalItem):
    """Get goal planning from Goal Planning Agent"""
    try:
        result = goal_agent.create_goal_plan(goal.dict(), profile.dict())
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/risk/assess")
def assess_risk(profile: UserProfile, expenses: Optional[List[ExpenseItem]] = None):
    """Get risk assessment from Risk Monitoring Agent"""
    try:
        expense_list = [e.dict() for e in expenses] if expenses else None
        result = risk_agent.assess_risks(profile.dict(), expense_list)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/agents/orchestrate")
def orchestrate_agents(profile: UserProfile, expenses: Optional[List[ExpenseItem]] = None, goals: Optional[List[GoalItem]] = None):
    """Orchestrate all agents for comprehensive analysis"""
    try:
        # Run all agents
        investment_analysis = investment_agent.analyze_profile(profile.dict())
        
        expense_list = [e.dict() for e in expenses] if expenses else []
        expense_analysis = expense_agent.analyze_expenses(expense_list, profile.dict())
        
        risk_assessment = risk_agent.assess_risks(profile.dict(), expense_list)
        
        goal_plans = []
        if goals:
            for goal in goals:
                plan = goal_agent.create_goal_plan(goal.dict(), profile.dict())
                goal_plans.append(plan)
        
        # Combine insights
        combined_insights = {
            "investment": investment_analysis,
            "expenses": expense_analysis,
            "risks": risk_assessment,
            "goals": goal_plans,
            "summary": {
                "health_score": 100 - risk_assessment['risk_score'],
                "top_priority": risk_assessment['priority_actions'][0] if risk_assessment['priority_actions'] else None,
                "recommended_action": investment_analysis['insights'][0] if investment_analysis['insights'] else None
            }
        }
        
        return {"success": True, "data": combined_insights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
