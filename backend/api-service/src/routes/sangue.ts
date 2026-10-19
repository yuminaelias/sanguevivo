import { Hono } from 'hono'
import { and, desc, eq, gt, inArray } from 'drizzle-orm'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { createDb } from '../db/client'
import { donors, units, memberships, appeals, responses, applications, reports } from '../db/schema'
import { authMiddleware } from '../middleware/auth'
import type { HonoEnv } from '../env'

const groups = z.enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Não sei'])
const district = z.string().trim().min(2).max(80)
const short = z.string().trim().min(2).max(140)
export const sangueRoutes = new Hono<HonoEnv>()

sangueRoutes.get('/v1/appeals', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const rows = await db.select({ appeal: appeals, address: units.address }).from(appeals)
    .innerJoin(units, eq(appeals.unitID, units.id))
    .where(and(eq(appeals.status, 'published'), eq(units.verified, true), gt(appeals.expiresAt, new Date())))
    .orderBy(desc(appeals.createdAt)).limit(100)
  return c.json(rows.map(({ appeal, address }) => ({ ...appeal, createdBy: undefined, address })))
})
sangueRoutes.use('/v1/private/*', authMiddleware)
sangueRoutes.get('/v1/private/dashboard', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const userID = c.get('userId')
  const [profile] = await db.select().from(donors).where(eq(donors.userID, userID))
  const [membership] = await db.select().from(memberships).where(eq(memberships.userID, userID))
  const [application] = await db.select().from(applications).where(eq(applications.userID, userID))
  const mine = await db.select().from(appeals).where(eq(appeals.createdBy, userID)).orderBy(desc(appeals.createdAt))
  const visits = await db.select({ response: responses, appeal: appeals }).from(responses)
    .innerJoin(appeals, eq(responses.appealID, appeals.id)).where(eq(responses.userID, userID)).orderBy(desc(responses.createdAt))
  return c.json({ profile: profile ?? null, membership: membership ?? null, application: application ?? null, appeals: mine, visits })
})
sangueRoutes.put('/v1/private/donor', zValidator('json', z.object({ name: short, bloodGroup: groups, district, available: z.boolean(), consent: z.literal(true), adult: z.literal(true) })), async (c) => {
  const data = c.req.valid('json')
  const db = createDb(c.env.DATABASE_URL)
  const values = { userID: c.get('userId'), name: data.name, bloodGroup: data.bloodGroup, district: data.district, available: data.available }
  const [profile] = await db.insert(donors).values(values).onConflictDoUpdate({ target: donors.userID, set: { ...values, updatedAt: new Date() } }).returning()
  return c.json(profile)
})
sangueRoutes.delete('/v1/private/donor', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  await db.delete(responses).where(eq(responses.userID, c.get('userId')))
  await db.delete(donors).where(eq(donors.userID, c.get('userId')))
  return c.json({ ok: true })
})
sangueRoutes.post('/v1/private/appeals', zValidator('json', z.object({ unitName: short, district, bloodGroup: groups.exclude(['Não sei']), urgency: z.enum(['Urgente', 'Prioritário', 'Regular']), quantity: z.number().int().min(1).max(50) })), async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const data = c.req.valid('json')
  const existing = await db.select().from(appeals).where(and(eq(appeals.createdBy, c.get('userId')), eq(appeals.unitName, data.unitName), eq(appeals.bloodGroup, data.bloodGroup), inArray(appeals.status, ['pending', 'published']), gt(appeals.expiresAt, new Date())))
  if (existing.length) return c.json({ error: 'Já comunicou um pedido igual. Acompanhe-o na Actividade.' }, 409)
  const [row] = await db.insert(appeals).values({ id: crypto.randomUUID(), createdBy: c.get('userId'), ...data, expiresAt: new Date(Date.now() + 7 * 86400000) }).returning()
  return c.json(row, 201)
})
sangueRoutes.patch('/v1/private/appeals/:id/cancel', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const [row] = await db.update(appeals).set({ status: 'cancelled' }).where(and(eq(appeals.id, c.req.param('id')), eq(appeals.createdBy, c.get('userId')), inArray(appeals.status, ['pending', 'published']))).returning()
  if (!row) return c.json({ error: 'Pedido não encontrado ou já encerrado.' }, 404)
  return c.json(row)
})
sangueRoutes.post('/v1/private/responses', zValidator('json', z.object({ appealID: z.string().uuid(), visitDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) })), async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const { appealID, visitDay } = c.req.valid('json')
  const [profile] = await db.select().from(donors).where(eq(donors.userID, c.get('userId')))
  if (!profile?.available) return c.json({ error: 'Active a disponibilidade no seu perfil antes de responder.' }, 400)
  const [need] = await db.select({ appeal: appeals, verified: units.verified }).from(appeals).innerJoin(units, eq(appeals.unitID, units.id)).where(eq(appeals.id, appealID))
  if (!need?.verified || need.appeal.status !== 'published' || need.appeal.expiresAt <= new Date()) return c.json({ error: 'Este pedido já não está activo.' }, 400)
  if (profile.bloodGroup !== need.appeal.bloodGroup) return c.json({ error: 'O grupo declarado não corresponde ao grupo solicitado. Contacte a unidade para orientação.' }, 400)
  const chosen = new Date(`${visitDay}T12:00:00Z`)
  if (Number.isNaN(chosen.getTime()) || chosen < new Date(Date.now() - 86400000) || chosen > need.appeal.expiresAt) return c.json({ error: 'Escolha um dia dentro da validade do pedido.' }, 400)
  const [existing] = await db.select().from(responses).where(and(eq(responses.userID, c.get('userId')), eq(responses.appealID, appealID)))
  if (existing && existing.status !== 'cancelled') return c.json({ error: 'Já respondeu a este pedido. Consulte a Actividade.' }, 409)
  const [row] = await db.insert(responses).values({ id: crypto.randomUUID(), userID: c.get('userId'), appealID, visitDay }).onConflictDoUpdate({ target: [responses.userID, responses.appealID], set: { visitDay, status: 'interested', confirmedAt: null } }).returning()
  return c.json(row, 201)
})
sangueRoutes.patch('/v1/private/responses/:id/cancel', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const [row] = await db.update(responses).set({ status: 'cancelled' }).where(and(eq(responses.id, c.req.param('id')), eq(responses.userID, c.get('userId')), eq(responses.status, 'interested'))).returning()
  if (!row) return c.json({ error: 'Esta visita já foi processada pela unidade.' }, 400)
  return c.json(row)
})
sangueRoutes.post('/v1/private/application', zValidator('json', z.object({ unitName: short, district, address: short, professionalEmail: z.string().email().max(180) })), async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const [existing] = await db.select().from(applications).where(eq(applications.userID, c.get('userId')))
  if (existing) return c.json({ error: 'A sua candidatura já foi enviada.' }, 409)
  const [row] = await db.insert(applications).values({ userID: c.get('userId'), ...c.req.valid('json') }).returning()
  return c.json(row, 201)
})
sangueRoutes.post('/v1/private/reports', zValidator('json', z.object({ appealID: z.string().uuid(), reason: z.enum(['Informação incorrecta', 'Pedido suspeito', 'Necessidade já resolvida']) })), async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  await db.insert(reports).values({ id: crypto.randomUUID(), userID: c.get('userId'), ...c.req.valid('json') })
  return c.json({ ok: true }, 201)
})

sangueRoutes.use('/v1/private/staff/*', async (c, next) => {
  const db = createDb(c.env.DATABASE_URL)
  const [member] = await db.select().from(memberships).where(eq(memberships.userID, c.get('userId')))
  if (!member) return c.json({ error: 'Acesso reservado.' }, 403)
  if (!member) return c.json({ error: 'Acesso reservado a profissionais autorizados.' }, 403)
  if (member.role === 'admin') { await next(); return }
  if (!member.unitID) return c.json({ error: 'Unidade não validada.' }, 403)
  const [unit] = await db.select().from(units).where(and(eq(units.id, member.unitID), eq(units.verified, true)))
  if (!unit) return c.json({ error: 'Unidade não validada.' }, 403)
  await next()
})
sangueRoutes.get('/v1/private/staff/workspace', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const [member] = await db.select().from(memberships).where(eq(memberships.userID, c.get('userId')))
  if (!member) return c.json({ error: 'Acesso reservado.' }, 403)
  const needs = await db.select().from(appeals).where(member.role === 'admin' ? undefined : eq(appeals.unitID, member.unitID!)).orderBy(desc(appeals.createdAt))
  const pending = member.role === 'admin' ? await db.select().from(applications).where(eq(applications.status, 'pending')) : []
  const allUnits = await db.select().from(units).where(eq(units.verified, true))
  const flags = member.role === 'admin' ? await db.select().from(reports).orderBy(desc(reports.createdAt)) : []
  const participants = await db.select({ response: responses, donorName: donors.name, bloodGroup: donors.bloodGroup, appeal: appeals }).from(responses).innerJoin(appeals, eq(responses.appealID, appeals.id)).innerJoin(donors, eq(responses.userID, donors.userID)).where(member.role === 'admin' ? undefined : eq(appeals.unitID, member.unitID!))
  return c.json({ needs, applications: pending, units: allUnits, reports: flags, participants, role: member.role })
})
sangueRoutes.patch('/v1/private/staff/appeals/:id', zValidator('json', z.object({ status: z.enum(['published', 'closed', 'rejected']), unitID: z.string().optional() })), async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const [member] = await db.select().from(memberships).where(eq(memberships.userID, c.get('userId')))
  if (!member) return c.json({ error: 'Acesso reservado.' }, 403)
  const [appeal] = await db.select().from(appeals).where(eq(appeals.id, c.req.param('id')))
  if (!appeal) return c.json({ error: 'Pedido não encontrado.' }, 404)
  if (member.role !== 'admin' && appeal.unitID !== member.unitID) return c.json({ error: 'Sem autorização para este pedido.' }, 403)
  const { status, unitID: picked } = c.req.valid('json')
  const unitID = member.role === 'admin' ? picked ?? appeal.unitID : member.unitID
  if (!unitID) return c.json({ error: 'Associe uma unidade validada.' }, 400)
  const [unit] = await db.select().from(units).where(and(eq(units.id, unitID), eq(units.verified, true)))
  if (!unit) return c.json({ error: 'Unidade não validada.' }, 400)
  if (status === 'published') {
    const duplicate = await db.select().from(appeals).where(and(eq(appeals.unitID, unitID), eq(appeals.bloodGroup, appeal.bloodGroup), eq(appeals.status, 'published'), gt(appeals.expiresAt, new Date())))
    if (duplicate.some((r) => r.id !== appeal.id)) return c.json({ error: 'Já existe um pedido activo deste grupo na unidade.' }, 409)
  }
  const [row] = await db.update(appeals).set({ status, unitID, unitName: unit.name, district: unit.district }).where(eq(appeals.id, appeal.id)).returning()
  return c.json(row)
})
sangueRoutes.patch('/v1/private/staff/responses/:id', zValidator('json', z.object({ status: z.enum(['donated', 'not_donated']) })), async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const [member] = await db.select().from(memberships).where(eq(memberships.userID, c.get('userId')))
  if (!member) return c.json({ error: 'Acesso reservado.' }, 403)
  const [row] = await db.select({ response: responses, unitID: appeals.unitID }).from(responses).innerJoin(appeals, eq(responses.appealID, appeals.id)).where(eq(responses.id, c.req.param('id')))
  if (!row || (member.role !== 'admin' && member.unitID !== row.unitID)) return c.json({ error: 'Sem autorização.' }, 403)
  if (row.response.status !== 'interested') return c.json({ error: 'Esta visita já foi processada.' }, 409)
  const [updated] = await db.update(responses).set({ status: c.req.valid('json').status, confirmedAt: new Date() }).where(eq(responses.id, row.response.id)).returning()
  return c.json(updated)
})
sangueRoutes.patch('/v1/private/staff/applications/:userID', zValidator('json', z.object({ approve: z.boolean() })), async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const [member] = await db.select().from(memberships).where(eq(memberships.userID, c.get('userId')))
  if (!member) return c.json({ error: 'Acesso reservado.' }, 403)
  if (member.role !== 'admin') return c.json({ error: 'Apenas a administração pode validar instituições.' }, 403)
  const [application] = await db.select().from(applications).where(and(eq(applications.userID, c.req.param('userID')), eq(applications.status, 'pending')))
  if (!application) return c.json({ error: 'Candidatura não encontrada.' }, 404)
  if (!c.req.valid('json').approve) {
    await db.update(applications).set({ status: 'rejected' }).where(eq(applications.userID, application.userID))
    return c.json({ ok: true })
  }
  const unitID = crypto.randomUUID()
  await db.insert(units).values({ id: unitID, name: application.unitName, district: application.district, address: application.address, verified: true })
  await db.insert(memberships).values({ userID: application.userID, unitID, role: 'staff' }).onConflictDoUpdate({ target: memberships.userID, set: { unitID, role: 'staff' } })
  await db.update(applications).set({ status: 'approved' }).where(eq(applications.userID, application.userID))
  return c.json({ ok: true })
})
