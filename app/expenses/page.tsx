"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ShoppingBag, Coffee, Home, Car, Heart, Smartphone } from "lucide-react";

const expenseData = [
  { name: "Shopping", value: 2400, color: "#3b82f6" },
  { name: "Food & Drink", value: 1398, color: "#8b5cf6" },
  { name: "Housing", value: 3800, color: "#ec4899" },
  { name: "Transportation", value: 908, color: "#10b981" },
  { name: "Healthcare", value: 480, color: "#f59e0b" },
  { name: "Entertainment", value: 620, color: "#06b6d4" },
];

const categories = [
  { icon: ShoppingBag, name: "Shopping", amount: "$2,400", percentage: "24%", color: "blue" },
  { icon: Coffee, name: "Food & Drink", amount: "$1,398", percentage: "14%", color: "purple" },
  { icon: Home, name: "Housing", amount: "$3,800", percentage: "38%", color: "pink" },
  { icon: Car, name: "Transportation", amount: "$908", percentage: "9%", color: "green" },
  { icon: Heart, name: "Healthcare", amount: "$480", percentage: "5%", color: "orange" },
  { icon: Smartphone, name: "Entertainment", amount: "$620", percentage: "6%", color: "cyan" },
];

export default function ExpensesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Expense Tracking</h1>
          <p className="text-gray-400">Monitor and analyze your spending patterns</p>
        </motion.div>

        {/* Total Expenses Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl glow-card mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 mb-2">Total Expenses This Month</p>
              <h2 className="text-5xl font-bold gradient-text">$9,606</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">vs Last Month</p>
              <p className="text-2xl font-semibold text-green-400">-12.5%</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass p-6 rounded-2xl glow-card"
          >
            <h3 className="text-xl font-semibold mb-6">Expense Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass p-6 rounded-2xl glow-card"
          >
            <h3 className="text-xl font-semibold mb-6">Categories</h3>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-${category.color}-500/20 flex items-center justify-center`}>
                    <category.icon className={`w-6 h-6 text-${category.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{category.name}</h4>
                    <p className="text-sm text-gray-400">{category.percentage} of total</p>
                  </div>
                  <div className="text-lg font-semibold">{category.amount}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
