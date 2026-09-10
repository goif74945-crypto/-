import assert from "node:assert/strict";
import test from "node:test";
import { FarViewCore } from "../src/core/far-view.js";
import { BoundedPriorityScheduler, priorityForDistance } from "../src/core/performance.js";
import { GameplayPressureTracker, PlayabilityShield } from "../src/core/playability.js";
import { AdaptivePerformanceGovernor } from "../src/core/governor.js";
import {
  AxeAdapter,
  BowAdapter,
  CooldownResolver,
  CriticalResolver,
  CustomWeaponAdapter,
  DamageResolver,
  KnockbackResolver,
  SpearAdapter,
  SwordAdapter,
  UniversalAttackAPI,
  WeaponRegistry,
  type CombatExecutionPort,
  type WeaponAdapter,
  type WeaponDefinition,
} from "../src/core/combat.js";
import type { AttackRequest, WorkItem } from "../src/core/types.js";

const weapon = (id: string, attackType: WeaponDefinition["attackType"]): WeaponDefinition => ({
  id, attackType, baseDamage: 10, range: 3, cooldownTicks: 5, knockback: 2, durabilityCost: 1,
});

const makeApi = () => new UniversalAttackAPI(new CooldownResolver(), new CriticalResolver(), new DamageResolver(), new KnockbackResolver());

const makePort = (targetDistance = 2, calls: string[] = []): CombatExecutionPort => ({
  resolveTarget: () => { calls.push("resolve"); return { id: "t", entity: {}, distance: targetDistance }; },
  applyDamage: (_target, damage) => { calls.push(`damage:${damage}`); return true; },
  applyKnockback: (_target, impulse) => { calls.push(`knockback:${impulse.x}`); },
});

const context = { attackerId: "a", targetId: "t", direction: { x: 1, y: 0, z: 0 }, tick: 10, criticalEligible: false };

test("far-view lifecycle supports recovery from FAR to VISIBLE", () => {
  const core = new FarViewCore();
  assert.equal(core.getState("c"), undefined);
  core.observeDistance("c", 4, 1);
  assert.equal(core.getState("c"), "VISIBLE");
  core.observeDistance("c", 70, 2);
  assert.equal(core.getState("c"), "FAR");
  core.observeDistance("c", 20, 3);
  assert.equal(core.getState("c"), "VISIBLE");
  core.release("c", 4);
  assert.equal(core.getState("c"), "RELEASED");
  core.clearReleased();
  assert.equal(core.getState("c"), undefined);
  assert.equal(core.transition("bad", "FAR", 1), false);
  assert.equal(core.transition("bad", "DISCOVERED", 1), true);
  assert.equal(core.transition("bad", "RELEASED", 2), true);
});

test("far-view zone boundaries are exact and reject invalid distances", () => {
  const core = new FarViewCore();
  assert.equal(core.classifyChunkDistance(0).zone, "0-8");
  assert.equal(core.classifyChunkDistance(7.999).zone, "0-8");
  assert.equal(core.classifyChunkDistance(8).zone, "8-16");
  assert.equal(core.classifyChunkDistance(15.999).zone, "8-16");
  assert.equal(core.classifyChunkDistance(16).zone, "16-32");
  assert.equal(core.classifyChunkDistance(31.999).zone, "16-32");
  assert.equal(core.classifyChunkDistance(32).zone, "32-64");
  assert.equal(core.classifyChunkDistance(63.999).zone, "32-64");
  assert.equal(core.classifyChunkDistance(64).zone, "64-100");
  assert.equal(core.classifyChunkDistance(100).zone, "64-100");
  assert.equal(core.classifyChunkDistance(100.001).zone, "OUT_OF_RANGE");
  assert.equal(core.classifyChunkDistance(-1).zone, "OUT_OF_RANGE");
  assert.equal(core.classifyChunkDistance(Number.NaN).zone, "OUT_OF_RANGE");
});

test("authoritative distance zones map to authoritative scheduler priorities", () => {
  assert.equal(priorityForDistance("0-8"), "CRITICAL");
  assert.equal(priorityForDistance("8-16"), "NEAR");
  assert.equal(priorityForDistance("16-32"), "IMPORTANT");
  assert.equal(priorityForDistance("32-64"), "MID");
  assert.equal(priorityForDistance("64-100"), "FAR");
  const scheduler = new BoundedPriorityScheduler<void>({ maxQueue: 8, maxPerWindow: 8 });
  for (const [zone, expected] of [["32-64", "MID"], ["64-100", "FAR"]] as const) {
    scheduler.enqueue({ key: zone, priority: expected, createdAtTick: 1, payload: undefined });
    assert.equal(scheduler.peekPriority(zone), expected);
  }
  assert.notEqual(scheduler.peekPriority("32-64"), "FAR");
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
  assert.equal(shield.priorityFor("CAMERA"), "CRITICAL");
  assert.equal(shield.priorityFor("BOSS"), "CRITICAL");
});

test("governor changes executable workload policy under pressure", () => {
  const governor = new AdaptivePerformanceGovernor();
  assert.equal(governor.evaluate({ queueRatio: 1, workRatio: 1, memoryRatio: 0, localGameplayActive: true }), "CRITICAL");
  assert.equal(governor.workloadPolicy().allowFar, false);
  assert.equal(governor.workloadPolicy().allowDecorative, false);
  assert.equal(governor.workloadPolicy().executionBudget, 2);
});

test("all five adapters converge and all seven attack types can be resolved centrally", () => {
  const adapters: WeaponAdapter[] = [
    new SwordAdapter(weapon("sword", "MELEE")),
    new AxeAdapter(weapon("axe", "HEAVY_MELEE")),
    new SpearAdapter(weapon("spear", "THRUST")),
    new BowAdapter(weapon("bow", "RANGED")),
    new CustomWeaponAdapter(weapon("custom", "SPECIAL")),
  ];
  const allTypes: WeaponDefinition["attackType"][] = ["MELEE", "HEAVY_MELEE", "THRUST", "SWEEP", "RANGED", "PROJECTILE", "SPECIAL"];
  const api = makeApi();
  const calls: string[] = [];
  for (const [index, attackType] of allTypes.entries()) {
    const adapter = attackType === "MELEE" ? adapters[0]
      : attackType === "HEAVY_MELEE" ? adapters[1]
      : attackType === "THRUST" ? adapters[2]
      : attackType === "RANGED" ? adapters[3]
      : new CustomWeaponAdapter(weapon(`custom-${index}`, attackType));
    const result = api.executeAdapter(adapter, { ...context, tick: 20 + index }, makePort(2, calls));
    assert.equal(result.accepted, true);
  }
  assert.equal(api.weapons.size, 7);
  assert.equal(calls.filter(call => call === "resolve").length, 7);
  assert.equal(adapters.map(adapter => adapter.toAttackRequest(context).targetId).every(id => id === "t"), true);
});

test("weapon validation rejects unregistered and mismatched requests", () => {
  const registry = new WeaponRegistry();
  const api = new UniversalAttackAPI(new CooldownResolver(), new CriticalResolver(), new DamageResolver(), new KnockbackResolver(), registry);
  const request = new SwordAdapter(weapon("sword", "MELEE")).toAttackRequest(context);
  const calls: string[] = [];
  assert.equal(api.execute(request, makePort(2, calls)).reason, "WEAPON_UNREGISTERED");
  assert.equal(registry.register(weapon("sword", "MELEE")), true);
  const mismatch = { ...request, attackType: "PROJECTILE" as const };
  assert.equal(api.execute(mismatch, makePort(2, calls)).reason, "WEAPON_ATTACK_TYPE_MISMATCH");
});

test("universal attack pipeline resolves target once and preserves base/modified/final damage", () => {
  const api = makeApi();
  const adapter = new SwordAdapter({ ...weapon("sword", "MELEE"), modifiers: [{ id: "strength", multiplier: 2 }] });
  const calls: string[] = [];
  const port: CombatExecutionPort = {
    ...makePort(2, calls),
    mitigateDamage: (_target, _request, incoming) => { calls.push(`mitigate:${incoming}`); return incoming - 3; },
    applyEffect: (_target, effect) => { calls.push(`effect:${effect.id}`); return true; },
    applyDurability: request => { calls.push(`durability:${request.durabilityCost}`); return true; },
    resolveProjectileResult: () => "VERIFIED",
    resolveDeathLootXp: () => ({ death: "VERIFIED", loot: "VERIFIED", xp: "VERIFIED" }),
  };
  const result = api.executeAdapter(adapter, { ...context, criticalEligible: true }, port);
  assert.equal(result.accepted, true);
  assert.equal(result.baseDamage, 10);
  assert.equal(result.modifiedDamage, 30);
  assert.equal(result.finalDamage, 27);
  assert.equal(result.critical, true);
  assert.equal(result.armorStatus, "VERIFIED");
  assert.equal(result.resistanceStatus, "VERIFIED");
  assert.equal(result.durabilityStatus, "VERIFIED");
  assert.deepEqual(result.effectStatuses, ["NOT_APPLICABLE"]);
  assert.deepEqual(calls, ["resolve", "mitigate:30", "damage:27", "knockback:2", "durability:1"]);
});

test("effect, durability, projectile, death, loot and XP stay explicitly unverified when no runtime capability is provided", () => {
  const api = makeApi();
  const adapter = new BowAdapter({
    ...weapon("bow", "PROJECTILE"),
    effects: [{ id: "slowness", durationTicks: 20, amplifier: 1 }],
  });
  const result = api.executeAdapter(adapter, context, makePort());
  assert.equal(result.accepted, true);
  assert.deepEqual(result.effectStatuses, ["NOT_VERIFIED"]);
  assert.equal(result.durabilityStatus, "NOT_VERIFIED");
  assert.equal(result.projectileStatus, "NOT_VERIFIED");
  assert.equal(result.deathStatus, "NOT_VERIFIED");
  assert.equal(result.lootStatus, "NOT_VERIFIED");
  assert.equal(result.xpStatus, "NOT_VERIFIED");
  assert.equal(result.armorStatus, "NOT_VERIFIED");
  assert.equal(result.resistanceStatus, "NOT_VERIFIED");
});

test("range and target validation reject before damage/knockback", () => {
  const api = makeApi();
  const request = new SwordAdapter(weapon("sword", "MELEE")).toAttackRequest(context);
  assert.equal(api.weapons.register(weapon("sword", "MELEE")), true);
  const damagePort: CombatExecutionPort = {
    resolveTarget: () => ({ id: "wrong", entity: {}, distance: 1 }),
    applyDamage: () => { throw new Error("damage must not run"); },
    applyKnockback: () => { throw new Error("knockback must not run"); },
  };
  assert.equal(api.execute(request, damagePort).reason, "TARGET_INVALID");

  const outOfRange = {
    ...damagePort,
    resolveTarget: () => ({ id: "t", entity: {}, distance: 4 }),
  };
  assert.equal(api.execute(request, outOfRange).reason, "OUT_OF_RANGE");
});

test("cooldown blocks the second attack", () => {
  const api = makeApi();
  const adapter = new SwordAdapter(weapon("sword", "MELEE"));
  const first = api.executeAdapter(adapter, context, makePort());
  assert.equal(first.accepted, true);
  const second = api.executeAdapter(adapter, { ...context, tick: 11 }, makePort());
  assert.equal(second.accepted, false);
  assert.equal(second.reason, "COOLDOWN");
});
