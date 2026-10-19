import { pgSchema, text, timestamp, boolean, integer, uniqueIndex, jsonb, index } from 'drizzle-orm/pg-core'

export const apiSchema = pgSchema('api')
export const newlyMeta = apiSchema.table('_newly_meta', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  project_id: text('project_id').notNull(),
  env: text('env').notNull(),
  template_version: text('template_version').notNull(),
}, (t) => ({ projectIdx: index('_newly_meta_project_id_idx').on(t.project_id) }))
export const kvEntries = apiSchema.table('kv_entries', {
  key: text('key').primaryKey(), value: jsonb('value'), expires_at: timestamp('expires_at', { withTimezone: true }),
}, (t) => ({ expiresIdx: index('kv_entries_expires_at_idx').on(t.expires_at) }))
export const donors = apiSchema.table('sv_donors', {
  userID: text('user_id').primaryKey(),
  name: text('name').notNull(),
  bloodGroup: text('blood_group').notNull(),
  district: text('district').notNull(),
  available: boolean('available').notNull().default(true),
  consentAt: timestamp('consent_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})
export const units = apiSchema.table('sv_units', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  district: text('district').notNull(),
  address: text('address').notNull(),
  verified: boolean('verified').notNull().default(false),
})
export const memberships = apiSchema.table('sv_memberships', {
  userID: text('user_id').primaryKey(),
  unitID: text('unit_id').references(() => units.id, { onDelete: 'cascade' }),
  role: text('role').notNull().default('staff'),
})
export const appeals = apiSchema.table('sv_appeals', {
  id: text('id').primaryKey(),
  createdBy: text('created_by').notNull(),
  unitID: text('unit_id').references(() => units.id, { onDelete: 'cascade' }),
  unitName: text('unit_name').notNull(),
  district: text('district').notNull(),
  bloodGroup: text('blood_group').notNull(),
  urgency: text('urgency').notNull(),
  quantity: integer('quantity').notNull().default(1),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
})
export const responses = apiSchema.table('sv_responses', {
  id: text('id').primaryKey(),
  userID: text('user_id').notNull(),
  appealID: text('appeal_id').notNull().references(() => appeals.id, { onDelete: 'cascade' }),
  visitDay: text('visit_day').notNull(),
  status: text('status').notNull().default('interested'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
}, (t) => ({ donorAppeal: uniqueIndex('sv_donor_appeal').on(t.userID, t.appealID) }))
export const applications = apiSchema.table('sv_applications', {
  userID: text('user_id').primaryKey(),
  unitName: text('unit_name').notNull(),
  district: text('district').notNull(),
  address: text('address').notNull(),
  professionalEmail: text('professional_email').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
export const reports = apiSchema.table('sv_reports', {
  id: text('id').primaryKey(),
  userID: text('user_id').notNull(),
  appealID: text('appeal_id').notNull().references(() => appeals.id, { onDelete: 'cascade' }),
  reason: text('reason').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
})
