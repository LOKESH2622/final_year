# 🚀 Quick Reference Card - Next.js Complaint System

## Installation (First Time)

```powershell
# Run the automated setup
.\install-nextjs.ps1

# OR manually:
npm install
pip install gTTS gtts-cli
```

## Running the Application

```powershell
# Development mode (recommended)
npm run dev

# Production mode
npm run build
npm start
```

**Access:** http://localhost:3000

## Environment Setup

Create `.env.local` file:
```env
ANTHROPIC_API_KEY=your-key-here
DATABASE_PATH=./data/complaints.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get API key: https://console.anthropic.com/

## Project Structure

```
src/
├── app/
│   ├── api/          # Backend endpoints
│   ├── page.tsx      # Main UI
│   └── layout.tsx    # Layout
├── components/       # React components
└── lib/             # Business logic
    ├── database.ts           # SQLite
    └── ai-complaint-generator.ts  # AI
```

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/speech-to-text` | POST | Convert audio → text |
| `/api/generate-complaint` | POST | Generate complaint with AI |
| `/api/text-to-speech` | POST | Convert text → audio |
| `/api/complaints` | POST | Submit complaint |
| `/api/complaints?id={id}` | GET | Get complaint |
| `/api/health` | GET | Health check |

## User Workflow

1. **🎤 Record** → Speak complaint
2. **🔄 Convert** → Speech to text
3. **✨ Generate** → AI creates letter
4. **🔊 Verify** → Listen to complaint
5. **✅ Submit** → Save to database
6. **🎉 Success** → Get complaint ID

## Key Commands

```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Type checking
npx tsc --noEmit

# Install Python TTS
pip install gTTS gtts-cli

# Check FFmpeg
ffmpeg -version
```

## Database Queries

```sql
-- View all complaints
SELECT * FROM complaints ORDER BY created_at DESC;

-- Get complaint by ID
SELECT * FROM complaints WHERE id = 'CMP7K3L9XYZ';

-- Count by status
SELECT status, COUNT(*) FROM complaints GROUP BY status;
```

## Component Props

### AudioRecorder
```typescript
<AudioRecorder 
  onRecordingComplete={(blob) => {}}
  disabled={false}
/>
```

### TranscriptionDisplay
```typescript
<TranscriptionDisplay
  audioBlob={blob}
  transcribedText={text}
  detectedLanguage={lang}
  onConvert={() => {}}
  showConvertButton={true}
/>
```

## Troubleshooting Quick Fixes

| Issue | Solution |
|-------|----------|
| Mic not working | Check browser permissions |
| AI not generating | Verify ANTHROPIC_API_KEY in .env.local |
| TTS fails | Run `pip install gTTS` |
| Build errors | Delete node_modules, run `npm install` |
| Port in use | Change port: `npm run dev -- -p 3001` |

## File Locations

- **Database:** `data/complaints.db`
- **Audio uploads:** `uploads/`
- **TTS audio:** `public/audio/`
- **Logs:** Console output
- **Config:** `.env.local`

## Important URLs

- **App:** http://localhost:3000
- **Health Check:** http://localhost:3000/api/health
- **Anthropic Console:** https://console.anthropic.com/
- **Next.js Docs:** https://nextjs.org/docs

## Common npm Scripts

```json
{
  "dev": "next dev",           // Development server
  "build": "next build",       // Production build
  "start": "next start",       // Production server
  "lint": "next lint"          // Code linting
}
```

## Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `ANTHROPIC_API_KEY` | AI generation | `sk-ant-...` |
| `DATABASE_PATH` | SQLite location | `./data/complaints.db` |
| `NEXT_PUBLIC_APP_URL` | App URL | `http://localhost:3000` |

## Tech Stack Summary

- **Frontend:** React 18 + TypeScript
- **Backend:** Next.js 14 API Routes
- **Styling:** Tailwind CSS
- **Database:** SQLite
- **AI:** Anthropic Claude 3.5 Sonnet
- **TTS:** Google Text-to-Speech (gTTS)
- **Audio:** FFmpeg

## Development Tips

1. **Hot Reload:** Changes auto-refresh in dev mode
2. **Console:** Use browser DevTools for debugging
3. **Logs:** Check terminal for server logs
4. **Types:** TypeScript catches errors early
5. **Tailwind:** Use utility classes for styling

## Production Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Manual
```bash
npm run build
npm start
```

Set environment variables in hosting platform.

## Database Schema

```sql
CREATE TABLE complaints (
  id TEXT PRIMARY KEY,
  complaint_text TEXT NOT NULL,
  transcribed_text TEXT NOT NULL,
  audio_path TEXT,
  language TEXT NOT NULL,
  category TEXT,
  status TEXT DEFAULT 'submitted',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Sample API Request

```javascript
// Submit complaint
fetch('/api/complaints', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    complaint: "...",
    transcribed_text: "...",
    language: "ta",
    category: "Water Supply"
  })
})
```

## Languages Supported

- **English** (en-IN)
- **Tamil** (ta-IN) - தமிழ்

## Status Codes

- `200` - Success
- `400` - Bad Request (missing data)
- `404` - Not Found
- `500` - Server Error

## Documentation Files

1. **README_NEXTJS.md** - Complete guide
2. **SETUP_GUIDE.md** - Quick start
3. **MIGRATION_GUIDE.md** - Old vs New comparison
4. **PROJECT_SUMMARY.md** - Overview
5. **WORKFLOW.md** - Detailed workflow
6. **QUICK_REFERENCE.md** - This file

## Testing the App

1. **Start server:** `npm run dev`
2. **Open browser:** http://localhost:3000
3. **Record:** Click "Start Recording"
4. **Speak:** Say a complaint
5. **Stop:** Click "Stop Recording"
6. **Convert:** Click "Convert to Text"
7. **Generate:** Click "Generate Complaint"
8. **Verify:** Click "Listen to Complaint"
9. **Submit:** Click "Confirm & Submit"
10. **Success:** Note your Complaint ID

## Need Help?

1. Check console errors (F12 in browser)
2. Review terminal logs
3. Verify .env.local settings
4. Check documentation files
5. Ensure all dependencies installed

---

**Keep this card handy for quick reference!** 📌
