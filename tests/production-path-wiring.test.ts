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

test("runtime source wires combat from the authoritative before-hurt event", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  assert.match(source, /world\.beforeEvents\.entityHurt\.subscribe\(event=>dispatchBeforeHurtCombat\(event\)\)/);
  assert.match(source, /function dispatchBeforeHurtCombat\(event: EntityHurtBeforeEvent\)/);
  assert.match(source, /activeBeforeHurtEvent\s*=\s*event/);
  assert.match(source, /combatObserver\(buildObservedAttack\(attacker,target,weaponAttackType\(attacker\),Math\.max\(0,event\.damage\)\)\)/);
  assert.match(source, /finally\s*\{\s*activeBeforeHurtEvent\s*=\s*undefined;/);
});

test("after-hurt remains observation-only and cannot invoke the combat observer", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  const afterHurt = source.match(/world\.afterEvents\.entityHurt\.subscribe\(event=>\{([\s\S]*?)\}\);/);
  assert.ok(afterHurt, "afterEvents.entityHurt production subscription missing");
  assert.doesNotMatch(afterHurt[1], /observeCombat\(/);
  assert.doesNotMatch(afterHurt[1], /combatObserver\(/);
});

test("canonical damage commit is limited to the active before-hurt event", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  assert.match(source, /if\s*\(\s*activeBeforeHurtEvent\s*\)\s*\{/);
  assert.match(source, /activeBeforeHurtEvent\.damage\s*=\s*plan\.finalDamage/);
  assert.match(source, /return\{committed:false,effectStatuses:\[\],durabilityStatus:"NOT_VERIFIED",projectileStatus:"NOT_VERIFIED",deathStatus:"NOT_VERIFIED",lootStatus:"NOT_VERIFIED",xpStatus:"NOT_VERIFIED"\};/);
  assert.doesNotMatch(source, /activeBeforeHurtEvent\.hurtEntity.*\.applyDamage\(/);
});

test("projectile after-events do not create a second canonical damage path", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  const projectileEntity = source.match(/world\.afterEvents\.projectileHitEntity\.subscribe\(event=>\{([\s\S]*?)\}\);/);
  assert.ok(projectileEntity, "projectileHitEntity production subscription missing");
  assert.doesNotMatch(projectileEntity[1], /observeCombat\(/);
  assert.doesNotMatch(projectileEntity[1], /combatObserver\(/);
});
