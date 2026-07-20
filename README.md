# SubtitleAI 🎬

> **AI Video Subtitle Generator — Powered by OpenAI Whisper**  
> Generate accurate subtitles from any video/audio file and translate to 90+ languages.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-Whisper-412991?logo=openai)](https://openai.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)

---

## ✨ Features

- **Whisper AI Transcription** — State-of-the-art speech recognition via `whisper-1`
- **90+ Language Support** — Works with any language Whisper supports
- **Auto-Translation** — Translate subtitles to any target language using GPT-4o-mini
- **SRT & VTT Export** — Industry-standard subtitle files, ready for any video editor
- **Real-time Progress** — Live progress tracking with polling (PENDING → PROCESSING → DONE)
- **Background Processing** — Fire-and-forget transcription; user sees live progress
- **Credit System** — 5 free jobs; expandable via payment
- **All Formats** — MP4, MP3, WAV, MOV, WebM, M4A, FLAC

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript |
| Transcription | OpenAI Whisper (`whisper-1`) |
| Translation | GPT-4o-mini |
| Auth | Clerk |
| Database | PostgreSQL + Prisma |
| File Upload | React Dropzone |
| Styling | Tailwind CSS |

---

## 🚀 Getting Started

```bash
git clone https://github.com/maa883151-eng/subtitle-ai.git
cd subtitle-ai
npm install
cp .env.example .env.local
# Add DATABASE_URL, Clerk keys, OPENAI_API_KEY
npx prisma db push
npm run dev
```

---

## 🔄 How It Works

1. User uploads video/audio (up to 500MB)
2. File saved to temp dir on server
3. `whisper-1` transcribes with segment timestamps
4. (Optional) GPT-4o-mini translates all lines in batches
5. SRT + VTT files generated and saved to DB
6. Temp file deleted; frontend polls for status updates

---

## 📁 Project Structure

```
src/
├── app/(dashboard)/
│   ├── generate/        # Upload + result pages
│   ├── history/         # All jobs table
│   └── dashboard/       # Overview
├── api/
│   ├── transcribe/      # Upload + fire transcription job
│   └── jobs/[id]/       # Polling endpoint
├── components/generate/
│   ├── job-uploader.tsx # Drag & drop with language select
│   └── job-result.tsx   # Live progress + subtitle preview
└── lib/
    ├── whisper.ts       # Whisper + GPT translation logic
    └── utils.ts         # SRT/VTT formatters
```

---

## 📄 License

MIT © 2024 Ahmed Al-Madani
