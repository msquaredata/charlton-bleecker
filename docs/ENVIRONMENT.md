# Environment variables (Charlton Bleecker)

Documented from the legacy intake app. Copy values into **root** `.env.local` for the Next.js app (same variable names).

## Lead intake (`/api/lead-intake`)

| Variable | Purpose |
|----------|---------|
| `HUBSPOT_ACCESS_TOKEN` | HubSpot Private App token |
| `LEAD_INTAKE_BYPASS_HUBSPOT` | `true` = skip HubSpot; email only (preview/local) |
| `HUBSPOT_PIPELINE_ID` | Deal pipeline (omit or `"default"` for auto) |
| `HUBSPOT_DEAL_STAGE_ID` | Deal stage |
| `HUBSPOT_DEAL_OWNER_ID` | Optional deal owner |
| `HUBSPOT_PORTAL_ID` | For HubSpot links in email |
| `RESEND_API_KEY` | Resend API |
| `INTERNAL_NOTIFY_EMAIL` | Comma-separated team recipients |
| `NOTIFY_FROM_EMAIL` | Verified From address |
| `LEAD_INTAKE_SEND_SUBMITTER_EMAIL` | `false` to disable thank-you email |
| `THANK_YOU_REDIRECT` | Path after success (use `/thank-you` for Next) |
| `NEXT_PUBLIC_LEAD_INTAKE_API_URL` | Optional API host when form is embedded cross-origin |
| `CORS_ALLOW_ORIGIN` | CORS for API |
| `LEAD_INTAKE_DEBUG` | `1` to expose HubSpot hints |
| `HUBSPOT_USE_EXTENDED_*` | Optional property toggles |
| `HUBSPOT_*_PROP_*` | Property name overrides |

## Contact form (`/api/contact`)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API |
| `NOTIFY_FROM_EMAIL` | Verified From address |
| `INTERNAL_NOTIFY_EMAIL` | Inbound recipients |
| `CONTACT_NOTIFY_EMAIL` | Optional; overrides team inbox for contact form only |

## Outreach utility (optional)
See also: [lead-intake-form-cbg/.env.example](../lead-intake-form-cbg/.env.example) for full comments.
