import { test, expect } from 'bun:test'
import { confirmInsertedSubscriber } from './subscription-confirmation'

const id = '00000000-0000-4000-8000-000000000001'
const request = (type = 'INSERT', token = 'test-secret') => new Request('http://localhost/hook', {
  method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ type, schema: 'public', table: 'newsletter_subscribers', record: { id, email: 'untrusted@example.com' } }),
})

test('only INSERT events send to the stored recipient with a stable row idempotency key', async () => {
  const sends = []
  const deps = { secret: 'test-secret', findSubscriber: async () => ({ id, email: 'stored@example.com', lang: 'el' }), send: async (...args) => sends.push(args) }
  expect((await confirmInsertedSubscriber(request('UPDATE'), deps)).status).toBe(400)
  expect(sends.length).toBe(0)
  await confirmInsertedSubscriber(request(), deps)
  await confirmInsertedSubscriber(request(), deps)
  expect(sends[0][0].email).toBe('stored@example.com')
  expect(sends[0][1]).toBe(`subscription-confirmation-${id}`)
  expect(sends[1][1]).toBe(sends[0][1])
})

test('unverified callers cannot read or send', async () => {
  let reads = 0
  const response = await confirmInsertedSubscriber(request('INSERT', 'wrong'), {
    secret: 'test-secret', findSubscriber: async () => { reads++; return null }, send: async () => {},
  })
  expect(response.status).toBe(401)
  expect(reads).toBe(0)
})

test('send failure is contained in the post-commit receiver', async () => {
  const response = await confirmInsertedSubscriber(request(), {
    secret: 'test-secret', findSubscriber: async () => ({ id, email: 'stored@example.com', lang: 'en' }),
    send: async () => { throw new Error('provider unavailable') },
  })
  expect(response.status).toBe(503)
})