/* End-to-end smoke test: serve the site, load each page in a mobile
 * viewport, capture console/page errors, confirm the app mounts, and
 * screenshot. Also drives a Yandl guess and a Rundl tap.
 *
 * Usage: node scripts/verify.mjs [rootDir]   (default ".")
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const ROOT = path.resolve(process.argv[2] || '.');
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
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});

let failures = 0;
async function check(name, url, fn) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  await page.goto(base + url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000); // allow Babel compile + React mount
  const mounted = await page.evaluate(() => {
    const r = document.getElementById('root');
    return r ? r.childElementCount : -1;
  });
  if (fn) { try { await fn(page); } catch (e) { errors.push('INTERACTION: ' + e.message); } }
  const shot = `/tmp/yan-${name}.png`;
  await page.screenshot({ path: shot });
  // ignore noisy non-fatal warnings
  const real = errors.filter((e) => !/Download the React DevTools|favicon|sourcemap/i.test(e));
  const ok = mounted > 0 && real.length === 0;
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${name}  (root children: ${mounted})  -> ${shot}`);
  if (real.length) real.slice(0, 6).forEach((e) => console.log('    · ' + e.slice(0, 160)));
  await page.close();
}

// Enter a game from its home screen by tapping the "Play" bottom-nav tab.
// First dismiss the first-run name prompt if present (its overlay covers the nav).
async function enterGame(page) {
  const later = page.locator('button', { hasText: 'Maybe later' });
  if (await later.count()) { await later.first().click().catch(() => {}); await page.waitForTimeout(200); }
  await page.locator('button', { hasText: 'Play' }).first().click();
  await page.waitForTimeout(700);
}

await check('home', '/index.html');

await check('yandl', '/Yandl/index.html', async (page) => {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await enterGame(page);
  for (const k of ['c', 'r', 'a', 'n', 'e']) await page.keyboard.press(k);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1400); // let the flip reveal play
});

await check('yandl-badword', '/Yandl/index.html', async (page) => {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await enterGame(page);
  for (const k of ['z', 'x', 'q', 'w', 'k']) await page.keyboard.press(k);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  const toast = await page.evaluate(() => document.body.innerText.includes('Not in word list'));
  if (!toast) throw new Error('expected "Not in word list" toast for non-word');
});

await check('rundl', '/Rundl/index.html', async (page) => {
  await enterGame(page);            // into the runner screen
  await page.mouse.click(195, 500); // tap to start
  await page.waitForTimeout(1800);  // let it run + accelerate
  await page.mouse.click(195, 460); // jump
  await page.waitForTimeout(500);
});

await check('snakl', '/Snakl/index.html', async (page) => {
  await enterGame(page);              // into the snake screen
  await page.waitForTimeout(400);
  await page.keyboard.press('ArrowUp');    // first input starts the game + turns
  await page.waitForTimeout(700);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(700);
  await page.keyboard.press('ArrowDown');  // exercise turning, ticking, drawing
  await page.waitForTimeout(900);
});

await check('packl', '/Packl/index.html', async (page) => {
  // every level's maze (incl. per-level mazeMods) must be fully connected
  const mazeOk = await page.evaluate(() => {
    const G = window.PacklGame;
    return G.LEVELS.every((lv) => G.validateMaze(G.parseMaze(G.MAZE_MAIN, lv.mazeMods)));
  });
  if (!mazeOk) throw new Error('a level maze is not fully connected (unreachable pellets)');
  await enterGame(page);                    // into the maze screen
  await page.waitForTimeout(400);
  await page.keyboard.press('ArrowLeft');   // first input starts the run
  await page.waitForTimeout(1900);          // intro card + chomp pellets
  await page.keyboard.press('ArrowUp');
  await page.waitForTimeout(900);
  await page.keyboard.press('ArrowRight');  // exercise turning, ghost AI, drawing
  await page.waitForTimeout(1200);
});

await browser.close();
server.close();
console.log(failures ? `\n✗ ${failures} page(s) had problems` : '\n✓ all pages mounted with no console errors');
process.exit(failures ? 1 : 0);
