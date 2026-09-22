import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { prospects } from './routes/prospects'
import { deals } from './routes/deals'
import { documents } from './routes/documents'
import { auth } from './routes/auth'
import { health } from './routes/health'

type Bindings = {
  DB: D1Database
  KV: KVNamespace
  PRDS_ENGINE_API: string
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('*', cors({
  origin: ['https://prds-core.pages.dev', 'https://prds.dev', 'http://localhost:5173'],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))

// Public routes
app.route('/auth', auth)
app.route('/health', health)

// Protected routes
app.use('/api/*', jwt({
  secret: (c) => c.env.JWT_SECRET
}))

app.route('/api/prospects', prospects)
app.route('/api/deals', deals)
app.route('/api/documents', documents)

app.get('/', (c) => c.json({ name: 'PRDS Core API', version: '0.1.0' }))

export default app