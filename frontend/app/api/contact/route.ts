import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  console.log(`[EMAIL MOCK] Contact from ${body.name} (${body.email}): ${body.subject}`)
  return NextResponse.json({ status: 'sent', message: 'Your message has been sent.' })
}
