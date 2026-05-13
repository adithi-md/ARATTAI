from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from datetime import date
import uuid

from core.database import get_db
from core.security import get_current_user_id
from models.goal import Goal
from schemas.goal import GoalCreate, GoalUpdate, GoalResponse, AddFundsRequest

router = APIRouter()


def calculate_progress(goal: Goal) -> dict:
    """Calculate goal progress and monthly contribution"""
    progress_percentage = (float(goal.saved_amount) / float(goal.target_amount)) * 100 if goal.target_amount > 0 else 0
    
    monthly_contribution = None
    if goal.deadline:
        days_remaining = (goal.deadline - date.today()).days
        if days_remaining > 0:
            months_remaining = days_remaining / 30
            remaining_amount = goal.target_amount - goal.saved_amount
            if months_remaining > 0:
                monthly_contribution = remaining_amount / months_remaining
    
    return {
        "progress_percentage": round(progress_percentage, 2),
        "monthly_contribution": monthly_contribution,
    }


@router.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal_data: GoalCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Create a new financial goal"""
    new_goal = Goal(
        user_id=uuid.UUID(user_id),
        **goal_data.model_dump(),
    )
    
    db.add(new_goal)
    await db.commit()
    await db.refresh(new_goal)
    
    # Add calculated fields
    progress_data = calculate_progress(new_goal)
    response = GoalResponse.model_validate(new_goal)
    response.progress_percentage = progress_data["progress_percentage"]
    response.monthly_contribution = progress_data["monthly_contribution"]
    
    return response


@router.get("/", response_model=List[GoalResponse])
async def get_goals(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get all goals for the current user"""
    result = await db.execute(
        select(Goal)
        .where(Goal.user_id == uuid.UUID(user_id))
        .order_by(Goal.created_at.desc())
    )
    goals = result.scalars().all()
    
    # Add calculated fields
    response_goals = []
    for goal in goals:
        progress_data = calculate_progress(goal)
        goal_response = GoalResponse.model_validate(goal)
        goal_response.progress_percentage = progress_data["progress_percentage"]
        goal_response.monthly_contribution = progress_data["monthly_contribution"]
        response_goals.append(goal_response)
    
    return response_goals


@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(
    goal_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific goal"""
    result = await db.execute(
        select(Goal).where(
            Goal.id == uuid.UUID(goal_id),
            Goal.user_id == uuid.UUID(user_id),
        )
    )
    goal = result.scalar_one_or_none()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    
    progress_data = calculate_progress(goal)
    response = GoalResponse.model_validate(goal)
    response.progress_percentage = progress_data["progress_percentage"]
    response.monthly_contribution = progress_data["monthly_contribution"]
    
    return response


@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: str,
    goal_data: GoalUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Update a goal"""
    result = await db.execute(
        select(Goal).where(
            Goal.id == uuid.UUID(goal_id),
            Goal.user_id == uuid.UUID(user_id),
        )
    )
    goal = result.scalar_one_or_none()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    
    # Update fields
    update_data = goal_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(goal, field, value)
    
    # Check if goal is completed
    if goal.saved_amount >= goal.target_amount:
        goal.is_completed = True
    
    await db.commit()
    await db.refresh(goal)
    
    progress_data = calculate_progress(goal)
    response = GoalResponse.model_validate(goal)
    response.progress_percentage = progress_data["progress_percentage"]
    response.monthly_contribution = progress_data["monthly_contribution"]
    
    return response


@router.post("/{goal_id}/add-funds", response_model=GoalResponse)
async def add_funds_to_goal(
    goal_id: str,
    funds: AddFundsRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Add funds to a goal"""
    result = await db.execute(
        select(Goal).where(
            Goal.id == uuid.UUID(goal_id),
            Goal.user_id == uuid.UUID(user_id),
        )
    )
    goal = result.scalar_one_or_none()
    
    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    
    goal.saved_amount += funds.amount
    
    # Check if goal is completed
    if goal.saved_amount >= goal.target_amount:
        goal.is_completed = True
    
    await db.commit()
    await db.refresh(goal)
    
    progress_data = calculate_progress(goal)
    response = GoalResponse.model_validate(goal)
    response.progress_percentage = progress_data["progress_percentage"]
    response.monthly_contribution = progress_data["monthly_contribution"]
    
    return response


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Delete a goal"""
    result = await db.execute(
        delete(Goal).where(
            Goal.id == uuid.UUID(goal_id),
            Goal.user_id == uuid.UUID(user_id),
        )
    )
    
    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found",
        )
    
    await db.commit()
