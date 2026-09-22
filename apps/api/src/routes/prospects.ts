import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const prospectSchema = z.object({
  company: z.string().min(1),
  state: z.string().length(2),
  industry: z.string().optional(),
  employeeCount: z.number().optional(),
  revenueEstimate: z.string().optional()
})

const querySchema = z.object({
  state: z.string().length(2).optional(),
  status: z.enum(['qualified', 'review', 'disqualified']).optional(),
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0)
})

export const prospects = new Hono<{ Bindings: { DB: D1Database } }>()

prospects.get('/', zValidator('query', querySchema), async (c) => {
  const { state, status, limit, offset } = c.req.valid('query')

  let query = 'SELECT * FROM prospects WHERE 1=1'
  const bindings: any[] = []

  if (state) {
    query += ' AND state = ?'
    bindings.push(state)
  }
  if (status) {
    query += ' AND status = ?'
    bindings.push(status)
  }

  query += ' ORDER BY updated_at DESC LIMIT ? OFFSET ?'
  bindings.push(limit, offset)

  const { results } = await c.env.DB.prepare(query).bind(...bindings).all()

  return c.json({ prospects: results, pagination: { limit, offset, total: results.length } })
})

prospects.get('/:id', async (c) => {
  const id = c.req.param('id')
  const prospect = await c.env.DB.prepare('SELECT * FROM prospects WHERE id = ?').bind(id).first()

  if (!prospect) {
    return c.json({ error: 'Not found' }, 404)
  }

  // Get filings
  const filings = await c.env.DB.prepare(
    `SELECT uf.* FROM ucc_filings uf
     JOIN prospect_ucc_filings puf ON uf.id = puf.ucc_filing_id
     WHERE puf.prospect_id = ?
     ORDER BY uf.filing_date DESC`
  ).bind(id).all()

  // Get enrichment
  const enrichments = await c.env.DB.prepare(
    `SELECT * FROM enrichment_results WHERE prospect_id = ? ORDER BY completed_at DESC`
  ).bind(id).all()

  // Get scoring history
  const scores = await c.env.DB.prepare(
    `SELECT * FROM health_scores WHERE prospect_id = ? ORDER BY recorded_at DESC LIMIT 10`
  ).bind(id).all()

  return c.json({
    prospect: { ...prospect, filings: filings.results, enrichments: enrichments.results, scoreHistory: scores.results }
  })
})

prospects.post('/', zValidator('json', prospectSchema), async (c) => {
  const data = c.req.valid('json')
  const id = crypto.randomUUID()
  const now = new Date().toISOString()

  await c.env.DB.prepare(
    `INSERT INTO prospects (id, company_name, company_name_normalized, state, industry, employee_count, revenue_estimate, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'review', ?, ?)`
  ).bind(id, data.company, data.company.toLowerCase().trim(), data.state, data.industry ?? '', data.employeeCount ?? 0, data.revenueEstimate ?? '', now, now).run()

  return c.json({ id, ...data, status: 'review', created_at: now, updated_at: now }, 201)
})

prospects.put('/:id', zValidator('json', prospectSchema.partial()), async (c) => {
  const data = c.req.valid('json')
  const updates: string[] = []
  const bindings: any[] = []

  if (data.company) { updates.push('company_name = ?'); bindings.push(data.company); updates.push('company_name_normalized = ?'); bindings.push(data.company.toLowerCase().trim()) }
  if (data.state) { updates.push('state = ?'); bindings.push(data.state) }
  if (data.industry !== undefined) { updates.push('industry = ?'); bindings.push(data.industry) }
  if (data.employeeCount !== undefined) { updates.push('employee_count = ?'); bindings.push(data.employeeCount) }
  if (data.revenueEstimate !== undefined) { updates.push('revenue_estimate = ?'); bindings.push(data.revenueEstimate) }

  if (updates.length > 0) {
    updates.push('updated_at = ?')
    bindings.push(new Date().toISOString())
    bindings.push(c.req.param('id'))

    await c.env.DB.prepare(`UPDATE prospects SET ${updates.join(', ')} WHERE id = ?`).bind(...bindings).run()
  }

  return c.json({ success: true })
})

prospects.post('/:id/score', async (c) => {
  // Trigger scoring via prds-engine
  return c.json({ success: true, message: 'Scoring triggered' })
})

prospects.post('/:id/enrich', async (c) => {
  // Trigger enrichment
  return c.json({ success: true, message: 'Enrichment triggered' })
})

prospects.get('/export', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM prospects').all()
  return c.json({ prospects: results })
})