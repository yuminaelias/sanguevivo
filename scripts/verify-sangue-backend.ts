import { createAuthClient } from 'better-auth/client';
import { jwtClient } from 'better-auth/client/plugins';
const authURL = 'https://auth-6bef3980-a03c-4d87-8c44-a2af03aa6b81-dev.api-dev.newlyapp.com';
const apiURL = 'https://api-6bef3980-a03c-4d87-8c44-a2af03aa6b81-dev.api-dev.newlyapp.com';
const password = `Sv-${crypto.randomUUID()}!`;
let bearer = '';
const client = createAuthClient({ baseURL: authURL, plugins: [jwtClient()], fetchOptions: { headers: { origin: 'expobase://' }, onRequest(ctx) { if (bearer) ctx.headers.set('Authorization', `Bearer ${bearer}`); } } });
function assert(value: unknown, message: string) { if (!value) throw new Error(message); }
async function api(path: string, method = 'GET', body?: unknown) { return fetch(apiURL + path, { method, headers: { 'Content-Type': 'application/json', ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}) }, body: body ? JSON.stringify(body) : undefined }); }
const publicResponse = await api('/v1/appeals'); assert(publicResponse.ok, `Public appeals ${publicResponse.status}`);
assert((await api('/v1/private/dashboard')).status === 401, 'Private route must require auth');
const created = await client.signUp.email({ email: `sv-check-${Date.now()}@example.com`, password, name: 'Verificação automática' });
assert(created.data?.token, `Signup failed: ${created.error?.message}`); bearer = created.data!.token;
try {
  const jwt = await client.token(); assert(jwt.data?.token, 'JWT unavailable'); bearer = jwt.data!.token;
  assert((await api('/v1/private/staff/workspace')).status === 403, 'Ordinary donor must not access staff');
  const missingConsent = await api('/v1/private/donor', 'PUT', { name: 'Pessoa de teste', bloodGroup: 'O-', district: 'KaMpfumo', available: true, consent: false, adult: true }); assert(missingConsent.status === 400, 'Consent must be enforced');
  const saved = await api('/v1/private/donor', 'PUT', { name: 'Pessoa de teste', bloodGroup: 'O-', district: 'KaMpfumo', available: true, consent: true, adult: true }); assert(saved.ok, `Profile save ${saved.status}`);
  const appealBody = { unitName: 'Unidade de teste automatizado', district: 'KaMpfumo', bloodGroup: 'O-', urgency: 'Urgente', quantity: 1 };
  const posted = await api('/v1/private/appeals', 'POST', appealBody); assert(posted.status === 201, `Appeal save ${posted.status}`); const appeal = await posted.json() as { id: string; status: string }; assert(appeal.status === 'pending', 'Appeal must start pending');
  assert((await api('/v1/private/appeals', 'POST', appealBody)).status === 409, 'Duplicate appeal must be blocked');
  const publiclyVisible = await (await api('/v1/appeals')).json() as { id: string }[]; assert(!publiclyVisible.some((r) => r.id === appeal.id), 'Unverified appeal must stay private');
  const dashboard = await (await api('/v1/private/dashboard')).json() as { profile: { bloodGroup: string }; appeals: { id: string }[] }; assert(dashboard.profile.bloodGroup === 'O-' && dashboard.appeals.some((r) => r.id === appeal.id), 'Saved data must reload');
  const cancelled = await api(`/v1/private/appeals/${appeal.id}/cancel`, 'PATCH'); assert(cancelled.ok, 'Appeal cancellation');
  assert((await api('/v1/private/donor', 'DELETE')).ok, 'Consent withdrawal');
  console.log('PASS: public access, sign-up, JWT, private access control, consent, profile persistence, pending appeals, duplicate prevention, moderation boundary, cancellation and consent withdrawal.');
} finally {
  const deleted = await client.deleteUser({ password }); assert(!deleted.error, `Account deletion failed: ${deleted.error?.message}`); console.log('PASS: test account permanently deleted.');
}
