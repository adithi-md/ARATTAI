from typing import Dict, List, Any
from datetime import date, timedelta


class SavingsAdvisorAgent:
    """Agent for providing savings advice"""
    
    def __init__(self):
        self.name = "Savings Advisor Agent"
    
    async def analyze_goals(self, goals: List[Dict[str, Any]], user_data: Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze savings goals and provide recommendations"""
        if not goals:
            return {
                "message": "You haven't set any financial goals yet. Start by creating a goal to track your savings progress!",
                "recommendations": [],
            }
        
        monthly_income = float(user_data.get("monthly_income", 0))
        total_target = sum(float(g.get("target_amount", 0)) for g in goals)
        total_saved = sum(float(g.get("saved_amount", 0)) for g in goals)
        total_remaining = total_target - total_saved
        
        recommendations = []
        
        # Analyze each goal
        for goal in goals:
            goal_name = goal.get("name")
            target = float(goal.get("target_amount", 0))
            saved = float(goal.get("saved_amount", 0))
            remaining = target - saved
            deadline = goal.get("deadline")
            
            if saved >= target:
                recommendations.append({
                    "goal": goal_name,
                    "status": "completed",
                    "message": f"🎉 Congratulations! You've reached your {goal_name} goal!",
                    "priority": "success",
                })
                continue
            
            # Calculate required monthly contribution
            if deadline:
                deadline_date = date.fromisoformat(deadline) if isinstance(deadline, str) else deadline
                days_remaining = (deadline_date - date.today()).days
                
                if days_remaining <= 0:
                    recommendations.append({
                        "goal": goal_name,
                        "status": "overdue",
                        "message": f"⚠️ {goal_name} deadline has passed. You still need ₹{remaining:,.2f}.",
                        "priority": "high",
                    })
                else:
                    months_remaining = days_remaining / 30
                    monthly_required = remaining / months_remaining if months_remaining > 0 else remaining
                    
                    if monthly_income > 0:
                        percentage_of_income = (monthly_required / monthly_income) * 100
                        
                        if percentage_of_income > 30:
                            recommendations.append({
                                "goal": goal_name,
                                "status": "challenging",
                                "message": f"⚠️ {goal_name} requires ₹{monthly_required:,.2f}/month ({percentage_of_income:.1f}% of income). Consider extending the deadline.",
                                "monthly_required": monthly_required,
                                "priority": "high",
                            })
                        elif percentage_of_income > 15:
                            recommendations.append({
                                "goal": goal_name,
                                "status": "moderate",
                                "message": f"💪 {goal_name} needs ₹{monthly_required:,.2f}/month ({percentage_of_income:.1f}% of income). You can do this!",
                                "monthly_required": monthly_required,
                                "priority": "medium",
                            })
                        else:
                            recommendations.append({
                                "goal": goal_name,
                                "status": "on_track",
                                "message": f"✅ {goal_name} is achievable with ₹{monthly_required:,.2f}/month ({percentage_of_income:.1f}% of income).",
                                "monthly_required": monthly_required,
                                "priority": "low",
                            })
                    else:
                        recommendations.append({
                            "goal": goal_name,
                            "status": "needs_planning",
                            "message": f"💡 {goal_name} requires ₹{monthly_required:,.2f}/month. Set your monthly income for better planning.",
                            "monthly_required": monthly_required,
                            "priority": "medium",
                        })
            else:
                recommendations.append({
                    "goal": goal_name,
                    "status": "no_deadline",
                    "message": f"📅 Set a deadline for {goal_name} to get a personalized savings plan.",
                    "priority": "low",
                })
        
        # Overall savings strategy
        if monthly_income > 0 and total_remaining > 0:
            total_monthly_required = sum(
                r.get("monthly_required", 0) for r in recommendations if "monthly_required" in r
            )
            
            if total_monthly_required > 0:
                total_percentage = (total_monthly_required / monthly_income) * 100
                
                strategy = {
                    "total_monthly_required": total_monthly_required,
                    "percentage_of_income": total_percentage,
                    "feasibility": "challenging" if total_percentage > 40 else "moderate" if total_percentage > 20 else "achievable",
                }
            else:
                strategy = None
        else:
            strategy = None
        
        return {
            "total_goals": len(goals),
            "total_target": total_target,
            "total_saved": total_saved,
            "total_remaining": total_remaining,
            "progress_percentage": (total_saved / total_target * 100) if total_target > 0 else 0,
            "recommendations": recommendations,
            "strategy": strategy,
        }
    
    def generate_response(self, analysis: Dict[str, Any]) -> str:
        """Generate human-readable savings advice"""
        if "message" in analysis and not analysis.get("recommendations"):
            return analysis["message"]
        
        response = f"**Savings Goals Overview**\n\n"
        response += f"Total Goals: {analysis['total_goals']}\n"
        response += f"Total Target: ₹{analysis['total_target']:,.2f}\n"
        response += f"Total Saved: ₹{analysis['total_saved']:,.2f} ({analysis['progress_percentage']:.1f}%)\n"
        response += f"Remaining: ₹{analysis['total_remaining']:,.2f}\n\n"
        
        if analysis["recommendations"]:
            response += "**Goal-by-Goal Analysis:**\n\n"
            for rec in analysis["recommendations"]:
                response += f"{rec['message']}\n"
        
        if analysis.get("strategy"):
            strategy = analysis["strategy"]
            response += f"\n**Overall Strategy:**\n"
            response += f"Total monthly contribution needed: ₹{strategy['total_monthly_required']:,.2f} "
            response += f"({strategy['percentage_of_income']:.1f}% of income)\n"
            response += f"Feasibility: {strategy['feasibility'].title()}\n"
        
        return response
