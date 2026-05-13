from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from typing import Optional
from datetime import date, datetime, timedelta
from decimal import Decimal
import uuid

from core.database import get_db
from core.security import get_current_user_id
from models.expense import Expense
from models.goal import Goal

router = APIRouter()


@router.get("/summary")
async def get_analytics_summary(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get comprehensive analytics summary"""
    # Default to current month if no dates provided
    if not start_date:
        start_date = date.today().replace(day=1)
    if not end_date:
        end_date = date.today()
    
    # Total spent this period
    result = await db.execute(
        select(func.sum(Expense.amount))
        .where(
            Expense.user_id == uuid.UUID(user_id),
            Expense.expense_date >= start_date,
            Expense.expense_date <= end_date,
        )
    )
    total_spent = result.scalar() or Decimal(0)
    
    # Biggest category
    result = await db.execute(
        select(
            Expense.category,
            func.sum(Expense.amount).label("total"),
        )
        .where(
            Expense.user_id == uuid.UUID(user_id),
            Expense.expense_date >= start_date,
            Expense.expense_date <= end_date,
        )
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
        .limit(1)
    )
    biggest_category_row = result.first()
    biggest_category = biggest_category_row.category if biggest_category_row else None
    biggest_category_amount = biggest_category_row.total if biggest_category_row else Decimal(0)
    
    # Average daily spend
    days_in_period = (end_date - start_date).days + 1
    avg_daily_spend = total_spent / days_in_period if days_in_period > 0 else Decimal(0)
    
    # Forecast month-end total (if current month)
    forecast = None
    if start_date.month == date.today().month and start_date.year == date.today().year:
        days_elapsed = (date.today() - start_date).days + 1
        days_in_month = (date.today().replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(days=1)
        days_in_month = days_in_month.day
        forecast = (total_spent / days_elapsed) * days_in_month if days_elapsed > 0 else Decimal(0)
    
    return {
        "total_spent": float(total_spent),
        "biggest_category": biggest_category,
        "biggest_category_amount": float(biggest_category_amount),
        "avg_daily_spend": float(avg_daily_spend),
        "forecast_month_end": float(forecast) if forecast else None,
        "period": {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
        },
    }


@router.get("/monthly-spending")
async def get_monthly_spending(
    year: int = Query(default=datetime.now().year),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get monthly spending for a year"""
    result = await db.execute(
        select(
            extract("month", Expense.expense_date).label("month"),
            func.sum(Expense.amount).label("total"),
        )
        .where(
            Expense.user_id == uuid.UUID(user_id),
            extract("year", Expense.expense_date) == year,
        )
        .group_by(extract("month", Expense.expense_date))
        .order_by(extract("month", Expense.expense_date))
    )
    
    monthly_data = {row.month: float(row.total) for row in result}
    
    # Fill in missing months with 0
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    chart_data = [
        {
            "month": months[i],
            "amount": monthly_data.get(i + 1, 0),
        }
        for i in range(12)
    ]
    
    return chart_data


@router.get("/category-breakdown")
async def get_category_breakdown(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get expense breakdown by category"""
    if not start_date:
        start_date = date.today().replace(day=1)
    if not end_date:
        end_date = date.today()
    
    result = await db.execute(
        select(
            Expense.category,
            func.sum(Expense.amount).label("total"),
            func.count(Expense.id).label("count"),
        )
        .where(
            Expense.user_id == uuid.UUID(user_id),
            Expense.expense_date >= start_date,
            Expense.expense_date <= end_date,
        )
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
    )
    
    categories = result.all()
    total_amount = sum(cat.total for cat in categories)
    
    return [
        {
            "name": cat.category,
            "value": float(cat.total),
            "count": cat.count,
            "percentage": round((float(cat.total) / float(total_amount)) * 100, 2) if total_amount > 0 else 0,
        }
        for cat in categories
    ]


@router.get("/weekly-spending")
async def get_weekly_spending(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get spending for current week"""
    today = date.today()
    start_of_week = today - timedelta(days=today.weekday())
    
    result = await db.execute(
        select(
            Expense.expense_date,
            func.sum(Expense.amount).label("total"),
        )
        .where(
            Expense.user_id == uuid.UUID(user_id),
            Expense.expense_date >= start_of_week,
            Expense.expense_date <= today,
        )
        .group_by(Expense.expense_date)
        .order_by(Expense.expense_date)
    )
    
    daily_data = {row.expense_date: float(row.total) for row in result}
    
    # Fill in all days of the week
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    chart_data = []
    for i in range(7):
        day_date = start_of_week + timedelta(days=i)
        chart_data.append({
            "day": days[i],
            "amount": daily_data.get(day_date, 0),
            "is_today": day_date == today,
        })
    
    return chart_data


@router.get("/savings-progress")
async def get_savings_progress(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get savings progress for all goals"""
    result = await db.execute(
        select(Goal)
        .where(Goal.user_id == uuid.UUID(user_id))
        .order_by(Goal.created_at.desc())
    )
    goals = result.scalars().all()
    
    return [
        {
            "name": goal.name,
            "target": float(goal.target_amount),
            "saved": float(goal.saved_amount),
            "percentage": round((float(goal.saved_amount) / float(goal.target_amount)) * 100, 2) if goal.target_amount > 0 else 0,
        }
        for goal in goals
    ]
