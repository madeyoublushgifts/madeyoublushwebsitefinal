# Made You Blush

Toronto floral subscription & gift shop — Vite, React, TypeScript, Tailwind.

## Local development

```bash
npm install
cp .env.example .env   # add Formspree form IDs
npm run dev            # http://localhost:8080
```

## Production build

```bash
npm run build
npm run preview
```

See **[DEPLOY.md](./DEPLOY.md)** for Vercel/Netlify, custom domain, and Formspree setup.

## Push to GitHub

This folder is already a Git repo with an initial commit on `main`.

**Repository:** [github.com/madeyoublushgifts/madeyoublushwebsitefinal](https://github.com/madeyoublushgifts/madeyoublushwebsitefinal)

Clone:

```bash
git clone https://github.com/madeyoublushgifts/madeyoublushwebsitefinal.git
```

Push updates (from this folder):

```powershell
& "C:\Program Files\Git\bin\git.exe" add .
& "C:\Program Files\Git\bin\git.exe" commit -m "Your message"
& "C:\Program Files\Git\bin\git.exe" push
```

**Optional — set your name for future commits (once):**

```powershell
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
