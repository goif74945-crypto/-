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

const weapon = (id: string, attackType: WeaponDefinition["attackType"], overrides: Partial<WeaponDefinition> = {}): WeaponDefinition => ({
  id, attackType, baseDamage: 10, range: 3, cooldownTicks: 5, knockback: 2, durabilityCost: 1, ...overrides,
});
const context = { attackerId: "a", targetId: "t", direction: { x: 1, y: 0, z: 0 }, tick: 10, criticalEligible: false };
const fullPort = (calls: string[] = [], targetDistance = 2): CombatExecutionPort => ({
  resolveTarget: () => { calls.push("resolve"); return { id: "t", entity: {}, distance: targetDistance }; },
  applyDamage: (_target, damage) => { calls.push(`damage:${damage}`); return true; },
  applyKnockback: (_target, impulse) => { calls.push(`knockback:${impulse.x}`); },
  mitigateArmorDamage: (_target, _request, incoming) => { calls.push("armor"); return incoming - 3; },
  mitigateResistanceDamage: (_target, _request, incoming) => { calls.push("resistance"); return incoming - 2; },
  applyEffect: () => { calls.push("effect"); return true; },
  applyDurability: () => { calls.push("durability"); return true; },
  resolveProjectileResult: () => { calls.push("projectile"); return "VERIFIED"; },
  resolveDeathLootXp: () => { calls.push("posthit"); return { death: "VERIFIED", loot: "VERIFIED", xp: "VERIFIED" }; },
});
const makeApi = () => new UniversalAttackAPI(new CooldownResolver(), new CriticalResolver(), new DamageResolver(), new KnockbackResolver());

test("far-view lifecycle records required first distant path and recovery", () => {
  const core = new FarViewCore();
  core.observeDistance("c", 70, 1);
  assert.deepEqual(core.getTransitionHistory("c"), ["DISCOVERED", "VISIBLE", "FAR"]);
  core.observeDistance("c", 20, 2);
  assert.equal(core.getState("c"), "VISIBLE");
  core.release("c", 3);
  assert.equal(core.getState("c"), "RELEASED");
  assert.equal(core.clearReleased(), 1);
  assert.deepEqual(core.getTransitionHistory("c"), []);
});

test("far-view rejects illegal transitions and non-monotonic ticks", () => {
  const core = new FarViewCore();
  assert.equal(core.transition("bad", "FAR", 1), false);
  assert.equal(core.transition("bad", "DISCOVERED", 1), true);
  assert.equal(core.transition("bad", "FAR", 2), false);
  assert.equal(core.transition("bad", "VISIBLE", 2), true);
  assert.equal(core.transition("bad", "FAR", 1), false);
  assert.throws(() => core.observeDistance("", 4, 2));
});

test("far-view exhaustive boundaries", () => {
  const core = new FarViewCore();
  const cases: readonly (readonly [number, string])[] = [
    [0, "0-8"], [7.999, "0-8"], [8, "8-16"], [15.999, "8-16"],
    [16, "16-32"], [31.999, "16-32"], [32, "32-64"], [63.999, "32-64"],
    [64, "64-100"], [100, "64-100"],
  ];
  for (const [value, zone] of cases) assert.equal(core.classifyChunkDistance(value).zone, zone);
  for (const value of [100.001, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) assert.equal(core.classifyChunkDistance(value).zone, "OUT_OF_RANGE");
});

test("far-view invalid distance releases tracked state deterministically", () => {
  const core = new FarViewCore();
  core.observeDistance("c", 4, 1);
  assert.equal(core.observeDistance("c", Number.NaN, 2).zone, "OUT_OF_RANGE");
  assert.equal(core.getState("c"), "RELEASED");
});

test("far-view stale reclamation and bounded history work", () => {
  const core = new FarViewCore(2);
  core.observeDistance("a", 4, 1);
  core.observeDistance("b", 4, 2);
  assert.equal(core.reclaimStale(81, 80), 1);
  assert.equal(core.getState("a"), "RELEASED");
  assert.equal(core.getState("b"), "VISIBLE");
  assert.equal(core.reclaimStale(82, 79), 1);
  assert.equal(core.getState("b"), "RELEASED");
  for (let tick = 3; tick <= 20; tick++) core.observeDistance("a", tick % 2 === 0 ? 70 : 20, tick);
  assert.ok(core.getTransitionHistory("a").length <= 8);
});

test("far-view render capability reports engine limit instead of simulating rendering", () => {
  const core = new FarViewCore();
  assert.equal(core.renderCapability(32, 64).capability, "ENGINE_SUPPORTED");
  assert.equal(core.renderCapability(100, 64).capability, "ENGINE_LIMITED");
  assert.equal(core.renderCapability(100, null).capability, "ENGINE_LIMITED");
  assert.equal(core.renderCapability(Number.NaN, 64).capability, "NOT_IMPLEMENTABLE");
});

test("distance zones map to one authoritative scheduler priority mapping", () => {
  assert.equal(priorityForDistance("0-8"), "CRITICAL");
  assert.equal(priorityForDistance("8-16"), "NEAR");
  assert.equal(priorityForDistance("16-32"), "IMPORTANT");
  assert.equal(priorityForDistance("32-64"), "MID");
  assert.equal(priorityForDistance("64-100"), "FAR");
});

test("scheduler stays bounded under 10000 FAR requests", () => {
  const scheduler = new BoundedPriorityScheduler<number>({ maxQueue: 256, maxPerWindow: 32, maxWorkAgeTicks: 40 });
  let admitted = 0;
  for (let i = 0; i < 10_000; i++) if (scheduler.enqueue({ key: `far-${i}`, priority: "FAR", createdAtTick: i % 10, payload: i })) admitted++;
  assert.equal(admitted, 256);
  assert.equal(scheduler.size, 256);
  assert.equal(scheduler.stats().maxObservedQueue, 256);
  assert.equal(scheduler.drain(() => undefined, 32, 10), 32);
  assert.equal(scheduler.size, 224);
});

test("scheduler deduplicates repeated keys and permits higher priority replacement", () => {
  const scheduler = new BoundedPriorityScheduler<number>({ maxQueue: 2, maxPerWindow: 2 });
  assert.equal(scheduler.enqueue({ key: "x", priority: "FAR", createdAtTick: 1, payload: 1 }), true);
  assert.equal(scheduler.enqueue({ key: "x", priority: "FAR", createdAtTick: 2, payload: 2 }), false);
  assert.equal(scheduler.enqueue({ key: "x", priority: "CRITICAL", createdAtTick: 3, payload: 3 }), true);
  assert.equal(scheduler.peekPriority("x"), "CRITICAL");
});

test("scheduler evicts lowest priority under pressure and preserves critical", () => {
  const scheduler = new BoundedPriorityScheduler<number>({ maxQueue: 3, maxPerWindow: 1 });
  assert.equal(scheduler.enqueue({ key: "a", priority: "FAR", createdAtTick: 1, payload: 1 }), true);
  assert.equal(scheduler.enqueue({ key: "b", priority: "DECORATIVE", createdAtTick: 2, payload: 2 }), true);
  assert.equal(scheduler.enqueue({ key: "c", priority: "MID", createdAtTick: 3, payload: 3 }), true);
  assert.equal(scheduler.enqueue({ key: "critical", priority: "CRITICAL", createdAtTick: 4, payload: 4 }), true);
  assert.equal(scheduler.peekPriority("b"), undefined);
  let ran = "";
  scheduler.drain(item => { ran = item.key; }, 1, 4);
  assert.equal(ran, "critical");
});

test("scheduler cancellation and stale rejection work under pressure", () => {
  const scheduler = new BoundedPriorityScheduler<number>({ maxQueue: 4, maxPerWindow: 2, maxWorkAgeTicks: 5 });
  assert.equal(scheduler.enqueue({ key: "old", priority: "FAR", createdAtTick: 1, payload: 1 }), true);
  assert.equal(scheduler.enqueue({ key: "keep", priority: "FAR", createdAtTick: 10, payload: 2 }), true);
  assert.equal(scheduler.cancel("old"), true);
  assert.equal(scheduler.cancel("missing"), false);
  assert.equal(scheduler.rejectStale(20), 1);
  assert.equal(scheduler.size, 0);
  assert.ok(scheduler.stats().staleRejected >= 1);
});

test("continuous critical work dominates lower priority work without queue explosion", () => {
  const scheduler = new BoundedPriorityScheduler<number>({ maxQueue: 32, maxPerWindow: 1 });
  for (let tick = 0; tick < 100; tick++) {
    scheduler.enqueue({ key: `critical-${tick}`, priority: "CRITICAL", createdAtTick: tick, payload: tick });
    scheduler.enqueue({ key: `low-${tick}`, priority: "DECORATIVE", createdAtTick: tick, payload: tick });
  }
  assert.equal(scheduler.size, 32);
  let first = "";
  scheduler.drain(item => { first = item.key; }, 1, 100);
  assert.ok(first.startsWith("critical-"));
});

test("scheduler execution instrumentation records handler duration", () => {
  const scheduler = new BoundedPriorityScheduler<number>({ maxQueue: 4, maxPerWindow: 2 });
  scheduler.enqueue({ key: "x", priority: "CRITICAL", createdAtTick: 1, payload: 1 });
  scheduler.drain(() => { for (let i = 0; i < 10000; i++) Math.sqrt(i); }, 1, 1);
  assert.equal(scheduler.stats().executed, 1);
  assert.ok(scheduler.stats().executionTimeMsTotal >= 0);
});

test("playability protects all required gameplay classes from degrade", () => {
  const tracker = new GameplayPressureTracker(3);
  const shield = new PlayabilityShield(tracker);
  const protectedKinds = ["MOVEMENT","INPUT","CAMERA","COMBAT","INVENTORY","ITEM_USE","BLOCK_INTERACTION","BLOCK_BREAK","BLOCK_PLACE","NEAR_ENTITY","PROJECTILE","BOSS","PVP","IMPORTANT_EVENT","REDSTONE"] as const;
  tracker.mark("COMBAT", 0);
  for (const kind of protectedKinds) assert.equal(shield.shouldDegrade(kind, 1), false);
  assert.equal(shield.shouldDegrade("FAR", 1), true);
  assert.equal(shield.shouldDegrade("DECORATIVE", 1), true);
  assert.equal(shield.shouldDegrade("FAR", 4), false);
  assert.equal(shield.priorityFor("CAMERA"), "CRITICAL");
  assert.equal(shield.priorityFor("BOSS"), "CRITICAL");
  assert.equal(shield.isBossTypeId("minecraft:wither"), true);
  assert.equal(shield.isBossTypeId("minecraft:zombie"), false);
});

test("governor works without synthetic memory input", () => {
  const governor = new AdaptivePerformanceGovernor();
  assert.equal(governor.evaluate({ queueRatio: 1, workRatio: 1, localGameplayActive: true }), "CRITICAL");
  assert.equal(governor.workloadPolicy().allowFar, false);
  assert.equal(governor.workloadPolicy().allowDecorative, false);
  assert.equal(governor.workloadPolicy().executionBudget, 2);
});

test("all five adapters and seven attack types converge to central pipeline", () => {
  const api = makeApi();
  const adapters: WeaponAdapter[] = [
    new SwordAdapter(weapon("sword", "MELEE")),
    new AxeAdapter(weapon("axe", "HEAVY_MELEE")),
    new SpearAdapter(weapon("spear", "THRUST")),
    new BowAdapter(weapon("bow", "RANGED", { durabilityCost: 0 })),
    new CustomWeaponAdapter(weapon("custom", "SPECIAL")),
  ];
  const allTypes: WeaponDefinition["attackType"][] = ["MELEE", "HEAVY_MELEE", "THRUST", "SWEEP", "RANGED", "PROJECTILE", "SPECIAL"];
  for (const [index, attackType] of allTypes.entries()) {
    let adapter: WeaponAdapter;
    if (attackType === "MELEE") adapter = adapters[0];
    else if (attackType === "HEAVY_MELEE") adapter = adapters[1];
    else if (attackType === "THRUST") adapter = adapters[2];
    else if (attackType === "RANGED") adapter = adapters[3];
    else adapter = new CustomWeaponAdapter(weapon(`custom-${index}`, attackType, { durabilityCost: 0 }));
    const result = api.executeAdapter(adapter, { ...context, tick: 20 + index }, fullPort());
    assert.equal(result.accepted, true);
    assert.equal(result.armorStatus, "VERIFIED");
    assert.equal(result.resistanceStatus, "VERIFIED");
    assert.equal(result.deathStatus, "VERIFIED");
    assert.equal(result.lootStatus, "VERIFIED");
    assert.equal(result.xpStatus, "VERIFIED");
  }
});

test("accepted combat results cannot contain unverified mandatory stages", () => {
  const api = makeApi();
  const adapter = new SwordAdapter(weapon("sword", "MELEE"));
  const port: CombatExecutionPort = { resolveTarget: () => ({ id: "t", entity: {}, distance: 2 }), applyDamage: () => true, applyKnockback: () => undefined };
  const result = api.executeAdapter(adapter, context, port);
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "ARMOR_CAPABILITY_UNVERIFIED");
});

test("full combat pipeline keeps base modified final damage distinct", () => {
  const api = makeApi();
  const adapter = new SwordAdapter(weapon("sword", "MELEE", {
    modifiers: [{ id: "strength", multiplier: 2 }],
    effects: [{ id: "slowness", durationTicks: 20, amplifier: 1 }],
  }));
  const calls: string[] = [];
  const result = api.executeAdapter(adapter, { ...context, criticalEligible: true }, fullPort(calls));
  assert.equal(result.accepted, true);
  assert.equal(result.baseDamage, 10);
  assert.equal(result.modifiedDamage, 30);
  assert.equal(result.finalDamage, 25);
  assert.deepEqual(calls, ["resolve", "armor", "resistance", "damage:25", "knockback:2", "effect", "durability", "posthit"]);
});

test("weapon validation rejects missing and mismatched registration", () => {
  const registry = new WeaponRegistry();
  const api = new UniversalAttackAPI(new CooldownResolver(), new CriticalResolver(), new DamageResolver(), new KnockbackResolver(), registry);
  const request = new SwordAdapter(weapon("sword", "MELEE")).toAttackRequest(context);
  assert.equal(api.execute(request, fullPort()).reason, "WEAPON_UNREGISTERED");
  assert.equal(registry.register(weapon("sword", "MELEE")), true);
  assert.equal(api.execute({ ...request, attackType: "PROJECTILE" }, fullPort()).reason, "WEAPON_ATTACK_TYPE_MISMATCH");
});

test("combat rejects malformed modifier effect and tick inputs before mutation", () => {
  const api = makeApi();
  const base = new SwordAdapter(weapon("sword", "MELEE", { durabilityCost: 0 })).toAttackRequest(context);
  assert.equal(api.execute({ ...base, range: -1 }, fullPort()).reason, "INVALID_RANGE");
  assert.equal(api.execute({ ...base, effects: [{ id: "", durationTicks: 1, amplifier: 0 }] }, fullPort()).reason, "EFFECT_INVALID");
  assert.equal(api.execute({ ...base, modifiers: [{ id: "", multiplier: 2 }] }, fullPort()).reason, "MODIFIER_INVALID");
  assert.equal(api.execute({ ...base, direction: { x: Number.NaN, y: 0, z: 0 } }, fullPort()).reason, "DIRECTION_INVALID");
});

test("combat target and range validation run after mandatory capability gate", () => {
  const api = makeApi();
  const adapter = new SwordAdapter(weapon("sword", "MELEE", { durabilityCost: 0 }));
  const targetPort: CombatExecutionPort = { ...fullPort(), resolveTarget: () => ({ id: "wrong", entity: {}, distance: 1 }) };
  assert.equal(api.executeAdapter(adapter, context, targetPort).reason, "TARGET_INVALID");
  assert.equal(api.executeAdapter(adapter, { ...context, tick: 20 }, fullPort([], 4)).reason, "OUT_OF_RANGE");
});

test("cooldown blocks second attack after a fully verified execution", () => {
  const api = makeApi();
  const adapter = new SwordAdapter(weapon("sword", "MELEE", { durabilityCost: 0 }));
  assert.equal(api.executeAdapter(adapter, context, fullPort()).accepted, true);
  assert.equal(api.executeAdapter(adapter, { ...context, tick: 11 }, fullPort()).reason, "COOLDOWN");
});
