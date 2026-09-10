import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const root = new URL("..", import.meta.url).pathname;
const source = join(root, "dist", "src");
const destination = join(root, "addon", "scripts");
const artifact = join(root, "NEXY_FARVIEW_100.mcaddon");

await rm(destination, { recursive: true, force: true });
await rm(artifact, { force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

async function pruneGeneratedFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await pruneGeneratedFiles(path);
    else if (!entry.name.endsWith(".js")) await rm(path, { force: true });
  }
}
await pruneGeneratedFiles(destination);

const scriptsMain = join(destination, "main.js");
const manifest = join(root, "addon", "manifest.json");
if (!(await stat(scriptsMain)).isFile()) throw new Error("generated addon/scripts/main.js is missing");
if (!(await stat(manifest)).isFile()) throw new Error("addon/manifest.json is missing");

await execFileAsync("zip", ["-qr", artifact, "manifest.json", "scripts"], { cwd: join(root, "addon") });
console.log(`PACKAGED: ${relative(root, artifact)}`);
