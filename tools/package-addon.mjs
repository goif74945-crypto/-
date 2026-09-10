import { cp, mkdir, rm } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const source = join(root, "dist", "src");
const destination = join(root, "addon", "scripts");

await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
console.log(`PACKAGED: ${destination}`);
