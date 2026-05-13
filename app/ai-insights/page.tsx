"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import { Sparkles, TrendingUp, AlertCircle, Lightbulb, Target, DollarSign } from "lucide-react";

const insights = [
  {
    icon: TrendingUp,
    type: "Positive",
    title: "Great Savings Streak!",
    description: "You've saved 15% more than your average over the past 3 months. Keep up the excellent work!",
    color: "green",
    action: "View Details",
  },
  {
    icon: AlertCircle,
    type: "Alert",
    title: "Unusual Spending Detected",
    description: "Your entertainment expenses are 40% higher than usual this month. Consider reviewing your subscriptions.",
    color: "orange",
    action: "Review Expenses",
  },
  {
    icon: Lightbulb,
    type: "Suggestion",
    title: "Investment Opportunity",
    description: "Based on your savings pattern, you could invest $500/month in a diversified portfolio.",
    color: "blue",
    action: "Learn More",
  },
  {
    icon: Target,
    type: "Goal Update",
    title: "Vacation Fund Progress",
    description: "You're on track to reach your vacation goal 2 months early if you maintain current savings rate.",
    color: "purple",
    action: "View Goal",
  },
  {
    icon: DollarSign,
    type: "Savings Tip",
    title: "Potential Monthly Savings",
    description: "By switching to annual subscriptions, you could save $45/month on your current services.",
    color: "cyan",
    action: "See Breakdown",
  },
];

const predictions = [
  { month: "Jul", predicted: 8200, actual: 8100 },
  { month: "Aug", predicted: 8500, actual: 8300 },
  { month: "Sep", predicted: 8100, actual: null },
  { month: "Oct", predicted: 8400, actual: null },
];

export default function AIInsightsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">AI Insights</h1>
          </div>
          <p className="text-gray-400">Personalized financial intelligence powered by AI</p>
        </motion.div>

        {/* AI Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl glow-card mb-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Your Financial Health Score</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-5xl font-bold gradient-text">8.5</div>
                <div>
                  <p className="text-green-400 font-semibold">Excellent</p>
                  <p className="text-sm text-gray-400">+0.8 from last month</p>
                </div>
              </div>
              <p className="text-gray-300">
                Your financial habits are strong. You're consistently saving, managing expenses well, 
                and making progress toward your goals. Our AI recommends focusing on investment 
                diversification for the next quarter.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Insights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {insights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass glass-hover p-6 rounded-2xl glow-card"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${insight.color}-500/20 flex items-center justify-center flex-shrink-0`}>
                  <insight.icon className={`w-6 h-6 text-${insight.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-1 rounded-full bg-${insight.color}-500/20 text-${insight.color}-400`}>
                      {insight.type}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{insight.description}</p>
                  <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                    {insight.action} →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Spending Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-2xl glow-card"
        >
          <h3 className="text-xl font-semibold mb-6">AI Spending Predictions</h3>
          <div className="space-y-4">
            {predictions.map((pred, index) => (
              <div key={pred.month} className="flex items-center gap-4">
                <div className="w-16 text-gray-400 font-medium">{pred.month}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex-1">
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(pred.predicted / 10000) * 100}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                    <div className="w-24 text-right">
                      <span className="text-sm font-semibold">${pred.predicted}</span>
                    </div>
                  </div>
                  {pred.actual && (
                    <div className="text-xs text-gray-400">
                      Actual: ${pred.actual} ({pred.actual < pred.predicted ? "✓ Under" : "Over"} prediction)
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
