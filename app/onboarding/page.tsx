"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, User, Briefcase, Wallet, TrendingUp, Target, Shield, Home } from "lucide-react";
import { useStore } from "@/lib/store";

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Financial Status", icon: Wallet },
  { id: 3, title: "Goals & Risk", icon: Target },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const { userProfile, setUserProfile } = useStore();

  const [formData, setFormData] = useState({
    name: userProfile.name || "",
    age: userProfile.age || 25,
    occupation: userProfile.occupation || "professional",
    monthlyIncome: userProfile.monthlyIncome || 50000,
    cashInHand: userProfile.cashInHand || 10000,
    bankBalance: userProfile.bankBalance || 100000,
    monthlyExpenses: userProfile.monthlyExpenses || 30000,
    existingInvestments: userProfile.existingInvestments || 50000,
    financialGoal: userProfile.financialGoal || "wealth",
    riskAppetite: userProfile.riskAppetite || "medium",
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      setUserProfile(formData);
      router.push("/analysis");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header with Home Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <Link
            href="/"
            className="glass glass-hover p-3 rounded-xl"
            title="Back to Home"
          >
            <Home className="w-5 h-5" />
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold mb-2">Let's Get to Know You</h1>
            <p className="text-gray-400">Help us personalize your wealth journey</p>
          </div>
          <div className="w-14" /> {/* Spacer for centering */}
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.id
                        ? "bg-indigo-500 text-white"
                        : "glass text-gray-400"
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs mt-2 text-gray-400">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-4 rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        currentStep > step.id ? "bg-indigo-500 w-full" : "w-0"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          className="glass p-8 rounded-3xl glow-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full glass px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Age: {formData.age}</label>
                  <input
                    type="range"
                    min="18"
                    max="65"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>18</span>
                    <span>65</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Occupation</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["student", "professional"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFormData({ ...formData, occupation: type })}
                        className={`p-4 rounded-xl transition-all ${
                          formData.occupation === type
                            ? "bg-indigo-500 text-white"
                            : "glass hover:bg-white/10"
                        }`}
                      >
                        {type === "student" ? <User className="w-6 h-6 mx-auto mb-2" /> : <Briefcase className="w-6 h-6 mx-auto mb-2" />}
                        <div className="capitalize">{type}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Income: ₹{formData.monthlyIncome.toLocaleString()}</label>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Cash in Hand: ₹{formData.cashInHand.toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={formData.cashInHand}
                    onChange={(e) => setFormData({ ...formData, cashInHand: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Bank Balance: ₹{formData.bankBalance.toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={formData.bankBalance}
                    onChange={(e) => setFormData({ ...formData, bankBalance: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Expenses: ₹{formData.monthlyExpenses.toLocaleString()}</label>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={formData.monthlyExpenses}
                    onChange={(e) => setFormData({ ...formData, monthlyExpenses: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Existing Investments: ₹{formData.existingInvestments.toLocaleString()}</label>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={formData.existingInvestments}
                    onChange={(e) => setFormData({ ...formData, existingInvestments: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium mb-3">Financial Goal</label>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "wealth", label: "Wealth Creation", icon: TrendingUp },
                      { value: "retirement", label: "Retirement", icon: Shield },
                      { value: "emergency", label: "Emergency Fund", icon: Wallet },
                      { value: "goal", label: "Specific Goal", icon: Target },
                    ].map((goal) => (
                      <button
                        key={goal.value}
                        onClick={() => setFormData({ ...formData, financialGoal: goal.value })}
                        className={`p-4 rounded-xl transition-all ${
                          formData.financialGoal === goal.value
                            ? "bg-indigo-500 text-white"
                            : "glass hover:bg-white/10"
                        }`}
                      >
                        <goal.icon className="w-6 h-6 mx-auto mb-2" />
                        <div className="text-sm">{goal.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Risk Appetite</label>
                  <div className="grid grid-cols-3 gap-4">
                    {["low", "medium", "high"].map((risk) => (
                      <button
                        key={risk}
                        onClick={() => setFormData({ ...formData, riskAppetite: risk })}
                        className={`p-4 rounded-xl transition-all ${
                          formData.riskAppetite === risk
                            ? "bg-indigo-500 text-white"
                            : "glass hover:bg-white/10"
                        }`}
                      >
                        <div className="capitalize font-medium">{risk}</div>
                        <div className="text-xs mt-1 opacity-80">
                          {risk === "low" && "Safe & Steady"}
                          {risk === "medium" && "Balanced"}
                          {risk === "high" && "Aggressive"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "glass glass-hover"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition-all"
            >
              {currentStep === 3 ? "Analyze My Profile" : "Continue"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
