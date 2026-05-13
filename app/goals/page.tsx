"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import { Target, Plane, Home as HomeIcon, GraduationCap, Car } from "lucide-react";

const goals = [
  {
    icon: Plane,
    title: "Vacation Fund",
    target: 5000,
    current: 3200,
    color: "blue",
    deadline: "Dec 2026",
  },
  {
    icon: HomeIcon,
    title: "House Down Payment",
    target: 50000,
    current: 18500,
    color: "purple",
    deadline: "Jun 2027",
  },
  {
    icon: GraduationCap,
    title: "Education Fund",
    target: 15000,
    current: 8900,
    color: "pink",
    deadline: "Sep 2026",
  },
  {
    icon: Car,
    title: "New Car",
    target: 25000,
    current: 12000,
    color: "green",
    deadline: "Mar 2027",
  },
];

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Financial Goals</h1>
          <p className="text-gray-400">Track your progress towards your dreams</p>
        </motion.div>

        {/* Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl glow-card mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Target className="w-8 h-8 text-blue-400" />
            <div>
              <h2 className="text-2xl font-bold">4 Active Goals</h2>
              <p className="text-gray-400">Total target: $95,000</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Total Saved</p>
              <p className="text-2xl font-bold text-green-400">$42,600</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-blue-400">$52,400</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Overall Progress</p>
              <p className="text-2xl font-bold text-purple-400">44.8%</p>
            </div>
          </div>
        </motion.div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals.map((goal, index) => {
            const progress = (goal.current / goal.target) * 100;
            return (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="glass glass-hover p-6 rounded-2xl glow-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-${goal.color}-500/20 flex items-center justify-center`}>
                      <goal.icon className={`w-7 h-7 text-${goal.color}-400`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{goal.title}</h3>
                      <p className="text-sm text-gray-400">Target: {goal.deadline}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Progress</span>
                    <span className="font-semibold">{progress.toFixed(1)}%</span>
                  </div>
                  
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                      className={`h-full bg-gradient-to-r from-${goal.color}-500 to-${goal.color}-400`}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-sm text-gray-400">Current</p>
                      <p className="text-lg font-bold text-green-400">
                        ${goal.current.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Target</p>
                      <p className="text-lg font-bold">
                        ${goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button className="w-full glass glass-hover py-2 rounded-xl text-sm font-medium mt-4">
                    Add Contribution
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
