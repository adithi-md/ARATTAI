# ARATTAI Deployment Guide

Complete guide to deploy ARATTAI to production using Vercel (Frontend) and Railway (Backend).

---

## 🚀 Quick Deploy

### Prerequisites
- GitHub account (already have: https://github.com/adithi-md/ARATTAI)
- Vercel account (free): https://vercel.com/signup
- Railway account (free): https://railway.app/

---

## 📦 Part 1: Deploy Backend to Railway

### Step 1: Sign Up for Railway
1. Go to https://railway.app/
2. Click "Login" → "Login with GitHub"
3. Authorize Railway to access your GitHub

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository: `adithi-md/ARATTAI`
4. Railway will detect the project

### Step 3: Configure Backend Service
1. Click "Add Service" → "GitHub Repo"
2. Select `ARATTAI` repository
3. Set **Root Directory**: `backend`
4. Railway will auto-detect Python

### Step 4: Add Environment Variables
Click "Variables" tab and add:

```env
PORT=8000
PYTHON_VERSION=3.11.9
```

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Once deployed, copy the URL (e.g., `https://arattai-backend.up.railway.app`)

### Step 6: Test Backend
Visit: `https://your-backend-url.railway.app/docs`

You should see the FastAPI Swagger documentation!

---

## 🌐 Part 2: Deploy Frontend to Vercel

### Step 1: Sign Up for Vercel
1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel

### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import `adithi-md/ARATTAI` from GitHub
3. Vercel will detect Next.js automatically

### Step 3: Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (leave as root)
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 4: Add Environment Variables
Click "Environment Variables" and add:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

**Important:** Replace `your-backend-url.railway.app` with your actual Railway backend URL from Part 1!

### Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Once deployed, you'll get a URL like: `https://arattai.vercel.app`

### Step 6: Test Frontend
1. Visit your Vercel URL
2. Navigate to `/dashboard`
3. Test the chatbot
4. Verify all features work

---

## 🔧 Alternative: One-Click Deploy

### Deploy Backend to Render (Alternative to Railway)

1. Go to https://render.com/
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect `ARATTAI` repository
5. Configure:
   - **Name**: arattai-backend
   - **Root Directory**: backend
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements_agents.txt`
   - **Start Command**: `uvicorn main_agents:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   ```
   PYTHON_VERSION=3.11.9
   ```
7. Click "Create Web Service"

---

## 🎯 Manual Deployment Steps

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy frontend
vercel --prod

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? arattai
# - Directory? ./
# - Override settings? No
```

### Option 2: Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Navigate to backend
cd backend

# Initialize Railway project
railway init

# Deploy
railway up

# Add domain
railway domain
```

---

## 🔐 Environment Variables Setup

### Backend Environment Variables (Railway/Render)

```env
# Required
PORT=8000
PYTHON_VERSION=3.11.9

# Optional (for future features)
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET_KEY=your-secret-key-here
GOOGLE_API_KEY=your-gemini-api-key
```

### Frontend Environment Variables (Vercel)

```env
# Required
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional
NEXT_PUBLIC_ENABLE_ANALYTICS=true
```

---

## ✅ Post-Deployment Checklist

### Backend Verification
- [ ] Visit `https://your-backend.railway.app/`
- [ ] Check API docs at `https://your-backend.railway.app/docs`
- [ ] Test endpoint: `https://your-backend.railway.app/api/agents/investment/analyze`
- [ ] Verify CORS allows your frontend domain

### Frontend Verification
- [ ] Visit your Vercel URL
- [ ] Landing page loads with animations
- [ ] Navigate to `/dashboard`
- [ ] Test data auto-loads
- [ ] Chatbot responds correctly
- [ ] Voice input works
- [ ] All charts display
- [ ] Navigation works

### Integration Testing
- [ ] Dashboard connects to backend
- [ ] Analysis page shows agent responses
- [ ] No CORS errors in console
- [ ] All API calls succeed

---

## 🐛 Troubleshooting

### Issue: Backend Build Fails
**Solution:**
```bash
# Check requirements_agents.txt has correct versions
cd backend
pip install -r requirements_agents.txt
python main_agents.py  # Test locally first
```

### Issue: Frontend Build Fails
**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Issue: CORS Errors
**Solution:** Update `backend/main_agents.py`:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-app.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Issue: Environment Variables Not Working
**Solution:**
1. Vercel: Go to Project Settings → Environment Variables → Add
2. Railway: Go to Variables tab → Add variable
3. Redeploy after adding variables

### Issue: 404 on Routes
**Solution:** Ensure `next.config.mjs` has:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
};

export default nextConfig;
```

---

## 🔄 Continuous Deployment

Both Vercel and Railway support automatic deployments:

### Vercel (Frontend)
- **Auto-deploys** on every push to `main` branch
- **Preview deployments** for pull requests
- **Instant rollbacks** from dashboard

### Railway (Backend)
- **Auto-deploys** on every push to `main` branch
- **Zero-downtime deployments**
- **Automatic health checks**

---

## 📊 Monitoring & Analytics

### Vercel Analytics
1. Go to your project on Vercel
2. Click "Analytics" tab
3. View real-time traffic, performance, and errors

### Railway Logs
1. Go to your service on Railway
2. Click "Deployments" tab
3. View real-time logs and metrics

---

## 🎯 Custom Domain Setup

### Add Custom Domain to Vercel
1. Go to Project Settings → Domains
2. Add your domain (e.g., `arattai.com`)
3. Update DNS records as instructed
4. SSL certificate auto-generated

### Add Custom Domain to Railway
1. Go to Settings → Domains
2. Click "Generate Domain" or add custom
3. Update DNS records
4. SSL certificate auto-generated

---

## 💰 Cost Estimation

### Free Tier Limits

**Vercel (Free)**
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- Perfect for this project!

**Railway (Free Trial)**
- $5 free credit/month
- ~500 hours runtime
- Enough for development/demo

**Render (Free)**
- 750 hours/month
- Automatic sleep after 15 min inactivity
- Good for demos

---

## 🚀 Production Recommendations

For production deployment:

1. **Database**: Use Supabase (free tier) or Railway PostgreSQL
2. **Redis**: Use Upstash (free tier)
3. **Storage**: Use Supabase Storage or AWS S3
4. **Monitoring**: Use Sentry for error tracking
5. **Analytics**: Use Vercel Analytics or Google Analytics

---

## 📞 Support

If you encounter issues:

1. **Check Logs**
   - Vercel: Project → Deployments → View Function Logs
   - Railway: Service → Deployments → View Logs

2. **Common Issues**
   - Build failures: Check package versions
   - Runtime errors: Check environment variables
   - CORS errors: Update allowed origins

3. **Get Help**
   - Vercel Discord: https://vercel.com/discord
   - Railway Discord: https://discord.gg/railway

---

## ✅ Deployment Complete!

Once deployed, you'll have:
- ✅ Frontend: `https://arattai.vercel.app`
- ✅ Backend: `https://arattai-backend.railway.app`
- ✅ API Docs: `https://arattai-backend.railway.app/docs`
- ✅ Auto-deployments on every push
- ✅ Free SSL certificates
- ✅ Global CDN
- ✅ Production-ready!

Share your live URLs:
- **Live App**: https://your-app.vercel.app
- **API Docs**: https://your-backend.railway.app/docs
- **GitHub**: https://github.com/adithi-md/ARATTAI

---

**Congratulations! Your ARATTAI platform is now live! 🎉**
