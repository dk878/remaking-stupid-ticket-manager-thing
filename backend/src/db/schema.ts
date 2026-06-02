import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  event: text('event').notNull(),
  date: text('date').notNull(),
  venue: text('venue').notNull(),
  section: text('section').notNull(),
  row: text('row').notNull(),
  seat: text('seat').notNull(),
  type: text('type').notNull(),
  notes: text('notes').notNull().default(''),
  imageUrl: text('image_url').notNull().default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
