# 🚀 Setup and Run Guide

## Complete Feature Checklist ✅

Your Speech-to-Text Complaint System has the following features:

### 1. **Audio Recording** 🎤
- Record voice complaints using browser microphone
- Real-time recording timer
- Play back recorded audio
- Works in Chrome, Edge, Safari

### 2. **Manual Text Entry** ⌨️
- Type complaints directly (Tamil or English)
- Automatic language detection
- Skips transcription step for efficiency

### 3. **Speech-to-Text Conversion** 🔄
- Browser-based speech recognition (Web Speech API)
- Supports Tamil and English
- Automatic language detection
- High accuracy with retry logic

### 4. **AI-Powered Complaint Generation** 🤖
- Groq AI integration (llama-3.3-70b-versatile)
- Automatic category detection
- Professional complaint letter formatting
- Fallback to template-based generation if AI unavailable

### 5. **Text-to-Speech Playback** 🔊
- Listen to generated complaint
- Browser-based synthesis (no external dependencies)
- Supports Tamil and English voices
- Adjustable speech rate

### 6. **Database Storage** 💾
- SQLite database for complaint storage
- Unique complaint IDs
- Status tracking
- Timestamp recording

---

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Modern browser** with:
   - Microphone access
   - Web Speech API support (Chrome, Edge, Safari)
3. **Groq API Key** (optional but recommended for AI features)

---

## 🛠️ Installation Steps

### Step 1: Install Dependencies

```powershell
npm install
```

### Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Groq API key:

```env
GROQ_API_KEY=your_actual_groq_api_key_here
```

**To get a Groq API key:**
1. Visit https://console.groq.com
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into `.env.local`

> **Note:** If you don't have a Groq API key, the system will still work using template-based complaint generation.

### Step 3: Initialize Database

The database will be created automatically on first run. The `data` directory will be created in your project root.

---

## 🚀 Running the Application

### Development Mode

```powershell
npm run dev
```

The application will start at: **http://localhost:3000**

### Production Build

```powershell
npm run build
npm start
```

---

## 🎯 How to Use

### Option A: Audio Recording Flow

1. **Step 1 - Record Audio**
   - Click "Start Recording"
   - Speak your complaint clearly in Tamil or English
   - Click "Stop Recording"
   - Play back to verify

2. **Step 2 - Convert to Text**
   - Click "Convert to Text"
   - Browser will transcribe your speech
   - Language is automatically detected

3. **Step 3 - Generate Complaint**
   - Click "Generate Complaint Letter with AI"
   - AI formats your complaint professionally
   - Category is automatically detected

4. **Step 4 - Verify & Submit**
   - Review the generated complaint
   - Click "Listen to Complaint" to hear it read aloud
   - Click "Confirm & Submit"
   - Get your unique complaint ID

### Option B: Manual Text Entry Flow

1. **Step 1 - Enter Text**
   - Type your complaint in the text area
   - Use Tamil or English
   - Click "Submit Text"
   - *Skips directly to Step 3*

2. **Step 3 - Generate Complaint**
   - Same as audio flow above

3. **Step 4 - Verify & Submit**
   - Same as audio flow above

---

## 🔧 Browser Compatibility

### Fully Supported:
- ✅ Google Chrome (Desktop & Mobile)
- ✅ Microsoft Edge
- ✅ Safari (macOS & iOS)

### Partially Supported:
- ⚠️ Firefox (Speech recognition may not work)

### Required Browser Permissions:
- 🎤 Microphone access (for audio recording)
- 🔊 Audio playback (for TTS)

---

## 🐛 Troubleshooting

### Issue: "Speech recognition not supported"
**Solution:** Use Chrome, Edge, or Safari browser.

### Issue: "Unable to access microphone"
**Solution:** 
1. Check browser permissions
2. Ensure microphone is connected
3. Close other apps using the microphone

### Issue: "AI Generation failed"
**Solutions:**
1. Check if `.env.local` has valid GROQ_API_KEY
2. Verify internet connection
3. System will automatically use template-based generation as fallback

### Issue: "No speech detected"
**Solutions:**
1. Speak louder and clearer
2. Check microphone is working
3. Reduce background noise
4. Try manual text entry instead

### Issue: TTS not working
**Solution:**
1. Ensure browser supports Web Speech API
2. Check system audio settings
3. Try a different browser

---

## 📂 Project Structure

```
speech-to-text/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── speech-to-text/     # Speech recognition (browser-based)
│   │   │   ├── text-to-speech/     # TTS endpoint
│   │   │   ├── generate-complaint/  # AI complaint generation
│   │   │   └── complaints/          # Database operations
│   │   ├── page.tsx                 # Main UI component
│   │   └── layout.tsx
│   ├── components/
│   │   ├── AudioRecorder.tsx        # Audio recording UI
│   │   ├── TranscriptionDisplay.tsx # Speech-to-text display
│   │   ├── ComplaintDisplay.tsx     # AI-generated complaint
│   │   ├── VerificationSection.tsx  # Final verification
│   │   └── SuccessMessage.tsx       # Success screen
│   └── lib/
│       ├── ai-complaint-generator.ts # Groq AI integration
│       └── database.ts              # SQLite operations
├── data/                            # SQLite database
├── .env.local                       # Environment variables
└── package.json
```

---

## 🔒 Security Notes

1. **Never commit `.env.local`** - It contains sensitive API keys
2. **API keys in `.env.local`** are only accessible server-side
3. **Database** stores complaints locally in SQLite
4. **No external audio storage** - Audio processed in browser only

---

## 📊 API Endpoints

### POST `/api/speech-to-text`
- Placeholder endpoint (actual transcription in browser)

### POST `/api/text-to-speech`
- Returns text for browser TTS synthesis

### POST `/api/generate-complaint`
- Generates complaint using Groq AI
- Falls back to templates if AI unavailable

### POST `/api/complaints`
- Saves complaint to database
- Returns unique complaint ID

### GET `/api/complaints`
- Retrieves all complaints

### GET `/api/complaints?id=COMPLAINT_ID`
- Retrieves specific complaint

---

## 🎨 Features Overview

| Feature | Technology | Fallback |
|---------|-----------|----------|
| Speech Recognition | Web Speech API | Manual text entry |
| AI Generation | Groq AI (Llama 3.3) | Template-based |
| Text-to-Speech | Web Speech Synthesis | Manual reading |
| Database | SQLite (better-sqlite3) | N/A |
| UI Framework | Next.js 14 + React | N/A |
| Styling | Tailwind CSS | N/A |

---

## 📝 Environment Variables

```env
# Required for AI features
GROQ_API_KEY=your_groq_api_key

# Optional (with defaults)
DATABASE_PATH=./data/complaints.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚨 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Speech recognition not supported" | Browser incompatibility | Use Chrome/Edge/Safari |
| "Unable to access microphone" | Permission denied | Allow microphone access |
| "Failed to generate complaint" | API error | Check GROQ_API_KEY or use fallback |
| "No speech detected" | Silent recording | Speak louder |

---

## ✅ Testing Checklist

Before deploying, test these scenarios:

- [ ] Audio recording starts and stops correctly
- [ ] Recorded audio plays back
- [ ] Speech-to-text converts Tamil speech
- [ ] Speech-to-text converts English speech
- [ ] Manual text entry works
- [ ] Tamil text is detected correctly
- [ ] English text is detected correctly
- [ ] AI generates complaint with Groq
- [ ] Template fallback works without API key
- [ ] TTS plays complaint in Tamil
- [ ] TTS plays complaint in English
- [ ] Complaint saves to database
- [ ] Unique complaint ID is generated
- [ ] Success message displays
- [ ] "Record Again" button resets flow
- [ ] Loading states appear correctly
- [ ] All buttons are enabled/disabled appropriately

---

## 🎓 Development Tips

1. **Check browser console** for detailed error messages
2. **Use Chrome DevTools** to debug speech recognition
3. **Test with clear audio** in a quiet environment
4. **Verify database** in `data/complaints.db` using SQLite viewer
5. **Monitor API calls** in Network tab for debugging

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review browser console for errors
3. Verify all prerequisites are met
4. Test with different browsers
5. Check API key configuration

---

## 🎉 Success!

If everything is working:
- ✅ You can record audio
- ✅ Speech converts to text
- ✅ AI generates professional complaints
- ✅ TTS reads complaints aloud
- ✅ Complaints save to database
- ✅ You receive a complaint ID

Congratulations! Your Speech-to-Text Complaint System is fully operational! 🚀
