# Quick Start: Deploy to Vercel in 5 Minutes

## What Changed?
✅ Removed `better-sqlite3` (causes Vercel build errors)
✅ Replaced with JSON-based file storage
✅ Project now builds successfully
✅ Ready for Vercel deployment

## Prerequisites
- GitHub account (https://github.com)
- Vercel account (https://vercel.com/signup - free)
- Groq API key (https://console.groq.com)

## 5-Minute Setup

### 1. Prepare Git (2 min)
```bash
cd "c:\speech to text"
git init
git add .
git commit -m "Ready for Vercel deployment"
```

### 2. Push to GitHub (2 min)
1. Create new repo on https://github.com/new
2. Run these commands:
```bash
git remote add origin https://github.com/YOUR_USERNAME/repo-name.git
git branch -M main
git push -u origin main
```

### 3. Deploy on Vercel (1 min)
1. Visit https://vercel.com/dashboard
2. Click "Add New Project"
3. Select your GitHub repository
4. Add environment variables:
   - `GROQ_API_KEY` = your key
   - `ANTHROPIC_API_KEY` = your key (optional)
5. Click "Deploy"
6. Done! 🎉 Your app is live at `https://your-project.vercel.app`

## Important!
- **Environment Variables**: Set these in Vercel dashboard, NOT in code
- **Data Storage**: JSON file in `/tmp` (temporary)
- **For persistent data**: Use MongoDB, Supabase, or Firebase

## Full Guide
See `VERCEL_DEPLOYMENT.md` for detailed troubleshooting and setup options.
