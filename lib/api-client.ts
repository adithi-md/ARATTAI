/**
 * API Client for ARATTAI Multi-Agent Backend
 * Connects frontend to FastAPI backend agents
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface UserProfile {
  name: string;
  age: number;
  monthly_income: number;
  monthly_expenses: number;
  bank_balance: number;
  cash_in_hand: number;
  existing_investments: number;
  risk_appetite: string;
  financial_goal: string;
}

export interface ExpenseItem {
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface GoalItem {
  name: string;
  target_amount: number;
  saved_amount: number;
  deadline?: string;
}

/**
 * Get investment recommendations from Investment Advisor Agent
 */
export async function getInvestmentAnalysis(profile: UserProfile) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/investment/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Investment analysis error:', error);
    return null;
  }
}

/**
 * Get expense analysis from Expense Intelligence Agent
 */
export async function getExpenseAnalysis(profile: UserProfile, expenses: ExpenseItem[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/expense/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, expenses }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Expense analysis error:', error);
    return null;
  }
}

/**
 * Get goal planning from Goal Planning Agent
 */
export async function getGoalPlan(profile: UserProfile, goal: GoalItem) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/goal/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, goal }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Goal planning error:', error);
    return null;
  }
}

/**
 * Get risk assessment from Risk Monitoring Agent
 */
export async function getRiskAssessment(profile: UserProfile, expenses?: ExpenseItem[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/risk/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, expenses }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Risk assessment error:', error);
    return null;
  }
}

/**
 * Orchestrate all agents for comprehensive analysis
 */
export async function orchestrateAgents(
  profile: UserProfile,
  expenses?: ExpenseItem[],
  goals?: GoalItem[]
) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/agents/orchestrate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, expenses, goals }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Agent orchestration error:', error);
    return null;
  }
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
    });
    
    return response.ok;
  } catch (error) {
    return false;
  }
}

/**
 * Convert frontend user profile to backend format
 */
export function convertProfileToBackendFormat(profile: any): UserProfile {
  return {
    name: profile.name,
    age: profile.age,
    monthly_income: profile.monthlyIncome,
    monthly_expenses: profile.monthlyExpenses,
    bank_balance: profile.bankBalance,
    cash_in_hand: profile.cashInHand,
    existing_investments: profile.existingInvestments,
    risk_appetite: profile.riskAppetite.toLowerCase(),
    financial_goal: profile.financialGoal.toLowerCase(),
  };
}
