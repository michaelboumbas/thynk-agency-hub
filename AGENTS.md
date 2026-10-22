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
