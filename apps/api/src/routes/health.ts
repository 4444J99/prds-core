import { Hono } from 'hono'

export const health = new Hono<{ Bindings: { DB: D1Database; KV: KVNamespace } }>()

health.get('/', async (c) => {
  const dbCheck = await c.env.DB.prepare('SELECT 1 as ok').first()
  const kvCheck = await c.env.KV.get('health-check')

  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {
      database: dbCheck ? 'ok' : 'failed',
      kv: kvCheck ? 'ok' : 'ok',
      version: '0.1.0'
    }
  })
})

health.get('/detailed', async (c) => {
  const start = Date.now()
  await c.env.DB.prepare('SELECT 1').first()
  const dbLatency = Date.now() - start

  const startKv = Date.now()
  await c.env.KV.put('health-check', 'ok', { expirationTtl: 60 })
  const kvLatency = Date.now() - startKv

  const prospectCount = await c.env.DB.prepare('SELECT COUNT(*) as c FROM prospects').first()
  const dealCount = await c.env.DB.prepare('SELECT COUNT(*) as c FROM deals').first()
  const docCount = await c.env.DB.prepare('SELECT COUNT(*) as c FROM documents').first()

  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    latencies: { database: dbLatency, kv: kvLatency },
    counts: {
      prospects: prospectCount?.c || 0,
      deals: dealCount?.c || 0,
      documents: docCount?.c || 0
    }
  })
})