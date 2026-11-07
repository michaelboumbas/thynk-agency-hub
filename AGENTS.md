<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Newsletter sign-ups (footer + window) POST to the server route `/api/public/newsletter`, which inserts into `newsletter_subscribers` with the service role and, only when a NEW row was inserted (the `newsletter_subscribers_guard` BEFORE INSERT trigger skips repeat sign-ups), sends the transactional `subscription-confirmation` email with row-ID idempotency and reply-to hello@thynkagency.gr. A failed send never fails the sign-up. The browser falls back to a direct anon insert (no email) only if the route is unreachable. Keep it a strict confirmation: no newsletter or promotional content in app emails.
- Managed app-email delivery uses the scaffolded sender; do not create email queues, polling jobs, or email SQL migrations.
- Brand (23/10/2026, Thynk 2026): Commissioner for all text (variable, `font-variation-settings:"FLAR" 100`), page background soft sky `--bg #eef5f8`, white `--paper` for cards, ink `#14262e` for text only, lake `#1d5866` for buttons and dark grounds, orange `#ff6a1a` as the accent (never white text on orange; never orange text on lake). The logo is the traced wordmark SVG in `Logo` (shared.tsx) with the square dot as a lake `<b>`; do not go back to Anton text. Accent words in titles: lake with the orange marker underline.
- Contact map (24/10/2026): `src/components/thynk14/map.tsx` draws the office map in the brand colours with MapLibre GL (loaded at runtime from jsDelivr, not an npm dependency) over OpenFreeMap's OpenStreetMap tiles; the style is `map-style.ts` (water = lake #1d5866, streets = sky #d3e7ee). Google's embed can't be recoloured, so it is only the fallback when WebGL/the library/the tiles fail. Keep the OpenStreetMap credit visible. Do not swap it back to a grayscale Google iframe.
- Social profiles (Instagram, Facebook, LinkedIn) live once in `v14Social` (`src/content/site-v14.ts`) and feed both the footer «Follow» and the Social media card on /contact.
- Lighter layout (07/11/2026, Mike, after thetetrahub.com): there is no header bar. The logo (`.t15-brand`) and a glass dock (`.t15-dock`: page links ≥1240px, EL/EN, Book an audit, menu) float over the page; the header hides while scrolling down and returns on scroll up. `TalkWidget` in Shell.tsx is the fixed «Let's talk» button at the bottom left of every page (the typing-bubble icon, option A; no founder photos), linking to the Google Calendar booking page for a 30' call. The services page is one big numbered list of the six service groups (open on hover/tap, pillar chips). New styles are the `t15-` block at the end of thynk14.css.
- Minimal pass (07/11/2026, Mike): no dot planet (PlanetField) behind the pages, no newsletter pop-up (sign-up only in the footer), the header dock shows only EL/EN, Book an audit and the menu, the footer's bottom line links only to pages that are not in the menu (Press, Careers, Privacy). The home page has five parts: hero, solutions, clients, the audit, the form (method, calculator and FAQ live on /services and /audit). Services has no rotating sticker or marquee.
