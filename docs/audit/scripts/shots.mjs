// Light + dark screenshots of Storybook stories from a static build.
//   cd apps/storybook && pnpm run build
//   node docs/audit/scripts/shots.mjs apps/storybook/storybook-static <outdir> <story-id>...
import { loadPlaywright, serve } from './_serve.mjs';

const [root, out, ...ids] = process.argv.slice(2);
const { chromium } = await loadPlaywright();
const srv = serve(root, 6123);
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: 900, height: 500 }, deviceScaleFactor: 2 });
for (const id of ids)
  for (const theme of ['light', 'dark']) {
    await pg.goto(`http://localhost:6123/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
    await pg.waitForTimeout(800);
    await pg.screenshot({ path: `${out}/${id}-${theme}.png` });
  }
await b.close();
srv.close();
