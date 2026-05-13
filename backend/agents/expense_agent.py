"""
Expense Intelligence Agent
Analyzes spending patterns, detects overspending, and provides behavioral insights
"""

from typing import Dict, List, Any
from datetime import datetime, timedelta


class ExpenseIntelligenceAgent:
    def __init__(self):
        self.name = "Expense Intelligence"
        self.role = "Analyze spending patterns and detect financial behaviors"
        
    def analyze_expenses(self, expenses: List[Dict], user_profile: Dict) -> Dict[str, Any]:
        """Analyze expense patterns and generate insights"""
        
        if not expenses:
            return {
                'total_spent': 0,
                'insights': ['No expense data available yet. Start tracking your expenses!'],
                'categories': {},
                'trends': {}
            }
        
        # Calculate category-wise spending
        categories = {}
        for expense in expenses:
            category = expense.get('category', 'Other')
            amount = expense.get('amount', 0)
            categories[category] = categories.get(category, 0) + amount
        
        total_spent = sum(categories.values())
        
        # Generate insights
        insights = self._generate_spending_insights(categories, total_spent, user_profile)
        
        # Detect overspending
        overspending_alerts = self._detect_overspending(categories, user_profile)
        
        # Analyze trends
        trends = self._analyze_trends(expenses)
        
        # Behavioral analysis
        behavioral_insights = self._behavioral_analysis(expenses, user_profile)
        
        return {
            'total_spent': round(total_spent, 2),
            'categories': {k: round(v, 2) for k, v in categories.items()},
            'insights': insights,
            'overspending_alerts': overspending_alerts,
            'trends': trends,
            'behavioral_insights': behavioral_insights
        }
    
    def _generate_spending_insights(self, categories: Dict, total: float, profile: Dict) -> List[str]:
        """Generate spending insights"""
        
        insights = []
        monthly_income = profile.get('monthly_income', 0)
        
        if not categories:
            return insights
        
        # Find top spending category
        top_category = max(categories.items(), key=lambda x: x[1])
        top_percentage = (top_category[1] / total * 100) if total > 0 else 0
        
        insights.append(f"Your biggest expense is {top_category[0]} at ₹{top_category[1]:,.0f} ({top_percentage:.1f}% of total spending)")
        
        # Check food delivery spending
        if 'Food' in categories:
            food_spending = categories['Food']
            if food_spending > monthly_income * 0.15:
                insights.append(f"⚠️ Food expenses are high at ₹{food_spending:,.0f}. Consider cooking at home more often.")
        
        # Check entertainment spending
        if 'Entertainment' in categories:
            entertainment = categories['Entertainment']
            if entertainment > monthly_income * 0.10:
                insights.append(f"⚠️ Entertainment spending (₹{entertainment:,.0f}) is affecting your savings goals.")
        
        # Check shopping
        if 'Shopping' in categories:
            shopping = categories['Shopping']
            if shopping > monthly_income * 0.20:
                insights.append(f"⚠️ Shopping expenses are high at ₹{shopping:,.0f}. Review discretionary purchases.")
        
        # Positive insights
        if total < monthly_income * 0.70:
            insights.append(f"✅ Great job! You're spending only {(total/monthly_income*100):.1f}% of your income.")
        
        return insights
    
    def _detect_overspending(self, categories: Dict, profile: Dict) -> List[Dict]:
        """Detect overspending in categories"""
        
        alerts = []
        monthly_income = profile.get('monthly_income', 0)
        
        # Define healthy spending limits (% of income)
        limits = {
            'Food': 0.15,
            'Transport': 0.10,
            'Entertainment': 0.10,
            'Shopping': 0.15,
            'Bills': 0.20,
        }
        
        for category, limit_percentage in limits.items():
            if category in categories:
                spent = categories[category]
                limit = monthly_income * limit_percentage
                
                if spent > limit:
                    overspend_amount = spent - limit
                    overspend_percentage = ((spent - limit) / limit * 100)
                    
                    alerts.append({
                        'category': category,
                        'spent': round(spent, 2),
                        'limit': round(limit, 2),
                        'overspend': round(overspend_amount, 2),
                        'percentage': round(overspend_percentage, 1),
                        'severity': 'high' if overspend_percentage > 50 else 'medium'
                    })
        
        return alerts
    
    def _analyze_trends(self, expenses: List[Dict]) -> Dict[str, Any]:
        """Analyze spending trends"""
        
        if len(expenses) < 2:
            return {'trend': 'insufficient_data'}
        
        # Sort by date
        sorted_expenses = sorted(expenses, key=lambda x: x.get('date', ''))
        
        # Calculate weekly spending
        weekly_spending = {}
        for expense in sorted_expenses:
            # Simplified week calculation
            week = expense.get('date', '')[:10]  # Use date as week identifier
            amount = expense.get('amount', 0)
            weekly_spending[week] = weekly_spending.get(week, 0) + amount
        
        if len(weekly_spending) >= 2:
            weeks = list(weekly_spending.values())
            recent_avg = sum(weeks[-2:]) / 2
            older_avg = sum(weeks[:-2]) / len(weeks[:-2]) if len(weeks) > 2 else weeks[0]
            
            trend_percentage = ((recent_avg - older_avg) / older_avg * 100) if older_avg > 0 else 0
            
            return {
                'trend': 'increasing' if trend_percentage > 5 else 'decreasing' if trend_percentage < -5 else 'stable',
                'percentage': round(trend_percentage, 1),
                'recent_avg': round(recent_avg, 2),
                'older_avg': round(older_avg, 2)
            }
        
        return {'trend': 'stable'}
    
    def _behavioral_analysis(self, expenses: List[Dict], profile: Dict) -> List[str]:
        """Analyze behavioral spending patterns"""
        
        insights = []
        
        if not expenses:
            return insights
        
        # Check spending frequency
        if len(expenses) > 50:
            insights.append("You make frequent small purchases. Consider consolidating to reduce impulse buying.")
        
        # Check for large transactions
        amounts = [e.get('amount', 0) for e in expenses]
        if amounts:
            avg_amount = sum(amounts) / len(amounts)
            large_transactions = [a for a in amounts if a > avg_amount * 3]
            
            if large_transactions:
                insights.append(f"Detected {len(large_transactions)} large transactions. Review if these were planned purchases.")
        
        # Weekend spending analysis
        weekend_expenses = [e for e in expenses if self._is_weekend(e.get('date', ''))]
        if len(weekend_expenses) > len(expenses) * 0.4:
            insights.append("40%+ of your spending happens on weekends. Plan weekend budgets to control expenses.")
        
        return insights
    
    def _is_weekend(self, date_str: str) -> bool:
        """Check if date is weekend"""
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            return date_obj.weekday() >= 5
        except:
            return False
