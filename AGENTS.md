<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Application architecture
- Keep demonstration records and support-domain types in `src/lib/support-data.ts`; pages consume the same data so counts, filters and details stay consistent.
- Keep dashboard, listings, categories and notifications on shared demonstration data; real submissions must never enter these public surfaces.
- Submit real tickets through the existing Supabase client and `process-support-ticket` Edge Function with an authenticated or anonymous session; never duplicate its storage or AI logic in the browser.
- Keep submitted results in tab-scoped session storage, keyed by session user and a `real-` route ID; render only the submitting session's response in the existing details page, without public database reads.
- Put shared navigation in the root shell and keep request listing and details under an Outlet layout; each content page owns its metadata.
- Define visual roles and reusable page styling in `src/styles.css`, and use existing design-system controls for interactions to preserve visual consistency.
