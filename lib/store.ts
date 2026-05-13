import { create } from 'zustand';

interface UserProfile {
  name: string;
  age: number;
  occupation: 'student' | 'professional';
  monthlyIncome: number;
  cashInHand: number;
  bankBalance: number;
  monthlyExpenses: number;
  existingInvestments: number;
  financialGoal: string;
  riskAppetite: 'low' | 'medium' | 'high';
}

interface AIAnalysis {
  healthScore: number;
  savingsPotential: number;
  investmentReadiness: number;
  emergencyFund: number;
  recommendedSIP: number;
  insights: string[];
}

interface Store {
  userProfile: UserProfile;
  aiAnalysis: AIAnalysis | null;
  setUserProfile: (profile: Partial<UserProfile>) => void;
  setAIAnalysis: (analysis: AIAnalysis) => void;
}

export const useStore = create<Store>((set) => ({
  userProfile: {
    name: '',
    age: 25,
    occupation: 'professional',
    monthlyIncome: 50000,
    cashInHand: 10000,
    bankBalance: 100000,
    monthlyExpenses: 30000,
    existingInvestments: 50000,
    financialGoal: 'wealth',
    riskAppetite: 'medium',
  },
  aiAnalysis: null,
  setUserProfile: (profile) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...profile },
    })),
  setAIAnalysis: (analysis) => set({ aiAnalysis: analysis }),
}));
