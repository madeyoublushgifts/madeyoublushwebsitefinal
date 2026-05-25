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

1. Create a **new empty repository** on [github.com/new](https://github.com/new) (e.g. `made-you-blush`) — do **not** add a README or .gitignore (this project already has them).

2. In PowerShell (use Git Bash if `git` is not in PATH):

```powershell
cd c:\Users\nashi\Downloads\flora-bloom-download-main
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/YOUR_USERNAME/made-you-blush.git
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

Replace `YOUR_USERNAME` and the repo name with yours. Sign in when GitHub prompts you.

**Optional — set your name for future commits (once):**

```powershell
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
