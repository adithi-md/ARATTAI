interface FinancialMemory {
  userId: string;
  timestamp: number;
  event: string;
  data: any;
}

class MemorySystem {
  private storageKey = 'arattai_financial_memory';
  
  addMemory(event: string, data: any) {
    const memories = this.getMemories();
    const newMemory: FinancialMemory = {
      userId: 'user_1', // In production, use actual user ID
      timestamp: Date.now(),
      event,
      data,
    };
    
    memories.push(newMemory);
    
    // Keep only last 100 memories
    if (memories.length > 100) {
      memories.shift();
    }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(memories));
    }
  }
  
  getMemories(): FinancialMemory[] {
    if (typeof window === 'undefined') return [];
    
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }
  
  getRecentMemories(count: number = 10): FinancialMemory[] {
    const memories = this.getMemories();
    return memories.slice(-count).reverse();
  }
  
  searchMemories(query: string): FinancialMemory[] {
    const memories = this.getMemories();
    return memories.filter(m => 
      m.event.toLowerCase().includes(query.toLowerCase()) ||
      JSON.stringify(m.data).toLowerCase().includes(query.toLowerCase())
    );
  }
  
  getMemoriesByType(eventType: string): FinancialMemory[] {
    const memories = this.getMemories();
    return memories.filter(m => m.event === eventType);
  }
  
  generateInsights(): string[] {
    const memories = this.getMemories();
    const insights: string[] = [];
    
    // Check for SIP consistency
    const sipMemories = memories.filter(m => m.event === 'sip_calculation');
    if (sipMemories.length > 3) {
      insights.push(`You've calculated SIP projections ${sipMemories.length} times. Ready to start investing?`);
    }
    
    // Check for goal setting
    const goalMemories = memories.filter(m => m.event === 'goal_viewed');
    if (goalMemories.length > 0) {
      insights.push(`You're actively tracking your financial goals. Great habit!`);
    }
    
    // Check for chat engagement
    const chatMemories = memories.filter(m => m.event === 'ai_chat');
    if (chatMemories.length > 5) {
      insights.push(`You've asked ${chatMemories.length} questions. You're learning fast!`);
    }
    
    // Check for profile updates
    const profileMemories = memories.filter(m => m.event === 'profile_updated');
    if (profileMemories.length > 1) {
      const latest = profileMemories[profileMemories.length - 1];
      const previous = profileMemories[profileMemories.length - 2];
      
      if (latest.data.monthlyIncome > previous.data.monthlyIncome) {
        const increase = ((latest.data.monthlyIncome - previous.data.monthlyIncome) / previous.data.monthlyIncome * 100).toFixed(1);
        insights.push(`Your income increased by ${increase}%! Time to increase your SIP.`);
      }
    }
    
    return insights;
  }
  
  clearMemories() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.storageKey);
    }
  }
}

export const memorySystem = new MemorySystem();
