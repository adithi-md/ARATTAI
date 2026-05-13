# 🚀 Deploy ARATTAI Now - Step by Step

Follow these exact steps to deploy your app in **10 minutes**!

---

## 🎯 Step 1: Deploy Backend (5 minutes)

### Option A: Railway (Recommended - Easiest)

1. **Go to Railway**
   - Visit: https://railway.app/
   - Click "Login with GitHub"
   - Authorize Railway

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose: `adithi-md/ARATTAI`

3. **Configure Service**
   - Click "Add variables"
   - Add: `PORT` = `8000`
   - Click "Deploy"

4. **Get Your Backend URL**
   - Wait 2-3 minutes for deployment
   - Click "Settings" → "Generate Domain"
   - Copy the URL (e.g., `arattai-backend-production.up.railway.app`)
   - **SAVE THIS URL - YOU'LL NEED IT!**

5. **Test Backend**
   - Visit: `https://your-backend-url/docs`
   - You should see API documentation!

---

## 🌐 Step 2: Deploy Frontend (5 minutes)

### Vercel (Recommended - Easiest)

1. **Go to Vercel**
   - Visit: https://vercel.com/signup
   - Click "Continue with GitHub"
   - Authorize Vercel

2. **Import Project**
   - Click "Add New..." → "Project"
   - Find and import: `adithi-md/ARATTAI`
   - Click "Import"

3. **Configure Project**
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (leave as is)
   - Build Command: `npm run build` (auto-filled)

4. **Add Environment Variables**
   Click "Environment Variables" and add:
   
   **Variable 1:**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url-from-step-1`
   
   **Variable 2:**
   - Name: `NEXT_PUBLIC_APP_URL`
   - Value: `https://arattai.vercel.app` (or your custom domain)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - You'll get a URL like: `https://arattai.vercel.app`

6. **Test Frontend**
   - Visit your Vercel URL
   - Go to `/dashboard`
   - Test the chatbot
   - Everything should work!

---

## ✅ Verification Checklist

### Backend (Railway)
- [ ] Visit `https://your-backend-url/`
- [ ] Visit `https://your-backend-url/docs` (should show API docs)
- [ ] No errors in Railway logs

### Frontend (Vercel)
- [ ] Landing page loads with animations
- [ ] Dashboard loads with test data
- [ ] Chatbot responds to questions
- [ ] Voice input works
- [ ] All charts display

---

## 🎉 You're Live!

Your app is now deployed at:
- **Frontend**: https://arattai.vercel.app
- **Backend**: https://your-backend-url.railway.app
- **API Docs**: https://your-backend-url.railway.app/docs

Share these URLs with anyone!

---

## 🔄 Auto-Deployments

Both platforms now auto-deploy when you push to GitHub:
- Push to `main` branch → Automatic deployment
- No manual steps needed!

---

## 🐛 Quick Fixes

### If Backend Doesn't Work:
1. Check Railway logs for errors
2. Verify `PORT=8000` is set in variables
3. Ensure `backend/requirements_agents.txt` exists

### If Frontend Doesn't Work:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure `NEXT_PUBLIC_API_URL` points to your Railway backend

### If CORS Errors:
- Already fixed! Backend now allows all Vercel domains

---

## 💡 Pro Tips

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Preview Deployments**: Every PR gets a preview URL
3. **Rollback**: Instantly rollback to previous deployment
4. **Monitoring**: Check Vercel Analytics for traffic

---

## 📞 Need Help?

If something doesn't work:
1. Check the full guide: `DEPLOYMENT_GUIDE.md`
2. View Railway logs: Railway Dashboard → Deployments → Logs
3. View Vercel logs: Vercel Dashboard → Deployments → Function Logs

---

**That's it! Your ARATTAI platform is now live! 🚀**

Share your live URL and impress everyone! 🎉
