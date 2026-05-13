"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Home, BarChart3, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  
  // Don't show navbar on landing and onboarding pages
  if (pathname === "/" || pathname === "/onboarding") {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ARATTAI</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                pathname === "/" 
                  ? "bg-indigo-500 text-white" 
                  : "glass glass-hover"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                pathname === "/dashboard" 
                  ? "bg-indigo-500 text-white" 
                  : "glass glass-hover"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            
            <Link
              href="/analysis"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                pathname === "/analysis" 
                  ? "bg-indigo-500 text-white" 
                  : "glass glass-hover"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI Analysis</span>
            </Link>

            <button className="glass glass-hover p-2 rounded-xl">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
