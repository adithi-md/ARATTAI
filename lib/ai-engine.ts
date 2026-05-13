interface UserProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  bankBalance: number;
  cashInHand: number;
  existingInvestments: number;
  riskAppetite: 'low' | 'medium' | 'high';
  age: number;
}

export function analyzeFinancialProfile(profile: UserProfile) {
  const monthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
  const savingsRate = (monthlySavings / profile.monthlyIncome) * 100;
  const totalLiquid = profile.bankBalance + profile.cashInHand;
  const netWorth = totalLiquid + profile.existingInvestments;
  
  // Calculate health score (0-100)
  let healthScore = 0;
  
  // Savings rate component (40 points)
  if (savingsRate >= 30) healthScore += 40;
  else if (savingsRate >= 20) healthScore += 30;
  else if (savingsRate >= 10) healthScore += 20;
  else healthScore += 10;
  
  // Emergency fund component (30 points)
  const emergencyMonths = totalLiquid / profile.monthlyExpenses;
  if (emergencyMonths >= 6) healthScore += 30;
  else if (emergencyMonths >= 3) healthScore += 20;
  else healthScore += 10;
  
  // Investment component (30 points)
  const investmentRatio = (profile.existingInvestments / netWorth) * 100;
  if (investmentRatio >= 40) healthScore += 30;
  else if (investmentRatio >= 20) healthScore += 20;
  else healthScore += 10;
  
  // Calculate savings potential
  const savingsPotential = Math.min(100, (monthlySavings / profile.monthlyIncome) * 100 + 20);
  
  // Calculate investment readiness
  let investmentReadiness = 0;
  if (emergencyMonths >= 6) investmentReadiness += 40;
  else if (emergencyMonths >= 3) investmentReadiness += 20;
  
  if (monthlySavings > 0) investmentReadiness += 30;
  if (profile.existingInvestments > 0) investmentReadiness += 30;
  
  // Calculate recommended emergency fund
  const emergencyFund = profile.monthlyExpenses * 6;
  const emergencyGap = Math.max(0, emergencyFund - totalLiquid);
  
  // Calculate recommended SIP
  let recommendedSIP = monthlySavings * 0.7; // 70% of savings
  if (profile.riskAppetite === 'low') recommendedSIP *= 0.6;
  if (profile.riskAppetite === 'high') recommendedSIP *= 1.2;
  recommendedSIP = Math.round(recommendedSIP / 500) * 500; // Round to nearest 500
  
  // Generate insights
  const insights: string[] = [];
  
  if (savingsRate < 20) {
    insights.push("Your savings rate is below optimal. Try to reduce expenses by 10-15%.");
  } else if (savingsRate >= 30) {
    insights.push("Excellent savings rate! You're on track for strong wealth creation.");
  }
  
  if (emergencyMonths < 3) {
    insights.push("Build an emergency fund of ₹" + emergencyFund.toLocaleString() + " (6 months expenses).");
  } else if (emergencyMonths >= 6) {
    insights.push("Great! Your emergency fund is well-established.");
  }
  
  if (monthlySavings > 5000 && emergencyMonths >= 3) {
    insights.push("You can safely invest ₹" + recommendedSIP.toLocaleString() + "/month in SIPs.");
  }
  
  if (profile.riskAppetite === 'medium') {
    insights.push("Moderate-risk SIPs are optimal for your profile and age.");
  }
  
  return {
    healthScore: Math.round(healthScore),
    savingsPotential: Math.round(savingsPotential),
    investmentReadiness: Math.round(investmentReadiness),
    emergencyFund: Math.round(emergencyFund),
    emergencyGap: Math.round(emergencyGap),
    recommendedSIP: Math.round(recommendedSIP),
    monthlySavings: Math.round(monthlySavings),
    savingsRate: Math.round(savingsRate),
    insights,
  };
}

export function getMutualFundRecommendations(riskAppetite: 'low' | 'medium' | 'high') {
  const allFunds = {
    low: [
      { name: "HDFC Balanced Advantage Fund", category: "Hybrid", returns: "11.2%", risk: "Low", minSIP: 500 },
      { name: "ICICI Prudential Equity & Debt Fund", category: "Hybrid", returns: "10.8%", risk: "Low", minSIP: 100 },
      { name: "SBI Equity Hybrid Fund", category: "Hybrid", returns: "12.1%", risk: "Low to Moderate", minSIP: 500 },
    ],
    medium: [
      { name: "Nifty 50 Index Fund", category: "Index Fund", returns: "14.5%", risk: "Moderate", minSIP: 500 },
      { name: "Mirae Asset Large Cap Fund", category: "Large Cap", returns: "15.2%", risk: "Moderate", minSIP: 1000 },
      { name: "Parag Parikh Flexi Cap Fund", category: "Flexi Cap", returns: "16.8%", risk: "Moderate", minSIP: 1000 },
      { name: "Axis Bluechip Fund", category: "Large Cap", returns: "14.9%", risk: "Moderate", minSIP: 500 },
    ],
    high: [
      { name: "Parag Parikh Flexi Cap Fund", category: "Flexi Cap", returns: "16.8%", risk: "Moderate to High", minSIP: 1000 },
      { name: "Axis Small Cap Fund", category: "Small Cap", returns: "18.5%", risk: "High", minSIP: 1000 },
      { name: "Quant Small Cap Fund", category: "Small Cap", returns: "22.3%", risk: "Very High", minSIP: 1000 },
      { name: "Motilal Oswal Midcap Fund", category: "Mid Cap", returns: "17.9%", risk: "High", minSIP: 500 },
    ],
  };
  
  return allFunds[riskAppetite];
}

export function calculateSIPProjection(monthlyAmount: number, years: number, returnRate: number = 12) {
  const months = years * 12;
  const monthlyRate = returnRate / 12 / 100;
  
  const futureValue = monthlyAmount * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const invested = monthlyAmount * months;
  const returns = futureValue - invested;
  
  return {
    invested: Math.round(invested),
    returns: Math.round(returns),
    total: Math.round(futureValue),
  };
}

export function generateAIMessages(profile: any, analysis: any) {
  if (!analysis) return [];
  
  const savingsRate = ((profile.monthlyIncome - profile.monthlyExpenses) / profile.monthlyIncome) * 100;
  
  const messages = [
    {
      type: 'insight',
      text: `Based on your ₹${profile.monthlyIncome.toLocaleString()} monthly income, you're saving ${savingsRate.toFixed(1)}% which is ${savingsRate >= 20 ? 'excellent' : 'below optimal'}.`,
    },
    {
      type: 'recommendation',
      text: `I recommend starting with ₹${(analysis.recommendedSIP || 0).toLocaleString()}/month in SIPs. This aligns with your ${profile.riskAppetite} risk appetite.`,
    },
    {
      type: 'alert',
      text: (analysis.emergencyGap || 0) > 0 
        ? `Build an emergency fund of ₹${(analysis.emergencyGap || 0).toLocaleString()} more to reach 6 months of expenses.`
        : `Great! Your emergency fund is well-established. Focus on wealth creation now.`,
    },
  ];
  
  return messages;
}

export function getAIResponse(query: string, profile: any, analysis: any): { text: string; links?: Array<{ label: string; url: string }> } {
  const lowerQuery = query.toLowerCase();
  
  // Ensure analysis has default values
  const safeAnalysis = analysis || {
    recommendedSIP: 5000,
    emergencyFund: 180000,
    emergencyGap: 0,
  };
  
  // SIP related queries
  if (lowerQuery.includes('sip') || lowerQuery.includes('systematic')) {
    const funds = getMutualFundRecommendations(profile.riskAppetite);
    return {
      text: `Great question about SIPs! Based on your ${profile.riskAppetite} risk profile and ₹${profile.monthlyIncome.toLocaleString()} monthly income, I recommend starting with ₹${safeAnalysis.recommendedSIP.toLocaleString()}/month.\n\n**Top 3 SIP Options for You:**\n\n1. **${funds[0].name}** - ${funds[0].returns} returns, ${funds[0].risk} risk\n2. **${funds[1].name}** - ${funds[1].returns} returns, ${funds[1].risk} risk\n3. **${funds[2].name}** - ${funds[2].returns} returns, ${funds[2].risk} risk\n\nSIPs work through rupee cost averaging - you buy more units when prices are low and fewer when high, reducing overall risk. Start small and increase gradually!`,
      links: [
        { label: '📊 View SIP Calculator', url: '#sip-calculator' },
        { label: '📈 See All Recommendations', url: '#mutual-funds' },
        { label: '📚 Learn About SIPs', url: 'https://www.amfiindia.com/investor-corner/knowledge-center/what-is-sip.html' },
      ],
    };
  }
  
  // Emergency fund queries
  if (lowerQuery.includes('emergency') || lowerQuery.includes('savings')) {
    return {
      text: `Your emergency fund is crucial! You need ₹${safeAnalysis.emergencyFund.toLocaleString()} (6 months of expenses).\n\n**Current Status:**\n- You have: ₹${(profile.bankBalance + profile.cashInHand).toLocaleString()}\n- You need: ₹${safeAnalysis.emergencyFund.toLocaleString()}\n- Gap: ₹${safeAnalysis.emergencyGap.toLocaleString()}\n\n**Action Plan:**\n1. Keep this in a liquid fund or savings account\n2. Don't invest emergency funds in equity\n3. Build it before starting aggressive investments\n4. Aim to complete in 6-12 months\n\n${safeAnalysis.emergencyGap > 0 ? `Save ₹${Math.round(safeAnalysis.emergencyGap / 6).toLocaleString()}/month for 6 months to complete it!` : 'Great job! Your emergency fund is complete. Now focus on wealth creation.'}`,
      links: [
        { label: '💰 Best Liquid Funds', url: 'https://www.valueresearchonline.com/funds/selector/category/4/liquid/?end-type=1&plan-type=direct' },
        { label: '🏦 High-Interest Savings Accounts', url: 'https://www.bankbazaar.com/savings-account.html' },
      ],
    };
  }
  
  // Risk profile queries
  if (lowerQuery.includes('risk') || lowerQuery.includes('safe') || lowerQuery.includes('aggressive')) {
    const riskAdvice = {
      low: 'Conservative investors should focus on debt funds, hybrid funds, and large-cap equity funds. Expected returns: 8-12% annually.',
      medium: 'Balanced investors can mix large-cap, flexi-cap, and index funds. Expected returns: 12-15% annually.',
      high: 'Aggressive investors can explore small-cap, mid-cap, and sector funds. Expected returns: 15-20%+ annually (with higher volatility).',
    };
    
    return {
      text: `Your risk appetite is **${profile.riskAppetite.toUpperCase()}**.\n\n${riskAdvice[profile.riskAppetite]}\n\n**Risk Management Tips:**\n- Diversify across 4-5 funds\n- Don't invest money you'll need in 3 years\n- Review portfolio every 6 months\n- Stay invested during market dips\n- Increase equity allocation if you're young\n\n**Your Age: ${profile.age}** - ${profile.age < 30 ? 'You can take more risk!' : profile.age < 45 ? 'Balanced approach is ideal' : 'Focus on capital preservation'}`,
      links: [
        { label: '📊 Risk Assessment Tool', url: 'https://www.amfiindia.com/investor-corner/knowledge-center/risk-o-meter.html' },
        { label: '📈 Fund Performance Comparison', url: 'https://www.valueresearchonline.com/funds/' },
      ],
    };
  }
  
  // Tax saving queries
  if (lowerQuery.includes('tax') || lowerQuery.includes('80c') || lowerQuery.includes('elss')) {
    return {
      text: `**Tax-Saving Investments (Section 80C):**\n\n**ELSS Mutual Funds** are the best option:\n- Save up to ₹46,800 in taxes (₹1.5L investment)\n- Only 3-year lock-in (shortest among 80C options)\n- Potential returns: 12-15% annually\n- Better than PPF, NSC, or Tax-Saving FDs\n\n**Top ELSS Funds:**\n1. Mirae Asset Tax Saver Fund\n2. Quant Tax Plan\n3. Canara Robeco Equity Tax Saver\n\n**Pro Tip:** Invest via SIP throughout the year instead of lump sum in March!`,
      links: [
        { label: '💰 Best ELSS Funds 2024', url: 'https://www.valueresearchonline.com/funds/selector/category/26/elss/' },
        { label: '📊 Tax Calculator', url: 'https://www.incometaxindia.gov.in/Pages/tools/tax-calculator.aspx' },
        { label: '📚 80C Deductions Guide', url: 'https://cleartax.in/s/80c-80-deductions' },
      ],
    };
  }
  
  // Investment amount queries
  if (lowerQuery.includes('how much') || lowerQuery.includes('amount') || lowerQuery.includes('invest')) {
    const monthlySavings = profile.monthlyIncome - profile.monthlyExpenses;
    return {
      text: `**Investment Capacity Analysis:**\n\n- Monthly Income: ₹${profile.monthlyIncome.toLocaleString()}\n- Monthly Expenses: ₹${profile.monthlyExpenses.toLocaleString()}\n- Monthly Savings: ₹${monthlySavings.toLocaleString()}\n\n**Recommended Allocation:**\n- Emergency Fund: ${safeAnalysis.emergencyGap > 0 ? `₹${Math.round(monthlySavings * 0.3).toLocaleString()}/month` : '✅ Complete'}\n- SIP Investments: ₹${safeAnalysis.recommendedSIP.toLocaleString()}/month\n- Liquid Savings: ₹${Math.round(monthlySavings * 0.2).toLocaleString()}/month\n\n**Golden Rule:** Start with 20% of income, increase by 10% every year!\n\nWith ₹${safeAnalysis.recommendedSIP.toLocaleString()}/month for 10 years at 12% returns, you'll build **₹${calculateSIPProjection(safeAnalysis.recommendedSIP, 10).total.toLocaleString()}**! 🚀`,
      links: [
        { label: '🧮 SIP Calculator', url: '#sip-calculator' },
        { label: '📊 Goal Planning Tool', url: 'https://www.amfiindia.com/investor-corner/online-center/mf-calculator' },
      ],
    };
  }
  
  // Fund selection queries
  if (lowerQuery.includes('fund') || lowerQuery.includes('which') || lowerQuery.includes('best')) {
    const funds = getMutualFundRecommendations(profile.riskAppetite);
    return {
      text: `**Personalized Fund Recommendations for ${profile.riskAppetite.toUpperCase()} Risk:**\n\n${funds.map((fund, i) => 
        `**${i + 1}. ${fund.name}**\n   Category: ${fund.category} | Returns: ${fund.returns} | Risk: ${fund.risk}\n   Min SIP: ₹${fund.minSIP}`
      ).join('\n\n')}\n\n**Selection Criteria:**\n- Consistent 3-5 year performance\n- Low expense ratio\n- Experienced fund manager\n- AUM > ₹1000 Cr\n\n**Diversification Tip:** Invest in 3-4 funds across different categories!`,
      links: [
        { label: '📈 Fund Comparison Tool', url: 'https://www.valueresearchonline.com/funds/' },
        { label: '⭐ Fund Ratings', url: 'https://www.morningstar.in/default.aspx' },
        { label: '📊 Historical Performance', url: 'https://www.amfiindia.com/research-information/other-data/mf-scheme-performance' },
      ],
    };
  }
  
  // Market timing queries
  if (lowerQuery.includes('market') || lowerQuery.includes('crash') || lowerQuery.includes('when')) {
    return {
      text: `**Market Timing Advice:**\n\n⚠️ **Don't try to time the market!** Even experts fail at this.\n\n**Why SIP is Better:**\n- Rupee cost averaging smooths out volatility\n- You buy more units when market is down\n- Removes emotional decision-making\n- Historical data shows SIP beats lump sum timing\n\n**Current Market Scenario:**\n- Nifty 50 PE Ratio: ~22 (slightly expensive)\n- Best Strategy: Continue SIPs, don't stop\n- Market corrections are buying opportunities\n\n**Remember:** Time IN the market > Timing the market!\n\n"The stock market is a device for transferring money from the impatient to the patient." - Warren Buffett`,
      links: [
        { label: '📊 Market Dashboard', url: 'https://www.nseindia.com/' },
        { label: '📈 Nifty 50 Analysis', url: 'https://www.moneycontrol.com/india/stockpricequote/indexnifty-50/nifty/IIN' },
      ],
    };
  }
  
  // KYC and account opening
  if (lowerQuery.includes('kyc') || lowerQuery.includes('account') || lowerQuery.includes('start') || lowerQuery.includes('open')) {
    return {
      text: `**Getting Started with Mutual Funds:**\n\n**Step 1: Complete KYC**\n- One-time process for all mutual funds\n- Need: PAN, Aadhaar, Bank details\n- Can be done online in 10 minutes\n\n**Step 2: Choose Platform**\n- Direct Plans (0% commission): Groww, Zerodha Coin, Paytm Money\n- Regular Plans: Any bank or distributor\n\n**Step 3: Start SIP**\n- Link bank account\n- Set up auto-debit\n- Choose funds and amount\n\n**Pro Tip:** Always choose **Direct Plans** - they have 1-1.5% higher returns than Regular Plans!`,
      links: [
        { label: '📝 Complete KYC Online', url: 'https://www.cvlkra.com/' },
        { label: '🚀 Open Groww Account', url: 'https://groww.in/mutual-funds' },
        { label: '💰 Zerodha Coin', url: 'https://coin.zerodha.com/' },
        { label: '📱 Paytm Money', url: 'https://www.paytmmoney.com/mutual-funds' },
      ],
    };
  }
  
  // Returns and expectations
  if (lowerQuery.includes('return') || lowerQuery.includes('profit') || lowerQuery.includes('earn')) {
    return {
      text: `**Expected Returns by Fund Category:**\n\n📊 **Equity Funds:**\n- Large Cap: 11-13% annually\n- Mid Cap: 13-16% annually\n- Small Cap: 15-20% annually (high risk)\n- Index Funds: 11-14% annually\n\n📊 **Hybrid Funds:**\n- Balanced: 10-12% annually\n- Aggressive Hybrid: 11-14% annually\n\n📊 **Debt Funds:**\n- Liquid Funds: 6-7% annually\n- Short Duration: 7-8% annually\n\n**Your Potential:**\nWith ₹${safeAnalysis.recommendedSIP.toLocaleString()}/month at 12% for 10 years:\n- Invested: ₹${calculateSIPProjection(safeAnalysis.recommendedSIP, 10).invested.toLocaleString()}\n- Returns: ₹${calculateSIPProjection(safeAnalysis.recommendedSIP, 10).returns.toLocaleString()}\n- **Total: ₹${calculateSIPProjection(safeAnalysis.recommendedSIP, 10).total.toLocaleString()}** 🎯\n\n⚠️ Past performance doesn't guarantee future returns!`,
      links: [
        { label: '🧮 Calculate Your Returns', url: '#sip-calculator' },
        { label: '📊 Historical Fund Performance', url: 'https://www.valueresearchonline.com/funds/' },
      ],
    };
  }
  
  // Default intelligent response
  return {
    text: `I'm here to help you with your wealth journey! I can assist you with:\n\n💰 **Investment Planning**\n- SIP recommendations\n- Fund selection\n- Portfolio diversification\n\n📊 **Financial Analysis**\n- Emergency fund planning\n- Risk assessment\n- Tax-saving strategies\n\n📈 **Market Insights**\n- Current market conditions\n- Investment timing\n- Return expectations\n\n🎯 **Goal Planning**\n- Retirement planning\n- Wealth creation\n- Specific financial goals\n\nAsk me anything like:\n- "Which mutual funds should I invest in?"\n- "How much should I invest monthly?"\n- "What are ELSS funds?"\n- "How to start investing?"\n- "What returns can I expect?"\n\nI'm analyzing your profile: ${profile.age} years old, ₹${profile.monthlyIncome.toLocaleString()} income, ${profile.riskAppetite} risk appetite. Let's build your wealth together! 🚀`,
    links: [
      { label: '📊 View My Recommendations', url: '#mutual-funds' },
      { label: '🧮 SIP Calculator', url: '#sip-calculator' },
      { label: '📚 Learn About Investing', url: 'https://www.amfiindia.com/investor-corner/knowledge-center' },
    ],
  };
}
