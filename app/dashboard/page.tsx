"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Brain, TrendingUp, Shield, Sparkles, MessageCircle, Send, Target, PiggyBank, AlertCircle, CheckCircle2, Zap, Clock } from "lucide-react";
import { useStore } from "@/lib/store";
import { getMutualFundRecommendations, calculateSIPProjection, generateAIMessages, getAIResponse } from "@/lib/ai-engine";
import { predictFutureWealth, calculateFinancialRisk, generateWealthTimeline } from "@/lib/predictions";
import { memorySystem } from "@/lib/memory";
import Navbar from "@/components/Navbar";
import VoiceInput from "@/components/VoiceInput";

export default function DashboardPage() {
  const { userProfile, aiAnalysis, setUserProfile, setAIAnalysis } = useStore();
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; text: string; links?: Array<{ label: string; url: string }> }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [showPredictions, setShowPredictions] = useState(false);
  const [memoryInsights, setMemoryInsights] = useState<string[]>([]);
  
  // Auto-populate with test data if empty
  useEffect(() => {
    if (!userProfile.name) {
      const testProfile = {
        name: "Test User",
        age: 28,
        isStudent: false,
        monthlyIncome: 50000,
        cashInHand: 10000,
        bankBalance: 100000,
        monthlyExpenses: 30000,
        existingInvestments: 50000,
        financialGoal: "wealth",
        riskAppetite: "medium" as const,
      };
      setUserProfile(testProfile);
      
      // Import and use the analysis function
      import("@/lib/ai-engine").then(({ analyzeFinancialProfile }) => {
        const analysis = analyzeFinancialProfile(testProfile);
        setAIAnalysis(analysis);
      });
    }
  }, [userProfile.name, setUserProfile, setAIAnalysis]);
  
  // Initialize chat messages when profile is ready
  useEffect(() => {
    if (userProfile.name && aiAnalysis && chatMessages.length === 0) {
      setChatMessages([
        { 
          role: "ai", 
          text: `Hi ${userProfile.name}! 👋 I'm your AI Wealth Advisor. I've analyzed your financial profile and your health score is ${aiAnalysis?.healthScore}/100.\n\nI can help you with:\n• SIP recommendations\n• Fund selection\n• Tax-saving strategies\n• Emergency fund planning\n• Market insights\n\nAsk me anything about mutual funds and investing!`,
          links: [
            { label: '📊 View Recommendations', url: '#mutual-funds' },
            { label: '🧮 SIP Calculator', url: '#sip-calculator' },
          ]
        },
      ]);
      setSipAmount(aiAnalysis?.recommendedSIP || 5000);
    }
  }, [userProfile.name, aiAnalysis, chatMessages.length]);
  
  // Load memory insights on mount
  useEffect(() => {
    if (aiAnalysis) {
      const insights = memorySystem.generateInsights();
      setMemoryInsights(insights);
      
      // Track dashboard view
      memorySystem.addMemory('dashboard_viewed', {
        timestamp: new Date().toISOString(),
        healthScore: aiAnalysis?.healthScore,
      });
    }
  }, [aiAnalysis]);
  
  // Early return if no data
  if (!aiAnalysis || !userProfile.name) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-4">Loading your dashboard...</div>
          <div className="text-sm text-gray-400 mb-4">Setting up test data...</div>
        </div>
      </div>
    );
  }
  
  const funds = getMutualFundRecommendations(userProfile.riskAppetite);
  const sipProjection = calculateSIPProjection(sipAmount, sipYears);
  const aiMessages = generateAIMessages(userProfile, aiAnalysis);
  
  // Predictive analytics
  const wealthPredictions = predictFutureWealth({
    monthlyIncome: userProfile.monthlyIncome,
    monthlyExpenses: userProfile.monthlyExpenses,
    bankBalance: userProfile.bankBalance,
    existingInvestments: userProfile.existingInvestments,
  }, 12);
  
  const financialRisks = calculateFinancialRisk({
    monthlyIncome: userProfile.monthlyIncome,
    monthlyExpenses: userProfile.monthlyExpenses,
    bankBalance: userProfile.bankBalance,
    existingInvestments: userProfile.existingInvestments,
  });
  
  const wealthTimeline = generateWealthTimeline({
    monthlyIncome: userProfile.monthlyIncome,
    monthlyExpenses: userProfile.monthlyExpenses,
    bankBalance: userProfile.bankBalance,
    existingInvestments: userProfile.existingInvestments,
  });

  
  // Generate SIP growth chart data
  const sipChartData = Array.from({ length: sipYears + 1 }, (_, i) => {
    const projection = calculateSIPProjection(sipAmount, i);
    return {
      year: i,
      invested: projection.invested,
      total: projection.total,
    };
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = chatInput;
    setChatMessages([...chatMessages, { role: "user", text: userMessage }]);
    setChatInput("");
    
    // Track chat in memory
    memorySystem.addMemory('ai_chat', {
      question: userMessage,
      timestamp: new Date().toISOString(),
    });
    
    // Get AI response
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage, userProfile, aiAnalysis);
      setChatMessages((prev) => [...prev, { 
        role: "ai", 
        text: aiResponse.text,
        links: aiResponse.links 
      }]);
    }, 800);
  };
  
  const handleVoiceTranscript = (text: string) => {
    setChatInput(text);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 pt-24">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userProfile.name}! 👋</h1>
              <p className="text-gray-400">Your AI Wealth Companion</p>
            </div>
            <div className="glass px-6 py-3 rounded-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm">AI Active</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Memory Insights Banner */}
        {memoryInsights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-4 rounded-2xl mb-6 border border-indigo-500/20"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">AI Insights from Your History</h3>
                <div className="space-y-1">
                  {memoryInsights.map((insight, index) => (
                    <p key={index} className="text-sm text-gray-300">• {insight}</p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Health Score Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Financial Health", value: aiAnalysis.healthScore, max: 100, icon: Shield, color: "indigo" },
            { label: "Savings Potential", value: aiAnalysis.savingsPotential, max: 100, icon: PiggyBank, color: "green" },
            { label: "Investment Readiness", value: aiAnalysis.investmentReadiness, max: 100, icon: TrendingUp, color: "purple" },
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass p-6 rounded-2xl glow-card"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">{metric.label}</div>
                  <div className="text-3xl font-bold">{metric.value}<span className="text-lg text-gray-400">/{metric.max}</span></div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-${metric.color}-500/20 flex items-center justify-center`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
                </div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-full bg-gradient-to-r from-${metric.color}-500 to-${metric.color}-400`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Charts & Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {/* SIP Growth Projection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-2xl glow-card"
              id="sip-calculator"
            >
              <h3 className="text-xl font-semibold mb-6">SIP Growth Projection</h3>
              
              {/* Sliders */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm mb-2">Monthly SIP: ₹{sipAmount.toLocaleString()}</label>
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={sipAmount}
                    onChange={(e) => setSipAmount(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Investment Period: {sipYears} years</label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={sipYears}
                    onChange={(e) => setSipYears(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Projection Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="glass p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Invested</div>
                  <div className="text-xl font-bold text-blue-400">₹{sipProjection.invested.toLocaleString()}</div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Returns</div>
                  <div className="text-xl font-bold text-green-400">₹{sipProjection.returns.toLocaleString()}</div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Total Value</div>
                  <div className="text-xl font-bold gradient-text">₹{sipProjection.total.toLocaleString()}</div>
                </div>
              </div>

              {/* Chart */}
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={sipChartData}>
                  <defs>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="year" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="invested" stroke="#6366f1" fillOpacity={1} fill="url(#colorInvested)" />
                  <Area type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Mutual Fund Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass p-6 rounded-2xl glow-card"
              id="mutual-funds"
            >
              <h3 className="text-xl font-semibold mb-6">Recommended Mutual Funds</h3>
              <div className="space-y-4">
                {funds.map((fund, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="glass glass-hover p-4 rounded-xl"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{fund.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{fund.category}</span>
                          <span>•</span>
                          <span>{fund.risk} Risk</span>
                          <span>•</span>
                          <span>Min SIP: ₹{fund.minSIP}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{fund.returns}</div>
                        <div className="text-xs text-gray-400">3Y Returns</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Emergency Fund */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass p-6 rounded-2xl glow-card"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Emergency Fund Recommendation</h3>
                  <p className="text-gray-400 mb-4">
                    Build an emergency fund of <span className="text-white font-semibold">₹{aiAnalysis.emergencyFund.toLocaleString()}</span> (6 months of expenses)
                  </p>
                  {aiAnalysis.emergencyGap > 0 ? (
                    <div className="flex items-center gap-2 text-orange-400">
                      <AlertCircle className="w-5 h-5" />
                      <span>₹{aiAnalysis.emergencyGap.toLocaleString()} more needed</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Emergency fund complete!</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Wealth Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass p-6 rounded-2xl glow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Wealth Milestones</h3>
                <Clock className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="space-y-4">
                {wealthTimeline.slice(0, 4).map((milestone, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="text-2xl">{milestone.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{milestone.title}</span>
                        <span className={`text-sm ${milestone.status === 'completed' ? 'text-green-400' : 'text-gray-400'}`}>
                          {milestone.status === 'completed' ? 'Complete!' : `${milestone.months} months`}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">₹{milestone.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Financial Risk Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="glass p-6 rounded-2xl glow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Risk Assessment</h3>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  financialRisks.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' :
                  financialRisks.riskLevel === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {financialRisks.riskLevel} Risk
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Risk Score</span>
                  <span className="font-semibold">{financialRisks.riskScore}/100</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      financialRisks.riskLevel === 'High' ? 'bg-red-500' :
                      financialRisks.riskLevel === 'Medium' ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${financialRisks.riskScore}%` }}
                  />
                </div>
              </div>
              {financialRisks.risks.length > 0 && (
                <div className="space-y-2">
                  {financialRisks.risks.slice(0, 3).map((risk, index) => (
                    <div key={index} className={`p-3 rounded-xl text-sm ${
                      risk.type === 'high' ? 'bg-red-500/10 border border-red-500/20' :
                      'bg-orange-500/10 border border-orange-500/20'
                    }`}>
                      <div className="font-semibold mb-1">{risk.title}</div>
                      <div className="text-xs text-gray-400">{risk.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Future Wealth Prediction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass p-6 rounded-2xl glow-card"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">12-Month Wealth Forecast</h3>
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="glass p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Current Wealth</div>
                  <div className="text-xl font-bold text-blue-400">
                    ₹{(userProfile.bankBalance + userProfile.existingInvestments).toLocaleString()}
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Predicted (12M)</div>
                  <div className="text-xl font-bold text-green-400">
                    ₹{wealthPredictions[wealthPredictions.length - 1].wealth.toLocaleString()}
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={wealthPredictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                    }}
                  />
                  <Line type="monotone" dataKey="wealth" stroke="#a855f7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Right Column - AI Chat */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass p-6 rounded-2xl glow-card sticky top-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Advisor</h3>
                  <div className="text-xs text-gray-400">Always here to help</div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="space-y-3 mb-6">
                {aiMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className={`p-3 rounded-xl text-sm ${
                      msg.type === 'alert' ? 'bg-orange-500/10 border border-orange-500/20' :
                      msg.type === 'recommendation' ? 'bg-indigo-500/10 border border-indigo-500/20' :
                      'bg-green-500/10 border border-green-500/20'
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                ))}
              </div>

              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto mb-4 space-y-3 scroll-smooth" id="chat-container">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] ${
                        msg.role === 'user'
                          ? 'bg-indigo-500 text-white p-3 rounded-xl'
                          : 'space-y-2'
                      }`}
                    >
                      {msg.role === 'ai' && (
                        <>
                          <div className="glass p-4 rounded-xl text-sm whitespace-pre-line">
                            {msg.text}
                          </div>
                          {msg.links && msg.links.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {msg.links.map((link, linkIndex) => (
                                <a
                                  key={linkIndex}
                                  href={link.url}
                                  target={link.url.startsWith('http') ? '_blank' : '_self'}
                                  rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
                                  onClick={(e) => {
                                    if (link.url.startsWith('#')) {
                                      e.preventDefault();
                                      const element = document.querySelector(link.url);
                                      element?.scrollIntoView({ behavior: 'smooth' });
                                    }
                                  }}
                                  className="glass glass-hover px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-indigo-500/20 transition-all"
                                >
                                  {link.label}
                                </a>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      {msg.role === 'user' && msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Questions */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Which funds should I invest in?",
                    "How much should I invest?",
                    "What are ELSS funds?",
                    "How to start investing?",
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        // Directly send the question without using chatInput state
                        setChatMessages([...chatMessages, { role: "user", text: question }]);
                        
                        // Track chat in memory
                        memorySystem.addMemory('ai_chat', {
                          question: question,
                          timestamp: new Date().toISOString(),
                        });
                        
                        // Get AI response
                        setTimeout(() => {
                          const aiResponse = getAIResponse(question, userProfile, aiAnalysis);
                          setChatMessages((prev) => [...prev, { 
                            role: "ai", 
                            text: aiResponse.text,
                            links: aiResponse.links 
                          }]);
                        }, 800);
                      }}
                      className="glass glass-hover px-3 py-1.5 rounded-lg text-xs hover:bg-indigo-500/20 transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 glass px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
                <VoiceInput onTranscript={handleVoiceTranscript} />
                <button
                  onClick={handleSendMessage}
                  className="glass glass-hover p-3 rounded-xl"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
