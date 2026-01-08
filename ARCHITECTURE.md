# 🏗️ Clean Architecture - Project Structure

## 📂 Directory Structure

```
c:\speech to text\
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript config
│   ├── next.config.js            # Next.js config
│   ├── tailwind.config.ts        # Tailwind CSS
│   ├── postcss.config.js         # PostCSS
│   └── .env.local                # Environment variables (API keys)
│
├── 📚 Documentation (Read These!)
│   ├── START_HERE.md             # 👈 START HERE!
│   ├── ENABLE_AI_GUIDE.md        # 🤖 How to enable AI
│   ├── SETUP_GUIDE.md            # Quick setup
│   ├── README_NEXTJS.md          # Complete docs
│   ├── WORKFLOW.md               # Visual workflow
│   ├── QUICK_REFERENCE.md        # Commands
│   └── PROJECT_SUMMARY.md        # Overview
│
├── 📂 src/ (Main Application Code)
│   │
│   ├── 📂 app/ (Next.js App Router)
│   │   │
│   │   ├── 📂 api/ (Backend API Routes)
│   │   │   │
│   │   │   ├── 📂 generate-complaint/
│   │   │   │   └── route.ts      # ✨ AI complaint generation
│   │   │   │
│   │   │   ├── 📂 text-to-speech/
│   │   │   │   └── route.ts      # 🔊 Text to audio (gTTS)
│   │   │   │
│   │   │   ├── 📂 complaints/
│   │   │   │   └── route.ts      # 💾 Save/retrieve from DB
│   │   │   │
│   │   │   └── 📂 health/
│   │   │       └── route.ts      # ✓ Health check
│   │   │
│   │   ├── page.tsx              # 🏠 Main application page
│   │   ├── layout.tsx            # 📐 Root layout
│   │   └── globals.css           # 🎨 Global styles
│   │
│   ├── 📂 components/ (React Components)
│   │   ├── AudioRecorder.tsx     # 🎤 Recording interface
│   │   ├── TranscriptionDisplay.tsx # 📝 Show transcribed text
│   │   ├── ComplaintDisplay.tsx  # ✨ Show AI complaint
│   │   ├── VerificationSection.tsx # 🔊 Verify with audio
│   │   └── SuccessMessage.tsx    # ✅ Success screen
│   │
│   └── 📂 lib/ (Business Logic)
│       ├── ai-complaint-generator.ts # 🤖 AI logic (Claude)
│       └── database.ts           # 💾 SQLite operations
│
├── 📂 public/
│   └── audio/                    # Generated TTS audio files
│
├── 📂 data/
│   └── complaints.db             # SQLite database
│
├── 📂 uploads/                   # Temporary audio uploads
│
├── 📂 backend_old/               # Old Flask backend (archived)
└── 📂 frontend_old/              # Old vanilla JS (archived)
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER (Client)                     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  1. User Records Audio (MediaRecorder API)          │  │
│  │     • Microphone captures audio                      │  │
│  │     • Blob stored in memory                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  2. Browser Speech Recognition (Web Speech API)      │  │
│  │     • Audio → Text conversion (Tamil/English)        │  │
│  │     • No server needed - 100% client-side            │  │
│  │     • Fast & accurate                                │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                │
└─────────────────────────────────────────────────────────────┘
                             ↓
                    Text sent to server
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                     NEXT.JS SERVER (API Routes)             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  3. AI Complaint Generation                          │  │
│  │     /api/generate-complaint                          │  │
│  │                                                       │  │
│  │     ┌─────────────────────────────────────────────┐  │  │
│  │     │  ai-complaint-generator.ts                  │  │  │
│  │     │  • Calls Anthropic Claude API               │  │  │
│  │     │  • Sends complaint text + language          │  │  │
│  │     │  • AI analyzes and generates letter         │  │  │
│  │     │  • Fallback to templates if AI fails        │  │  │
│  │     └─────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                │
└─────────────────────────────────────────────────────────────┘
                             ↓
                    Complaint generated
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                     TEXT-TO-SPEECH (Optional)               │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  4. Convert Complaint to Audio                       │  │
│  │     /api/text-to-speech                              │  │
│  │     • Uses gTTS (Google Text-to-Speech)              │  │
│  │     • Generates MP3 file                             │  │
│  │     • Saves to public/audio/                         │  │
│  │     • Returns audio URL                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↓                                │
└─────────────────────────────────────────────────────────────┘
                             ↓
                    User verifies complaint
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                     DATABASE STORAGE                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  5. Save to SQLite Database                          │  │
│  │     /api/complaints                                  │  │
│  │                                                       │  │
│  │     ┌─────────────────────────────────────────────┐  │  │
│  │     │  database.ts (ComplaintDB)                  │  │  │
│  │     │  • Generates unique ID                       │  │  │
│  │     │  • Saves all details                         │  │  │
│  │     │  • Returns complaint ID                      │  │  │
│  │     └─────────────────────────────────────────────┘  │  │
│  │                                                       │  │
│  │     data/complaints.db                               │  │
│  │     ┌─────────────────────────────────────────────┐  │  │
│  │     │ Complaint Table:                            │  │  │
│  │     │ - id                                        │  │  │
│  │     │ - complaint_text                            │  │  │
│  │     │ - transcribed_text                          │  │  │
│  │     │ - language                                  │  │  │
│  │     │ - category                                  │  │  │
│  │     │ - status                                    │  │  │
│  │     │ - created_at                                │  │  │
│  │     │ - updated_at                                │  │  │
│  │     └─────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                             ↓
                    Success! Complaint ID returned
```

---

## 🎯 Component Hierarchy

```
page.tsx (Main Controller)
│
├── State Management
│   ├── step (current step 1-5)
│   ├── audioBlob (recorded audio)
│   ├── transcribedText (speech → text)
│   ├── detectedLanguage (ta/en)
│   ├── complaintText (AI generated)
│   ├── category (Water, Road, etc.)
│   └── complaintId (CMP123XYZ)
│
└── Components (rendered based on step)
    │
    ├── AudioRecorder
    │   └── Props: onRecordingComplete, disabled
    │
    ├── TranscriptionDisplay
    │   └── Props: audioBlob, text, language, onConvert
    │
    ├── ComplaintDisplay
    │   └── Props: complaintText, onGenerate
    │
    ├── VerificationSection
    │   └── Props: complaintText, language, onConfirm, onRetry
    │
    └── SuccessMessage
        └── Props: complaintId, onNewComplaint
```

---

## 🔌 API Endpoints

### 1. Generate Complaint (AI)
```
POST /api/generate-complaint

Request:
{
  "text": "transcribed complaint text",
  "language": "ta" | "en"
}

Response:
{
  "success": true,
  "complaint": "formatted complaint letter",
  "category": "Water Supply",
  "details": { ... }
}
```

### 2. Text-to-Speech
```
POST /api/text-to-speech

Request:
{
  "text": "complaint text to speak",
  "language": "ta" | "en"
}

Response:
{
  "success": true,
  "audioUrl": "/audio/uuid.mp3"
}
```

### 3. Submit Complaint
```
POST /api/complaints

Request:
{
  "complaint": "full complaint text",
  "transcribed_text": "original speech",
  "language": "ta" | "en",
  "category": "Water Supply"
}

Response:
{
  "success": true,
  "complaint_id": "CMP7K3L9XYZ",
  "message": "Complaint submitted successfully"
}
```

### 4. Get Complaints
```
GET /api/complaints?id=CMP7K3L9XYZ

Response:
{
  "success": true,
  "complaint": { /* complaint object */ }
}

GET /api/complaints

Response:
{
  "success": true,
  "complaints": [ /* array of complaints */ ]
}
```

### 5. Health Check
```
GET /api/health

Response:
{
  "status": "healthy",
  "service": "Speech-to-Text Complaint System (Next.js)",
  "version": "2.0.0",
  "ai_provider": "Anthropic Claude" | "Template-based"
}
```

---

## 🎨 Styling Architecture

### Tailwind CSS Utility-First

```tsx
// Clean, maintainable styling
<button className="
  px-6 py-3                    // Padding
  bg-blue-600                  // Background
  hover:bg-blue-700            // Hover state
  text-white                   // Text color
  rounded-lg                   // Border radius
  transition-colors            // Smooth transitions
  disabled:bg-gray-400         // Disabled state
">
  Click Me
</button>
```

### Global Styles
- `src/app/globals.css` - Tailwind imports + custom styles
- Responsive design (mobile-first)
- Dark mode ready (can be enabled)

---

## 💾 Database Schema

```sql
CREATE TABLE complaints (
  id TEXT PRIMARY KEY,              -- CMP7K3L9XYZ
  complaint_text TEXT NOT NULL,     -- Full formatted letter
  transcribed_text TEXT NOT NULL,   -- Original speech
  audio_path TEXT,                  -- Optional audio file
  language TEXT NOT NULL,           -- 'ta' or 'en'
  category TEXT,                    -- Water, Road, etc.
  status TEXT DEFAULT 'submitted',  -- submitted, reviewed, resolved
  created_at DATETIME,              -- Auto timestamp
  updated_at DATETIME               -- Auto timestamp
);
```

---

## 🔐 Environment Variables

```env
# .env.local (NOT committed to Git)

# AI Features (Optional)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Database
DATABASE_PATH=./data/complaints.db

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Security:**
- `.env.local` in `.gitignore`
- Never commit API keys
- Server-side only (not exposed to browser)

---

## 🚀 Build & Deployment

### Development
```bash
npm run dev          # Start dev server
# Hot reload enabled
# TypeScript checking
# Fast refresh
```

### Production
```bash
npm run build        # Build optimized bundle
npm start            # Run production server
```

### Deploy to Vercel
```bash
vercel               # One command deployment
# Add ANTHROPIC_API_KEY as environment variable
```

---

## 📊 Performance Optimizations

1. **Code Splitting** - Automatic by Next.js
2. **Image Optimization** - Next.js Image component
3. **Font Optimization** - Google Fonts with next/font
4. **Client-Side Rendering** - For speech recognition
5. **Server-Side Generation** - For API routes
6. **Lazy Loading** - Components load on demand

---

## 🛡️ Error Handling

### Client-Side
```tsx
try {
  // API call
} catch (error) {
  alert('User-friendly error message');
  console.error(error);  // Developer logs
}
```

### Server-Side
```ts
try {
  // Business logic
} catch (error) {
  console.error('Detailed error:', error);
  return NextResponse.json(
    { error: 'User-friendly message' },
    { status: 500 }
  );
}
```

### AI Fallback
- If AI fails → Use templates
- App always works!

---

## 🎯 Best Practices Implemented

✅ **TypeScript** - Type safety throughout
✅ **Component Structure** - Reusable, maintainable
✅ **Error Handling** - Comprehensive try-catch
✅ **Loading States** - User feedback
✅ **Responsive Design** - Mobile-friendly
✅ **Clean Code** - Well-commented
✅ **Modular Architecture** - Easy to extend
✅ **Environment Config** - Secure API keys
✅ **Database Layer** - Abstracted operations
✅ **API Routes** - RESTful design

---

## 📈 Scalability

### Current Setup
- **Users:** 1-100 concurrent
- **Database:** SQLite (perfect for small-medium)
- **Hosting:** Vercel/Netlify (serverless)

### Future Scale (if needed)
- Upgrade to PostgreSQL
- Add Redis caching
- CDN for audio files
- Load balancing
- Microservices architecture

---

**Clean, professional, production-ready code! 🚀**
