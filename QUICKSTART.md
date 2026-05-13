# 🚀 Arattai Quick Start Guide

Get Arattai running in 5 minutes!

## Prerequisites

- Docker & Docker Compose installed
- OR Node.js 20+ and Python 3.11+

## Option 1: Docker (Recommended) ⚡

### 1. Clone & Setup
```bash
git clone https://github.com/yourusername/arattai.git
cd arattai
```

### 2. Configure Environment
```bash
# Copy environment files
cp .env.local.example .env.local
cp backend/.env.example backend/.env

# Edit .env files (use default values for local development)
```

### 3. Start Everything
```bash
docker-compose up -d
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### 5. Demo Login
```
Email: demo@arattai.ai
Password: ArattaiDemo2025
```

## Option 2: Manual Setup 🛠️

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Start PostgreSQL & Redis (separate terminals or Docker)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
docker run -d -p 6379:6379 redis:7

# Run migrations
alembic upgrade head

# Start backend
uvicorn main:app --reload
```

### Frontend

```bash
# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Start frontend
npm run dev
```

## 🎯 First Steps

### 1. Register Account
- Go to http://localhost:3000
- Click "Sign In" → "Sign up"
- Fill in registration form

### 2. Add First Expense
- Navigate to "Expenses"
- Click "Add Expense"
- Fill in details and save

### 3. Create Financial Goal
- Navigate to "Goals"
- Click "Create Goal"
- Set target amount and deadline

### 4. Chat with AI
- Navigate to "AI Insights"
- Try: "Analyze my spending this month"
- Watch AI agent respond in real-time

## 🧪 Test the API

### Using curl
```bash
# Register user
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "full_name": "Test User",
    "currency": "INR",
    "monthly_income": 50000
  }'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'

# Use the access_token from response for authenticated requests
```

### Using API Docs
1. Go to http://localhost:8000/docs
2. Click "Authorize"
3. Enter Bearer token
4. Try endpoints interactively

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000  # Frontend
lsof -i :8000  # Backend
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection
psql postgresql://postgres:postgres@localhost:5432/arattai_db
```

### Frontend Build Error
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

### Backend Import Error
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

## 📚 Next Steps

1. **Explore Features**
   - Add multiple expenses
   - Create various goals
   - Try different AI queries
   - Check analytics dashboard

2. **Read Documentation**
   - [README.md](README.md) - Full documentation
   - [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guide
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

3. **Customize**
   - Update branding colors
   - Add custom categories
   - Modify AI agent prompts
   - Extend API endpoints

## 🎨 Demo Data

To populate with demo data:

```bash
cd backend
python scripts/seed_demo_data.py
```

This creates:
- 6 months of expenses
- 3 financial goals
- Sample AI insights

## 🔑 Default Credentials

### Local Development
```
Database: postgres / postgres
Redis: (no auth)
```

### Demo User
```
Email: demo@arattai.ai
Password: ArattaiDemo2025
```

## 📞 Need Help?

- **Documentation**: [README.md](README.md)
- **Issues**: https://github.com/arattai/arattai/issues
- **Discord**: https://discord.gg/arattai
- **Email**: support@arattai.ai

## ✅ Verification Checklist

- [ ] Frontend loads at localhost:3000
- [ ] Backend API responds at localhost:8000
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can create expense
- [ ] Can create goal
- [ ] AI chat responds
- [ ] Charts display data

If all checked, you're ready to go! 🎉

---

**Happy coding with Arattai!** 🚀
