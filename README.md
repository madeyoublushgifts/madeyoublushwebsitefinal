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

1. Create the repo on GitHub (if you have not already): [github.com/new](https://github.com/new)  
   Name: **`madeyoublushwebsitefinal`** — leave it empty (no README / .gitignore).

2. On the repo page, copy the **HTTPS clone URL** (looks like  
   `https://github.com/YOUR_USERNAME/madeyoublushwebsitefinal.git`).

3. In PowerShell (use Git Bash if `git` is not in PATH):

```powershell
cd c:\Users\nashi\Downloads\flora-bloom-download-main
& "C:\Program Files\Git\bin\git.exe" remote add origin https://github.com/YOUR_USERNAME/madeyoublushwebsitefinal.git
& "C:\Program Files\Git\bin\git.exe" push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username (or use the full URL GitHub shows). Sign in when prompted.

**Optional — set your name for future commits (once):**

```powershell
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
