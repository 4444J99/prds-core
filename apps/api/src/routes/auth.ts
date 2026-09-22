import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { SignJWT, jwtVerify } from 'jose'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  company: z.string().optional()
})

export const auth = new Hono<{ Bindings: { DB: D1Database; KV: KVNamespace; JWT_SECRET: string } }>()

auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json')

  // In production, verify against hashed password in DB
  const user = await c.env.DB.prepare(
    `SELECT id, email, name, tier, organization_id FROM users WHERE email = ?`
  ).bind(email).first()

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Verify password (mock for now)
  if (password.length < 8) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const secret = new TextEncoder().encode(c.env.JWT_SECRET)
  const token = await new SignJWT({
    sub: user.id,
    email: user.email,
    name: user.name,
    tier: user.tier,
    organizationId: user.organizationId
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  return c.json({ token, user })
})

auth.post('/signup', zValidator('json', signupSchema), async (c) => {
  const { email, password, name, company } = c.req.valid('json')

  const existing = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (existing) {
    return c.json({ error: 'Email already registered' }, 400)
  }

  if (password.length < 8) {
    return c.json({ error: 'Password must be at least 8 characters' }, 400)
  }

  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  // In production, hash password with bcrypt
  await c.env.DB.prepare(
    `INSERT INTO users (id, email, name, company, password_hash, tier, organization_id, created_at)
     VALUES (?, ?, ?, ?, ?, 'free', ?, ?)`
  ).bind(id, email, name, company ?? '', 'hashed_' + password, crypto.randomUUID(), now).run()

  const secret = new TextEncoder().encode(c.env.JWT_SECRET)
  const token = await new SignJWT({
    sub: id,
    email,
    name,
    tier: 'free',
    organizationId: crypto.randomUUID()
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)

  return c.json({ token, user: { id, email, name, tier: 'free', organizationId: crypto.randomUUID() } }, 201)
})

auth.post('/refresh', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing token' }, 401)
  }

  const token = authHeader.slice(7)
  const secret = new TextEncoder().encode(c.env.JWT_SECRET)

  try {
    const { payload } = await jwtVerify(token, secret, { issuer: 'prds-core' })
    const newToken = await new SignJWT({
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      tier: payload.tier,
      organizationId: payload.organizationId
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    return c.json({ token })
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ error: 'Missing token' }, 401)
  }

  const token = authHeader.slice(7)
  const secret = new TextEncoder().encode(c.env.JWT_SECRET)

  try {
    const { payload } = await jwtVerify(token, secret, { issuer: 'prds-core' })
    return c.json({ user: payload })
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

auth.post('/logout', (c) => {
  // In production, add token to blocklist in KV
  return c.json({ success: true })
})