import * as jose from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'king-choreography-jwt-secret-2025'
)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'brian@kingchoreography.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'KingChoreography2025!'

export async function createToken(email: string, role: string) {
  return await new jose.SignJWT({ email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET)
    return payload as { email: string; role: string }
  } catch {
    return null
  }
}

export async function verifyAdmin(request: Request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const payload = await verifyToken(auth.slice(7))
  if (!payload || payload.role !== 'admin') return null
  return payload
}

export function checkAdminCredentials(email: string, password: string) {
  return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}
