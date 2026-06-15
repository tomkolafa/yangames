# YanGames

A tiny collection of mobile-first web games:

- **Yandl** — a daily word puzzle (Wordle-style). New word every day, on-device streak/stats, share card.
- **Rundl** — a cute T-rex-style endless runner that **speeds up and gets denser the longer you survive**.

Built from a Claude Design handoff. Soft pastel brand, four switchable themes (Light / Dark / Classic / Funky), installable PWA, full-viewport on phones and a device frame on desktop.

## Project layout

```
index.html            YanGames landing (game picker)
Yandl/                Word game — index.html, *.jsx screens, game.js, words.js
Rundl/                Runner    — index.html, *.jsx screens, game.js
styles.css, tokens/   Design-system CSS (palette, type, themes, keyframes)
app.css               Full-viewport responsive shell
_ds_bundle.js         Precompiled shared components (Board, Keyboard, Tile, Button…)
manifest.webmanifest, sw.js, pwa.js, icon*.{svg,png}   PWA
vendor/               Self-hosted production React (committed; no runtime CDN)
scripts/              gen-words · gen-icons · check-jsx · build · verify
dist/                 Production build output (generated)
```

The screens are React, compiled in the browser with Babel **during development** and **precompiled with esbuild for production** (no Babel, minified, production React).

## Develop

```bash
npm install
npm run dev          # static server at http://localhost:8765 (uses in-browser Babel)
```

Open `http://localhost:8765` (landing), `/Yandl/`, `/Rundl/`.

## Regenerate assets

```bash
npm run words        # rebuild Yandl/words.js (answers + allowed-guess dictionary)
npm run icons        # rebuild PNG icons from icon.svg
```

The Yandl dictionary bundles ~1.1k common answers (google-10000-english, public domain)
and ~12.6k valid guesses (an-array-of-english-words, MIT) — no external word API at runtime.

## Build & verify

```bash
npm run build        # → dist/ (precompiled, minified, self-hosted React, no Babel)
npm run check        # esbuild transform check of every game script
node scripts/verify.mjs dist   # headless-browser smoke test of the built site
```

## Deploy (Vercel)

Connected to Vercel: pushes to `main` auto-build (`npm run build`) and deploy `dist/`.
Free subdomain `yandl.vercel.app`; a custom domain can be attached later with no rebuild.

## Leaderboard (Supabase)

Shared online leaderboard via Supabase (set up in a later phase). Score submission goes
through a Vercel serverless function (validation + rate-limit); the **anon key** is public,
the **service-role key** lives only in Vercel env vars — never in client code or git.
