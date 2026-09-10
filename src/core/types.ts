export type Priority = "CRITICAL" | "NEAR" | "IMPORTANT" | "MID" | "FAR" | "DECORATIVE";
export type DistanceZone = "0-8" | "8-16" | "16-32" | "32-64" | "64-100" | "OUT_OF_RANGE";
export type ChunkState = "UNKNOWN" | "DISCOVERED" | "VISIBLE" | "FAR" | "RELEASED";

export type AttackType =
  | "MELEE"
  | "HEAVY_MELEE"
  | "THRUST"
  | "SWEEP"
  | "RANGED"
  | "PROJECTILE"
  | "SPECIAL";

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface CombatModifier {
  readonly id: string;
  readonly multiplier: number;
}

export interface CombatEffect {
  readonly id: string;
  readonly durationTicks: number;
  readonly amplifier: number;
}

export interface AttackRequest {
  readonly attackerId: string;
  readonly weaponId: string;
  readonly targetId: string;
  readonly attackType: AttackType;
  readonly direction: Vec3;
  readonly range: number;
  readonly baseDamage: number;
  readonly cooldownTicks: number;
  readonly criticalEligible: boolean;
  readonly knockback: number;
  readonly durabilityCost: number;
  readonly modifiers: readonly CombatModifier[];
  readonly effects: readonly CombatEffect[];
  readonly tick: number;
}

export interface CombatResult {
  readonly accepted: boolean;
  readonly reason?: string;
  readonly baseDamage: number;
  readonly modifiedDamage: number;
  readonly finalDamage: number;
  readonly critical: boolean;
  readonly knockback: Vec3;
  readonly cooldownReadyAt: number;
  readonly durabilityCost: number;
  readonly armorStatus: "VERIFIED" | "NOT_VERIFIED" | "NOT_APPLICABLE" | "FAILED";
  readonly resistanceStatus: "VERIFIED" | "NOT_VERIFIED" | "NOT_APPLICABLE" | "FAILED";
  readonly effectStatuses: readonly ("VERIFIED" | "NOT_VERIFIED" | "NOT_APPLICABLE" | "FAILED")[];
  readonly durabilityStatus: "VERIFIED" | "NOT_VERIFIED" | "NOT_APPLICABLE" | "FAILED";
  readonly projectileStatus: "VERIFIED" | "NOT_VERIFIED" | "NOT_APPLICABLE" | "FAILED";
  readonly deathStatus: "VERIFIED" | "NOT_VERIFIED" | "NOT_APPLICABLE" | "FAILED";
  readonly lootStatus: "VERIFIED" | "NOT_VERIFIED" | "NOT_APPLICABLE" | "FAILED";
  readonly xpStatus: "VERIFIED" | "NOT_VERIFIED" | "NOT_APPLICABLE" | "FAILED";
}

export interface WorkItem<T> {
  readonly key: string;
  readonly priority: Priority;
  readonly createdAtTick: number;
  readonly expiresAtTick?: number;
  readonly payload: T;
}
