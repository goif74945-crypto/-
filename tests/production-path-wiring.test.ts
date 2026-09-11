import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

// These are static source-wiring checks only. They do not prove that Bedrock
// actually executes the production path in a live 26.45 session.
test("main source installs the canonical combat observer and does not drop unregistered production weapons", async () => {
  const source = await readFile(new URL("../../src/main.ts", import.meta.url), "utf8");
  assert.match(source, /installRuntimeCombatObserver\(/);
  assert.match(source, /function ensureObservedWeaponRegistered\(request: AttackRequest\)/);
  assert.match(source, /combat\.weapons\.register\(\{/);
  assert.match(source, /combat\.execute\(request,\s*combatPort\)/);
  assert.doesNotMatch(source, /if\s*\(\s*!combat\.weapons\.get\(request\.weaponId\)\s*\)\s*return/);
});

test("runtime source wires combat from the authoritative before-hurt event", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  assert.match(source, /world\.beforeEvents\.entityHurt\.subscribe\(event=>dispatchBeforeHurtCombat\(event\)\)/);
  assert.match(source, /function dispatchBeforeHurtCombat\(event: EntityHurtBeforeEvent\)/);
  assert.match(source, /activeBeforeHurtEvent\s*=\s*event/);
  assert.match(source, /combatObserver\(buildObservedAttack\(attacker,target,weaponAttackType\(attacker\),Math\.max\(0,event\.damage\)\)\)/);
  assert.match(source, /finally\s*\{\s*activeBeforeHurtEvent\s*=\s*undefined;/);
});

test("before-hurt commit reports success only after mutating the authoritative damage field", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  const commitStart = source.indexOf("public commit(");
  assert.notEqual(commitStart, -1, "BedrockCombatPort.commit missing");
  const commitEnd = source.indexOf("public applyEffect", commitStart);
  assert.ok(commitEnd > commitStart, "commit method boundary missing");
  const commit = source.slice(commitStart, commitEnd);
  const mutation = commit.indexOf("activeBeforeHurtEvent.damage = plan.finalDamage");
  const success = commit.indexOf("committed:true");
  assert.ok(mutation >= 0, "authoritative before-hurt damage mutation missing");
  assert.ok(success > mutation, "committed:true must follow the authoritative damage mutation");
  assert.doesNotMatch(commit, /hurtEntity.*\.applyDamage\(/);
});

test("after-hurt remains observation-only and cannot invoke the combat observer", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  const start = source.indexOf("world.afterEvents.entityHurt.subscribe");
  assert.notEqual(start, -1, "afterEvents.entityHurt production subscription missing");
  const end = source.indexOf("});", start);
  assert.ok(end > start, "afterEvents.entityHurt subscription boundary missing");
  const section = source.slice(start, end);
  assert.doesNotMatch(section, /observeCombat\(/);
  assert.doesNotMatch(section, /combatObserver\(/);
  assert.doesNotMatch(section, /applyDamage\(/);
});

test("projectile after-events do not create a second canonical damage path", async () => {
  const source = await readFile(new URL("../../src/bedrock/runtime.ts", import.meta.url), "utf8");
  const start = source.indexOf("world.afterEvents.projectileHitEntity.subscribe");
  assert.notEqual(start, -1, "projectileHitEntity production subscription missing");
  const end = source.indexOf("});", start);
  assert.ok(end > start, "projectileHitEntity subscription boundary missing");
  const section = source.slice(start, end);
  assert.doesNotMatch(section, /observeCombat\(/);
  assert.doesNotMatch(section, /combatObserver\(/);
  assert.doesNotMatch(section, /applyDamage\(/);
});
