// Shared helpers: find the npx-cached Playwright, serve a static Storybook build.
import http from 'node:http';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { extname, join } from 'node:path';

export async function loadPlaywright() {
  const base = join(homedir(), '.npm/_npx');
  for (const d of readdirSync(base)) {
    const p = join(base, d, 'node_modules/playwright/index.mjs');
    if (existsSync(p)) return import(p);
  }
  throw new Error('Playwright not found in ~/.npm/_npx — run `npx playwright --version` once');
}

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

export function serve(root, port) {
  return http
    .createServer((q, r) => {
      let p = join(root, decodeURIComponent(q.url.split('?')[0]));
      if (!existsSync(p) || p.endsWith('/')) p = join(p, 'index.html');
      try {
        r.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' });
        r.end(readFileSync(p));
      } catch {
        r.writeHead(404);
        r.end();
      }
    })
    .listen(port);
}
