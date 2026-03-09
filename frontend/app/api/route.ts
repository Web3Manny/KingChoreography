import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'King Choreography API', status: 'running' })
}
