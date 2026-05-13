# Arattai Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Vercel account (frontend)
- Railway/Render account (backend)
- Supabase account (database + storage)
- Google Cloud account (Gemini API)
- Pinecone account (vector database)

## Frontend Deployment (Vercel)

### 1. Connect Repository
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link
```

### 2. Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://api.arattai.ai
NEXT_PUBLIC_APP_URL=https://arattai.ai
```

### 3. Deploy
```bash
# Deploy to production
vercel --prod
```

### 4. Custom Domain
- Add custom domain in Vercel dashboard
- Update DNS records:
  - Type: CNAME
  - Name: @
  - Value: cname.vercel-dns.com

## Backend Deployment (Railway)

### 1. Create New Project
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init
```

### 2. Configure Environment Variables
In Railway Dashboard → Variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/arattai_db

# Redis
REDIS_URL=redis://default:pass@host:6379

# JWT
JWT_SECRET_KEY=your-32-char-secret-key

# AI Services
GOOGLE_API_KEY=your-gemini-api-key
PINECONE_API_KEY=your-pinecone-key
PINECONE_ENVIRONMENT=your-region

# Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Email
RESEND_API_KEY=your-resend-key

# Environment
ENVIRONMENT=production
```

### 3. Deploy
```bash
# Deploy backend
railway up
```

### 4. Custom Domain
- Add custom domain in Railway dashboard
- Update DNS records:
  - Type: CNAME
  - Name: api
  - Value: your-project.up.railway.app

## Database Setup (Supabase)

### 1. Create Project
- Go to https://supabase.com
- Create new project
- Note down connection string

### 2. Run Migrations
```bash
cd backend

# Set DATABASE_URL
export DATABASE_URL="postgresql://..."

# Run migrations
alembic upgrade head
```

### 3. Enable Row Level Security
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own expenses" ON expenses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own goals" ON goals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own messages" ON ai_messages
  FOR ALL USING (auth.uid() = user_id);
```

### 4. Setup Storage Buckets
```sql
-- Create buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('receipts', 'receipts', false),
  ('avatars', 'avatars', true),
  ('exports', 'exports', false);

-- Create policies
CREATE POLICY "Users can upload own receipts" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'receipts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

## AI Services Setup

### Google Gemini API
1. Go to https://makersuite.google.com/app/apikey
2. Create API key
3. Add to environment variables

### Pinecone Vector Database
1. Go to https://www.pinecone.io
2. Create new index:
   - Name: arattai-finance
   - Dimensions: 768
   - Metric: cosine
3. Get API key and environment
4. Add to environment variables

## Email Service (Resend)

1. Go to https://resend.com
2. Create API key
3. Verify domain
4. Add to environment variables

## Monitoring & Logging

### Sentry (Error Tracking)
```bash
# Install Sentry
npm install @sentry/nextjs
pip install sentry-sdk

# Initialize
npx @sentry/wizard -i nextjs
```

### Vercel Analytics
```bash
# Install
npm install @vercel/analytics

# Add to layout.tsx
import { Analytics } from '@vercel/analytics/react';
```

## Performance Optimization

### Frontend
- Enable Next.js Image Optimization
- Configure CDN caching
- Enable compression
- Implement code splitting

### Backend
- Enable Redis caching
- Configure connection pooling
- Implement rate limiting
- Enable GZIP compression

## Security Checklist

- [ ] HTTPS enforced
- [ ] CORS configured
- [ ] Rate limiting enabled
- [ ] JWT tokens secured
- [ ] Environment variables secured
- [ ] Database backups enabled
- [ ] Row Level Security enabled
- [ ] API keys rotated
- [ ] Audit logs enabled
- [ ] DDoS protection enabled

## Backup Strategy

### Database Backups
```bash
# Automated daily backups (Supabase)
# Configure in Supabase Dashboard → Database → Backups

# Manual backup
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Storage Backups
```bash
# Sync to S3 for redundancy
aws s3 sync supabase-bucket s3://arattai-backups/
```

## Rollback Procedure

### Frontend Rollback
```bash
# Vercel automatic rollback
vercel rollback
```

### Backend Rollback
```bash
# Railway rollback to previous deployment
railway rollback
```

### Database Rollback
```bash
# Alembic downgrade
alembic downgrade -1
```

## Health Checks

### Frontend
- URL: https://arattai.ai
- Expected: 200 OK

### Backend
- URL: https://api.arattai.ai/health
- Expected: {"status": "healthy"}

### Database
```bash
# Check connection
psql $DATABASE_URL -c "SELECT 1"
```

## Scaling

### Horizontal Scaling
- Frontend: Automatic (Vercel)
- Backend: Configure in Railway dashboard
- Database: Upgrade Supabase plan

### Vertical Scaling
- Increase Railway instance size
- Upgrade Supabase compute

## Cost Estimation

### Monthly Costs (Estimated)
- Vercel Pro: $20/month
- Railway Hobby: $5/month
- Supabase Pro: $25/month
- Pinecone Starter: $70/month
- Gemini API: Pay-as-you-go (~$10-50/month)
- **Total: ~$130-180/month**

## Support

For deployment issues:
- Email: devops@arattai.ai
- Slack: #arattai-deployment
- Docs: https://docs.arattai.ai/deployment
