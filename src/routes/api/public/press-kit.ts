import { createFileRoute } from '@tanstack/react-router'

/**
 * Press kit download (26/11/2026, Mike: «δεν κατεβαίνει όταν πατάς download»).
 * The static ZIP in /public/press is fine, but a plain <a download> is ignored by iPhone Safari and by the
 * in-app browsers of Instagram, LinkedIn and Facebook, which just do nothing or open a blank page.
 * This route serves the same file with Content-Disposition: attachment, which every browser treats as a download.
 */
const FILE = '/press/thynk-press-kit-2026.zip'
const NAME = 'Thynk-press-kit-2026.zip'

export const Route = createFileRoute('/api/public/press-kit')({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ request }) => {
        const res = await fetch(new URL(FILE, request.url))
        if (!res.ok) return Response.redirect(new URL(FILE, request.url), 302)
        return new Response(res.body, {
          status: 200,
          headers: {
            'Content-Type': 'application/zip',
            'Content-Disposition': `attachment; filename="${NAME}"`,
            'Cache-Control': 'public, max-age=3600',
          },
        })
      },
    },
  },
})
