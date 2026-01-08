# 🤖 How to Enable AI Features - Complete Guide

## Overview

Your application has **TWO MODES**:

1. **Without AI** - Uses template-based complaint generation (works immediately)
2. **With AI** - Uses Claude 3.5 Sonnet for intelligent complaint generation (requires API key)

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Get Your Anthropic API Key

1. **Visit:** https://console.anthropic.com/
2. **Sign Up/Login:**
   - Click "Sign Up" if you don't have an account
   - Use your email or Google account
   - Verify your email if needed

3. **Get API Key:**
   - Go to "API Keys" section in the dashboard
   - Click "Create Key" or "New API Key"
   - Copy the key (it starts with `sk-ant-`)
   - **IMPORTANT:** Save it somewhere safe - you can only see it once!

### Step 2: Add API Key to Your Project

1. **Open `.env.local` file** in your project root:
   ```
   c:\speech to text\.env.local
   ```

2. **Replace the placeholder:**
   ```env
   # BEFORE (placeholder):
   ANTHROPIC_API_KEY=your_anthropic_api_key_here

   # AFTER (your actual key):
   ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
   ```

3. **Save the file** (Ctrl+S)

### Step 3: Restart the Server

In PowerShell terminal:
```powershell
# Press Ctrl+C to stop the server
# Then restart:
npm run dev
```

### Step 4: Test AI Features

1. Open http://localhost:3000
2. Record a complaint (e.g., "There is no water supply in my area for three days")
3. Convert to text
4. Click "Generate Complaint Letter with AI"
5. Watch as AI creates a professional complaint letter! ✨

---

## 📊 Comparison: Template vs AI

### Without AI (Template Mode)
```
COMPLAINT LETTER
Complaint ID: CMP123
Category: Water Supply

To,
The Municipal Corporation Officer,

Subject: Complaint Regarding Water Supply

Dear Sir/Madam,

I would like to bring to your attention the following issue:

There is no water supply in my area for three days

I request you to kindly look into this matter urgently...
```

### With AI (Smart Mode) ✨
```
COMPLAINT LETTER
Complaint ID: CMP123
Category: Water Supply

To,
The Municipal Corporation Officer,
Municipal Ward Office

Subject: Urgent Complaint Regarding Continuous Water Supply Disruption

Respected Sir/Madam,

I am writing to bring to your immediate attention a critical issue 
affecting residents in our locality. For the past three days, we have 
been experiencing a complete absence of water supply in our area.

This prolonged water shortage is causing severe hardship to all 
residents, affecting daily essential activities such as drinking, 
cooking, and sanitation. The situation is particularly distressing 
for families with young children and elderly members.

I kindly request you to:
1. Investigate the cause of this disruption immediately
2. Restore the water supply at the earliest
3. Provide information about the expected timeline for resolution

Your prompt action in this matter would be greatly appreciated.

Thanking you in advance for your attention to this urgent matter.

Yours faithfully,
[Resident]
```

**AI Improvements:**
- ✅ More professional language
- ✅ Better structure and formatting
- ✅ Identifies urgency and impact
- ✅ Provides specific action items
- ✅ Context-aware details
- ✅ Proper formal tone

---

## 🔧 Technical Details

### How It Works

1. **User records complaint** → Browser speech recognition converts to text
2. **Text sent to Claude AI** → AI analyzes and generates professional letter
3. **AI considers:**
   - Complaint category (Water, Electricity, Road, etc.)
   - Language (Tamil or English)
   - Severity and context
   - Proper formal structure
   - Cultural appropriateness

### Files Using AI

- **`src/lib/ai-complaint-generator.ts`** - Main AI logic
- **`src/app/api/generate-complaint/route.ts`** - API endpoint

### AI Model Details

- **Model:** Claude 3.5 Sonnet (claude-3-5-sonnet-20241022)
- **Provider:** Anthropic
- **Max Tokens:** 2048
- **Features:**
  - Multilingual (Tamil & English)
  - Context-aware generation
  - Professional formatting
  - Automatic fallback to templates if AI fails

---

## 💰 Pricing Information

### Anthropic Claude Pricing (as of 2026)

**Claude 3.5 Sonnet:**
- Input: $3.00 per million tokens
- Output: $15.00 per million tokens

**Typical Complaint:**
- Input: ~200-300 tokens (your complaint description)
- Output: ~500-800 tokens (generated letter)
- **Cost per complaint:** ~$0.01-0.02 (1-2 cents)

**Free Credits:**
- Anthropic often provides $5-10 free credits for new accounts
- This gives you approximately **500-1000 free complaints**

### No Credit Card Required

You can sign up and get free credits without a credit card initially!

---

## 🐛 Troubleshooting

### "AI generation failed" Error

**Causes:**
1. Invalid or expired API key
2. No internet connection
3. API quota exceeded
4. Anthropic service down

**Solutions:**
1. **Check API key in .env.local:**
   ```env
   ANTHROPIC_API_KEY=sk-ant-...   # Must start with sk-ant-
   ```

2. **Verify key is valid:**
   - Go to https://console.anthropic.com/settings/keys
   - Check if key is active
   - Create a new key if needed

3. **Restart server after changing .env.local:**
   ```powershell
   Ctrl+C
   npm run dev
   ```

4. **Check console logs:**
   - Open browser DevTools (F12)
   - Look for errors in Console tab
   - Check terminal for server errors

### AI Taking Too Long

**Normal:** 2-5 seconds for generation
**Too long:** 10+ seconds

**Solutions:**
- Check internet connection
- Anthropic API might be slow
- Try again in a few minutes

### Fallback to Templates

If AI fails, the system automatically uses templates. This ensures your app always works!

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env.local` file private
- Add `.env.local` to `.gitignore` (already done)
- Never commit API keys to Git
- Rotate keys periodically
- Use environment variables in production

### ❌ DON'T:
- Share your API key publicly
- Commit `.env.local` to version control
- Put API keys in frontend code
- Use same key across multiple projects

---

## 🚀 Production Deployment

### Environment Variables

When deploying to Vercel/Netlify/etc:

1. **Add environment variable in hosting platform:**
   ```
   ANTHROPIC_API_KEY=sk-ant-your-production-key
   ```

2. **Don't include .env.local in deployment** (it's already in .gitignore)

### Vercel Example:

```bash
# Deploy
vercel

# Add environment variable
vercel env add ANTHROPIC_API_KEY
# Paste your key when prompted
```

---

## 📈 Monitoring Usage

### Check Your Usage:

1. Go to https://console.anthropic.com/settings/usage
2. View:
   - Total requests
   - Tokens used
   - Costs incurred
   - Remaining credits

### Set Up Alerts:

1. Go to Settings → Notifications
2. Set up alerts for:
   - 80% usage threshold
   - 100% credit exhausted
   - Unusual activity

---

## 🎓 Testing AI Features

### Test in English:

**Record:** "The street light in front of my house has not been working for a week. It's very dark at night and causing safety concerns."

**Expected AI Output:** Professional complaint with:
- Proper category identification (Street Light)
- Safety concern emphasis
- Structured format
- Action request

### Test in Tamil:

**Record:** "எங்கள் பகுதியில் மூன்று நாட்களாக மின்சாரம் இல்லை. வீட்டு வேலைகள் செய்ய முடியவில்லை."

**Expected AI Output:** Tamil complaint letter with:
- Proper Tamil formatting
- Cultural appropriateness
- Professional tone in Tamil

---

## 🎯 Current Setup Status

```powershell
# Check current .env.local
Get-Content .env.local

# You should see:
# ANTHROPIC_API_KEY=your_anthropic_api_key_here  ← UPDATE THIS!
```

---

## ✅ Checklist

- [ ] Created Anthropic account
- [ ] Got API key from console
- [ ] Added key to `.env.local`
- [ ] Restarted server
- [ ] Tested complaint generation
- [ ] Verified AI is working

---

## 🆘 Need Help?

1. **Check logs:** Terminal and browser console (F12)
2. **Verify API key:** Console.anthropic.com
3. **Test with template mode first:** Works without AI key
4. **Review error messages:** They usually tell you what's wrong

---

## 📞 Support Resources

- **Anthropic Docs:** https://docs.anthropic.com/
- **API Reference:** https://docs.anthropic.com/claude/reference/
- **Status Page:** https://status.anthropic.com/
- **Support:** https://console.anthropic.com/support

---

**Your app works perfectly without AI using templates. AI just makes it smarter! 🎉**
