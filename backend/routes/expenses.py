from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, func
from typing import List, Optional
from datetime import date
import uuid

from core.database import get_db
from core.security import get_current_user_id
from models.expense import Expense
from schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseResponse, ExpenseSummary

router = APIRouter()


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense_data: ExpenseCreate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Create a new expense"""
    new_expense = Expense(
        user_id=uuid.UUID(user_id),
        **expense_data.model_dump(),
    )
    
    db.add(new_expense)
    await db.commit()
    await db.refresh(new_expense)
    
    return new_expense


@router.get("/", response_model=List[ExpenseResponse])
async def get_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get all expenses for the current user with filters"""
    query = select(Expense).where(Expense.user_id == uuid.UUID(user_id))
    
    if category:
        query = query.where(Expense.category == category)
    
    if start_date:
        query = query.where(Expense.expense_date >= start_date)
    
    if end_date:
        query = query.where(Expense.expense_date <= end_date)
    
    if search:
        query = query.where(
            (Expense.product_name.ilike(f"%{search}%")) |
            (Expense.notes.ilike(f"%{search}%"))
        )
    
    query = query.order_by(Expense.expense_date.desc()).offset(skip).limit(limit)
    
    result = await db.execute(query)
    expenses = result.scalars().all()
    
    return expenses


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific expense"""
    result = await db.execute(
        select(Expense).where(
            Expense.id == uuid.UUID(expense_id),
            Expense.user_id == uuid.UUID(user_id),
        )
    )
    expense = result.scalar_one_or_none()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
async def update_expense(
    expense_id: str,
    expense_data: ExpenseUpdate,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Update an expense"""
    result = await db.execute(
        select(Expense).where(
            Expense.id == uuid.UUID(expense_id),
            Expense.user_id == uuid.UUID(user_id),
        )
    )
    expense = result.scalar_one_or_none()
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    
    # Update fields
    update_data = expense_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    
    await db.commit()
    await db.refresh(expense)
    
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Delete an expense"""
    result = await db.execute(
        delete(Expense).where(
            Expense.id == uuid.UUID(expense_id),
            Expense.user_id == uuid.UUID(user_id),
        )
    )
    
    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )
    
    await db.commit()


@router.delete("/bulk", status_code=status.HTTP_204_NO_CONTENT)
async def bulk_delete_expenses(
    expense_ids: List[str],
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Bulk delete expenses"""
    expense_uuids = [uuid.UUID(eid) for eid in expense_ids]
    
    await db.execute(
        delete(Expense).where(
            Expense.id.in_(expense_uuids),
            Expense.user_id == uuid.UUID(user_id),
        )
    )
    
    await db.commit()


@router.get("/summary/by-category", response_model=List[ExpenseSummary])
async def get_expense_summary_by_category(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    """Get expense summary grouped by category"""
    query = select(
        Expense.category,
        func.sum(Expense.amount).label("total_amount"),
        func.count(Expense.id).label("count"),
    ).where(Expense.user_id == uuid.UUID(user_id))
    
    if start_date:
        query = query.where(Expense.expense_date >= start_date)
    
    if end_date:
        query = query.where(Expense.expense_date <= end_date)
    
    query = query.group_by(Expense.category)
    
    result = await db.execute(query)
    summaries = result.all()
    
    return [
        ExpenseSummary(
            category=row.category,
            total_amount=row.total_amount,
            count=row.count,
        )
        for row in summaries
    ]
