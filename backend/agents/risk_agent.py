"""
Risk Monitoring Agent
Detects financial risks, savings deficiencies, and market volatility
"""

from typing import Dict, List, Any


class RiskMonitoringAgent:
    def __init__(self):
        self.name = "Risk Monitoring"
        self.role = "Detect and alert financial risks"
        
    def assess_risks(self, user_profile: Dict, expenses: List[Dict] = None) -> Dict[str, Any]:
        """Comprehensive risk assessment"""
        
        monthly_income = user_profile.get('monthly_income', 0)
        monthly_expenses = user_profile.get('monthly_expenses', 0)
        bank_balance = user_profile.get('bank_balance', 0)
        cash_in_hand = user_profile.get('cash_in_hand', 0)
        existing_investments = user_profile.get('existing_investments', 0)
        
        monthly_savings = monthly_income - monthly_expenses
        total_liquid = bank_balance + cash_in_hand
        
        risks = []
        risk_score = 0
        
        # 1. Emergency Fund Risk
        emergency_risk = self._assess_emergency_fund(total_liquid, monthly_expenses)
        if emergency_risk:
            risks.append(emergency_risk)
            risk_score += emergency_risk['score']
        
        # 2. Savings Rate Risk
        savings_risk = self._assess_savings_rate(monthly_savings, monthly_income)
        if savings_risk:
            risks.append(savings_risk)
            risk_score += savings_risk['score']
        
        # 3. Investment Diversification Risk
        diversification_risk = self._assess_diversification(existing_investments, total_liquid)
        if diversification_risk:
            risks.append(diversification_risk)
            risk_score += diversification_risk['score']
        
        # 4. Expense Volatility Risk
        if expenses:
            volatility_risk = self._assess_expense_volatility(expenses, monthly_income)
            if volatility_risk:
                risks.append(volatility_risk)
                risk_score += volatility_risk['score']
        
        # 5. Income Dependency Risk
        income_risk = self._assess_income_dependency(monthly_income, existing_investments)
        if income_risk:
            risks.append(income_risk)
            risk_score += income_risk['score']
        
        # Calculate overall risk level
        risk_level = self._calculate_risk_level(risk_score)
        
        # Generate recommendations
        recommendations = self._generate_risk_recommendations(risks)
        
        return {
            'risk_score': min(100, risk_score),
            'risk_level': risk_level,
            'risks': risks,
            'recommendations': recommendations,
            'priority_actions': self._get_priority_actions(risks)
        }
    
    def _assess_emergency_fund(self, liquid: float, monthly_expenses: float) -> Dict:
        """Assess emergency fund adequacy"""
        
        if monthly_expenses == 0:
            return None
        
        months_covered = liquid / monthly_expenses
        
        if months_covered < 3:
            return {
                'type': 'emergency_fund',
                'severity': 'high',
                'score': 40,
                'title': 'Critical: Insufficient Emergency Fund',
                'description': f'You have only {months_covered:.1f} months of expenses saved. Need 6 months minimum.',
                'impact': 'High vulnerability to financial shocks',
                'action': f'Build emergency fund to ₹{monthly_expenses * 6:,.0f}'
            }
        elif months_covered < 6:
            return {
                'type': 'emergency_fund',
                'severity': 'medium',
                'score': 20,
                'title': 'Warning: Emergency Fund Below Target',
                'description': f'You have {months_covered:.1f} months covered. Target is 6 months.',
                'impact': 'Moderate financial vulnerability',
                'action': f'Add ₹{(6 - months_covered) * monthly_expenses:,.0f} to emergency fund'
            }
        
        return None
    
    def _assess_savings_rate(self, savings: float, income: float) -> Dict:
        """Assess savings rate"""
        
        if income == 0:
            return None
        
        savings_rate = (savings / income) * 100
        
        if savings_rate < 10:
            return {
                'type': 'savings_rate',
                'severity': 'high',
                'score': 30,
                'title': 'Critical: Very Low Savings Rate',
                'description': f'Saving only {savings_rate:.1f}% of income. Minimum should be 20%.',
                'impact': 'Insufficient wealth accumulation',
                'action': 'Reduce expenses by 15-20% immediately'
            }
        elif savings_rate < 20:
            return {
                'type': 'savings_rate',
                'severity': 'medium',
                'score': 15,
                'title': 'Warning: Below Optimal Savings',
                'description': f'Savings rate is {savings_rate:.1f}%. Target is 20-30%.',
                'impact': 'Slow wealth building',
                'action': 'Increase savings by cutting discretionary expenses'
            }
        
        return None
    
    def _assess_diversification(self, investments: float, liquid: float) -> Dict:
        """Assess investment diversification"""
        
        total_wealth = investments + liquid
        
        if total_wealth == 0:
            return None
        
        investment_ratio = (investments / total_wealth) * 100
        
        if investment_ratio < 20:
            return {
                'type': 'diversification',
                'severity': 'medium',
                'score': 20,
                'title': 'Low Investment Allocation',
                'description': f'Only {investment_ratio:.1f}% of wealth is invested. Target is 40-60%.',
                'impact': 'Missing out on wealth growth',
                'action': 'Start SIP investments after building emergency fund'
            }
        
        return None
    
    def _assess_expense_volatility(self, expenses: List[Dict], income: float) -> Dict:
        """Assess expense volatility"""
        
        if len(expenses) < 3:
            return None
        
        amounts = [e.get('amount', 0) for e in expenses]
        avg = sum(amounts) / len(amounts)
        variance = sum((x - avg) ** 2 for x in amounts) / len(amounts)
        std_dev = variance ** 0.5
        
        volatility = (std_dev / avg * 100) if avg > 0 else 0
        
        if volatility > 50:
            return {
                'type': 'expense_volatility',
                'severity': 'medium',
                'score': 15,
                'title': 'High Expense Volatility',
                'description': f'Your expenses vary significantly (±{volatility:.0f}%). This makes planning difficult.',
                'impact': 'Unpredictable cash flow',
                'action': 'Create a monthly budget and stick to it'
            }
        
        return None
    
    def _assess_income_dependency(self, income: float, investments: float) -> Dict:
        """Assess income dependency"""
        
        if investments < income * 12:
            return {
                'type': 'income_dependency',
                'severity': 'low',
                'score': 10,
                'title': 'High Income Dependency',
                'description': 'Your investments are less than 1 year of income. Build passive income sources.',
                'impact': 'Complete dependency on active income',
                'action': 'Focus on long-term wealth building through SIPs'
            }
        
        return None
    
    def _calculate_risk_level(self, score: int) -> str:
        """Calculate overall risk level"""
        
        if score >= 70:
            return 'Critical'
        elif score >= 40:
            return 'High'
        elif score >= 20:
            return 'Moderate'
        else:
            return 'Low'
    
    def _generate_risk_recommendations(self, risks: List[Dict]) -> List[str]:
        """Generate recommendations based on risks"""
        
        recommendations = []
        
        for risk in risks:
            if risk['severity'] == 'high':
                recommendations.append(f"🔴 URGENT: {risk['action']}")
            elif risk['severity'] == 'medium':
                recommendations.append(f"🟡 Important: {risk['action']}")
            else:
                recommendations.append(f"🟢 Consider: {risk['action']}")
        
        return recommendations
    
    def _get_priority_actions(self, risks: List[Dict]) -> List[Dict]:
        """Get prioritized actions"""
        
        # Sort by severity and score
        sorted_risks = sorted(risks, key=lambda x: (x['severity'] == 'high', x['score']), reverse=True)
        
        return [
            {
                'priority': i + 1,
                'title': risk['title'],
                'action': risk['action'],
                'severity': risk['severity']
            }
            for i, risk in enumerate(sorted_risks[:3])  # Top 3 priorities
        ]
