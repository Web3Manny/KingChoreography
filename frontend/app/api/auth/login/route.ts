import { NextRequest, NextResponse } from 'next/server'
import { createToken, checkAdminCredentials } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  if (!checkAdminCredentials(email, password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
  const token = await createToken(email, 'admin')
  return NextResponse.json({ token, email, role: 'admin', name: 'Brian King' })
}
