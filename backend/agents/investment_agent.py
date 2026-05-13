"""
Investment Advisor Agent
Suggests SIPs, mutual funds, portfolio diversification, and tax-saving strategies
"""

from typing import Dict, List, Any
import json


class InvestmentAdvisorAgent:
    def __init__(self):
        self.name = "Investment Advisor"
        self.role = "Provide personalized investment recommendations"
        
    def analyze_profile(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user profile and generate investment recommendations"""
        
        monthly_income = user_profile.get('monthly_income', 0)
        monthly_expenses = user_profile.get('monthly_expenses', 0)
        risk_appetite = user_profile.get('risk_appetite', 'medium')
        age = user_profile.get('age', 25)
        existing_investments = user_profile.get('existing_investments', 0)
        
        monthly_savings = monthly_income - monthly_expenses
        
        # Calculate recommended SIP amount
        sip_percentage = 0.7  # 70% of savings
        if risk_appetite == 'low':
            sip_percentage = 0.5
        elif risk_appetite == 'high':
            sip_percentage = 0.8
            
        recommended_sip = monthly_savings * sip_percentage
        
        # Get fund recommendations based on risk
        funds = self._get_fund_recommendations(risk_appetite, age)
        
        # Calculate portfolio allocation
        allocation = self._calculate_allocation(risk_appetite, age)
        
        # Tax saving recommendations
        tax_savings = self._get_tax_saving_recommendations(monthly_income)
        
        return {
            'recommended_sip': round(recommended_sip, 2),
            'funds': funds,
            'allocation': allocation,
            'tax_savings': tax_savings,
            'insights': self._generate_insights(user_profile, recommended_sip)
        }
    
    def _get_fund_recommendations(self, risk_appetite: str, age: int) -> List[Dict]:
        """Get mutual fund recommendations based on risk profile"""
        
        funds_db = {
            'low': [
                {
                    'name': 'HDFC Balanced Advantage Fund',
                    'category': 'Hybrid',
                    'returns_3y': 11.2,
                    'risk': 'Low',
                    'min_sip': 500,
                    'expense_ratio': 0.85,
                    'aum': 45000
                },
                {
                    'name': 'ICICI Prudential Equity & Debt Fund',
                    'category': 'Hybrid',
                    'returns_3y': 10.8,
                    'risk': 'Low',
                    'min_sip': 100,
                    'expense_ratio': 0.92,
                    'aum': 32000
                },
                {
                    'name': 'SBI Equity Hybrid Fund',
                    'category': 'Hybrid',
                    'returns_3y': 12.1,
                    'risk': 'Low to Moderate',
                    'min_sip': 500,
                    'expense_ratio': 0.78,
                    'aum': 28000
                }
            ],
            'medium': [
                {
                    'name': 'Nifty 50 Index Fund',
                    'category': 'Index Fund',
                    'returns_3y': 14.5,
                    'risk': 'Moderate',
                    'min_sip': 500,
                    'expense_ratio': 0.15,
                    'aum': 85000
                },
                {
                    'name': 'Mirae Asset Large Cap Fund',
                    'category': 'Large Cap',
                    'returns_3y': 15.2,
                    'risk': 'Moderate',
                    'min_sip': 1000,
                    'expense_ratio': 0.52,
                    'aum': 62000
                },
                {
                    'name': 'Parag Parikh Flexi Cap Fund',
                    'category': 'Flexi Cap',
                    'returns_3y': 16.8,
                    'risk': 'Moderate',
                    'min_sip': 1000,
                    'expense_ratio': 0.68,
                    'aum': 48000
                },
                {
                    'name': 'Axis Bluechip Fund',
                    'category': 'Large Cap',
                    'returns_3y': 14.9,
                    'risk': 'Moderate',
                    'min_sip': 500,
                    'expense_ratio': 0.58,
                    'aum': 38000
                }
            ],
            'high': [
                {
                    'name': 'Parag Parikh Flexi Cap Fund',
                    'category': 'Flexi Cap',
                    'returns_3y': 16.8,
                    'risk': 'Moderate to High',
                    'min_sip': 1000,
                    'expense_ratio': 0.68,
                    'aum': 48000
                },
                {
                    'name': 'Axis Small Cap Fund',
                    'category': 'Small Cap',
                    'returns_3y': 18.5,
                    'risk': 'High',
                    'min_sip': 1000,
                    'expense_ratio': 0.75,
                    'aum': 22000
                },
                {
                    'name': 'Quant Small Cap Fund',
                    'category': 'Small Cap',
                    'returns_3y': 22.3,
                    'risk': 'Very High',
                    'min_sip': 1000,
                    'expense_ratio': 0.82,
                    'aum': 18000
                },
                {
                    'name': 'Motilal Oswal Midcap Fund',
                    'category': 'Mid Cap',
                    'returns_3y': 17.9,
                    'risk': 'High',
                    'min_sip': 500,
                    'expense_ratio': 0.72,
                    'aum': 15000
                }
            ]
        }
        
        return funds_db.get(risk_appetite, funds_db['medium'])
    
    def _calculate_allocation(self, risk_appetite: str, age: int) -> Dict[str, float]:
        """Calculate portfolio allocation"""
        
        # Rule of thumb: Equity % = 100 - age
        equity_percentage = min(100 - age, 80)
        
        if risk_appetite == 'low':
            equity_percentage *= 0.7
        elif risk_appetite == 'high':
            equity_percentage = min(equity_percentage * 1.2, 90)
        
        debt_percentage = 100 - equity_percentage
        
        return {
            'equity': round(equity_percentage, 1),
            'debt': round(debt_percentage, 1),
            'allocation_strategy': self._get_allocation_strategy(equity_percentage)
        }
    
    def _get_allocation_strategy(self, equity_percentage: float) -> str:
        """Get allocation strategy description"""
        if equity_percentage >= 80:
            return "Aggressive Growth - High equity allocation for maximum wealth creation"
        elif equity_percentage >= 60:
            return "Balanced Growth - Moderate equity for steady growth with manageable risk"
        else:
            return "Conservative - Capital preservation with stable returns"
    
    def _get_tax_saving_recommendations(self, monthly_income: float) -> Dict[str, Any]:
        """Generate tax-saving recommendations"""
        
        annual_income = monthly_income * 12
        
        # Calculate potential tax savings
        max_80c_investment = 150000
        tax_saved = max_80c_investment * 0.312  # 31.2% tax rate for high income
        
        return {
            'section_80c_limit': max_80c_investment,
            'potential_tax_savings': round(tax_saved, 2),
            'recommended_elss_sip': round(max_80c_investment / 12, 2),
            'elss_funds': [
                'Mirae Asset Tax Saver Fund',
                'Quant Tax Plan',
                'Canara Robeco Equity Tax Saver'
            ]
        }
    
    def _generate_insights(self, profile: Dict, recommended_sip: float) -> List[str]:
        """Generate personalized insights"""
        
        insights = []
        
        age = profile.get('age', 25)
        risk = profile.get('risk_appetite', 'medium')
        
        if age < 30:
            insights.append(f"At {age}, you have time on your side. Consider aggressive equity allocation for maximum growth.")
        elif age < 45:
            insights.append(f"At {age}, a balanced approach works best. Mix large-cap and flexi-cap funds.")
        else:
            insights.append(f"At {age}, focus on capital preservation with debt-heavy allocation.")
        
        if recommended_sip > 0:
            insights.append(f"Start with ₹{round(recommended_sip):,}/month SIP. Increase by 10% annually.")
        
        if risk == 'low':
            insights.append("Your conservative approach is wise. Focus on hybrid and large-cap funds.")
        elif risk == 'high':
            insights.append("Your aggressive stance can yield high returns. Diversify across mid and small caps.")
        
        return insights
