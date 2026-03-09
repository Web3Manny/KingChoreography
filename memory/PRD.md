# King Choreography - Product Requirements Document

## Original Problem Statement
Build a premium, user-friendly web platform for Brian King's choreography clients ("King Choreography"). The platform provides in-person choreography booking, virtual routine reviews, and an admin dashboard for managing the business.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, framer-motion
- **Backend**: FastAPI (Python) on port 8001, serving API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT-based admin auth
- **Deployment Target**: Vercel (single Next.js project) — currently running in preview environment with separate frontend/backend

## Architecture
```
/app/frontend/          — Next.js 16 app (port 3000)
├── app/
│   ├── (public)/       — Public pages with Header/Footer layout
│   │   ├── page.tsx    — Home
│   │   ├── about/
│   │   ├── services/
│   │   ├── apply/      — Application funnel
│   │   ├── submit/     — Submission funnel (5-step)
│   │   ├── choreography/
│   │   ├── reviews/
│   │   ├── upgrades/
│   │   ├── monthly/
│   │   ├── testimonials/
│   │   ├── faq/
│   │   └── contact/
│   ├── admin/          — Admin dashboard (JWT protected)
│   │   ├── login/
│   │   ├── applications/
│   │   ├── submissions/
│   │   ├── queue/
│   │   └── services/
│   └── api/            — Next.js API routes (for Vercel deployment)
├── components/
│   ├── layout/         — Header, Footer
│   └── ui/             — shadcn/ui components
├── lib/                — Utilities (api client, auth, pricing, supabase)
└── .env.local          — Supabase credentials

/app/backend/           — FastAPI backend (port 8001, handles /api in preview)
```

## User Personas
1. **Gym Owners/Coaches** — Apply for choreography, submit routines for review
2. **Brian King (Admin)** — Manage applications, review queue, services, submissions

## Core Features (Phase 1) — COMPLETED
- [x] 10+ public pages (Home, About, Services, Choreography, Reviews, Upgrades, Monthly, Testimonials, FAQ, Contact)
- [x] Application funnel — multi-field form for new client applications
- [x] Submission funnel — 5-step form (Service → Contact → Details → Video → Payment)
- [x] Dynamic pricing engine (client/non-client rates, athlete count, session length, add-ons)
- [x] Admin dashboard with stats, quick links, recent activity
- [x] Admin applications management (list, detail, status updates, notes)
- [x] Admin submissions management (list, detail, status updates, queue)
- [x] Admin services CRUD
- [x] Review week assignment logic
- [x] Dark theme with gold (#D4AF37) and silver (#A8A9AD) accents
- [x] Responsive design with mobile navigation

## Phase 2 — FUTURE
- [ ] Monthly Reviews Subscription functionality
- [ ] Real PayPal integration (currently MOCKED)
- [ ] Real Resend email integration (currently MOCKED)

## Credentials
- **Admin**: brian@kingchoreography.com / KingChoreography2025!
- **Supabase URL**: https://frwldthcljuncpjxpefi.supabase.co
- **Preview URL**: https://king-choreo-next.preview.emergentagent.com

## What's Been Implemented (Feb 2026)
- Complete Next.js migration from React/FastAPI dual-project to Next.js frontend + FastAPI backend
- All 10+ public pages ported to Next.js App Router
- Application and Submission funnels fully functional
- Admin dashboard with authentication, application/submission management
- API client updated for Next.js architecture
- All tests passing (14/14 in iteration_2.json)
