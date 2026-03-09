import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { supabaseGet, supabasePatch } from '@/lib/supabase'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const data = await supabaseGet('submissions', `id=eq.${id}`)
  if (!data.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const submission = data[0]
  submission.files = await supabaseGet('submission_files', `submission_id=eq.${id}`).catch(() => [])
  return NextResponse.json(submission)
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin(request)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  body.updated_at = new Date().toISOString()
  if (body.review_status === 'completed') body.completed_at = new Date().toISOString()
  const result = await supabasePatch('submissions', `id=eq.${id}`, body)
  return NextResponse.json(result[0] || body)
}
