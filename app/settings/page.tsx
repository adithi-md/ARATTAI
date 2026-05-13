"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import { User, Bell, Shield, Palette, CreditCard, Globe } from "lucide-react";

const settingsSections = [
  {
    icon: User,
    title: "Profile Settings",
    description: "Manage your personal information and preferences",
    items: ["Full Name", "Email Address", "Phone Number", "Profile Picture"],
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Control how you receive updates and alerts",
    items: ["Email Notifications", "Push Notifications", "SMS Alerts", "Weekly Reports"],
  },
  {
    icon: Shield,
    title: "Security & Privacy",
    description: "Protect your account and data",
    items: ["Two-Factor Authentication", "Change Password", "Connected Devices", "Privacy Settings"],
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Customize your interface",
    items: ["Theme Mode", "Accent Color", "Font Size", "Dashboard Layout"],
  },
  {
    icon: CreditCard,
    title: "Connected Accounts",
    description: "Manage linked bank accounts and cards",
    items: ["Bank Accounts", "Credit Cards", "Payment Methods", "Auto-Sync Settings"],
  },
  {
    icon: Globe,
    title: "Preferences",
    description: "Set your regional and language preferences",
    items: ["Language", "Currency", "Time Zone", "Date Format"],
  },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account and preferences</p>
        </motion.div>

        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl glow-card mb-8"
        >
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
              AJ
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Alex Johnson</h2>
              <p className="text-gray-400 mb-3">alex.johnson@email.com</p>
              <div className="flex gap-3">
                <button className="glass glass-hover px-4 py-2 rounded-xl text-sm font-medium">
                  Edit Profile
                </button>
                <button className="glass glass-hover px-4 py-2 rounded-xl text-sm font-medium">
                  Change Avatar
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400 mb-1">Member Since</p>
              <p className="text-lg font-semibold">Jan 2024</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="glass glass-hover p-6 rounded-2xl glow-card"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-1">{section.title}</h3>
                  <p className="text-sm text-gray-400">{section.description}</p>
                </div>
              </div>
              <div className="space-y-2 pl-16">
                {section.items.map((item) => (
                  <button
                    key={item}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-white/5 transition-all text-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-2xl border-red-500/20 mt-8"
        >
          <h3 className="text-xl font-semibold mb-4 text-red-400">Danger Zone</h3>
          <div className="space-y-3">
            <button className="w-full glass glass-hover px-4 py-3 rounded-xl text-sm font-medium text-left hover:bg-red-500/10 transition-all">
              Export All Data
            </button>
            <button className="w-full glass glass-hover px-4 py-3 rounded-xl text-sm font-medium text-left hover:bg-red-500/10 transition-all">
              Deactivate Account
            </button>
            <button className="w-full glass glass-hover px-4 py-3 rounded-xl text-sm font-medium text-left text-red-400 hover:bg-red-500/10 transition-all">
              Delete Account Permanently
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
