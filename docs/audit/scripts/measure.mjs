// Measure elements in a story: size, padding, border, colour (first 8 matches).
//   node docs/audit/scripts/measure.mjs apps/storybook/storybook-static "atoms-listitem--default|li" ...
import { loadPlaywright, serve } from './_serve.mjs';

const [root, ...pairs] = process.argv.slice(2);
const { chromium } = await loadPlaywright();
const srv = serve(root, 6127);
const b = await chromium.launch();
const pg = await b.newPage();
for (const [id, sel] of pairs.map((x) => x.split('|'))) {
  await pg.goto(`http://localhost:6127/iframe.html?id=${id}&viewMode=story`);
  await pg.waitForTimeout(700);
  const rows = await pg.$$eval(sel, (els) =>
    els.slice(0, 8).map((e) => {
      const r = e.getBoundingClientRect();
      const c = getComputedStyle(e);
      return `${e.textContent.trim().slice(0, 9).padEnd(9)} ${r.width.toFixed(0)}x${r.height.toFixed(1)} pad=${c.paddingTop}/${c.paddingRight} bw=${c.borderTopWidth} bc=${c.borderTopColor} col=${c.color}`;
    }),
  );
  console.log(`# ${id}\n${rows.join('\n')}`);
}
await b.close();
srv.close();
