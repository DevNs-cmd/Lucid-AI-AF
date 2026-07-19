# LUCID AI Monorepo

## What this actually is

This repo is **not a working AI storytelling product**. It is a **UI prototype and backend scaffold** for an interactive fiction / RPG platform called LUCID AI.

What you get today:

- A **Next.js marketing site + player dashboard shell** with polished glassmorphism UI, animations, and hardcoded demo data.
- An **Express API** with two real Gemini-powered endpoints (story advance + NPC chat) that persist to PostgreSQL via Prisma — but **the frontend never calls them**.
- A **Python FastAPI-style AI service folder** with provider abstractions, Celery/Qdrant config, and orchestration code — but **no HTTP server entrypoint, no routes, not wired into the monorepo npm workspaces**.
- Leftover **TanStack Start route files** (`apps/web/_legacy_routes/`) from an abandoned routing approach.

The landing page sells features (multiplayer, cinematics, creator studio, vector memory, Stripe billing) that **do not exist in runnable form** in this codebase.

---

## Honest feature matrix

| Area | Status | Reality |
|------|--------|---------|
| Landing page (`/`) | **UI only** | Marketing copy, scroll cinema, pricing FAQ. CTAs go to `#` or `/login`. |
| Player auth | **Fake** | Login writes email/username to `localStorage` and redirects. No password check, no API, no JWT. |
| Signup | **Fake** | Static form, no submit handler. |
| Dashboard & game screens | **Mock data** | Worlds, quests, chapters, NPCs from `apps/web/lib/mockData.ts` and inline arrays. |
| Story screen (`/story/[id]`) | **Simulated** | Hardcoded typewriter text. "Generate" waits 3s then redirects. Cinematic render shows `alert()`. |
| World map (`/world`) | **Wrong data** | Real cities (NYC, London, Tokyo) on a MapLibre globe — not game worlds. |
| Admin panel (`/admin/*`) | **Mock + split design** | Users/worlds/logs/reports use local state + mock data. `/admin` is a separate dashboard with its own sidebar and dead `#` nav links. |
| Admin auth middleware | **Disabled** | `middleware.ts` checks cookie but redirect is commented out ("TEMPORARILY DISABLED for demo viewing"). |
| Admin auth library | **Unused for login** | `lib/auth.ts` has demo credentials (`admin@lucid.ai` / `arcane123`) but **no page calls `login()`**. |
| Express API story/NPC | **Real (if configured)** | Gemini + Prisma. Requires DB seed data with valid UUIDs. Not connected to frontend. |
| Redis cache layer | **Written, not mounted** | `sessionCache`, `storyCache`, `promptCache`, `rateLimiter` exist but **no routes use them**. |
| Stripe payments | **Written, not mounted** | Checkout + webhook handlers exist. **Not registered in `server.ts`**. Frontend upgrade buttons do nothing. |
| Multi-provider AI (`apps/api/src/ai/`) | **Library code** | OpenAI/Anthropic/Google story, image, voice, embedding modules. **Not imported by the running server.** |
| Python `apps/ai-service` | **Scaffold** | ~35 Python files (orchestrator, providers, services). **No `main.py`, no FastAPI app, no API routes.** |
| Prisma schema Qdrant field | **Schema only** | `NPC.memoryVectorId` implies vector DB; **no Qdrant client usage in Node API**. |
| Multiplayer / guilds | **Static UI** | Hardcoded "Elowen is online" card on dashboard. |
| Tests | **None found** | No test scripts in root workspaces. |

---

## Repository layout

```
lucid-ai-monorepo/
├── apps/
│   ├── web/                 # Next.js 16 frontend (package name: lucid-ai-admin)
│   ├── api/                 # Express + Prisma + Gemini backend (package name: lucid-ai-backend)
│   └── ai-service/          # Python/Poetry AI layer — NOT in npm workspaces, NOT runnable as-is
├── package.json             # npm workspaces: apps/* (only web + api participate)
└── node_modules/
```

### `apps/web` — Frontend

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind, Radix UI, Framer Motion, MapLibre, Three.js, Recharts, Zustand (installed, barely used).

**What runs:** `npm run dev` → http://localhost:3000

| Route | What it actually does |
|-------|------------------------|
| `/` | Marketing landing page with scroll-driven canvas animation |
| `/login`, `/signup` | Fake auth UI |
| `/dashboard` | Player hub; reads username from `localStorage`; shows mock worlds/quests/chapters |
| `/story/[id]` | Fake story generator UI with hardcoded prose |
| `/world`, `/world/[id]` | Map demo / mock world detail |
| `/characters`, `/characters/[id]` | NPC encyclopedia from mock data |
| `/quests`, `/inventory`, `/gallery`, `/timeline`, `/notifications` | Static or mock content |
| `/profile`, `/settings` | Profile form backed by `localStorage` |
| `/premium` | Pricing cards; upgrade button has no handler |
| `/admin` | Standalone admin dashboard (different design, dead nav links) |
| `/admin/users`, `/worlds`, `/logs`, `/reports`, `/analytics`, `/settings` | CRUD-ish UI on in-memory mock data |
| `/particles-demo`, `/etheral-demo` | Component showcase pages |

**Data sources:** Almost everything is `apps/web/lib/mockData.ts`, `mockPlayer.ts`, or inline arrays in page files. **Zero `fetch()` calls to the backend.**

**Dead code:** `apps/web/_legacy_routes/` — old TanStack Start file routes (excluded from TypeScript). `@tanstack/react-router` is a dependency but unused by the Next app.

### `apps/api` — Node backend

**Stack:** Express 4, Prisma 5, PostgreSQL, Google Gemini (`@google/genai`), ioredis, Stripe SDK.

**What runs:** `npm run dev` → defaults to **port 3000** (same as Next.js — you must set `PORT=3001` or similar).

**Live HTTP routes** (only these three groups):

| Method | Path | Behavior |
|--------|------|----------|
| `GET` | `/api/health` | Pings PostgreSQL via Prisma |
| `POST` | `/api/story/advance` | Loads User/World/NPC from DB → calls Gemini → updates world/NPC/story node in transaction → returns narrative + choices |
| `POST` | `/api/npc/converse` | Loads NPC/World → Gemini structured JSON dialogue → updates trust/anger → returns reply |
| * | everything else | `404` |

**Required env at startup:** `DATABASE_URL`, `GEMINI_API_KEY` (server exits if missing).

**Implemented but not exposed via HTTP:**

- Redis caching (`src/cache/*`)
- Stripe checkout + webhooks (`src/payments/*`)
- Pluggable AI providers (`src/ai/*` — story, image, voice, embedding, moderation)
- `src/index.ts` re-exports modules nothing imports

**Database models (Prisma):** `User`, `World`, `NPC`, `StoryNode`. No migrations folder verified in this doc — you need `prisma migrate dev` + manual seed data with matching UUIDs to hit the API.

**Model name used:** `gemini-3.5-flash` in controllers — verify this exists in Google's API; may need updating.

### `apps/ai-service` — Python backend (parallel, unfinished)

**Stack (declared):** Python 3.12, FastAPI, SQLAlchemy async, Qdrant, Redis, Celery, RabbitMQ, OpenAI/Anthropic/Gemini clients.

**What runs:** Nothing out of the box. There is **no `main.py`**, no FastAPI app instantiation, no route modules. Code is importable library structure only.

**Docker:** `docker-compose.yml` and `Dockerfile` exist for intended infra, but the service is not integrated with `apps/web` or `apps/api`.

---

## How to run (what actually works)

### Frontend only (recommended for demo)

```bash
cd apps/web
npm install   # or from repo root: npm install
npm run dev
```

Open http://localhost:3000

### Full stack (manual, untested end-to-end)

1. PostgreSQL running with `DATABASE_URL` in `apps/api/.env`
2. `cd apps/api && npx prisma migrate dev && npx prisma db seed` (no seed script confirmed — you may need to insert rows by hand)
3. Set `GEMINI_API_KEY` in `apps/api/.env`
4. Start API on a **non-3000 port:** `PORT=3001 npm run dev`
5. Start frontend: `cd apps/web && npm run dev`
6. Wire frontend yourself — **no API client exists today**

### Monorepo scripts (root)

```bash
npm run dev    # runs dev in ALL workspaces (web + api simultaneously — port conflict likely)
npm run build  # builds web + api
```

---

## Environment variables

### `apps/api/.env`

| Variable | Required | Used for |
|----------|----------|----------|
| `DATABASE_URL` | **Yes** (boot fails without it) | PostgreSQL / Prisma |
| `GEMINI_API_KEY` | **Yes** (boot fails without it) | Story + NPC controllers |
| `PORT` | No (default `3000`) | Express listen port |
| `REDIS_URL` | No | Cache modules (unused by routes) |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs | No | Payment modules (unmounted) |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, etc. | No | Alternate AI modules (unmounted) |

### `apps/web`

No `.env` required. No `NEXT_PUBLIC_API_URL` defined — confirms frontend/backend disconnect.

### `apps/ai-service/.env.example`

Exists for the Python stack; service not runnable without additional setup.

---

## Technical debt and inconsistencies

1. **Two backends, one frontend, zero integration.** Express API and Python ai-service overlap in purpose; neither talks to Next.js.
2. **Port collision.** Both `apps/web` and `apps/api` default to 3000.
3. **Two admin UIs.** `/admin` (Antigravity-style, self-contained) vs `/admin/users` etc. (Sidebar + Topbar + mock tables) — different design systems, duplicate sidebars on `/admin`.
4. **Auth is theater.** Player login = localStorage. Admin middleware disabled. `lib/auth.ts` demo login unused.
5. **Marketing lies vs code.** Landing page promises multiplayer, cinematics, creator studio, chapter limits — none implemented.
6. **World map uses real Earth cities**, not game biomes from mock data.
7. **Package naming confusion.** Frontend package `lucid-ai-admin` is the whole product UI, not admin-only.
8. **README in `apps/web` is wrong.** Claims redirect to `/admin` and working admin guard — neither is true.
9. **Duplicate UI files.** e.g. `components/ui/progress.tsx` and `progress (1).tsx`.
10. **No shared types** between frontend types (`apps/web/types/`) and Prisma schema — different shapes for World, NPC, User.
11. **`apps/ai-service` not in npm workspaces** — easy to forget it exists.
12. **CORS wide open** (`origin: "*"`) on API.

---

## Who this repo is for right now

- **Design / frontend demo:** Show investors or users what the product *could* look like.
- **Backend spike:** Test Gemini story branching and NPC dialogue against PostgreSQL if you POST manually (curl/Postman).
- **Not for:** Production deployment, real users, billing, multiplayer, or "AI that remembers everything" as advertised.

To become a real product, minimum work:

1. Single backend (pick Node or Python, delete or merge the other)
2. Auth (sessions/JWT, password hashing — Prisma `User.password` exists but no register/login routes)
3. Frontend API client connecting story/NPC/world flows
4. Remove or quarantine mock data paths
5. Mount payments, caching, rate limits — or delete dead code
6. One admin UI, real auth, real data
7. Align marketing copy with shipped features

---

## Quick reference: where things live

| Concern | Location |
|---------|----------|
| Mock player/world/NPC data | `apps/web/lib/mockData.ts`, `mockPlayer.ts` |
| Fake admin auth | `apps/web/lib/auth.ts`, `apps/web/middleware.ts` |
| Gemini story engine (used) | `apps/api/src/config/gemini.ts` |
| Gemini NPC chat (used) | `apps/api/src/controllers/npcController.ts` |
| Unused AI abstractions | `apps/api/src/ai/` |
| Unused payments | `apps/api/src/payments/` |
| Unused Redis cache | `apps/api/src/cache/` |
| DB schema | `apps/api/prisma/schema.prisma` |
| Python AI orchestrator | `apps/ai-service/app/ai/` |
| shadcn-style UI components | `apps/web/components/ui/` |
| Legacy TanStack routes | `apps/web/_legacy_routes/` (ignore) |

---

## License / status

Private monorepo (`"private": true`). Treat as internal prototype unless stated otherwise.
