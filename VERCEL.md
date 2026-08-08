# Vercel — Made You Blush

## Live URLs

| URL | Purpose |
|-----|---------|
| https://flora-bloom-download-main.vercel.app | Production alias |
| https://github.com/madeyoublushgifts/madeyoublushwebsitefinal | Source repo (auto-deploy on push to `main`) |

Dashboard: [vercel.com/madeyoublushgifts-4416s-projects/flora-bloom-download-main](https://vercel.com/madeyoublushgifts-4416s-projects/flora-bloom-download-main)

## Formbricks (forms)

Contact, shop inquiry, subscription waitlist, and early-access submit via Formbricks Client Response API. Production IDs are baked into the build.

Optional overrides in Vercel → **Project → Settings → Environment Variables** (Production / Preview / Development):

| Variable | Purpose |
|----------|---------|
| `VITE_FORMBRICKS_APP_URL` | Formbricks app URL (default `https://app.formbricks.com`) |
| `VITE_FORMBRICKS_ENVIRONMENT_ID` | Environment ID |
| `VITE_FORMBRICKS_SURVEY_ID` | Early-access survey |
| `VITE_FORMBRICKS_CONTACT_SURVEY_ID` | Contact survey |
| `VITE_FORMBRICKS_INQUIRY_SURVEY_ID` | Shop inquiry survey |
| `VITE_FORMBRICKS_WAITLIST_SURVEY_ID` | Waitlist survey |

Redeploy after changing env vars so the Vite build picks them up.

## Stripe + Resend (order emails)

Server-only variables (do **not** prefix with `VITE_`):

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Creates Checkout sessions |
| `STRIPE_WEBHOOK_SECRET` | Verifies `POST /api/stripe-webhook` (`checkout.session.completed`) |
| `RESEND_API_KEY` | Sends customer + merchant confirmation emails |
| `ORDER_FROM_EMAIL` | Optional; default `info@madeyoublush.ca` |
| `ORDER_NOTIFY_EMAIL` | Optional merchant To; default `info@madeyoublush.ca` |
| `SITE_URL` / `VITE_SITE_URL` | Checkout success/cancel redirects |

Webhook URL: `https://www.madeyoublush.ca/api/stripe-webhook`  
Early-access notify: `POST /api/early-access-notify` (called by the client after Formbricks succeeds)

Verify **madeyoublush.ca** in [Resend Domains](https://resend.com/domains) before relying on production sends from `info@madeyoublush.ca`.

## Custom domain

1. Vercel → **Settings → Domains**
2. Add `madeyoublush.ca` (and `www` if you use it)
3. At your domain registrar, add the DNS records Vercel shows
4. Wait for SSL (usually a few minutes)

## Redeploy from your PC

```powershell
cd c:\Users\nashi\Downloads\flora-bloom-download-main
npx vercel deploy --prod --yes
```

Git pushes to `main` also trigger automatic deploys.
