# Theme demo (localhost)

Play with logo and colour options without affecting the live Vercel site.

## Run the demo server

```bash
npm run dev:demo
```

Opens at **http://localhost:8081** (production dev uses port **8080**).

> **Important:** The theme demo is **localhost only** — it is not on the Vercel live site.

## Troubleshooting

**Page won't load?**

1. In the project folder, install deps once: `npm install`
2. Start the demo server: `npm run dev:demo`
3. Open **http://localhost:8081** (not 8080, not the Vercel URL)
4. If `localhost` fails on Windows, try **http://127.0.0.1:8081**
5. Keep the terminal window open while browsing — closing it stops the server

**Port already in use?** Stop the other process or run: `npx vite --mode demo --port 8082`

## What's different in demo mode

- **Logo:** PNG mark in header and footer
- **Colours:** Blush mauve overlays from the logo script (`hsl(345 48% 52%)`), light pink accents
- **Banner:** Pink strip at the top so you know you're in demo mode

## Tweak colours

Edit `src/demo/demo-theme.css` — CSS variables under `[data-theme="demo"]`.

## Tweak logo

Replace `src/assets/logo-made-you-blush.png` and refresh.

Drop a new export as `src/assets/logo-source.jpg` (or pass a path), then run:

```bash
node scripts/make-logo-transparent.mjs
```

This removes only the black matte, trims empty padding, and writes a high-quality transparent PNG without eating into the rose linework.

## Live site

The main site (`npm run dev` / Vercel) is unchanged until you merge demo styles into `src/index.css`.
