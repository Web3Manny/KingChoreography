import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { supabaseGet } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let week = request.nextUrl.searchParams.get('week')
  if (!week) {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(now)
    monday.setDate(diff)
    monday.setHours(0, 0, 0, 0)
    week = monday.toISOString().split('T')[0]
  }

  const [submissions, weekData] = await Promise.all([
    supabaseGet('submissions', `review_week=eq.${week}&order=submitted_at.asc`).catch(() => []),
    supabaseGet('review_weeks', `week_start=eq.${week}`).catch(() => []),
  ])

  return NextResponse.json({
    week: weekData[0] || { week_start: week, capacity: 20, current_count: submissions.length },
    submissions,
  })
}
