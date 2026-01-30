# Yaya's Sound Safari - Project Report

**Date:** January 29, 2026
**Author:** Claude (AI Assistant)
**Project Owner:** Jay (FlipTech CEO)
**Target User:** Yaya, 4.5 years old

---

## Executive Summary

Built a fully functional phonics learning game for Yaya based on the PRD provided. The app teaches consonant digraphs (SH, CH, TH, WH, CK) using the Hooked on Phonics methodology. The app is deployed to production but has a **critical audio issue** that needs resolution.

---

## What Was Built

### Tech Stack
| Component | Technology |
|-----------|------------|
| Framework | Next.js 16.1.6 + React 18 + TypeScript |
| Styling | Tailwind CSS (custom pink/purple theme) |
| Animations | Framer Motion |
| State Management | Zustand with LocalStorage persistence |
| Database | Supabase (PostgreSQL) |
| TTS | Web Speech API (browser native) |
| Celebrations | react-rewards (confetti) |
| Deployment | Vercel |

### Features Completed

#### 1. Home Page (`/`)
- Game mode selection with animated cards
- Star counter and rainbow progress display
- Personalized branding ("Yaya's Sound Safari")

#### 2. Sound Explorer (`/explore`)
- Learn all 5 digraphs sequentially
- Large animated letter display
- Sound button with TTS
- Teaching tips with mouth positioning
- Example word cards with emojis
- Progress tracking (explored badge)

#### 3. Picture Match (`/match`)
- Match pictures to digraph sounds
- 3 picture options per round
- Confetti celebrations on correct answers
- Sticker rewards every 3 correct
- Visual feedback for correct/incorrect

#### 4. Sound Hunt (`/hunt`)
- Reverse challenge: hear sound, find letters
- Adaptive difficulty (2-5 options)
- Streak tracking
- Rainbow stripe rewards

#### 5. Rewards Page (`/rewards`)
- Star counter with animation
- Rainbow builder progress
- Sticker collection (12 animals)
- Per-digraph mastery progress bars

### Database Schema (Supabase)

```sql
-- Tables created:
- player_profiles (id, player_name, created_at, updated_at)
- player_progress (player_id, digraph_id, explored, practice_correct, practice_attempts, mastered)
- player_rewards (player_id, stars, stickers[], rainbow_stripes)
- game_sessions (analytics - optional)
```

### Deployment

| Resource | URL |
|----------|-----|
| Production | https://yaya-phonics.vercel.app |
| Vercel Dashboard | https://vercel.com/flip-tech/yaya-phonics |
| Supabase Dashboard | https://supabase.com/dashboard/project/znnfffernfcqoeujcdol |

---

## Issues Encountered

### 1. Supabase Project Initialization Delay
**Problem:** After creating the Supabase project, it took ~2 minutes to become available. Initial `supabase link` commands failed with connection refused errors.

**Resolution:** Waited for project status to change from `COMING_UP` to `Active Healthy`, then successfully linked and pushed migrations.

### 2. Vercel Environment Variables Missing
**Problem:** First production deploy failed because Supabase URL/keys weren't set in Vercel environment.

**Error:**
```
Error: supabaseUrl is required.
```

**Resolution:** Added environment variables via Vercel CLI:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add OPENROUTER_API_KEY production
```

### 3. PATH Issues in Build Environment
**Problem:** Node.js, npm, and Homebrew weren't in the default PATH in the development environment.

**Resolution:** Explicitly set PATH in all bash commands:
```bash
export PATH="/opt/homebrew/bin:$HOME/.nvm/versions/node/v22.20.0/bin:/usr/bin:/bin:$PATH"
```

---

## CRITICAL OPEN ISSUE: Text-to-Speech Not Making Sounds

### Problem Description

The Web Speech API is **spelling out the letters** instead of **pronouncing the phonetic sounds**.

**Expected behavior:**
- SH button should say: "shhhh" (the actual sound)
- CH button should say: "ch ch ch" (like a train)

**Actual behavior:**
- SH button says: "S... H..." (spelling the letters)
- CH button says: "C... H..." (spelling the letters)

### What We Tried

#### Attempt 1: Simple phonetic text
```javascript
audioText: 'shhhh'  // Still spelled as "S-H-H-H-H"
```

#### Attempt 2: Repeated phonetic sounds
```javascript
audioText: 'shshsh'  // Still spelled as "S-H-S-H-S-H"
```

#### Attempt 3: Syllable-based pronunciation
```javascript
audioText: 'shuh shuh shuh'  // Says "S-H-U-H" spelled out
```

#### Attempt 4: Full phrase with example word
```javascript
// "shuh shuh shuh... like in ship"
// Still spells "S-H-U-H" but says "like in ship" correctly
```

### Root Cause Analysis

The Web Speech API treats lowercase letter combinations as individual letters to be spelled, not phonemes to be pronounced. This is a fundamental limitation of browser-native TTS:

1. **No phoneme support** - Web Speech API doesn't understand IPA or phonetic notation
2. **Letter-by-letter parsing** - Short strings like "sh" are interpreted as "S, H"
3. **No SSML support** - Cannot use `<phoneme>` tags to specify pronunciation
4. **Voice-dependent** - Some voices handle it worse than others

### Potential Solutions to Research

#### Option A: Use Full Words Only
Instead of trying to say the sound, say an example word emphasizing the digraph:
```javascript
// Instead of "shh shh shh"
speak("ship... ship... ship")  // The 'sh' sound is naturally pronounced
```

#### Option B: ElevenLabs API
ElevenLabs has better phonetic handling and child-friendly voices. The PRD originally specified this as an option.
- Pros: High quality, proper phoneme pronunciation
- Cons: API cost (~$0.30/1000 chars)

#### Option C: Qwen3-TTS (Self-hosted)
The user researched this option. Could provide better control over pronunciation.
- Pros: Free, customizable
- Cons: Requires 24GB+ VRAM GPU (Google Colab Pro could work)

#### Option D: Pre-recorded Audio Files
Record the actual sounds as MP3/WAV files and play them instead of TTS.
- Pros: Perfect pronunciation, works offline
- Cons: Requires audio production, larger bundle size

#### Option E: SSML via Cloud TTS
Google Cloud TTS or Amazon Polly support SSML with phoneme tags:
```xml
<speak>
  <phoneme alphabet="ipa" ph="ʃ">sh</phoneme>
</speak>
```
- Pros: Precise phoneme control
- Cons: API costs, more complex integration

### Recommended Next Steps

1. **Short-term fix:** Change `audioText` to use full example words repeated ("ship, ship, ship") since Web Speech API pronounces words correctly

2. **Medium-term:** Integrate ElevenLabs API when ready (user mentioned getting API key later)

3. **Long-term:** Evaluate Qwen3-TTS on Google Colab for cost-free, high-quality audio

---

## Files Created

```
yaya-phonics/
├── .env.local                          # API keys (Supabase, OpenRouter)
├── .vercel/                            # Vercel project config
├── PROJECT_REPORT.md                   # This report
├── supabase/
│   └── migrations/
│       └── 20260130_initial_schema.sql # Database schema
├── src/
│   ├── app/
│   │   ├── globals.css                 # Pink/purple theme, animations
│   │   ├── layout.tsx                  # Root layout with CloudSyncProvider
│   │   ├── page.tsx                    # Home page
│   │   ├── explore/page.tsx            # Sound Explorer mode
│   │   ├── match/page.tsx              # Picture Match game
│   │   ├── hunt/page.tsx               # Sound Hunt game
│   │   └── rewards/page.tsx            # Sticker collection
│   ├── components/
│   │   ├── CloudSyncProvider.tsx       # Initializes Supabase sync
│   │   ├── GameModeCard.tsx            # Animated game selection cards
│   │   ├── LetterDisplay.tsx           # Animated digraph letters
│   │   ├── PictureCard.tsx             # Clickable word/image cards
│   │   └── SoundButton.tsx             # Big play sound button
│   ├── data/
│   │   └── digraphs.ts                 # All digraph data + word lists
│   ├── hooks/
│   │   └── useSpeechSynthesis.ts       # Web Speech API wrapper
│   ├── lib/
│   │   └── supabase.ts                 # Supabase client + helpers
│   └── stores/
│       └── gameStore.ts                # Zustand store with cloud sync
```

---

## API Keys & Credentials

| Service | Status | Location |
|---------|--------|----------|
| Supabase URL | Configured | `.env.local`, Vercel env |
| Supabase Anon Key | Configured | `.env.local`, Vercel env |
| OpenRouter API Key | Configured (for future AI tutor) | `.env.local`, Vercel env |
| ElevenLabs API Key | Not yet provided | Needed for better TTS |

---

## Metrics & Success Criteria (from PRD)

### Learning Outcomes (To Be Measured)
- [ ] Yaya can identify all 5 digraph sounds when heard
- [ ] Yaya can match digraph letters to their sounds
- [ ] Yaya can recognize digraphs in simple words
- [ ] Yaya shows increased confidence with reading activities

### Engagement Metrics (To Be Tracked)
- [ ] Daily usage of 10-15 minutes
- [ ] Requests to play independently
- [ ] Completes reward collection
- [ ] Positive emotional response to AI tutor

---

## Next Development Phases

### Phase 2: AI Voice Tutor (Pending TTS Fix)
- Integrate OpenRouter API with GPT-4o-mini
- Create "Rich the Reading Buddy" persona
- Context-aware encouragement and feedback

### Phase 3: Word Builder Mode
- Drag-and-drop letter tiles
- Build words from digraphs
- AI pronunciation assistance

### Phase 4: Speech Recognition (Future)
- Speechace or KeenASR integration
- "Say the sound" practice mode
- Phoneme-level feedback

---

## Summary

The core game is functional and deployed. All 4 game modes work, progress saves locally and to the cloud, and the visual/animation experience is polished and child-friendly.

**The blocking issue is the TTS not pronouncing digraph sounds correctly.** This needs to be resolved before the game can effectively teach phonics. The user is researching solutions, and the most promising paths are:

1. ElevenLabs API (when key is available)
2. Pre-recorded audio files
3. Using full words instead of isolated sounds as a workaround

---

*Report generated: January 30, 2026*
