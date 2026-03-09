import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { supabaseGet } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [apps, subs] = await Promise.all([
    supabaseGet('applications', 'order=submitted_at.desc&limit=5').catch(() => []),
    supabaseGet('submissions', 'order=submitted_at.desc&limit=5').catch(() => []),
  ])

  const activity: any[] = []
  for (const a of apps) {
    activity.push({ type: 'application', id: a.id, title: `New application from ${a.gym_name}`, subtitle: a.contact_name, status: a.status, timestamp: a.submitted_at })
  }
  for (const s of subs) {
    activity.push({ type: 'submission', id: s.id, title: `Submission from ${s.gym_name}`, subtitle: `${s.service_type} - $${s.calculated_amount}`, status: s.review_status, timestamp: s.submitted_at })
  }
  activity.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''))
  return NextResponse.json(activity.slice(0, 10))
}
