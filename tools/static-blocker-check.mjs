import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const sourceRoots = ["src", "tests", "tools"];
const forbidden = [
  /\bTODO\b/i,
  /\bFIXME\b/i,
  /\bplaceholder\b/i,
  /synthetic\s+success/i,
  /\bgetEntities\s*\(/i,
  /\bsetInterval\s*\(/i,
  /\bsetTimeout\s*\(/i,
];

async function filesUnder(directory) {
  const result = [];
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesUnder(absolute));
    else if (/\.(ts|mjs|js)$/.test(entry.name)) result.push(absolute);
  }
  return result;
}

const files = [];
for (const path of sourceRoots) files.push(...await filesUnder(join(root, path)));
const failures = [];
for (const file of files) {
  const text = await readFile(file, "utf8");
  for (const pattern of forbidden) {
    if (pattern.test(text)) failures.push(`${relative(root, file)} matches ${pattern}`);
  }
}

if (failures.length) {
  console.error("STATIC_BLOCKER_CHECK_FAILED");
  for (const failure of failures) console.error(failure);
  process.exit(1);
}
console.log(`STATIC_BLOCKER_CHECK_PASS ${files.length} source files scanned`);
