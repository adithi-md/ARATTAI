"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Target,
  Sparkles,
  Settings,
  LogOut,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Wallet, label: "Expenses", href: "/expenses" },
  { icon: Target, label: "Goals", href: "/goals" },
  { icon: Sparkles, label: "AI Insights", href: "/ai-insights" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 top-0 h-screen w-64 glass border-r border-white/10 p-6 flex flex-col z-50"
    >
      {/* Logo */}
      <Link href="/dashboard" className="mb-12">
        <h1 className="text-2xl font-bold gradient-text">ARATTAI</h1>
        <p className="text-xs text-gray-400 mt-1">AI Finance Platform</p>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-blue-500/20 text-blue-400 glow-card"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout */}
      <Link
        href="/"
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </Link>
    </motion.aside>
  );
}
