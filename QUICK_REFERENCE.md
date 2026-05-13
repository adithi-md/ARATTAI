# ARATTAI - Quick Reference Guide

## 🚀 Quick Start Commands

### Start Development Servers

**Frontend:**
```bash
npm run dev
```
Access at: http://localhost:3000

**Backend (Multi-Agent System):**
```bash
cd backend
python main_agents.py
```
Access at: http://localhost:8000  
API Docs: http://localhost:8000/docs

**Docker (All Services):**
```bash
docker-compose up -d
```

---

## 📂 Key Files & Their Purpose

### Frontend
| File | Purpose |
|------|---------|
| `app/dashboard/page.tsx` | Main dashboard with all features |
| `lib/ai-engine.ts` | AI chatbot response logic |
| `lib/predictions.ts` | Wealth forecasting engine |
| `lib/memory.ts` | User event tracking system |
| `lib/api-client.ts` | Backend API integration |
| `components/Navbar.tsx` | Navigation component |
| `components/VoiceInput.tsx` | Voice input component |

### Backend
| File | Purpose |
|------|---------|
| `backend/main_agents.py` | FastAPI app with 5 endpoints |
| `backend/agents/investment_agent.py` | SIP & fund recommendations |
| `backend/agents/expense_agent.py` | Spending pattern analysis |
| `backend/agents/goal_agent.py` | Goal planning |
| `backend/agents/risk_agent.py` | Risk assessment |

---

## 🎯 Test the Application

### 1. Dashboard Auto-Loads
- Navigate to http://localhost:3000/dashboard
- Test data automatically populates
- All charts and metrics display

### 2. Test AI Chatbot
Try these questions:
- "Which mutual funds should I invest in?"
- "How much should I invest monthly?"
- "What are ELSS funds?"
- "How to start investing?"
- "What returns can I expect?"

Each question gets a **different, contextual response**!

### 3. Test Voice Input
- Click the microphone icon in chat
- Say: "How much should I invest?"
- Voice converts to text and sends

### 4. Test Backend Agents
```bash
# Test Investment Agent
curl -X POST http://localhost:8000/api/agents/investment/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "age": 28,
    "monthly_income": 50000,
    "monthly_expenses": 30000,
    "bank_balance": 100000,
    "cash_in_hand": 10000,
    "existing_investments": 50000,
    "risk_appetite": "medium",
    "financial_goal": "wealth"
  }'
```

---

## 🔧 Common Issues & Solutions

### Issue: Dashboard not loading
**Solution:** Check if test data is auto-populating. Clear browser cache and reload.

### Issue: Chatbot same response
**Solution:** Fixed! Each question now triggers different response based on query content.

### Issue: Backend not starting
**Solution:** 
```bash
cd backend
pip install -r requirements_agents.txt
python main_agents.py
```

### Issue: Port already in use
**Solution:**
```bash
# Kill process on port 3000 (frontend)
npx kill-port 3000

# Kill process on port 8000 (backend)
npx kill-port 8000
```

---

## 📊 Dashboard Features Checklist

- ✅ Health Score Cards (3 metrics)
- ✅ SIP Growth Projection (interactive chart)
- ✅ Mutual Fund Recommendations (based on risk)
- ✅ Emergency Fund Tracker
- ✅ Wealth Timeline (4 milestones)
- ✅ Risk Assessment (with score)
- ✅ 12-Month Wealth Forecast
- ✅ AI Chatbot (10+ query types)
- ✅ Quick Question Buttons (4 questions)
- ✅ Voice Input
- ✅ Memory Insights Banner

---

## 🤖 AI Chatbot Query Types

1. **SIP Queries** → Detailed SIP recommendations with fund names
2. **Emergency Fund** → Calculate required emergency fund
3. **Risk Assessment** → Personalized risk profile analysis
4. **Tax Saving** → ELSS fund recommendations
5. **Fund Selection** → Top mutual funds for your profile
6. **Market Timing** → Market analysis and timing advice
7. **KYC Process** → Step-by-step investment guide
8. **Return Expectations** → Expected returns by category
9. **Investment Amount** → Monthly investment calculation
10. **General Guidance** → Contextual financial advice

---

## 🎨 UI Components

### Glassmorphism Classes
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glow-card {
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.1);
}

.gradient-text {
  background: linear-gradient(to right, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Animation Classes
```css
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```

---

## 📈 Analytics Features

### Predictive Analytics
```typescript
// 12-month wealth forecast
const predictions = predictFutureWealth({
  monthlyIncome: 50000,
  monthlyExpenses: 30000,
  bankBalance: 100000,
  existingInvestments: 50000
}, 12);

// Financial risk calculation
const risks = calculateFinancialRisk({
  monthlyIncome: 50000,
  monthlyExpenses: 30000,
  bankBalance: 100000,
  existingInvestments: 50000
});

// Wealth timeline
const timeline = generateWealthTimeline({
  monthlyIncome: 50000,
  monthlyExpenses: 30000,
  bankBalance: 100000,
  existingInvestments: 50000
});
```

---

## 🔐 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (backend/.env)
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/arattai_db
REDIS_URL=redis://localhost:6379
JWT_SECRET_KEY=your-secret-key-here
GOOGLE_API_KEY=your-gemini-api-key
```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build

# View running containers
docker ps
```

---

## 📦 NPM Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🔗 Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Dashboard | http://localhost:3000/dashboard |
| AI Chat | http://localhost:3000/ai-insights |
| Analysis | http://localhost:3000/analysis |
| GitHub | https://github.com/adithi-md/ARATTAI |

---

## 📞 Getting Help

1. **Check Documentation**
   - README.md - Complete project overview
   - ARCHITECTURE.md - System architecture
   - PROJECT_STATUS.md - Current status
   - QUICK_START.md - Quick start guide

2. **Common Commands**
   ```bash
   # Check if ports are free
   netstat -ano | findstr :3000
   netstat -ano | findstr :8000
   
   # Check Node version
   node --version
   
   # Check Python version
   python --version
   
   # Check if backend is running
   curl http://localhost:8000
   ```

3. **Debug Mode**
   ```bash
   # Frontend with debug
   npm run dev -- --debug
   
   # Backend with debug
   uvicorn main_agents:app --reload --log-level debug
   ```

---

## 🎯 Next Steps

1. **Test All Features** - Go through each page and feature
2. **Customize Test Data** - Modify user profile in dashboard
3. **Try Voice Input** - Test speech recognition
4. **Explore Backend** - Visit http://localhost:8000/docs
5. **Review Code** - Check implementation details
6. **Deploy** - Follow DEPLOYMENT.md for production

---

## 🏆 Feature Highlights

✨ **Auto-Loading Dashboard** - No manual data entry needed  
✨ **Intelligent Chatbot** - Different responses for each query  
✨ **Voice Input** - Hands-free interaction  
✨ **Predictive Analytics** - 12-month wealth forecast  
✨ **Memory System** - Tracks user behavior  
✨ **Multi-Agent Backend** - 7 specialized AI agents  
✨ **Premium UI** - Glassmorphism with smooth animations  
✨ **Fully Responsive** - Works on all devices  

---

**Last Updated:** May 13, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
