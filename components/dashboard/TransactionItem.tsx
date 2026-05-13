"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TransactionItemProps {
  icon: LucideIcon;
  title: string;
  category: string;
  amount: string;
  isExpense: boolean;
  delay?: number;
}

export default function TransactionItem({
  icon: Icon,
  title,
  category,
  amount,
  isExpense,
  delay = 0,
}: TransactionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
    >
      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-gray-400">{category}</p>
      </div>
      <div
        className={`text-lg font-semibold ${
          isExpense ? "text-red-400" : "text-green-400"
        }`}
      >
        {isExpense ? "-" : "+"}${amount}
      </div>
    </motion.div>
  );
}
