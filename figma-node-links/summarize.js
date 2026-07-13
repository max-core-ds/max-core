const fs = require("fs");
const file = process.argv[2];
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const variants = new Set();
const descs = [];
const topFrames = [];
function walk(n, depth) {
  const name = n.name || "";
  if (depth <= 1 && n.id) topFrames.push(`${" ".repeat(depth*2)}${name} [${n.id}]`);
  if (name.length > 55 && !/=/.test(name)) descs.push(name);
  if (/=/.test(name)) variants.add(name);
  (n.children || []).forEach((c) => walk(c, depth + 1));
}
(Array.isArray(data) ? data : [data]).forEach((n) => walk(n, 0));
console.log("=== TOP FRAMES ===");
topFrames.forEach((f) => console.log(f));
console.log("\n=== DESCRIPTIONS ===");
descs.forEach((d) => console.log("• " + d + "\n"));
console.log("=== VARIANTS (" + variants.size + ") ===");
[...variants].forEach((v) => console.log(v));
