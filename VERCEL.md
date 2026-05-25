# Vercel — Made You Blush

## Live URLs

| URL | Purpose |
|-----|---------|
| https://flora-bloom-download-main.vercel.app | Production alias |
| https://github.com/madeyoublushgifts/madeyoublushwebsitefinal | Source repo (auto-deploy on push to `main`) |

Dashboard: [vercel.com/madeyoublushgifts-4416s-projects/flora-bloom-download-main](https://vercel.com/madeyoublushgifts-4416s-projects/flora-bloom-download-main)

## Formspree (required for forms)

In Vercel → **Project → Settings → Environment Variables**, add for **Production**, **Preview**, and **Development**:

| Variable | Value |
|----------|--------|
| `VITE_FORMSPREE_CONTACT_ID` | from [formspree.io](https://formspree.io) |
| `VITE_FORMSPREE_INQUIRY_ID` | from Formspree |
| `VITE_FORMSPREE_WAITLIST_ID` | from Formspree |

Then **Deployments → … → Redeploy** (or push any commit to `main`) so the build picks them up.

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
