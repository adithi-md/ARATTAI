"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Shield, Target, AlertTriangle, CheckCircle, Loader2, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { 
  orchestrateAgents, 
  checkBackendHealth, 
  convertProfileToBackendFormat 
} from "@/lib/api-client";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function AnalysisPage() {
  const router = useRouter();
  const { userProfile, aiAnalysis } = useStore();
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(false);
  const [agentAnalysis, setAgentAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userProfile.name) {
      router.push('/onboarding');
      return;
    }

    async function runAnalysis() {
      setLoading(true);
      setError(null);

      // Check if backend is available
      const isHealthy = await checkBackendHealth();
      setBackendAvailable(isHealthy);

      if (!isHealthy) {
        setError("Backend agents are not available. Please start the backend server.");
        setLoading(false);
        return;
      }

      // Convert profile and run orchestration
      const backendProfile = convertProfileToBackendFormat(userProfile);
      
      // Sample expenses for demo
      const sampleExpenses = [
        { amount: 5000, category: "Food", date: "2026-05-01", description: "Groceries" },
        { amount: 3000, category: "Transport", date: "2026-05-05", description: "Fuel" },
        { amount: 2000, category: "Entertainment", date: "2026-05-10", description: "Movies" },
      ];

      const result = await orchestrateAgents(backendProfile, sampleExpenses);
      
      if (result) {
        setAgentAnalysis(result);
      } else {
        setError("Failed to get analysis from agents. Please try again.");
      }

      setLoading(false);
    }

    runAnalysis();
  }, [userProfile, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6 pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-12 rounded-3xl text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mx-auto mb-6">
              <Brain className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-4">AI Agents Analyzing...</h2>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                <span>Investment Advisor Agent working...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                <span>Expense Intelligence Agent analyzing...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                <span>Risk Monitoring Agent assessing...</span>
              </div>
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-green-400" />
                <span>Goal Planning Agent strategizing...</span>
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 flex items-center justify-center p-6 pt-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-12 rounded-3xl text-center max-w-md"
          >
            <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Backend Not Available</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="glass p-4 rounded-xl text-left text-sm space-y-2">
              <p className="font-semibold text-indigo-400">To start the backend:</p>
              <code className="block bg-black/30 p-2 rounded">cd backend</code>
              <code className="block bg-black/30 p-2 rounded">pip install -r requirements_agents.txt</code>
              <code className="block bg-black/30 p-2 rounded">python main_agents.py</code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 glass glass-hover px-6 py-3 rounded-xl"
            >
              Retry Connection
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Multi-Agent Analysis</h1>
                <p className="text-gray-400">Comprehensive insights from 4 AI agents</p>
              </div>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full inline-flex">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm">Backend Connected</span>
            </div>
          </motion.div>

          {/* Summary Card */}
          {agentAnalysis?.summary && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-6 rounded-2xl glow-card mb-8"
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-indigo-400" />
                <h2 className="text-xl font-semibold">AI Summary</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="glass p-4 rounded-xl">
                  <div className="text-sm text-gray-400 mb-1">Health Score</div>
                  <div className="text-3xl font-bold gradient-text">
                    {agentAnalysis.summary.health_score}/100
                  </div>
                </div>
                <div className="glass p-4 rounded-xl col-span-2">
                  <div className="text-sm text-gray-400 mb-2">Top Priority</div>
                  <div className="font-semibold">
                    {agentAnalysis.summary.top_priority?.title || "All systems optimal"}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Investment Analysis */}
            {agentAnalysis?.investment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass p-6 rounded-2xl glow-card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Investment Advisor</h3>
                </div>

                <div className="space-y-4">
                  <div className="glass p-4 rounded-xl">
                    <div className="text-sm text-gray-400 mb-1">Recommended SIP</div>
                    <div className="text-2xl font-bold text-indigo-400">
                      ₹{agentAnalysis.investment.recommended_sip?.toLocaleString()}
                      <span className="text-sm text-gray-400">/month</span>
                    </div>
                  </div>

                  {agentAnalysis.investment.allocation && (
                    <div className="glass p-4 rounded-xl">
                      <div className="text-sm text-gray-400 mb-3">Portfolio Allocation</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span>Equity</span>
                          <span className="font-semibold">{agentAnalysis.investment.allocation.equity}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{ width: `${agentAnalysis.investment.allocation.equity}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Debt</span>
                          <span className="font-semibold">{agentAnalysis.investment.allocation.debt}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            style={{ width: `${agentAnalysis.investment.allocation.debt}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {agentAnalysis.investment.insights && (
                    <div className="space-y-2">
                      {agentAnalysis.investment.insights.slice(0, 3).map((insight: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{insight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Risk Assessment */}
            {agentAnalysis?.risks && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-2xl glow-card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Risk Monitoring</h3>
                </div>

                <div className="space-y-4">
                  <div className="glass p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Risk Score</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        agentAnalysis.risks.risk_level === 'High' ? 'bg-red-500/20 text-red-400' :
                        agentAnalysis.risks.risk_level === 'Moderate' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {agentAnalysis.risks.risk_level}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{agentAnalysis.risks.risk_score}/100</div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-3">
                      <div 
                        className={`h-full ${
                          agentAnalysis.risks.risk_level === 'High' ? 'bg-red-500' :
                          agentAnalysis.risks.risk_level === 'Moderate' ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${agentAnalysis.risks.risk_score}%` }}
                      />
                    </div>
                  </div>

                  {agentAnalysis.risks.risks && agentAnalysis.risks.risks.length > 0 && (
                    <div className="space-y-2">
                      {agentAnalysis.risks.risks.slice(0, 3).map((risk: any, index: number) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-xl ${
                            risk.severity === 'high' ? 'bg-red-500/10 border border-red-500/20' :
                            'bg-orange-500/10 border border-orange-500/20'
                          }`}
                        >
                          <div className="font-semibold text-sm mb-1">{risk.title}</div>
                          <div className="text-xs text-gray-400">{risk.description}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {agentAnalysis.risks.priority_actions && agentAnalysis.risks.priority_actions.length > 0 && (
                    <div className="glass p-4 rounded-xl">
                      <div className="text-sm font-semibold mb-2 text-indigo-400">Priority Actions</div>
                      <div className="space-y-2">
                        {agentAnalysis.risks.priority_actions.slice(0, 2).map((action: any, index: number) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-indigo-400">{action.priority}</span>
                            </div>
                            <span className="text-gray-300">{action.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Expense Analysis */}
            {agentAnalysis?.expenses && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass p-6 rounded-2xl glow-card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Expense Intelligence</h3>
                </div>

                <div className="space-y-4">
                  {agentAnalysis.expenses.insights && (
                    <div className="space-y-2">
                      {agentAnalysis.expenses.insights.slice(0, 4).map((insight: string, index: number) => (
                        <div key={index} className="glass p-3 rounded-xl text-sm">
                          {insight}
                        </div>
                      ))}
                    </div>
                  )}

                  {agentAnalysis.expenses.overspending_alerts && agentAnalysis.expenses.overspending_alerts.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-orange-400">Overspending Alerts</div>
                      {agentAnalysis.expenses.overspending_alerts.map((alert: any, index: number) => (
                        <div key={index} className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-xl text-sm">
                          <div className="font-semibold">{alert.category}</div>
                          <div className="text-xs text-gray-400">
                            Overspending by ₹{alert.overspend?.toLocaleString()} ({alert.severity} severity)
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Goal Planning */}
            {agentAnalysis?.goals && agentAnalysis.goals.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass p-6 rounded-2xl glow-card"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Goal Planning</h3>
                </div>

                <div className="space-y-4">
                  {agentAnalysis.goals.map((goal: any, index: number) => (
                    <div key={index} className="glass p-4 rounded-xl">
                      <div className="font-semibold mb-2">{goal.goal_name}</div>
                      <div className="text-sm text-gray-400 mb-3">
                        Required: ₹{goal.required_monthly?.toLocaleString()}/month
                      </div>
                      {goal.feasibility && (
                        <div className={`px-3 py-1 rounded-full text-xs inline-block ${
                          goal.feasibility.status === 'easy' ? 'bg-green-500/20 text-green-400' :
                          goal.feasibility.status === 'moderate' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {goal.feasibility.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
