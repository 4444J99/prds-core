import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const documentSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['UCC Report', 'Enrichment', 'Compliance', 'Scoring']),
  prospectId: z.string().uuid(),
  size: z.string().optional(),
  status: z.enum(['ready', 'processing', 'failed']).default('processing')
)

export const documents = new Hono<{ Bindings: { DB: D1Database } }>()

documents.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT d.*, p.company_name FROM documents d
     JOIN prospects p ON d.prospect_id = p.id
     ORDER BY d.created_at DESC LIMIT 50`
  ).all()
  return c.json({ documents: results })
})

documents.get('/:id', async (c) => {
  const id = c.req.param('id')
  const doc = await c.env.DB.prepare('SELECT * FROM documents WHERE id = ?').bind(id).first()
  if (!doc) return c.json({ error: 'Not found' }, 404)
  return c.json({ document: doc })
})

documents.post('/', zValidator('json', documentSchema), async (c) => {
  const data = c.req.valid('json')
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    `INSERT INTO documents (id, name, type, prospect_id, size, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, data.name, data.type, data.prospectId, data.size ?? '', 'processing', now).run()

  // In production, trigger document generation async
  return c.json({ id, ...data, status: 'processing', created_at: now }, 201)
})

documents.get('/:id/download', async (c) => {
  // In production, return signed URL for R2 object
  return c.json({ url: `https://r2.example.com/documents/${c.req.param('id')}` })
})

documents.delete('/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM documents WHERE id = ?').bind(c.req.param('id')).run()
  return c.json({ success: true })
})