# King Choreography — Product Requirements Document

## Original Problem Statement
Build the King Choreography website from the GitHub repo Web3Manny/KingChoreography. Supabase project already created. Start with scaffold using TypeScript (adapted to React), Tailwind CSS, and shadcn/ui, then build Phase 1 in order listed in Build Phases section.

## Architecture
- **Frontend**: React (CRA) + react-router-dom + Tailwind CSS + shadcn/ui + framer-motion
- **Backend**: FastAPI (Python) with httpx for Supabase REST API calls
- **Database**: Supabase PostgreSQL (accessed via PostgREST REST API)
- **Auth**: JWT-based admin auth (hardcoded credentials for Phase 1)
- **Payments**: PayPal (MOCKED — placeholder endpoints)
- **Email**: Resend (MOCKED — console logging)
- **Storage**: Supabase Storage (placeholder — not yet connected)

## User Personas
1. **Gym Owner/Coach** — Browses services, submits applications for in-person choreography, submits routines for virtual review
2. **Brian King (Admin)** — Manages applications, reviews submissions, tracks queue/revenue, manages services

## Core Requirements
### Pricing (Static)
- Review & Feedback: Client $150 / Non-Client $250
- Consultation Add-on: $100
- Virtual Upgrade: Client 2hr $40/athlete, 4hr $80/athlete; Non-client 2hr $60/athlete, 4hr $120/athlete

### Database Tables
- profiles, services, applications, submissions, submission_files, review_weeks, notifications

## What's Been Implemented (Phase 1) — March 9, 2026

### Public Pages (10 pages)
- Home (hero, services, testimonials, CTA)
- About (Brian King bio, credentials, past clients)
- Services (in-person + virtual overview)
- Choreography (in-person deep-dive)
- Reviews & Feedback (pricing, includes, CTA)
- Virtual Upgrades (pricing table, how it works)
- Monthly Reviews (tier cards — placeholder for Phase 2)
- Testimonials (6 testimonials grid)
- FAQ (accordion by category)
- Contact (form + contact info)

### Application Funnel
- /apply — Multi-section form (program info, services, team levels, timing)
- /apply/confirmed — Confirmation with summary

### Submission Funnel
- /submit — 5-step multi-step form (Service → Contact → Details → Video → Payment)
- /submit/confirmed — Confirmation with review week assignment
- Server-side price calculation
- Conditional fields (session length for virtual upgrade, consultation addon for review)
- Free Tier flow (client-only, $0, no queue)

### Admin Dashboard
- /admin/login — JWT login
- /admin — Dashboard with stats cards, quick links, recent activity
- /admin/applications — List + search/filter
- /admin/applications/:id — Detail + status update + notes
- /admin/queue — Weekly review queue with capacity bar
- /admin/submissions — List + search/filter
- /admin/submissions/:id — Detail + review status + complete + notes
- /admin/services — CRUD with modal form

### Backend
- All API routes with Supabase REST API integration
- Server-side price calculation engine
- Review week assignment logic
- JWT auth for admin routes
- Mock PayPal payment flow
- Mock email notifications

## Styling Update — March 9, 2026
- Integrated actual BK Logo (TRSP.png) throughout: header, footer, hero, admin sidebar, admin login
- Updated color palette to match logo: metallic gold gradients (#B8860B → #D4AF37 → #FFD700), silver accents (#A8A9AD), charcoal backgrounds
- Added badge-card styling with gold top-line accents (inspired by logo's shield/badge shape)
- Added btn-gold class with metallic gradient matching logo's crown
- Silver/gray navigation text matching logo's premium tone
- Gold gradient dividers matching logo borders
- Gold glow hover effects on interactive cards

## Testing Status
- Backend: 100% (10/10 tests passing including stats fix)
- Frontend: 100% (all core flows working)

## Prioritized Backlog

### P0 — Remaining Phase 1
- [ ] Supabase Storage integration for video file upload
- [ ] PayPal sandbox integration (replace mocks)
- [ ] Resend email integration (replace mocks)

### P1 — Phase 2
- [ ] Monthly subscription billing (Stripe or PayPal recurring)
- [ ] Supabase Auth for admin (replace hardcoded credentials)
- [ ] Row Level Security policies on database
- [ ] Review feedback delivery system
- [ ] Client portal (view submission status)

### P2 — Phase 3+
- [ ] Brian's logo and brand photos integration
- [ ] SEO + meta tags + Open Graph
- [ ] Analytics (Google Analytics / PostHog)
- [ ] Instagram feed widget
- [ ] Mobile app (PWA)

## Next Tasks
1. Integrate real PayPal sandbox for payment processing
2. Set up Supabase Storage buckets for video uploads
3. Integrate Resend for email notifications
4. Add Brian's actual logo/photos
5. SEO optimization and meta tags
