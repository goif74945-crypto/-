import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// These are static source-wiring checks only. They do not prove that Bedrock
// actually executes the production path in a live 26.45 session.
test("main source installs the canonical combat observer", async () => {
  const source = await readFile(new URL("../../src/main.ts", import.meta.url), "utf8");
  assert.match(source, /installRuntimeCombatObserver\(/);
  assert.match(source, /if\s*\(\s*!combat\.weapons\.get\(request\.weaponId\)\s*\)\s*return/);
  assert.match(source, /combat\.execute\(request,\s*combatPort\)/);
});

test("runtime source exposes the observer installation API used by main", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  assert.match(source, /export function installRuntimeCombatObserver\(/);
  assert.match(source, /combatObserver\s*=\s*observer/);
  assert.match(source, /observeCombat\(/);
});

test("runtime source keeps combat side-effect commit fail-safe", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  assert.match(source, /public commit\([^\n]*\):CombatCommitResult\s*\{\s*return\{\s*committed:false/);
  assert.doesNotMatch(source, /public commit\([^\n]*\)[\s\S]*?\.applyDamage\(/);
});
