from typing import Dict, Any
import re


class RouterAgent:
    """Routes user queries to appropriate specialized agents"""
    
    def __init__(self):
        self.name = "Router Agent"
        
        # Keywords for routing
        self.expense_keywords = [
            "spend", "expense", "spent", "spending", "bought", "purchase",
            "transaction", "payment", "cost", "money went", "where did",
        ]
        
        self.budget_keywords = [
            "budget", "plan", "allocate", "allocation", "50/30/20",
            "how much should", "distribute", "divide",
        ]
        
        self.savings_keywords = [
            "save", "saving", "goal", "target", "achieve", "reach",
            "progress", "contribution", "monthly", "deadline",
        ]
        
        self.investment_keywords = [
            "invest", "investment", "mutual fund", "stock", "equity",
            "sip", "fd", "ppf", "portfolio", "returns", "grow money",
        ]
    
    def route(self, query: str) -> str:
        """Determine which agent should handle the query"""
        query_lower = query.lower()
        
        # Count keyword matches for each agent
        scores = {
            "expense_analysis": sum(1 for kw in self.expense_keywords if kw in query_lower),
            "budget_planning": sum(1 for kw in self.budget_keywords if kw in query_lower),
            "savings_advisor": sum(1 for kw in self.savings_keywords if kw in query_lower),
            "investment_education": sum(1 for kw in self.investment_keywords if kw in query_lower),
        }
        
        # Get agent with highest score
        best_agent = max(scores.items(), key=lambda x: x[1])
        
        # If no clear match, default to expense analysis
        if best_agent[1] == 0:
            return "expense_analysis"
        
        return best_agent[0]
    
    def get_agent_description(self, agent_type: str) -> str:
        """Get description of what the agent does"""
        descriptions = {
            "expense_analysis": "Analyzing your spending patterns and identifying insights",
            "budget_planning": "Creating a personalized budget plan",
            "savings_advisor": "Providing savings advice for your goals",
            "investment_education": "Educating you about investment options",
        }
        return descriptions.get(agent_type, "Processing your request")
