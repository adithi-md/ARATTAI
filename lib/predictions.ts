interface UserProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  bankBalance: number;
  existingInvestments: number;
}

export function predictFutureWealth(profile: UserProfile, months: number = 12) {
  const monthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
  const currentWealth = profile.bankBalance + profile.existingInvestments;
  
  // Assume 12% annual return on investments
  const monthlyReturn = 0.01; // 1% per month
  
  const predictions = [];
  let wealth = currentWealth;
  let totalInvested = profile.existingInvestments;
  
  for (let i = 1; i <= months; i++) {
    // Add monthly savings
    wealth += monthlySavings;
    totalInvested += monthlySavings * 0.7; // 70% goes to investments
    
    // Apply returns on investments
    const investmentGrowth = totalInvested * monthlyReturn;
    wealth += investmentGrowth;
    totalInvested += investmentGrowth;
    
    predictions.push({
      month: i,
      wealth: Math.round(wealth),
      invested: Math.round(totalInvested),
      savings: Math.round(wealth - totalInvested),
    });
  }
  
  return predictions;
}

export function predictBankBalance(profile: UserProfile, months: number = 6) {
  const monthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
  const predictions = [];
  
  for (let i = 1; i <= months; i++) {
    const balance = profile.bankBalance + (monthlySavings * i);
    predictions.push({
      month: i,
      balance: Math.round(balance),
      change: Math.round(monthlySavings * i),
    });
  }
  
  return predictions;
}

export function calculateFinancialRisk(profile: UserProfile) {
  const monthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
  const savingsRate = (monthlySavings / profile.monthlyIncome) * 100;
  const emergencyMonths = profile.bankBalance / profile.monthlyExpenses;
  
  let riskScore = 0;
  const risks = [];
  
  // Low savings rate risk
  if (savingsRate < 10) {
    riskScore += 30;
    risks.push({
      type: 'high',
      title: 'Low Savings Rate',
      description: `You're only saving ${savingsRate.toFixed(1)}% of income. Aim for at least 20%.`,
      impact: 'High',
    });
  } else if (savingsRate < 20) {
    riskScore += 15;
    risks.push({
      type: 'medium',
      title: 'Below Optimal Savings',
      description: `Savings rate is ${savingsRate.toFixed(1)}%. Try to reach 20-30%.`,
      impact: 'Medium',
    });
  }
  
  // Emergency fund risk
  if (emergencyMonths < 3) {
    riskScore += 40;
    risks.push({
      type: 'high',
      title: 'Insufficient Emergency Fund',
      description: `You have only ${emergencyMonths.toFixed(1)} months of expenses saved. Need 6 months.`,
      impact: 'High',
    });
  } else if (emergencyMonths < 6) {
    riskScore += 20;
    risks.push({
      type: 'medium',
      title: 'Emergency Fund Below Target',
      description: `Build your emergency fund to 6 months of expenses.`,
      impact: 'Medium',
    });
  }
  
  // Investment diversification risk
  const investmentRatio = (profile.existingInvestments / (profile.bankBalance + profile.existingInvestments)) * 100;
  if (investmentRatio < 20) {
    riskScore += 20;
    risks.push({
      type: 'medium',
      title: 'Low Investment Allocation',
      description: `Only ${investmentRatio.toFixed(1)}% of wealth is invested. Consider increasing to 40-60%.`,
      impact: 'Medium',
    });
  }
  
  // Spending risk
  const expenseRatio = (profile.monthlyExpenses / profile.monthlyIncome) * 100;
  if (expenseRatio > 80) {
    riskScore += 30;
    risks.push({
      type: 'high',
      title: 'High Expense Ratio',
      description: `You're spending ${expenseRatio.toFixed(1)}% of income. Reduce to below 70%.`,
      impact: 'High',
    });
  }
  
  return {
    riskScore: Math.min(100, riskScore),
    riskLevel: riskScore > 60 ? 'High' : riskScore > 30 ? 'Medium' : 'Low',
    risks,
  };
}

export function generateWealthTimeline(profile: UserProfile) {
  const milestones = [];
  const monthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
  const currentWealth = profile.bankBalance + profile.existingInvestments;
  
  // Emergency Fund Milestone
  const emergencyFund = profile.monthlyExpenses * 6;
  if (currentWealth < emergencyFund) {
    const monthsToEmergency = Math.ceil((emergencyFund - currentWealth) / monthlySavings);
    milestones.push({
      title: 'Emergency Fund Complete',
      amount: emergencyFund,
      months: monthsToEmergency,
      status: 'pending',
      icon: '🛡️',
    });
  } else {
    milestones.push({
      title: 'Emergency Fund Complete',
      amount: emergencyFund,
      months: 0,
      status: 'completed',
      icon: '✅',
    });
  }
  
  // First Lakh Milestone
  if (currentWealth < 100000) {
    const monthsToLakh = Math.ceil((100000 - currentWealth) / (monthlySavings * 1.12));
    milestones.push({
      title: 'First ₹1 Lakh',
      amount: 100000,
      months: monthsToLakh,
      status: 'pending',
      icon: '💰',
    });
  }
  
  // 5 Lakh Milestone
  if (currentWealth < 500000) {
    const monthsTo5L = Math.ceil((500000 - currentWealth) / (monthlySavings * 1.12));
    milestones.push({
      title: '₹5 Lakh Wealth',
      amount: 500000,
      months: monthsTo5L,
      status: 'pending',
      icon: '🎯',
    });
  }
  
  // 10 Lakh Milestone
  const monthsTo10L = Math.ceil((1000000 - currentWealth) / (monthlySavings * 1.12));
  milestones.push({
    title: '₹10 Lakh Wealth',
    amount: 1000000,
    months: monthsTo10L,
    status: 'pending',
    icon: '🚀',
  });
  
  // 1 Crore Milestone
  const monthsTo1Cr = Math.ceil((10000000 - currentWealth) / (monthlySavings * 1.12));
  milestones.push({
    title: '₹1 Crore Wealth',
    amount: 10000000,
    months: monthsTo1Cr,
    status: 'pending',
    icon: '👑',
  });
  
  return milestones;
}
