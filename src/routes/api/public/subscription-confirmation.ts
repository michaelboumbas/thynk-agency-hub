import { createFileRoute } from '@tanstack/react-router'
import { confirmInsertedSubscriber } from '@/lib/subscription-confirmation'

export const Route = createFileRoute('/api/public/subscription-confirmation')({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: async ({ request }) => confirmInsertedSubscriber(request, {
        secret: process.env['LOVABLE_CRON_SECRET'],
        findSubscriber: async (id) => {
          const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
          const { data, error } = await supabaseAdmin.from('newsletter_subscribers')
            .select('id,email,lang').eq('id', id).maybeSingle()
          if (error) throw error
          return data
        },
        send: async (subscriber, idempotencyKey) => {
          const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
          return sendTemplateEmail('subscription-confirmation', subscriber.email, {
            templateData: { lang: subscriber.lang },
            replyTo: 'hello@thynkagency.gr',
            idempotencyKey,
          })
        },
      }),
    },
  },
})