import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const dealSchema = z.object({
  prospectId: z.string().uuid(),
  stage: z.enum(['qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']),
  amount: z.string(),
  probability: z.number().min(0).max(100),
  owner: z.string().optional()
})

export const deals = new Hono<{ Bindings: { DB: D1Database } }>()

deals.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT d.*, p.company_name FROM deals d
     JOIN prospects p ON d.prospect_id = p.id
     ORDER BY d.created_at DESC`
  ).all()
  return c.json({ deals: results })
})

deals.get('/:id', async (c) => {
  const id = c.req.param('id')
  const deal = await c.env.DB.prepare('SELECT * FROM deals WHERE id = ?').bind(id).first()
  if (!deal) return c.json({ error: 'Not found' }, 404)
  return c.json({ deal })
})

deals.post('/', zValidator('json', dealSchema), async (c) => {
  const data = c.req.valid('json')
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    `INSERT INTO deals (id, prospect_id, stage, amount, probability, owner, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, data.prospectId, data.stage, data.amount, data.probability, data.owner ?? '', now, now).run()

  return c.json({ id, ...data, created_at: now }, 201)
})

deals.put('/:id', zValidator('json', dealSchema.partial()), async (c) => {
  const data = c.req.valid('json')
  const updates: string[] = []
  const bindings: any[] = []

  if (data.stage) { updates.push('stage = ?'); bindings.push(data.stage) }
  if (data.amount) { updates.push('amount = ?'); bindings.push(data.amount) }
  if (data.probability !== undefined) { updates.push('probability = ?'); bindings.push(data.probability) }
  if (data.owner !== undefined) { updates.push('owner = ?'); bindings.push(data.owner) }

  if (updates.length > 0) {
    updates.push('updated_at = ?')
    bindings.push(new Date().toISOString())
    bindings.push(c.req.param('id'))
    await c.env.DB.prepare(`UPDATE deals SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run()
  }

  return c.json({ success: true })
})

deals.delete('/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM deals WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})