"""
Goal Planning Agent
Builds savings roadmaps, goal decomposition, and financial milestone planning
"""

from typing import Dict, List, Any
from datetime import datetime, timedelta


class GoalPlanningAgent:
    def __init__(self):
        self.name = "Goal Planning"
        self.role = "Create personalized savings roadmaps and milestone plans"
        
    def create_goal_plan(self, goal: Dict, user_profile: Dict) -> Dict[str, Any]:
        """Create a detailed plan to achieve a financial goal"""
        
        target_amount = goal.get('target_amount', 0)
        current_amount = goal.get('saved_amount', 0)
        deadline = goal.get('deadline')
        goal_name = goal.get('name', 'Financial Goal')
        
        monthly_income = user_profile.get('monthly_income', 0)
        monthly_expenses = user_profile.get('monthly_expenses', 0)
        monthly_savings = monthly_income - monthly_expenses
        
        remaining_amount = target_amount - current_amount
        
        # Calculate timeline
        if deadline:
            try:
                deadline_date = datetime.strptime(deadline, '%Y-%m-%d')
                months_remaining = max(1, (deadline_date - datetime.now()).days // 30)
            except:
                months_remaining = 12
        else:
            months_remaining = 12
        
        # Calculate required monthly contribution
        required_monthly = remaining_amount / months_remaining if months_remaining > 0 else remaining_amount
        
        # Check feasibility
        feasibility = self._check_feasibility(required_monthly, monthly_savings)
        
        # Generate milestones
        milestones = self._generate_milestones(target_amount, current_amount, months_remaining)
        
        # Create action plan
        action_plan = self._create_action_plan(goal_name, required_monthly, monthly_savings, feasibility)
        
        # Calculate success probability
        success_probability = self._calculate_success_probability(
            required_monthly, monthly_savings, months_remaining
        )
        
        return {
            'goal_name': goal_name,
            'target_amount': target_amount,
            'current_amount': current_amount,
            'remaining_amount': remaining_amount,
            'months_remaining': months_remaining,
            'required_monthly': round(required_monthly, 2),
            'feasibility': feasibility,
            'milestones': milestones,
            'action_plan': action_plan,
            'success_probability': success_probability
        }
    
    def _check_feasibility(self, required: float, available: float) -> Dict[str, Any]:
        """Check if goal is feasible"""
        
        percentage_of_savings = (required / available * 100) if available > 0 else 999
        
        if percentage_of_savings <= 50:
            return {
                'status': 'easy',
                'message': f'Highly achievable! Requires only {percentage_of_savings:.1f}% of your monthly savings.',
                'color': 'green'
            }
        elif percentage_of_savings <= 80:
            return {
                'status': 'moderate',
                'message': f'Achievable with discipline. Requires {percentage_of_savings:.1f}% of your monthly savings.',
                'color': 'yellow'
            }
        elif percentage_of_savings <= 100:
            return {
                'status': 'challenging',
                'message': f'Challenging but possible. Requires {percentage_of_savings:.1f}% of your monthly savings.',
                'color': 'orange'
            }
        else:
            return {
                'status': 'difficult',
                'message': f'Very challenging. Consider extending the deadline or reducing the target.',
                'color': 'red'
            }
    
    def _generate_milestones(self, target: float, current: float, months: int) -> List[Dict]:
        """Generate milestone checkpoints"""
        
        milestones = []
        remaining = target - current
        
        # 25% milestone
        milestone_25 = current + (remaining * 0.25)
        months_25 = months * 0.25
        milestones.append({
            'percentage': 25,
            'amount': round(milestone_25, 2),
            'months': round(months_25, 1),
            'description': 'First Quarter - Building Momentum'
        })
        
        # 50% milestone
        milestone_50 = current + (remaining * 0.50)
        months_50 = months * 0.50
        milestones.append({
            'percentage': 50,
            'amount': round(milestone_50, 2),
            'months': round(months_50, 1),
            'description': 'Halfway There - Keep Going!'
        })
        
        # 75% milestone
        milestone_75 = current + (remaining * 0.75)
        months_75 = months * 0.75
        milestones.append({
            'percentage': 75,
            'amount': round(milestone_75, 2),
            'months': round(months_75, 1),
            'description': 'Final Stretch - Almost Done!'
        })
        
        # 100% milestone
        milestones.append({
            'percentage': 100,
            'amount': round(target, 2),
            'months': months,
            'description': 'Goal Achieved! 🎉'
        })
        
        return milestones
    
    def _create_action_plan(self, goal_name: str, required: float, available: float, feasibility: Dict) -> List[str]:
        """Create actionable steps"""
        
        plan = []
        
        plan.append(f"Set up automatic transfer of ₹{required:,.0f} to a dedicated {goal_name} account")
        
        if feasibility['status'] in ['challenging', 'difficult']:
            plan.append("Review and cut discretionary expenses by 10-15%")
            plan.append("Look for additional income sources (freelancing, side gigs)")
        
        plan.append("Track progress weekly and adjust if needed")
        plan.append("Celebrate milestones to stay motivated")
        
        if required > available * 0.5:
            plan.append("Consider investing in liquid funds for better returns")
        
        return plan
    
    def _calculate_success_probability(self, required: float, available: float, months: int) -> Dict[str, Any]:
        """Calculate probability of achieving the goal"""
        
        if available <= 0:
            return {'probability': 0, 'rating': 'Very Low'}
        
        ratio = required / available
        
        # Base probability on ratio and timeline
        if ratio <= 0.5:
            probability = 95
        elif ratio <= 0.7:
            probability = 85
        elif ratio <= 0.9:
            probability = 70
        elif ratio <= 1.0:
            probability = 55
        else:
            probability = max(20, 60 - (ratio - 1) * 30)
        
        # Adjust for timeline
        if months < 6:
            probability -= 10
        elif months > 24:
            probability += 5
        
        probability = max(0, min(100, probability))
        
        if probability >= 80:
            rating = 'Very High'
        elif probability >= 60:
            rating = 'High'
        elif probability >= 40:
            rating = 'Moderate'
        elif probability >= 20:
            rating = 'Low'
        else:
            rating = 'Very Low'
        
        return {
            'probability': round(probability, 1),
            'rating': rating
        }
