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

- Subscription confirmations use a signed/secret-authenticated database INSERT webhook with authoritative row lookup and row-ID idempotency; browser signup stays insert-only and never sends email.
- Managed app-email delivery uses the scaffolded sender; do not create email queues, polling jobs, or email SQL migrations.
