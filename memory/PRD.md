# King Choreography - Product Requirements Document

## Original Problem Statement
Build a premium, user-friendly web platform for Brian King's choreography clients ("King Choreography"). The platform provides in-person choreography booking, virtual routine reviews, and an admin dashboard for managing the business.

## Tech Stack
- **Frontend & Backend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, framer-motion
- **API**: Next.js API Routes (all business logic in TypeScript)
- **Database**: Supabase (PostgreSQL via REST API)
- **Authentication**: JWT-based admin auth (jose library)
- **Deployment Target**: Vercel (single Next.js project)
- **Preview Environment**: FastAPI reverse proxy on port 8001 forwards /api/* to Next.js on port 3000

## Architecture (Monolithic Next.js)
```
/app/frontend/          — Single Next.js project (frontend + API)
├── app/
│   ├── (public)/       — Public pages with Header/Footer layout
│   │   ├── page.tsx    — Home
│   │   ├── about/
│   │   ├── services/
│   │   ├── apply/      — Application funnel + /apply/confirmed
│   │   ├── submit/     — Submission funnel (5-step) + /submit/confirmed
│   │   ├── choreography/
│   │   ├── reviews/
│   │   ├── upgrades/
│   │   ├── monthly/
│   │   ├── testimonials/
│   │   ├── faq/
│   │   └── contact/
│   ├── admin/          — Admin dashboard (JWT protected)
│   │   ├── login/
│   │   ├── applications/ + [id] detail
│   │   ├── submissions/ + [id] detail
│   │   ├── queue/
│   │   └── services/
│   └── api/            — ALL backend logic (TypeScript)
│       ├── services/
│       ├── applications/
│       ├── submissions/ + /free
│       ├── calculate-price/
│       ├── auth/ (login, me)
│       ├── contact/
│       ├── payments/ (create-order, capture-order) [MOCKED]
│       └── admin/ (stats, applications, submissions, queue, services, recent-activity)
├── components/
│   ├── layout/         — Header, Footer
│   └── ui/             — shadcn/ui components
├── lib/
│   ├── api.ts          — Frontend API client (relative fetch)
│   ├── supabase.ts     — Supabase REST helpers (server-side)
│   ├── auth.ts         — JWT token creation/verification
│   ├── pricing.ts      — Pricing engine + review week assignment
│   └── utils.ts        — Tailwind merge utility
└── .env.local          — Supabase credentials, admin config

/app/backend/server.py  — Thin reverse proxy (preview env only, not needed on Vercel)
```

## Core Features (Phase 1) — COMPLETED
- [x] 10+ public pages (Home, About, Services, Choreography, Reviews, Upgrades, Monthly, Testimonials, FAQ, Contact)
- [x] Application funnel — multi-field form for new client applications
- [x] Submission funnel — 5-step form (Service → Contact → Details → Video → Payment)
- [x] Dynamic pricing engine (client/non-client rates, athlete count, session length, add-ons)
- [x] Review week assignment logic (Monday cutoff)
- [x] Admin dashboard with stats, quick links, recent activity
- [x] Admin CRUD for applications, submissions, services
- [x] Admin review queue view
- [x] JWT authentication for admin
- [x] All API logic in Next.js API routes (TypeScript)
- [x] Dark theme with gold (#D4AF37) and silver (#A8A9AD) accents

## Phase 2 — FUTURE
- [ ] Monthly Reviews Subscription functionality
- [ ] Real PayPal integration (currently MOCKED)
- [ ] Real Resend email integration (currently MOCKED)
- [ ] Clean up old /frontend/src/ React source files

## Credentials
- **Admin**: brian@kingchoreography.com / KingChoreography2025!
- **Supabase URL**: https://frwldthcljuncpjxpefi.supabase.co
- **Preview URL**: https://king-choreo-next.preview.emergentagent.com

## Testing Status
- **iteration_2.json**: 14/14 frontend tests passed
- **iteration_3.json**: 22/22 backend+frontend tests passed (all API routes verified)
