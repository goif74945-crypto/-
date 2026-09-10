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
  readonly tick: number;
}

export interface CombatResult {
  readonly accepted: boolean;
  readonly reason?: string;
  readonly finalDamage: number;
  readonly critical: boolean;
  readonly knockback: Vec3;
  readonly cooldownReadyAt: number;
  readonly durabilityCost: number;
}

export interface WorkItem<T> {
  readonly key: string;
  readonly priority: Priority;
  readonly createdAtTick: number;
  readonly payload: T;
}
