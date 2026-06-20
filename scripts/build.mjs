/* Production build → dist/
 *
 * The prototype compiles JSX in the browser with Babel-standalone (~3MB) and
 * ships development React. This build:
 *   • precompiles every JSX file with esbuild (classic React.createElement)
 *   • bundles + minifies each page's scripts
 *   • self-hosts the *production* React/ReactDOM (no Babel, no third-party CDN
 *     at runtime → faster + reliable + offline-friendly)
 *   • copies all static assets and rewrites the three index.html files
 */
import { transform } from 'esbuild';
import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const REACT = '18.3.1';

async function compileJsx(file) {
  const code = await readFile(file, 'utf8');
  const out = await transform(code, { loader: 'jsx', jsx: 'transform' });
  return out.code;
}
async function minify(code) {
  return (await transform(code, { loader: 'js', minify: true })).code;
}

// ── reset dist ───────────────────────────────────────────────────────
await rm(DIST, { recursive: true, force: true });
await mkdir(DIST, { recursive: true });

// ── copy static assets verbatim ──────────────────────────────────────
const STATIC = [
  'styles.css', 'app.css', 'pwa.js', 'sw.js', 'manifest.webmanifest',
  'icon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png',
  '_ds_bundle.js', 'config.js', 'leaderboard.js', 'identity.js', 'sound.js', 'og.png', 'tokens', 'assets',
  'Yandl/words.js', 'Yandl/game.js', 'Rundl/game.js', 'Snakl/game.js',
];
for (const rel of STATIC) {
  await mkdir(path.join(DIST, path.dirname(rel)), { recursive: true });
  await cp(rel, path.join(DIST, rel), { recursive: true });
}

// ── self-host production React + ReactDOM ────────────────────────────
// Prefer the committed vendor/ copy so CI builds need no network; fetch
// and cache it on first run if missing.
await mkdir(path.join(DIST, 'vendor'), { recursive: true });
for (const f of ['react.production.min.js', 'react-dom.production.min.js']) {
  const local = path.join('vendor', f);
  let txt;
  try {
    txt = await readFile(local, 'utf8');
  } catch {
    const pkg = f.startsWith('react-dom') ? 'react-dom' : 'react';
    txt = await (await fetch(`https://unpkg.com/${pkg}@${REACT}/umd/${f}`)).text();
    await mkdir('vendor', { recursive: true });
    await writeFile(local, txt);
  }
  await writeFile(path.join(DIST, 'vendor', f), txt);
  console.log('vendored', f, `(${Math.round(txt.length / 1024)}KB)`);
}

// ── HTML transform: dev React+Babel → prod React + compiled bundle ───
function rewriteHtml(html, bundleHref) {
  return html
    .replace(/<script\s+src="https:\/\/unpkg\.com\/react@[^"]*react\.development\.js"[^>]*><\/script>/,
      '<script src="/vendor/react.production.min.js"></script>')
    .replace(/<script\s+src="https:\/\/unpkg\.com\/react-dom@[^"]*react-dom\.development\.js"[^>]*><\/script>/,
      '<script src="/vendor/react-dom.production.min.js"></script>')
    .replace(/<script\s+src="https:\/\/unpkg\.com\/@babel\/standalone[^"]*"[^>]*><\/script>\s*/,
      '')
    // drop the per-file JSX includes (empty <script type=text/babel src=...>)
    .replace(/<script type="text\/babel"[^>]*src="[^"]*"><\/script>\s*/g, '')
    // replace the inline bootstrap / inline app with the compiled bundle
    .replace(/<script type="text\/babel">[\s\S]*?<\/script>/, `<script src="${bundleHref}"></script>`);
}

// ── per-page bundles ─────────────────────────────────────────────────
const GAMES = [
  {
    dir: 'Yandl', bundle: 'app.bundle.js',
    files: ['YandlIcons.jsx', 'HomeScreen.jsx', 'HowToPlayScreen.jsx', 'YandlGameScreen.jsx',
      'LeaderboardScreen.jsx', 'SettingsScreen.jsx', 'YandlApp.jsx'],
    boot: "ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window.YandlApp));",
  },
  {
    dir: 'Rundl', bundle: 'app.bundle.js',
    files: ['BendHomeScreen.jsx', 'RunnerScreen.jsx', 'BendLeaderboardScreen.jsx',
      'BendSettingsScreen.jsx', 'BendApp.jsx'],
    boot: "ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window.BendApp));",
  },
  {
    dir: 'Snakl', bundle: 'app.bundle.js',
    files: ['SnaklHomeScreen.jsx', 'SnaklGameScreen.jsx', 'SnaklLeaderboardScreen.jsx',
      'SnaklSettingsScreen.jsx', 'SnaklApp.jsx'],
    boot: "ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(window.SnaklApp));",
  },
];

for (const g of GAMES) {
  const parts = [];
  for (const f of g.files) parts.push(await compileJsx(path.join(g.dir, f)));
  parts.push(g.boot);
  const min = await minify(parts.join('\n'));
  await writeFile(path.join(DIST, g.dir, g.bundle), min);
  const html = await readFile(path.join(g.dir, 'index.html'), 'utf8');
  await writeFile(path.join(DIST, g.dir, 'index.html'), rewriteHtml(html, g.bundle));
  console.log(`built ${g.dir}/${g.bundle} (${Math.round(min.length / 1024)}KB) + index.html`);
}

// ── landing page (inline JSX) ────────────────────────────────────────
{
  const html = await readFile('index.html', 'utf8');
  const m = html.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
  const min = await minify((await transform(m[1], { loader: 'jsx', jsx: 'transform' })).code);
  await writeFile(path.join(DIST, 'landing.app.js'), min);
  await writeFile(path.join(DIST, 'index.html'), rewriteHtml(html, '/landing.app.js'));
  console.log(`built landing.app.js (${Math.round(min.length / 1024)}KB) + index.html`);
}

console.log('\n✓ build complete → dist/');
