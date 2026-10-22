import { z } from 'zod'

const insertedSubscriber = z.object({
  type: z.literal('INSERT'),
  schema: z.literal('public'),
  table: z.literal('newsletter_subscribers'),
  record: z.object({ id: z.string().uuid() }),
})

type Subscriber = { id: string; email: string; lang: string | null }
type Dependencies = {
  secret: string | undefined
  findSubscriber: (id: string) => Promise<Subscriber | null>
  send: (subscriber: Subscriber, idempotencyKey: string) => Promise<unknown>
}

/** Database-only INSERT hook. Recipient and language are read back, never trusted from the payload. */
export async function confirmInsertedSubscriber(request: Request, dependencies: Dependencies) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer\s+/i, '')
  if (!dependencies.secret || token !== dependencies.secret) {
    return new Response(null, { status: 401 })
  }
  const payload = insertedSubscriber.safeParse(await request.json().catch(() => null))
  if (!payload.success) return new Response(null, { status: 400 })
  try {
    const subscriber = await dependencies.findSubscriber(payload.data.record.id)
    if (!subscriber) return new Response(null, { status: 404 })
    await dependencies.send(subscriber, `subscription-confirmation-${subscriber.id}`)
    return new Response(null, { status: 204 })
  } catch {
    // The database webhook runs after commit: this cannot roll back registration.
    // Do not expose recipient data or error details to the caller.
    console.warn('[subscription-confirmation] Send failed')
    return new Response(null, { status: 503 })
  }
}