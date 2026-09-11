import assert from "node:assert/strict";
import test from "node:test";
import {
  CooldownResolver,
  CriticalResolver,
  DamageResolver,
  KnockbackResolver,
  SwordAdapter,
  UniversalAttackAPI,
  WeaponRegistry,
  type CombatExecutionPort,
} from "../src/core/combat.js";

const context = {
  attackerId: "attacker",
  targetId: "target",
  direction: { x: 1, y: 0, z: 0 },
  tick: 10,
  criticalEligible: false,
} as const;

const weapon = new SwordAdapter({
  id: "foundation:validation",
  attackType: "MELEE",
  baseDamage: 10,
  range: 3,
  cooldownTicks: 5,
  knockback: 2,
  durabilityCost: 0,
});

const port: CombatExecutionPort = {
  resolveTarget: () => ({ id: "target", entity: {}, distance: 2 }),
  mitigateArmorDamage: (_target, _request, incoming) => incoming,
  mitigateResistanceDamage: (_target, _request, incoming) => incoming,
  commit: () => ({
    committed: false,
    effectStatuses: [],
    durabilityStatus: "NOT_VERIFIED",
    projectileStatus: "NOT_APPLICABLE",
    deathStatus: "NOT_VERIFIED",
    lootStatus: "NOT_VERIFIED",
    xpStatus: "NOT_VERIFIED",
  }),
};

test("invalid adapter requests are rejected before weapon registry mutation", () => {
  const registry = new WeaponRegistry();
  const api = new UniversalAttackAPI(
    new CooldownResolver(),
    new CriticalResolver(),
    new DamageResolver(),
    new KnockbackResolver(),
    registry,
  );

  const result = api.executeAdapter(
    weapon,
    { ...context, direction: { x: Number.NaN, y: 0, z: 0 } },
    port,
  );

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "DIRECTION_INVALID");
  assert.equal(registry.size, 0);
});

test("rejected target execution rolls back newly registered adapter state", () => {
  const registry = new WeaponRegistry();
  const api = new UniversalAttackAPI(
    new CooldownResolver(),
    new CriticalResolver(),
    new DamageResolver(),
    new KnockbackResolver(),
    registry,
  );
  const result = api.executeAdapter(weapon, context, {
    ...port,
    resolveTarget: () => undefined,
  });
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "TARGET_INVALID");
  assert.equal(registry.size, 0);
});

test("rejected commit execution rolls back newly registered adapter state", () => {
  const registry = new WeaponRegistry();
  const api = new UniversalAttackAPI(
    new CooldownResolver(),
    new CriticalResolver(),
    new DamageResolver(),
    new KnockbackResolver(),
    registry,
  );
  const result = api.executeAdapter(weapon, context, port);
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "COMMIT_REJECTED");
  assert.equal(registry.size, 0);
});

test("conflicting adapter definition cannot overwrite an existing weapon", () => {
  const registry = new WeaponRegistry();
  const api = new UniversalAttackAPI(
    new CooldownResolver(),
    new CriticalResolver(),
    new DamageResolver(),
    new KnockbackResolver(),
    registry,
  );
  assert.equal(registry.register(weapon.definition), true);
  const conflicting = new SwordAdapter({ ...weapon.definition, baseDamage: 99 });
  const result = api.executeAdapter(conflicting, context, port);
  assert.equal(result.accepted, false);
  assert.equal(result.reason, "WEAPON_DEFINITION_CONFLICT");
  assert.equal(registry.get(weapon.definition.id)?.baseDamage, 10);
  assert.equal(registry.size, 1);
});
