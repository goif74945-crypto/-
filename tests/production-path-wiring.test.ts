import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("main runtime installs the canonical combat observer", async () => {
  const source = await readFile(new URL("../src/main.ts", import.meta.url), "utf8");
  assert.match(source, /installRuntimeCombatObserver\(/);
  assert.match(source, /combat\.execute\(request,\s*combatPort\)/);
});

test("runtime exposes the observer installation API used by main", async () => {
  const source = await readFile(new URL("../src/bedrock/runtime.ts", import.meta.url), "utf8");
  assert.match(source, /export function installRuntimeCombatObserver\(/);
  assert.match(source, /combatObserver\s*=\s*observer/);
  assert.match(source, /observeCombat\(/);
});
