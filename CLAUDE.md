# YanGames — codebase guide & "new game" contract

YanGames is a tiny collection of mobile-web games. Each game is a self-contained
folder that **reuses one shared chrome**: the same full-viewport phone shell,
bottom nav, Settings screen, Supabase leaderboard, player-name system, theming,
and sounds. The landing page (`index.html`) shows one card per game.

Existing games: **Yandl** (`Yandl/`, word game), **Rundl** (`Rundl/`, endless
runner — note its files use a legacy `Bend` prefix and `window.BendGame`), and
**Snakl** (`Snakl/`, snake — the current reference for the conventions below).

Dev: `npm run dev` → `python3 -m http.server 8765` (in-browser Babel, dev React).
Build: `npm run build` → `dist/` (esbuild precompiles JSX, bundles+minifies, self-hosts
prod React). Deploy: push to `main` → Vercel builds `dist/`.

---

## Shared building blocks (don't rebuild these)

Loaded as plain `<script>`s before any game code (see any game's `index.html`):

| Global | File | What it gives you |
|---|---|---|
| `window.YAN_CONFIG` | `config.js` | Supabase URL + anon key |
| `window.YanLeaderboard` | `leaderboard.js` | `.submit(row)`, `.fetchTop(game,{limit})`, `.getName()`, `.setName()`, `.ENABLED` |
| `window.YanIdentity` | `identity.js` | `.getName()/.setName()/.hasName()`, `.isOnboarded()/.markOnboarded()`, `.NamePrompt({theme,dismissible,onSave,onClose})` (modal), `.NameField({theme})` (settings row) |
| `window.YanSound` | `sound.js` | `.play(name, soundKey)`; recipes: `key, back, invalid, flip, win, lose, jump, start, milestone, gameover` (no audio files) |
| `window.WordlingDesignSystem_ea77b4` | `_ds_bundle.js` | shared React components incl. `.Button` |

Shared CSS: `styles.css` + `app.css` (+ `tokens/`). The theme lives on
`.app-root` via `data-theme`, so all `--game-bg`, `--game-text`, `--brand`,
`--hairline`, `--text-muted`, `--bg-sunken`, `--brand-tint`, `--accent-success`,
`--radius-*`, `--ease-bounce`, etc. cascade down. The shell classes are
`.app-root` → `.phone-shell` (full-viewport on mobile, framed phone on desktop).

The player **name is global** across all games: `localStorage['yan-name']`
(via `YanLeaderboard`/`YanIdentity`). Never build a custom name input.

---

## To add a new game `Xxxl/` — checklist

Use **one consistent prefix** `Xxxl` and expose every component on `window.Xxxl*`.
The `index.html` bootstrap and `build.mjs` `boot` string must reference the exact
same `window.*` names or the page white-screens.

1. **Files** (mirror `Snakl/`):
   - `Xxxl/index.html` — copy `Snakl/index.html`; change title + the JSX `<script src>` list + the bootstrap to render `window.XxxlApp`.
   - `Xxxl/game.js` — vanilla IIFE → `window.XxxlGame`: canvas drawing + pure game logic + the score/stat helpers below.
   - `Xxxl/XxxlApp.jsx` — copy `Snakl/SnaklApp.jsx`: `XxxlBottomNav` + `XxxlApp`. Holds `screen` (`home`/`game`/`leaderboard`/`settings`), `theme` (`xxxl-theme`), any game-specific selection (e.g. `xxxl-char`), a `gameKey` bumped on Play to remount the game screen, and `showNamePrompt` from `YanIdentity`. **Hide the bottom nav while `screen==='game'`.**
   - `Xxxl/XxxlHomeScreen.jsx`, `Xxxl/XxxlGameScreen.jsx`, `Xxxl/XxxlLeaderboardScreen.jsx`, `Xxxl/XxxlSettingsScreen.jsx`.

2. **`index.html` head load order:** React, ReactDOM, Babel (dev only), `../_ds_bundle.js`, `/config.js`, `/leaderboard.js`, `/identity.js`, `/sound.js`, then `game.js`. CSS: `../styles.css`, `../app.css`.

3. **Theming:** support `clean-light` / `clean-dark` / `classic` / `funky`; `dark = theme==='clean-dark' || theme==='funky'`. Persist to `xxxl-theme`. Canvas games re-read the theme in their draw palette (see `SnaklGameScreen.jsx`).

4. **Settings** (copy `SnaklSettingsScreen.jsx`'s `Toggle`/`Row`/`SectionLabel`/`THEMES`): always include **Profile** (`YanIdentity.NameField`), **Appearance** (4 theme buttons), **Gameplay** (Sound toggle `xxxl-sound`, plus any game-specific toggles — e.g. Snakl's "Solid Walls" → `snakl-walls`), and **About**.

5. **Sound:** `YanSound.play(name, 'xxxl-sound')`.

6. **Player name:** render `YanIdentity.NamePrompt` from the App shell on first run, and `YanIdentity.NameField` in Settings.

7. **Leaderboard:**
   - Submit on game-over: `YanLeaderboard.submit({ game:'xxxl', name, emoji, score, char_id })` (auto-submit if `getName()` exists, else show `NamePrompt` — see `SnaklGameScreen.jsx`).
   - Read: `YanLeaderboard.fetchTop('xxxl', { limit: 25 })`.
   - **If your game ranks by `score desc`, add your id to the score branch in `leaderboard.js` `fetchTop`** (`game === 'rundl' || game === 'snakl' || ...`) — otherwise it falls back to Yandl's guesses/time ordering.

8. **Local scores/stats** (copy from `Snakl/game.js`): `xxxl-hi` (per-character best, JSON object), `xxxl-stats` (`{games}`). Helpers: `loadHighScores/saveHighScore/getGlobalHi/loadStats/recordGame`.

9. **Supabase schema** (`supabase/schema.sql`): add `'xxxl'` to **both** CHECK constraints — the table `check (game in (...))` AND the `scores_insert_public` policy `with check (game in (...))` — and add a partial index if score-ranked. **The file is NOT auto-applied. You must run the migration on the live DB** (Supabase SQL editor / `ALTER TABLE`); `create table if not exists` will not alter the existing table. Until applied, every insert with the new `game` value is silently rejected and scores won't save.

10. **Build registration** (`scripts/build.mjs`): add `'Xxxl/game.js'` to the `STATIC` array, and add an entry to `GAMES` (`dir`, `bundle:'app.bundle.js'`, `files:[…JSX in include order…]`, `boot`). `rewriteHtml` handles the HTML automatically if it follows the standard shape — no other build change needed.

11. **Landing card** (`index.html`): add a `<GameCard title subtitle href accentColor accentBg delay illustration tileLogo />`. `illustration` is an `<img>` from `assets/illustrations/` or an inline SVG (see `RunnerIcon` / `SnakeIcon`); `tileLogo` is `<TileLogo letters={[…]} colors={[…]} size={34} />`.

12. **Verify:** `npm run dev` → open `/Xxxl/`, click through home → play → leaderboard → settings; check the console is clean and all `localStorage` keys are `xxxl-*` (+ shared `yan-name`/`yan-onboarded`). Then `npm run build`.

---

## The four pets (shared art, used by Rundl + Snakl)

`CHARACTERS` ids `B/E/N/D`: **Bebe** (golden retriever, `#F4B942`), **Bambi**
(cat, `#E8755C`), **Nene** (King Charles cavalier, `#4A4A4A`), **Dede**
(dachshund, `#9B6B3A`). Emoji map `{ B:'🐕', E:'🐱', N:'👑', D:'🌭' }`.
They're drawn procedurally on canvas (no image files), two ways:
- **Side view** (a running pet, feet at origin, facing +x): `drawCharacter(ctx, id, frame, jumping)`.
- **Front-facing face** (centered, for a portrait/avatar/top-down head): `Snakl/game.js`'s `drawFace(ctx, id, size)` (Rundl has the same art as the `CharFacePortrait` component).

If a new game reuses the pets, copy these draw functions into its `game.js`
(they're intentionally duplicated per game so each bundle is standalone).

---

## Possible future cleanup (not done yet)

The App shell + BottomNav + Settings `Toggle/Row/SectionLabel/THEMES` scaffold is
currently **copy-pasted per game**. It could be extracted into a shared module
(like `identity.js`) so new games stop duplicating it. Left as-is for now to keep
each game self-contained and matching the existing Yandl/Rundl pattern.
