// Deploy-friendly build entry.
// If a prebuilt dist/ is committed, skip the heavy Vite build (it runs out of
// memory on small Docker builders). Set FORCE_BUILD=1 or use `npm run build:dist`
// to rebuild dist/ locally.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import process from 'node:process';

const hasPrebuilt = fs.existsSync('dist/index.html');

const force = Boolean(process.env.FORCE_BUILD) || process.argv.includes('--force');

if (hasPrebuilt && !force) {
  console.log('Prebuilt dist/index.html found - skipping vite build.');
  process.exit(0);
}

const result = spawnSync(
  process.execPath,
  ['--max-old-space-size=3072', './node_modules/vite/bin/vite.js', 'build'],
  { stdio: 'inherit' },
);

process.exit(result.status ?? 1);
