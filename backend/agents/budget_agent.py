from typing import Dict, List, Any
from decimal import Decimal


class BudgetPlanningAgent:
    """Agent for creating budget plans"""
    
    def __init__(self):
        self.name = "Budget Planning Agent"
    
    async def create_budget(self, user_data: Dict[str, Any], expenses: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create a budget plan based on 50/30/20 rule"""
        monthly_income = float(user_data.get("monthly_income", 0))
        
        if monthly_income <= 0:
            return {
                "error": "Monthly income not set. Please update your profile to get a personalized budget plan.",
            }
        
        # 50/30/20 Budget Rule
        needs_budget = monthly_income * 0.50  # 50% for needs
        wants_budget = monthly_income * 0.30  # 30% for wants
        savings_budget = monthly_income * 0.20  # 20% for savings
        
        # Categorize expenses
        needs_categories = ["Food", "Transport", "Bills", "Health"]
        wants_categories = ["Shopping", "Entertainment", "Other"]
        
        current_needs = 0
        current_wants = 0
        
        for expense in expenses:
            amount = float(expense.get("amount", 0))
            category = expense.get("category", "Other")
            
            if category in needs_categories:
                current_needs += amount
            elif category in wants_categories:
                current_wants += amount
        
        # Calculate current savings
        current_savings = monthly_income - (current_needs + current_wants)
        
        # Generate recommendations
        recommendations = []
        
        if current_needs > needs_budget:
            overspend = current_needs - needs_budget
            recommendations.append({
                "category": "Needs",
                "message": f"You're overspending on needs by ₹{overspend:,.2f}. Look for ways to reduce essential expenses.",
                "priority": "high",
            })
        
        if current_wants > wants_budget:
            overspend = current_wants - wants_budget
            recommendations.append({
                "category": "Wants",
                "message": f"You're overspending on wants by ₹{overspend:,.2f}. Consider cutting back on non-essential purchases.",
                "priority": "medium",
            })
        
        if current_savings < savings_budget:
            shortfall = savings_budget - current_savings
            recommendations.append({
                "category": "Savings",
                "message": f"You're ₹{shortfall:,.2f} short of your savings goal. Try to reduce expenses to meet your 20% savings target.",
                "priority": "high",
            })
        elif current_savings > savings_budget:
            excess = current_savings - savings_budget
            recommendations.append({
                "category": "Savings",
                "message": f"Great job! You're saving ₹{excess:,.2f} more than the recommended 20%. Consider investing this surplus.",
                "priority": "low",
            })
        
        return {
            "monthly_income": monthly_income,
            "budget_plan": {
                "needs": {
                    "budget": needs_budget,
                    "current": current_needs,
                    "remaining": needs_budget - current_needs,
                    "percentage": (current_needs / monthly_income) * 100,
                },
                "wants": {
                    "budget": wants_budget,
                    "current": current_wants,
                    "remaining": wants_budget - current_wants,
                    "percentage": (current_wants / monthly_income) * 100,
                },
                "savings": {
                    "budget": savings_budget,
                    "current": current_savings,
                    "remaining": savings_budget - current_savings,
                    "percentage": (current_savings / monthly_income) * 100,
                },
            },
            "recommendations": recommendations,
        }
    
    def generate_response(self, budget_data: Dict[str, Any]) -> str:
        """Generate human-readable budget plan"""
        if "error" in budget_data:
            return budget_data["error"]
        
        plan = budget_data["budget_plan"]
        income = budget_data["monthly_income"]
        
        response = f"**Your 50/30/20 Budget Plan** (Based on ₹{income:,.2f} monthly income)\n\n"
        
        response += f"**Needs (50%):** ₹{plan['needs']['budget']:,.2f}\n"
        response += f"Current: ₹{plan['needs']['current']:,.2f} ({plan['needs']['percentage']:.1f}%)\n"
        response += f"Remaining: ₹{plan['needs']['remaining']:,.2f}\n\n"
        
        response += f"**Wants (30%):** ₹{plan['wants']['budget']:,.2f}\n"
        response += f"Current: ₹{plan['wants']['current']:,.2f} ({plan['wants']['percentage']:.1f}%)\n"
        response += f"Remaining: ₹{plan['wants']['remaining']:,.2f}\n\n"
        
        response += f"**Savings (20%):** ₹{plan['savings']['budget']:,.2f}\n"
        response += f"Current: ₹{plan['savings']['current']:,.2f} ({plan['savings']['percentage']:.1f}%)\n"
        response += f"Target: ₹{plan['savings']['remaining']:,.2f} more\n\n"
        
        if budget_data["recommendations"]:
            response += "**Recommendations:**\n"
            for rec in budget_data["recommendations"]:
                emoji = "🔴" if rec["priority"] == "high" else "🟡" if rec["priority"] == "medium" else "🟢"
                response += f"{emoji} {rec['message']}\n"
        
        return response
