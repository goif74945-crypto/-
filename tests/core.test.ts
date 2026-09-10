import assert from "node:assert/strict";
import test from "node:test";
import { FarViewCore } from "../src/core/far-view.js";
import { BoundedPriorityScheduler } from "../src/core/performance.js";
import { GameplayPressureTracker, PlayabilityShield } from "../src/core/playability.js";
import { AdaptivePerformanceGovernor } from "../src/core/governor.js";
import { CooldownResolver, CriticalResolver, DamageResolver, KnockbackResolver, UniversalAttackAPI, SwordAdapter, AxeAdapter, SpearAdapter, BowAdapter, CustomWeaponAdapter, type CombatExecutionPort, type WeaponDefinition } from "../src/core/combat.js";
import type { WorkItem } from "../src/core/types.js";

const weapon = (id: string, attackType: WeaponDefinition["attackType"]): WeaponDefinition => ({
  id, attackType, baseDamage: 10, range: 3, cooldownTicks: 5, knockback: 2, durabilityCost: 1,
});

test("far-view zones are deterministic and separate simulation from visual detail", () => {
  const core = new FarViewCore();
  assert.equal(core.classifyChunkDistance(4).detail, "FULL");
  assert.equal(core.classifyChunkDistance(20).detail, "MEDIUM");
  assert.equal(core.classifyChunkDistance(80).simulationAllowed, false);
  assert.equal(core.classifyChunkDistance(100).zone, "64-100");
});

test("priority scheduler is bounded, deduplicates, and protects high priority", () => {
  const scheduler = new BoundedPriorityScheduler<number>({ maxQueue: 2, maxPerWindow: 1 });
  const item = (key: string, priority: WorkItem<number>["priority"]): WorkItem<number> => ({ key, priority, createdAtTick: 1, payload: 1 });
  assert.equal(scheduler.enqueue(item("low", "FAR")), true);
  assert.equal(scheduler.enqueue(item("decorative", "DECORATIVE")), true);
  assert.equal(scheduler.enqueue(item("critical", "CRITICAL")), true);
  assert.equal(scheduler.size, 2);
  let ran = 0;
  scheduler.drain(() => ran++);
  assert.equal(ran, 1);
  assert.equal(scheduler.cancel("decorative"), true);
});

test("real gameplay pressure blocks FAR/decorative work and expires", () => {
  const pressure = new GameplayPressureTracker(3);
  const shield = new PlayabilityShield(pressure);
  assert.equal(shield.shouldDegrade("FAR", 0), false);
  pressure.mark("COMBAT", 0);
  assert.equal(shield.shouldDegrade("FAR", 1), true);
  assert.equal(shield.shouldDegrade("DECORATIVE", 1), true);
  assert.equal(shield.shouldDegrade("COMBAT", 1), false);
  assert.equal(shield.shouldDegrade("FAR", 4), false);
});

test("governor changes executable workload policy under pressure", () => {
  const governor = new AdaptivePerformanceGovernor();
  assert.equal(governor.evaluate({ queueRatio: 1, workRatio: 1, memoryRatio: 0, localGameplayActive: true }), "CRITICAL");
  assert.equal(governor.workloadPolicy().allowFar, false);
  assert.equal(governor.workloadPolicy().allowDecorative, false);
  assert.equal(governor.workloadPolicy().executionBudget, 2);
});

test("all weapon adapters converge on the same request contract", () => {
  const adapters = [
    new SwordAdapter(weapon("sword", "MELEE")),
    new AxeAdapter(weapon("axe", "HEAVY_MELEE")),
    new SpearAdapter(weapon("spear", "THRUST")),
    new BowAdapter(weapon("bow", "RANGED")),
    new CustomWeaponAdapter(weapon("custom", "SPECIAL")),
  ];
  const requests = adapters.map(adapter => adapter.toAttackRequest({ attackerId: "a", targetId: "t", direction: { x: 1, y: 0, z: 0 }, tick: 10, criticalEligible: false }));
  assert.deepEqual(requests.map(request => request.attackerId), ["a", "a", "a", "a", "a"]);
  assert.deepEqual(requests.map(request => request.targetId), ["t", "t", "t", "t", "t"]);
});

test("universal attack API resolves target once and reuses it for damage/knockback", () => {
  const api = new UniversalAttackAPI(new CooldownResolver(), new CriticalResolver(), new DamageResolver(), new KnockbackResolver());
  const adapter = new SwordAdapter(weapon("sword", "MELEE"));
  const request = adapter.toAttackRequest({ attackerId: "a", targetId: "t", direction: { x: 1, y: 0, z: 0 }, tick: 10, criticalEligible: true });
  const calls: string[] = [];
  const target = { id: "t", entity: {}, distance: 2 };
  const port: CombatExecutionPort = {
    resolveTarget: (_request) => { calls.push("resolve"); return target; },
    applyDamage: (_target, damage) => { calls.push(`damage:${damage}`); return true; },
    applyKnockback: (_target, impulse) => { calls.push(`knockback:${impulse.x}`); },
  };
  const result = api.execute(request, port);
  assert.equal(result.accepted, true);
  assert.equal(result.finalDamage, 15);
  assert.deepEqual(calls, ["resolve", "damage:15", "knockback:2"]);

  const blocked = api.execute({ ...request, tick: 11 }, port);
  assert.equal(blocked.accepted, false);
  assert.equal(blocked.reason, "COOLDOWN");
});

test("range validation rejects a resolved target outside weapon range", () => {
  const api = new UniversalAttackAPI(new CooldownResolver(), new CriticalResolver(), new DamageResolver(), new KnockbackResolver());
  const request = new SwordAdapter(weapon("sword", "MELEE")).toAttackRequest({ attackerId: "a", targetId: "t", direction: { x: 1, y: 0, z: 0 }, tick: 1, criticalEligible: false });
  const port: CombatExecutionPort = {
    resolveTarget: () => ({ id: "t", entity: {}, distance: 4 }),
    applyDamage: () => { throw new Error("damage must not run"); },
    applyKnockback: () => { throw new Error("knockback must not run"); },
  };
  const result = api.execute(request, port);
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "OUT_OF_RANGE");
});
