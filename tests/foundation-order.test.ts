import assert from "node:assert/strict";
import test from "node:test";
import {
  CooldownResolver,
  CriticalResolver,
  DamageResolver,
  KnockbackResolver,
  SwordAdapter,
  UniversalAttackAPI,
  type CombatExecutionPort,
} from "../src/core/combat.js";

const api = new UniversalAttackAPI(
  new CooldownResolver(),
  new CriticalResolver(),
  new DamageResolver(),
  new KnockbackResolver(),
);

const requestContext = {
  attackerId: "attacker",
  targetId: "target",
  direction: { x: 1, y: 0, z: 0 },
  tick: 100,
  criticalEligible: true,
} as const;

const weapon = new SwordAdapter({
  id: "foundation:sword",
  attackType: "MELEE",
  baseDamage: 10,
  range: 3,
  cooldownTicks: 5,
  knockback: 2,
  durabilityCost: 0,
  modifiers: [{ id: "power", multiplier: 2 }],
});

test("foundation combat ordering is critical -> armor -> resistance -> modifiers -> final", () => {
  const stages: string[] = [];
  const port: CombatExecutionPort = {
    resolveTarget: () => {
      stages.push("target");
      return { id: "target", entity: {}, distance: 2 };
    },
    mitigateArmorDamage: (_target, _request, incoming) => {
      stages.push(`armor:${incoming}`);
      return incoming - 3;
    },
    mitigateResistanceDamage: (_target, _request, incoming) => {
      stages.push(`resistance:${incoming}`);
      return incoming - 2;
    },
    commit: (_request, _target, plan) => {
      stages.push(`commit:${plan.finalDamage}`);
      return {
        committed: true,
        effectStatuses: ["NOT_APPLICABLE"],
        durabilityStatus: "NOT_APPLICABLE",
        projectileStatus: "NOT_APPLICABLE",
        deathStatus: "VERIFIED",
        lootStatus: "VERIFIED",
        xpStatus: "VERIFIED",
      };
    },
  };

  const result = api.executeAdapter(weapon, requestContext, port);
  assert.equal(result.accepted, true);
  assert.equal(result.baseDamage, 10);
  assert.equal(result.modifiedDamage, 20);
  assert.equal(result.finalDamage, 20);
  assert.deepEqual(stages, [
    "target",
    "armor:15",
    "resistance:12",
    "commit:20",
  ]);
});
