/* Focused verification for the 5 refinements, run against the built dist/.
 *
 *   1. Back-to-selection arrow on each game's home screen → returns to landing
 *   2. Rundl home content vertically centered + arrow clear of the logo
 *   3. No fake seed names on either leaderboard (real players / empty state)
 *
 * Speed-ramp + seagull-height tuning are verified separately by asserting the
 * new constants shipped in the bundle (see the grep in the build step).
 *
 * Usage: node scripts/verify-changes.mjs [rootDir]   (default "dist")
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve(process.argv[2] || 'dist');
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.jsx': 'text/babel', '.css': 'text/css', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.txt': 'text/plain',
};

const server = http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(ROOT, p);
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end('not found');
  }
});

await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;
console.log('serving', ROOT, 'at', base, '\n');

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true, hasTouch: true,
});

const FAKE_NAMES = ['Luna', 'Jasper', 'Nova', 'Mochi', 'Pixel', 'Cleo', 'Zara', 'Cosmo',
                    'Max', 'Pip', 'Oscar', 'Bella'];
let failures = 0;
function assert(cond, msg) {
  if (cond) { console.log('  ✓ ' + msg); }
  else { console.log('  ✗ ' + msg); failures++; }
}

async function fresh(url) {
  const page = await ctx.newPage();
  page.on('pageerror', (e) => { console.log('  · PAGEERROR ' + e.message); failures++; });
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  return page;
}

// ── 1. Back arrow → landing (both games) ────────────────────────────────
for (const game of ['Yandl', 'Rundl']) {
  console.log(`\n[${game}] back-to-selection arrow`);
  const page = await fresh(`/${game}/index.html`);
  const back = page.locator('button[aria-label="Back to game selection"]');
  assert(await back.count() === 1, 'arrow present on home screen');
  assert(await back.first().isVisible(), 'arrow is visible');
  await back.first().click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(600);
  const url = page.url();
  assert(/\/index\.html$/.test(url) && !/\/(Yandl|Rundl)\//.test(url), `navigated to landing (${url.replace(base, '')})`);
  // Game names render as separate letter tiles, so match the stable card taglines.
  const txt = await page.evaluate(() => document.body.innerText);
  assert(/Pick a game/i.test(txt) && /6 tries/i.test(txt) && /Run, jump/i.test(txt),
    'landing shows the picker + both game cards');
  await page.screenshot({ path: `/tmp/yan-chg-${game.toLowerCase()}-landing.png` });
  await page.close();
}

// ── 2. Rundl home: centered + arrow clear of logo ───────────────────────
console.log('\n[Rundl] home layout centered');
{
  const page = await fresh('/Rundl/index.html');
  await page.screenshot({ path: '/tmp/yan-chg-rundl-home.png' });
  const backBox = await page.locator('button[aria-label="Back to game selection"]').first().boundingBox();
  // first RUNDLE logo tile = first letter "R"
  const logoBox = await page.locator('text="R"').first().boundingBox();
  assert(backBox && logoBox, 'measured arrow + logo boxes');
  if (backBox && logoBox) {
    assert(backBox.y + backBox.height <= logoBox.y + 2, 'arrow sits above the logo (no overlap)');
    assert(logoBox.y > 90, `content pushed down from the top — centered (logo top=${Math.round(logoBox.y)}px)`);
    assert(logoBox.y < 844 * 0.6, 'content not pushed off the bottom');
  }
  await page.close();
}

// ── 3. No fake seed names on either leaderboard ─────────────────────────
for (const game of ['Yandl', 'Rundl']) {
  console.log(`\n[${game}] leaderboard has no fake seed names`);
  const page = await fresh(`/${game}/index.html`);
  await page.locator('button', { hasText: 'Board' }).first().click();
  await page.waitForTimeout(2500); // allow Supabase fetch + render
  await page.screenshot({ path: `/tmp/yan-chg-${game.toLowerCase()}-board.png` });
  const txt = await page.evaluate(() => document.body.innerText);
  const found = FAKE_NAMES.filter((n) => new RegExp('\\b' + n + '\\b').test(txt));
  assert(found.length === 0, found.length ? `fake names leaked: ${found.join(', ')}` : 'no fake seed names in the board');
  await page.close();
}

await browser.close();
server.close();
console.log(failures ? `\n✗ ${failures} check(s) failed` : '\n✓ all change checks passed');
process.exit(failures ? 1 : 0);
