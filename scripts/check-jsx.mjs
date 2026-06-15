/* Transform every game script through esbuild to catch syntax errors.
   JSX files use the classic React.createElement runtime (global React). */
import { transform } from 'esbuild';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dirs = ['Yandl', 'Rundl'];
let errors = 0;

for (const dir of dirs) {
  const files = (await readdir(dir)).filter((f) => f.endsWith('.jsx') || f.endsWith('.js'));
  for (const f of files.sort()) {
    const p = path.join(dir, f);
    const code = await readFile(p, 'utf8');
    const loader = f.endsWith('.jsx') ? 'jsx' : 'js';
    try {
      await transform(code, { loader, jsx: 'transform' });
      console.log('ok    ', p);
    } catch (e) {
      errors++;
      console.error('FAIL  ', p, '\n  ', e.message.split('\n').join('\n   '));
    }
  }
}

console.log(errors ? `\n✗ ${errors} file(s) failed to transform` : '\n✓ All game scripts transform cleanly');
process.exit(errors ? 1 : 0);
