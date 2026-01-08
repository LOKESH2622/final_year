# 🔧 UI Troubleshooting Guide

## ✅ Server Status
- **Running:** http://localhost:3000
- **Status:** Ready ✓

---

## 🐛 Common UI Issues & Solutions

### **Issue 1: Nothing Shows on Screen (Blank Page)**

**Causes:**
- Browser cache
- JavaScript disabled
- Console errors

**Solutions:**
```
1. Hard refresh: Ctrl + Shift + R (or Ctrl + F5)
2. Clear browser cache
3. Open DevTools (F12) → Check Console for errors
4. Try incognito/private mode
```

---

### **Issue 2: Styles Not Loading (Ugly/Unstyled)**

**Causes:**
- Tailwind CSS not compiled
- CSS file not loaded

**Solutions:**
```powershell
# Restart dev server
Stop-Process -Name node -Force
npm run dev
```

**Then:**
- Hard refresh browser (Ctrl + Shift + R)
- Check if globals.css is loading in DevTools → Network tab

---

### **Issue 3: Buttons Not Clickable**

**Causes:**
- Loading state stuck
- JavaScript errors
- State management issue

**Solutions:**
1. Open DevTools (F12) → Console tab
2. Look for errors (red text)
3. Refresh page (Ctrl + R)
4. Try recording/typing again

---

### **Issue 4: Recording Doesn't Work**

**Causes:**
- Microphone permission denied
- Browser doesn't support MediaRecorder

**Solutions:**
```
1. Check browser: Use Chrome, Edge, or Safari
2. Allow microphone access:
   - Click padlock icon in address bar
   - Allow microphone permission
3. Check if microphone works in other apps
4. Try manual text entry instead
```

---

### **Issue 5: Speech Recognition Fails**

**Causes:**
- Browser doesn't support SpeechRecognition
- Microphone issues
- Background noise

**Solutions:**
```
1. Use Chrome, Edge, or Safari (Firefox not supported)
2. Speak clearly in quiet environment
3. Try manual text entry as alternative
```

---

### **Issue 6: AI Generation Stuck/Slow**

**Causes:**
- No GROQ_API_KEY configured
- Network issues
- API rate limit

**Solutions:**
```powershell
# Check .env.local file exists
Test-Path .env.local

# If not exists, create it:
Copy-Item .env.local.example .env.local

# Edit .env.local and add:
GROQ_API_KEY=your_actual_key_here
```

**Note:** App works without API key (uses template fallback)

---

### **Issue 7: Text-to-Speech Not Playing**

**Causes:**
- Browser doesn't support SpeechSynthesis
- Audio blocked by browser
- No voices available

**Solutions:**
```
1. Check browser: Use Chrome, Edge, or Safari
2. Allow audio autoplay in browser settings
3. Click listen button again
4. Check system volume/mute
```

---

### **Issue 8: Database Errors**

**Causes:**
- SQLite file permissions
- Data folder doesn't exist

**Solutions:**
```powershell
# Check data folder exists
Test-Path "data"

# If not, create it:
New-Item -ItemType Directory -Path "data" -Force

# Restart dev server
Stop-Process -Name node -Force
npm run dev
```

---

### **Issue 9: Port Already in Use**

**Symptoms:**
```
Port 3000 is in use, trying 3001 instead
```

**Solutions:**
```powershell
# Option 1: Kill process on port 3000
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }

# Option 2: Use different port
# App automatically switches to 3001, 3002, etc.

# Then restart
npm run dev
```

---

### **Issue 10: MetaMask Errors (Harmless)**

**Symptoms:**
```
MetaMask extension not found
```

**Solution:**
- **Ignore it** - Not related to your app
- Or disable MetaMask extension temporarily

---

## 🔍 Debug Steps

### **Step 1: Check Browser Console**
```
1. Press F12 (DevTools)
2. Go to Console tab
3. Look for red errors
4. Share error messages if needed
```

### **Step 2: Check Network Tab**
```
1. Press F12 (DevTools)
2. Go to Network tab
3. Refresh page (Ctrl + R)
4. Check if all files load (200 status)
5. Look for failed requests (red)
```

### **Step 3: Check Elements Tab**
```
1. Press F12 (DevTools)
2. Go to Elements tab
3. Check if HTML structure exists
4. Look for styles applied to elements
```

### **Step 4: Test in Incognito**
```
1. Open incognito/private window
2. Go to http://localhost:3000
3. Test if issue persists
4. If works → Clear browser cache
```

---

## 📋 Checklist for Working App

- [ ] Server running on http://localhost:3000
- [ ] Page loads (not blank)
- [ ] Styles applied (looks good)
- [ ] Recording button visible
- [ ] Manual text box visible
- [ ] Can type in text box
- [ ] Can click buttons
- [ ] No console errors (F12)

---

## 🎯 Quick Tests

### **Test 1: Page Loads**
```
1. Open: http://localhost:3000
2. Should see: "Speech-to-Text Complaint System" title
3. Should see: Two boxes (Audio Recording + Manual Text)
```

### **Test 2: Manual Text Works**
```
1. Type "test" in text box
2. Click "Submit Text" button
3. Should see: Your text displayed with language badge
```

### **Test 3: Styles Work**
```
1. Page should have:
   - Blue gradient background
   - White cards/boxes
   - Colored buttons (blue, green)
   - Professional fonts
```

---

## 🆘 Still Not Working?

### **Provide These Details:**

1. **What you see:**
   - Blank page?
   - Unstyled page?
   - Buttons not working?
   - Error messages?

2. **Browser Console Errors:**
   - Press F12
   - Copy any red error messages

3. **Browser Info:**
   - Which browser? (Chrome/Edge/Firefox/Safari)
   - Version?

4. **What you tried:**
   - Recording or typing?
   - What step failed?
   - Any error messages shown?

---

## 🔧 Nuclear Option (Full Reset)

If nothing works:

```powershell
# 1. Stop everything
Stop-Process -Name node -Force

# 2. Clear all caches
Remove-Item -Path ".next" -Recurse -Force
Remove-Item -Path "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue

# 3. Restart
npm run dev

# 4. Hard refresh browser
# Ctrl + Shift + R (or Ctrl + F5)

# 5. Try incognito mode
# Ctrl + Shift + N (Chrome/Edge)
```

---

## ✅ Verification

Your app should look like this:

```
┌─────────────────────────────────────────────┐
│  🎤 Speech-to-Text Complaint System        │
│  Record or type your complaint              │
│  ✓ Groq AI Powered   ✓ Tamil & English     │
├─────────────────────────────────────────────┤
│  Choose Input Method                        │
│                                             │
│  ┌──────────────┐  ┌──────────────┐       │
│  │ 🎤 Audio     │  │ ⌨️ Manual    │       │
│  │ Recording    │  │ Text Entry   │       │
│  │              │  │              │       │
│  │ [Start Rec]  │  │ [Text Box]   │       │
│  │ [Stop Rec]   │  │ [Submit]     │       │
│  │ [Play]       │  │              │       │
│  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────┘
```

If you see something completely different or nothing at all, follow the debug steps above!

---

**Current Status:** ✅ Server running on http://localhost:3000

**Next Step:** Open browser and test the app!
