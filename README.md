# ARATTAI - Agentic AI Finance Assistant

> **Production-ready, trial-ready AI-powered personal finance platform with multi-agent orchestration**

A comprehensive fintech platform combining conversational AI, real-time financial analytics, and intelligent multi-agent systems to provide personalized financial guidance.

## 🌟 Key Features

### 🤖 Multi-Agent AI System
- **Expense Analysis Agent**: Pattern detection, anomaly identification, spending insights
- **Budget Planning Agent**: 50/30/20 budget creation, personalized recommendations
- **Savings Advisor Agent**: Goal tracking, contribution planning, deadline management
- **Investment Education Agent**: Risk-based investment education (NOT financial advice)
- **Router Agent**: Intelligent query routing to specialized agents

### 💰 Financial Management
- **Expense Tracking**: Categorized expenses, receipt uploads, recurring payments
- **Goal Management**: Progress tracking, milestone markers, AI-powered insights
- **Analytics Dashboard**: Real-time charts, category breakdowns, spending forecasts
- **Budget Planning**: Automated 50/30/20 budgets, overspend alerts

### 🎨 Premium UI/UX
- **Glassmorphism Design**: Frosted glass effects, backdrop blur
- **3D Visualizations**: React Three Fiber animated orbs
- **Smooth Animations**: Framer Motion transitions
- **Dark Premium Theme**: Futuristic fintech aesthetic
- **Fully Responsive**: Mobile-first design

## 🏗️ Architecture

```
┌─────────────────────┐
│  Next.js Frontend   │
│  (Vercel Deploy)    │
└──────────┬──────────┘
           │ REST + WebSocket
┌──────────▼──────────┐
│  FastAPI Gateway    │
│  (Railway/Render)   │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    │   Agents    │
    ├─────────────┤
    │ • Expense   │
    │ • Budget    │
    │ • Savings   │
    │ • Investment│
    └──────┬──────┘
           │
    ┌──────▼──────────────┐
    │  PostgreSQL + Redis │
    │  Pinecone Vectors   │
    └─────────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router) + TypeScript
- **UI**: TailwindCSS + Shadcn/UI
- **Animations**: Framer Motion
- **3D**: React Three Fiber + Drei
- **Charts**: Recharts + D3.js
- **State**: Zustand + React Query (TanStack)
- **Forms**: React Hook Form + Zod

### Backend
- **API**: FastAPI (Python 3.11+)
- **AI**: LangChain + LangGraph (multi-agent orchestration)
- **LLM**: Google Gemini 1.5 Pro
- **Database**: PostgreSQL (async with SQLAlchemy)
- **Cache**: Redis
- **Tasks**: Celery
- **WebSockets**: FastAPI WebSocket

### Infrastructure
- **Frontend Deploy**: Vercel
- **Backend Deploy**: Railway / Render
- **Database**: Supabase / AWS RDS
- **Storage**: Supabase Storage / AWS S3
- **CI/CD**: GitHub Actions

## 📦 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/arattai.git
cd arattai

# Copy environment files
cp .env.local.example .env.local
cp backend/.env.example backend/.env

# Edit .env files with your credentials

# Start all services
docker-compose up -d

# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy and configure environment
cp .env.example .env
# Edit .env with your credentials

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
# Install dependencies
npm install

# Copy and configure environment
cp .env.local.example .env.local
# Edit .env.local

# Start development server
npm run dev
```

## 🗄️ Database Setup

### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  full_name TEXT,
  currency VARCHAR(3) DEFAULT 'INR',
  monthly_income NUMERIC(12,2),
  risk_appetite VARCHAR(10) DEFAULT 'moderate',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL,
  product_name TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  expense_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals table
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount NUMERIC(12,2) NOT NULL,
  saved_amount NUMERIC(12,2) DEFAULT 0,
  deadline DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Messages table
CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  agent_used VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🔑 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend (backend/.env)
```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/arattai_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET_KEY=your-32-char-secret-key-here

# AI Services
GOOGLE_API_KEY=your-gemini-api-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=your-region

# Storage (Supabase or AWS)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token

### Expenses
- `GET /api/expenses` - List expenses (with filters)
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/{id}` - Update expense
- `DELETE /api/expenses/{id}` - Delete expense
- `GET /api/expenses/summary/by-category` - Category summary

### Goals
- `GET /api/goals` - List goals
- `POST /api/goals` - Create goal
- `POST /api/goals/{id}/add-funds` - Add funds to goal
- `PUT /api/goals/{id}` - Update goal

### Analytics
- `GET /api/analytics/summary` - Analytics summary
- `GET /api/analytics/monthly-spending` - Monthly chart data
- `GET /api/analytics/category-breakdown` - Category pie chart
- `GET /api/analytics/weekly-spending` - Weekly bar chart

### AI Agents
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/chat/history` - Get chat history
- `POST /api/ai/insights` - Get specific AI insight

## 🤖 AI Agents Usage

### Chat with AI
```typescript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: "Analyze my spending this month",
    conversation_history: []
  })
});
```

### Get Specific Insight
```typescript
const insight = await fetch('/api/ai/insights', {
  method: 'POST',
  body: JSON.stringify({
    insight_type: "expense_analysis",
    parameters: {}
  })
});
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

## 📊 Project Structure

```
arattai/
├── app/                      # Next.js pages
│   ├── page.tsx             # Landing page
│   ├── login/               # Authentication
│   ├── dashboard/           # Main dashboard
│   ├── expenses/            # Expense tracking
│   ├── goals/               # Goal management
│   ├── ai-insights/         # AI chat interface
│   └── settings/            # User settings
├── components/              # React components
│   ├── layout/             # Layout components
│   ├── dashboard/          # Dashboard widgets
│   └── charts/             # Chart components
├── backend/                 # FastAPI backend
│   ├── main.py             # FastAPI app
│   ├── core/               # Config, security, database
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   ├── routes/             # API endpoints
│   ├── agents/             # AI agents
│   └── tasks/              # Celery tasks
├── docker-compose.yml       # Docker orchestration
└── README.md               # This file
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
npm run test
```

## 📝 License

This project is proprietary and confidential.

## 🤝 Contributing

This is a production trial project. For contribution guidelines, contact the maintainers.

## 📞 Support

For issues or questions:
- Email: support@arattai.ai
- Documentation: https://docs.arattai.ai

---

**Built with ❤️ by the Arattai Team**

*Disclaimer: Arattai provides educational financial information, not professional financial advice. Consult certified financial advisors for investment decisions.*
