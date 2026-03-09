import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { supabaseGet } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString().split('.')[0]
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('.')[0]

  const [apps, subs, paid, queued] = await Promise.all([
    supabaseGet('applications', `submitted_at=gte.${weekAgo}&select=id`).catch(() => []),
    supabaseGet('submissions', `submitted_at=gte.${weekAgo}&select=id`).catch(() => []),
    supabaseGet('submissions', `payment_status=eq.paid&submitted_at=gte.${monthStart}&select=calculated_amount`).catch(() => []),
    supabaseGet('submissions', `review_status=eq.queued&select=id`).catch(() => []),
  ])

  const revenue = paid.reduce((s: number, r: any) => s + parseFloat(r.calculated_amount || 0), 0)
  return NextResponse.json({
    applications_this_week: apps.length,
    submissions_this_week: subs.length,
    revenue_this_month: Math.round(revenue * 100) / 100,
    queue_depth: queued.length,
  })
}
