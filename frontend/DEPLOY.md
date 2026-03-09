# Vercel Deployment Guide — King Choreography

## Quick Deploy

1. **Push to GitHub** (use the "Save to Github" button in Emergent)
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Set **Root Directory** to `frontend`
4. Vercel auto-detects Next.js — click **Deploy**

## Environment Variables

Add these in **Vercel → Project Settings → Environment Variables**:

| Variable | Value | Scope |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://frwldthcljuncpjxpefi.supabase.co` | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_nehyEWf7wxUamLMZp7_MCA_1zkzXrqy` | All |
| `SUPABASE_URL` | `https://frwldthcljuncpjxpefi.supabase.co` | All |
| `SUPABASE_SERVICE_KEY` | `sb_secret_3MXNjdYyAqM_lczyr7fptA_5Ol9bcLC` | All |
| `SUPABASE_ANON_KEY` | `sb_publishable_nehyEWf7wxUamLMZp7_MCA_1zkzXrqy` | All |
| `ADMIN_EMAIL` | `brian@kingchoreography.com` | All |
| `ADMIN_PASSWORD` | *(your admin password)* | All |
| `JWT_SECRET` | *(generate a strong random string)* | All |

> **Tip:** For production, generate a new `JWT_SECRET` with `openssl rand -base64 32`

## Custom Domain

1. Vercel → Project Settings → Domains
2. Add `kingchoreography.com` (or your domain)
3. Update DNS records as instructed by Vercel

## What Deploys

Everything is in the `frontend/` directory — a single Next.js project:
- **Pages**: App Router at `app/(public)/` and `app/admin/`
- **API Routes**: All backend logic at `app/api/` (no separate backend needed)
- **Database**: Supabase (external, no infra to manage)

No FastAPI, no Python, no second server. One project, one deploy.
