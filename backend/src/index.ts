import { desc, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { db } from './db'
import { tickets } from './db/schema'

const app = new Hono()

app.use('/*', cors())

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.get('/api/tickets', async (c) => {
  const result = await db.select().from(tickets).orderBy(desc(tickets.createdAt))
  return c.json(result)
})

app.get('/api/tickets/:id', async (c) => {
  const id = Number(c.req.param('id'))

  if (!Number.isFinite(id)) return c.json({ error: 'Invalid ticket id' }, 400)

  const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id))

  if (!ticket) return c.json({ error: 'Ticket not found' }, 404)
  return c.json(ticket)
})

app.post('/api/tickets', async (c) => {
  const body = await c.req.json()

  const [ticket] = await db
    .insert(tickets)
    .values({
      event: String(body.event || 'New Event'),
      date: String(body.date || 'Fri • Jun 05, 2026 • 8:00 PM'),
      venue: String(body.venue || 'Lenovo Center'),
      section: String(body.section || 'TBD'),
      row: String(body.row || 'TBD'),
      seat: String(body.seat || '1'),
      type: String(body.type || 'Adult'),
      notes: String(body.notes || ''),
      imageUrl: String(body.imageUrl || ''),
    })
    .returning()

  return c.json(ticket, 201)
})

app.put('/api/tickets/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const body = await c.req.json()

  if (!Number.isFinite(id)) return c.json({ error: 'Invalid ticket id' }, 400)

  const [ticket] = await db
    .update(tickets)
    .set({
      event: String(body.event || 'New Event'),
      date: String(body.date || 'Fri • Jun 05, 2026 • 8:00 PM'),
      venue: String(body.venue || 'Lenovo Center'),
      section: String(body.section || 'TBD'),
      row: String(body.row || 'TBD'),
      seat: String(body.seat || '1'),
      type: String(body.type || 'Adult'),
      notes: String(body.notes || ''),
      imageUrl: String(body.imageUrl || ''),
    })
    .where(eq(tickets.id, id))
    .returning()

  if (!ticket) return c.json({ error: 'Ticket not found' }, 404)
  return c.json(ticket)
})

app.delete('/api/tickets/:id', async (c) => {
  const id = Number(c.req.param('id'))

  if (!Number.isFinite(id)) return c.json({ error: 'Invalid ticket id' }, 400)

  const [ticket] = await db.delete(tickets).where(eq(tickets.id, id)).returning()

  if (!ticket) return c.json({ error: 'Ticket not found' }, 404)
  return c.json({ success: true })
})

export default {
  port: 4000,
  fetch: app.fetch,
}
