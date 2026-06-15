/* Verify the LIVE deployed site in a mobile viewport, including the
 * Supabase leaderboard read path. Usage: node scripts/verify-live.mjs [baseUrl] */
import { chromium } from 'playwright';

const BASE = (process.argv[2] || 'https://yandlgames.vercel.app').replace(/\/$/, '');
const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
});

let failures = 0;
async function check(name, path, fn) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1800);
  const mounted = await page.evaluate(() => (document.getElementById('root') || {}).childElementCount ?? -1);
  let extra = '';
  if (fn) { try { extra = (await fn(page)) || ''; } catch (e) { errors.push('INTERACTION: ' + e.message); } }
  await page.screenshot({ path: `/tmp/live-${name}.png` });
  const real = errors.filter((e) => !/DevTools|favicon|sourcemap/i.test(e));
  const ok = mounted > 0 && real.length === 0;
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${name}  (root: ${mounted}) ${extra}  -> /tmp/live-${name}.png`);
  real.slice(0, 5).forEach((e) => console.log('    · ' + e.slice(0, 160)));
  await page.close();
}

async function enterGame(page) {
  await page.locator('button', { hasText: 'Play' }).first().click();
  await page.waitForTimeout(700);
}

await check('home', '/');
await check('yandl', '/Yandl/', async (page) => {
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(1500);
  await enterGame(page);
  for (const k of ['c','r','a','n','e']) await page.keyboard.press(k);
  await page.keyboard.press('Enter'); await page.waitForTimeout(1400);
});
await check('rundl', '/Rundl/', async (page) => {
  await enterGame(page);
  await page.mouse.click(195, 500); await page.waitForTimeout(1500); await page.mouse.click(195, 460);
  await page.waitForTimeout(400);
});
// Leaderboard live-read: open the Board tab and confirm the Supabase row shows
await check('rundl-board', '/Rundl/', async (page) => {
  await page.locator('button', { hasText: 'Board' }).first().click();
  await page.waitForTimeout(2500); // allow Supabase fetch
  const hasTestRow = await page.evaluate(() => document.body.innerText.includes('TestBot'));
  return hasTestRow ? '[live leaderboard ✓ TestBot shown]' : '[leaderboard fetch: no live row found]';
});

await browser.close();
console.log(failures ? `\n✗ ${failures} problem(s)` : '\n✓ live site OK');
process.exit(failures ? 1 : 0);
