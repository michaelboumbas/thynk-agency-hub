import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

/**
 * Newsletter sign-up (22/10/2026, Mike): the footer form and the window post here.
 * 1. The row goes into public.newsletter_subscribers (server-side, service role). The table's BEFORE INSERT
 *    trigger (newsletter_subscribers_guard) turns a repeat sign-up into an update of the existing row and skips
 *    the insert, so `select('id')` returns a row only for a genuinely new subscriber; it also refuses more than
 *    20 sign-ups a minute overall.
 * 2. Only for a new subscriber: the transactional confirmation email (template «subscription-confirmation»,
 *    Lovable app emails from notify.thynkagency.gr, replies to hello@). Idempotent per row; a failed send never
 *    fails the sign-up. Strictly a confirmation: Lovable app emails may not carry newsletter or promotional content.
 */
const SignupBody = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254)
    .regex(/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/),
  lang: z.enum(['en', 'el']),
  source: z.enum(['footer', 'popup']),
  page: z.string().max(200).optional(),
  consentText: z.string().min(10).max(600),
})

/** posts only from our own pages (the live site and the Lovable preview); requests without an Origin pass */
function allowedOrigin(request: Request): boolean {
  const origin = request.headers.get('Origin')
  if (!origin) return true
  try {
    const host = new URL(origin).hostname
    return (
      host === 'thynkagency.gr' ||
      host.endsWith('.thynkagency.gr') ||
      host.endsWith('.lovable.app') ||
      host.endsWith('.lovableproject.com') ||
      host === 'localhost'
    )
  } catch {
    return false
  }
}

export const Route = createFileRoute('/api/public/newsletter')({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!allowedOrigin(request)) return Response.json({ ok: false }, { status: 403 })
        const parsed = SignupBody.safeParse(await request.json().catch(() => null))
        if (!parsed.success) return Response.json({ ok: false }, { status: 400 })
        const s = parsed.data

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
        const { data, error } = await supabaseAdmin
          .from('newsletter_subscribers')
          .insert({
            email: s.email,
            lang: s.lang,
            source: s.source,
            page: s.page ?? null,
            consent: true,
            consent_text: s.consentText,
          })
          .select('id')
        if (error) {
          console.warn('[newsletter] insert failed:', error.code)
          return Response.json({ ok: false }, { status: error.code === 'P0001' ? 429 : 500 })
        }

        const id = data?.[0]?.id
        if (id) {
          try {
            const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
            await sendTemplateEmail('subscription-confirmation', s.email, {
              templateData: { lang: s.lang },
              replyTo: 'hello@thynkagency.gr',
              idempotencyKey: `subscription-confirmation-${id}`,
            })
          } catch {
            // the sign-up is saved either way; never expose the address or the error to the caller
            console.warn('[newsletter] confirmation email not sent')
          }
        }
        return Response.json({ ok: true })
      },
    },
  },
})
