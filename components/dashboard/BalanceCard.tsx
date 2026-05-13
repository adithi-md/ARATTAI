"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

interface BalanceCardProps {
  title: string;
  amount: string;
  change: string;
  isPositive: boolean;
  delay?: number;
}

export default function BalanceCard({
  title,
  amount,
  change,
  isPositive,
  delay = 0,
}: BalanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass glass-hover p-6 rounded-2xl glow-card"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <h3 className="text-3xl font-bold">{amount}</h3>
        </div>
        <div
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
            isPositive
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change}</span>
        </div>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ duration: 1, delay: delay + 0.3 }}
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
        />
      </div>
    </motion.div>
  );
}
