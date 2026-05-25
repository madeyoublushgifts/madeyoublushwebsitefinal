# Deploy Made You Blush (live website + custom domain)

This project is a **Vite + React** site. Production output is the `dist/` folder after `npm run build`.

---

## Before you go live (required)

### 1. Formspree (contact & inquiry forms)

1. Sign up at [formspree.io](https://formspree.io).
2. Create **three** forms: Contact, Inquiry, Waitlist.
3. Copy each form ID (the code after `/f/` in the form URL).
4. In the project folder, copy `.env.example` to `.env`:

```env
VITE_FORMSPREE_CONTACT_ID=your_contact_form_id
VITE_FORMSPREE_INQUIRY_ID=your_inquiry_form_id
VITE_FORMSPREE_WAITLIST_ID=your_waitlist_form_id
```

**Never commit `.env`** — it is already in `.gitignore`.

Forms will not work on the live site until these IDs are set in your host’s **Environment Variables** (same names as above).

### 2. Test a production build locally

```powershell
cd c:\Users\nashi\Downloads\flora-bloom-download-main
npm install
npm run build
npm run preview
```

Open the URL shown (usually `http://localhost:4173`) and click through Shop, Contact, Coming Soon, and Build a Bouquet.

---

## Save your work (Git + GitHub)

Git was not available in some terminals—install [Git for Windows](https://git-scm.com/download/win) if needed, or use **GitHub Desktop**.

1. Create a new repository on [github.com](https://github.com) (e.g. `made-you-blush`).
2. In the project folder:

```powershell
git init
git add .
git commit -m "Made You Blush site — ready for deploy"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/made-you-blush.git
git push -u origin main
```

Replace `YOUR_USERNAME` and repo name with yours.

---

## Recommended: Vercel (free, easy custom domain)

1. Sign up at [vercel.com](https://vercel.com) → **Add New Project** → Import your GitHub repo.
2. Framework preset: **Vite** (auto-detected).
3. **Environment Variables** (Settings → Environment Variables), add:

   | Name | Value |
   |------|--------|
   | `VITE_FORMSPREE_CONTACT_ID` | your ID |
   | `VITE_FORMSPREE_INQUIRY_ID` | your ID |
   | `VITE_FORMSPREE_WAITLIST_ID` | your ID |

4. Deploy. You get a URL like `made-you-blush.vercel.app`.

`vercel.json` in this repo already routes all paths to `index.html` (required for React Router).

### Connect your domain on Vercel

1. Project → **Settings** → **Domains** → Add your domain (e.g. `madeyoublush.ca` and `www.madeyoublush.ca`).
2. Vercel shows DNS records. At your domain registrar (GoDaddy, Namecheap, Google Domains, Cloudflare, etc.):

   - **Root / apex** (`@`): usually **A** records to Vercel’s IPs, or use registrar “ALIAS” if they support it.
   - **www**: **CNAME** → `cname.vercel-dns.com` (Vercel shows the exact value).

3. Wait for DNS (often 5–60 minutes, sometimes up to 24h). Vercel will issue HTTPS automatically.

---

## Alternative: Netlify

1. [netlify.com](https://netlify.com) → **Add new site** → Import from Git.
2. Build command: `npm run build`  
   Publish directory: `dist`  
   (already in `netlify.toml`.)
3. **Site configuration → Environment variables** — add the three `VITE_FORMSPREE_*` variables.
4. **Domain management** → Add custom domain → follow Netlify’s DNS instructions.

`public/_redirects` handles SPA routing on Netlify.

---

## Alternative: Cloudflare Pages

1. [dash.cloudflare.com](https://dash.cloudflare.com) → Pages → Create project → Connect Git.
2. Build: `npm run build`, output: `dist`.
3. Add the three `VITE_FORMSPREE_*` env vars.
4. **Custom domains** → attach a domain on Cloudflare (easiest if DNS is already on Cloudflare).

Add a **Redirect rule** or `_redirects` / `public/_redirects` for `/*` → `/index.html` (200).

---

## Quick manual deploy (no Git)

If you only need something live fast:

1. Set `.env` locally with Formspree IDs.
2. Run `npm run build`.
3. Drag the **`dist`** folder onto [Netlify Drop](https://app.netlify.com/drop).

**Note:** Env vars are baked in at build time for Vite—rebuild after changing `.env`.

---

## Checklist after launch

- [ ] Home, Shop, Build a Bouquet, Contact, Coming Soon all load
- [ ] Direct links work (e.g. `/shop`, `/contact`) — refresh each once
- [ ] Contact form submits (check Formspree inbox)
- [ ] Shop / Build a Bouquet inquiry submits
- [ ] Coming Soon waitlist submits
- [ ] Instagram & TikTok links open correctly
- [ ] Images load under `/images/myb/`

---

## Need help?

Share your **domain name** and **registrar** (where you bought the domain) if DNS steps are unclear—records differ slightly per provider.
