import pytest
from httpx import AsyncClient
from datetime import date


@pytest.mark.asyncio
async def test_create_expense(client: AsyncClient, auth_headers: dict):
    """Test creating a new expense"""
    response = await client.post(
        "/api/expenses",
        json={
            "amount": 150.75,
            "product_name": "Groceries",
            "category": "Food",
            "payment_method": "UPI",
            "expense_date": date.today().isoformat(),
            "notes": "Weekly grocery shopping",
        },
        headers=auth_headers,
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == "150.75"
    assert data["product_name"] == "Groceries"
    assert data["category"] == "Food"


@pytest.mark.asyncio
async def test_get_expenses(client: AsyncClient, auth_headers: dict):
    """Test retrieving expenses"""
    response = await client.get("/api/expenses", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)


@pytest.mark.asyncio
async def test_get_expense_by_id(client: AsyncClient, auth_headers: dict, sample_expense_id: str):
    """Test retrieving a specific expense"""
    response = await client.get(f"/api/expenses/{sample_expense_id}", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == sample_expense_id


@pytest.mark.asyncio
async def test_update_expense(client: AsyncClient, auth_headers: dict, sample_expense_id: str):
    """Test updating an expense"""
    response = await client.put(
        f"/api/expenses/{sample_expense_id}",
        json={"amount": 200.00, "notes": "Updated notes"},
        headers=auth_headers,
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["amount"] == "200.00"
    assert data["notes"] == "Updated notes"


@pytest.mark.asyncio
async def test_delete_expense(client: AsyncClient, auth_headers: dict, sample_expense_id: str):
    """Test deleting an expense"""
    response = await client.delete(f"/api/expenses/{sample_expense_id}", headers=auth_headers)
    
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_expense_summary_by_category(client: AsyncClient, auth_headers: dict):
    """Test getting expense summary by category"""
    response = await client.get("/api/expenses/summary/by-category", headers=auth_headers)
    
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if data:
        assert "category" in data[0]
        assert "total_amount" in data[0]
        assert "count" in data[0]
