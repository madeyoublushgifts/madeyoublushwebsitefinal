# Connect a Squarespace domain to Vercel (Made You Blush)

Use this with project **flora-bloom-download-main** on Vercel.  
Example domain: **madeyoublush.ca** — swap in yours if different.

---

## Part 1 — Add the domain in Vercel

1. Open [Vercel Dashboard](https://vercel.com/madeyoublushgifts-4416s-projects/flora-bloom-download-main).
2. **Settings** → **Domains**.
3. Add:
   - `madeyoublush.ca` (root / apex)
   - `www.madeyoublush.ca` (recommended as well)
4. Vercel shows **Invalid Configuration** until DNS is correct — that is normal at first.
5. Note the records Vercel asks for (usually below). Your dashboard is the source of truth if values differ.

| Type | Host / Name | Value |
|------|-------------|--------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

6. Optional: In Vercel, set **www** as primary and redirect `madeyoublush.ca` → `www` (or the reverse).

---

## Part 2 — DNS in Squarespace

1. Log in at [squarespace.com](https://www.squarespace.com).
2. Go to **Settings** → **Domains** (or **Domains** from the home menu).
3. Click your domain (e.g. **madeyoublush.ca**).
4. Open **DNS Settings** or **DNS** / **Advanced Settings**.

### Remove conflicts

Delete or edit old records that send traffic to Squarespace hosting:

- **A** record for `@` pointing to Squarespace IPs  
- **CNAME** for `www` pointing to Squarespace (`ext-sq.squarespace.com`, etc.)

**Do not delete** MX records if you use email on this domain (Google Workspace, etc.).

### Add Vercel records

In **Custom records** (or **Add record**):

**Record 1 — root domain**

| Field | Value |
|-------|--------|
| Type | A |
| Host | `@` (sometimes blank for root) |
| Points to / Data | `76.76.21.21` |
| TTL | Default (often 4 hours) |

**Record 2 — www**

| Field | Value |
|-------|--------|
| Type | CNAME |
| Host | `www` |
| Points to / Data | `cname.vercel-dns.com` |
| TTL | Default |

Save changes.

---

## Part 3 — Squarespace site vs this site

If you still have a **Squarespace website** on this domain:

- Pointing DNS to Vercel sends visitors to **Made You Blush** (this Vite app), not the old Squarespace pages.
- To keep Squarespace for something else, use a **subdomain** only (e.g. `shop.madeyoublush.ca` on Vercel) and leave root on Squarespace — or cancel / unpublish the Squarespace site on that domain.

---

## Part 4 — Wait and verify

1. DNS can take **15 minutes to 48 hours** (often under 1 hour).
2. In Vercel **Domains**, status should change to **Valid Configuration**.
3. Vercel issues **HTTPS** automatically once DNS is correct.
4. Test:
   - https://madeyoublush.ca  
   - https://www.madeyoublush.ca  
   - Refresh `/shop` and `/contact` on each.

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| Vercel still “Invalid Configuration” | Wait longer; confirm host is `@` and `www`, not `madeyoublush.ca` as host for CNAME |
| Squarespace won’t allow CNAME on root | Use only **www** on Vercel and redirect apex in Vercel; apex may need Squarespace’s “forwarding” to www |
| “This site can’t be reached” | Old DNS cached — wait or flush DNS; check A/CNAME in Squarespace match Vercel exactly |
| SSL pending | DNS must be valid first; wait up to 24h after DNS goes green |
| Email stops working | Re-add MX records Squarespace removed; get MX from your email provider |

---

## Vercel project links

- **Production:** https://flora-bloom-download-main.vercel.app  
- **GitHub:** https://github.com/madeyoublushgifts/madeyoublushwebsitefinal  

After DNS works, your custom domain replaces the `.vercel.app` URL for visitors.
