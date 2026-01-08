# 🚀 Vercel Deployment Guide

This guide explains how to deploy your Speech-to-Text Complaint System to Vercel.

## Prerequisites

1. **GitHub Account** - Code must be on GitHub
2. **Vercel Account** - Free account at https://vercel.com
3. **API Keys** - Groq API key from https://console.groq.com

## Step-by-Step Deployment

### Step 1: Prepare Your Code

1. **Install dependencies locally**
   ```bash
   npm install
   ```

2. **Test build locally**
   ```bash
   npm run build
   ```
   This ensures everything compiles correctly before pushing.

3. **Verify .env.local has your API keys**
   ```
   GROQ_API_KEY=your_key_here
   ANTHROPIC_API_KEY=your_key_here (optional)
   ```

### Step 2: Push Code to GitHub

1. **Initialize git (if not already done)**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Speech-to-text system for Vercel"
   ```

2. **Create repository on GitHub**
   - Go to https://github.com/new
   - Create new repository (e.g., `speech-to-text-system`)
   - Don't initialize with README/gitignore

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/speech-to-text-system.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Visit https://vercel.com/dashboard**
2. **Click "Add New Project"**
3. **Import your GitHub repository**
   - Click "Import Git Repository"
   - Search for and select your repository
4. **Configure Project**
   - **Project Name**: `speech-to-text-system` (or your choice)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
5. **Add Environment Variables**
   - Click "Environment Variables"
   - Add each variable from `.env.example`:
     ```
     Key: GROQ_API_KEY
     Value: your_actual_groq_key
     
     Key: ANTHROPIC_API_KEY
     Value: your_key (if used)
     ```
   - Select environments: Production, Preview, Development
6. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (2-3 minutes)
   - ✅ Done! Your app is live

#### Option B: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   - Select "Y" to link to existing project or create new
   - Choose your project settings
   - Add environment variables when prompted

3. **Set Production Environment Variables**
   ```bash
   vercel env add GROQ_API_KEY production
   # Enter your API key
   
   vercel env add ANTHROPIC_API_KEY production
   # Enter your API key (if used)
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

## Important Notes

### Database Storage
- **Local Development**: Complaints saved to `data/complaints.json`
- **Vercel Production**: Complaints saved to `/tmp/data/complaints.json`
- ⚠️ **Important**: Vercel has ephemeral storage. Data persists only during function lifecycle.
- **For persistent storage**, consider:
  - MongoDB Atlas (free tier available)
  - Supabase (PostgreSQL)
  - Firebase Realtime Database
  - AWS S3 for archiving

### Environment Variables
- **Never commit `.env.local`** - it's in `.gitignore`
- Always use Vercel dashboard to set production variables
- Each environment (Production/Preview/Development) can have different variables

### Troubleshooting Deployment

**Build fails with "out of memory"**
- Vercel has 3GB memory limit
- Your project should build fine (basic Next.js app)

**API Keys not recognized**
- Verify variables are set in Vercel dashboard
- Redeploy after adding variables
- Check variable names match your code exactly

**Changes not reflecting**
- Vercel auto-deploys on git push
- Wait 2-3 minutes for deployment
- Clear browser cache (Ctrl+Shift+Delete)

**Local works, production fails**
- Check environment variables are set
- Use Vercel Logs: Dashboard → Your Project → Deployments → Logs
- Ensure all dependencies are in `package.json`

## After Deployment

### Your App URL
```
https://your-project-name.vercel.app
```

### Automatic Deployments
- Any push to `main` branch → auto-deploys to production
- Pull requests → auto-deploy preview environments
- Rollback: Vercel dashboard → Deployments → Click deployment → Redeploy

### Monitor Your App
- **Vercel Analytics**: Dashboard → Analytics (free tier)
- **Error Tracking**: Dashboard → Functions (logs)
- **Performance**: Check Network tab in Chrome DevTools

## Updating Your App

After deployment, to make changes:

1. **Make code changes locally**
2. **Test**: `npm run dev`
3. **Build test**: `npm run build`
4. **Commit and push**
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```
5. **Vercel auto-deploys** (wait 2-3 minutes)

## Free Tier Limits (Vercel)

- ✅ Unlimited deployments
- ✅ Unlimited domains
- ✅ 100 GB bandwidth/month
- ✅ Serverless functions
- ❌ No persistent storage (use database service)

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment/vercel
- **Common Issues**: https://vercel.com/support

---

**Your app is now ready for the world! 🎉**
