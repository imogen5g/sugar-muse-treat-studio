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

## Cake menu
- Render menu videos through CakeVideo with hidden native controls, visible-only looping playback and reduced-motion support, so the cake imagery stays uninterrupted without unnecessary downloads.
- Share the cake catalogue between menu and order pages to prevent price drift.
- Never treat client review state as payment confirmation; only verified provider events may issue paid receipts.
- Guest orders use server-validated totals and hashed per-order access tokens; browser Data API access stays disabled to protect customer details.
- Customer payment references can only request verification; paid receipts require a stored verified provider reference and payment timestamp.

## Search and analytics
- Manage page metadata through route head options and routing through TanStack Start; HTML fallback redirects would bypass the server routing.
- Serve the sitemap from the router-derived inventory with explicit route inclusion decisions; exclude checkout pages and omit non-authoritative lastmod dates.
- Initialize GA4 once in the root head with automatic page views disabled and send page views from router location changes to avoid duplicate counting.
