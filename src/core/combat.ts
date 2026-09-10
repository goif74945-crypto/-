import type { AttackRequest, AttackType, CombatEffect, CombatResult, CombatModifier, Vec3 } from "./types.js";

const ATTACK_TYPES = new Set<AttackType>([
  "MELEE", "HEAVY_MELEE", "THRUST", "SWEEP", "RANGED", "PROJECTILE", "SPECIAL",
]);

export type CombatStageStatus = "VERIFIED" | "NOT_VERIFIED" | "NOT_APPLICABLE" | "FAILED";

export interface WeaponDefinition {
  readonly id: string;
  readonly attackType: AttackType;
  readonly baseDamage: number;
  readonly range: number;
  readonly cooldownTicks: number;
  readonly knockback: number;
  readonly durabilityCost: number;
  readonly modifiers?: readonly CombatModifier[];
  readonly effects?: readonly CombatEffect[];
}

export interface AttackContext {
  readonly attackerId: string;
  readonly targetId: string;
  readonly direction: Vec3;
  readonly tick: number;
  readonly criticalEligible: boolean;
}

export interface WeaponAdapter {
  readonly definition: WeaponDefinition;
  toAttackRequest(context: AttackContext): AttackRequest;
}

abstract class BaseAdapter implements WeaponAdapter {
  public constructor(public readonly definition: WeaponDefinition) {}
  public toAttackRequest(context: AttackContext): AttackRequest {
    return {
      attackerId: context.attackerId,
      weaponId: this.definition.id,
      targetId: context.targetId,
      attackType: this.definition.attackType,
      direction: context.direction,
      range: this.definition.range,
      baseDamage: this.definition.baseDamage,
      cooldownTicks: this.definition.cooldownTicks,
      criticalEligible: context.criticalEligible,
      knockback: this.definition.knockback,
      durabilityCost: this.definition.durabilityCost,
      modifiers: this.definition.modifiers ?? [],
      effects: this.definition.effects ?? [],
      tick: context.tick,
    };
  }
}

export class SwordAdapter extends BaseAdapter {}
export class AxeAdapter extends BaseAdapter {}
export class SpearAdapter extends BaseAdapter {}
export class BowAdapter extends BaseAdapter {}
export class CustomWeaponAdapter extends BaseAdapter {}

export class WeaponRegistry {
  private readonly weapons = new Map<string, WeaponDefinition>();

  public constructor(private readonly maxEntries = 512) {
    if (maxEntries <= 0) throw new Error("maxEntries must be positive");
  }

  public register(definition: WeaponDefinition): boolean {
    if (!isValidWeaponDefinition(definition)) return false;
    if (!this.weapons.has(definition.id) && this.weapons.size >= this.maxEntries) return false;
    this.weapons.set(definition.id, definition);
    return true;
  }

  public get(id: string): WeaponDefinition | undefined {
    return this.weapons.get(id);
  }

  public get size(): number {
    return this.weapons.size;
  }
}

export class CooldownResolver {
  private readonly readyAt = new Map<string, number>();

  public constructor(private readonly maxEntries = 4096) {
    if (maxEntries <= 0) throw new Error("maxEntries must be positive");
  }

  public validate(key: string, tick: number): number | null {
    this.prune(tick);
    const readyAt = this.readyAt.get(key) ?? 0;
    return tick >= readyAt ? null : readyAt;
  }

  public commit(key: string, tick: number, cooldownTicks: number): number {
    this.prune(tick);
    const next = tick + Math.max(0, cooldownTicks);
    if (!this.readyAt.has(key) && this.readyAt.size >= this.maxEntries) this.evictEarliest();
    this.readyAt.set(key, next);
    return next;
  }

  private prune(tick: number): void {
    for (const [key, readyAt] of this.readyAt) if (readyAt <= tick) this.readyAt.delete(key);
  }

  private evictEarliest(): void {
    let victim: string | undefined;
    let earliest = Number.POSITIVE_INFINITY;
    for (const [key, readyAt] of this.readyAt) {
      if (readyAt < earliest) {
        earliest = readyAt;
        victim = key;
      }
    }
    if (victim !== undefined) this.readyAt.delete(victim);
  }

  public get size(): number {
    return this.readyAt.size;
  }
}

export class CriticalResolver {
  public resolve(eligible: boolean, baseDamage: number): { critical: boolean; damage: number } {
    if (!eligible) return { critical: false, damage: baseDamage };
    return { critical: true, damage: baseDamage * 1.5 };
  }
}

export class DamageResolver {
  public resolve(baseDamage: number, modifiers: readonly CombatModifier[]): number {
    return Math.max(0, modifiers.reduce((damage, modifier) => damage * modifier.multiplier, baseDamage));
  }
}

export class KnockbackResolver {
  public resolve(direction: Vec3, strength: number): Vec3 {
    const magnitude = Math.hypot(direction.x, direction.y, direction.z);
    if (magnitude === 0 || strength <= 0) return { x: 0, y: 0, z: 0 };
    return { x: direction.x / magnitude * strength, y: direction.y / magnitude * strength, z: direction.z / magnitude * strength };
  }
}

export interface ResolvedCombatTarget {
  readonly id: string;
  readonly entity: unknown;
  readonly distance: number;
}

export interface CombatExecutionPort {
  resolveTarget(request: AttackRequest): ResolvedCombatTarget | undefined;
  applyDamage(target: ResolvedCombatTarget, damage: number): boolean;
  applyKnockback(target: ResolvedCombatTarget, impulse: Vec3): void;
  mitigateDamage?: (target: ResolvedCombatTarget, request: AttackRequest, incomingDamage: number) => number;
  applyEffect?: (target: ResolvedCombatTarget, effect: CombatEffect) => boolean;
  applyDurability?: (request: AttackRequest) => boolean;
  resolveProjectileResult?: (request: AttackRequest, target: ResolvedCombatTarget) => CombatStageStatus;
  resolveDeathLootXp?: (request: AttackRequest, target: ResolvedCombatTarget) => { death: CombatStageStatus; loot: CombatStageStatus; xp: CombatStageStatus };
}

export class UniversalAttackAPI {
  public readonly weapons: WeaponRegistry;

  public constructor(
    private readonly cooldown: CooldownResolver,
    private readonly critical: CriticalResolver,
    private readonly damage: DamageResolver,
    private readonly knockback: KnockbackResolver,
    weapons = new WeaponRegistry(),
  ) {
    this.weapons = weapons;
  }

  public executeAdapter(adapter: WeaponAdapter, context: AttackContext, port: CombatExecutionPort): CombatResult {
    if (!this.weapons.register(adapter.definition)) return this.reject(adapter.toAttackRequest(context), "WEAPON_INVALID");
    return this.execute(adapter.toAttackRequest(context), port);
  }

  public execute(request: AttackRequest, port: CombatExecutionPort): CombatResult {
    const validation = this.validateRequest(request);
    if (validation) return this.reject(request, validation);

    const registeredWeapon = this.weapons.get(request.weaponId);
    if (!registeredWeapon) return this.reject(request, "WEAPON_UNREGISTERED");
    if (registeredWeapon.attackType !== request.attackType) return this.reject(request, "WEAPON_ATTACK_TYPE_MISMATCH");
    if (registeredWeapon.range !== request.range) return this.reject(request, "WEAPON_RANGE_MISMATCH");

    const target = port.resolveTarget(request);
    if (!target || target.id !== request.targetId || target.entity === undefined || target.entity === null) return this.reject(request, "TARGET_INVALID");
    if (!Number.isFinite(target.distance) || target.distance > request.range) return this.reject(request, "OUT_OF_RANGE");

    const cooldownKey = `${request.attackerId}:${request.weaponId}`;
    const blockedUntil = this.cooldown.validate(cooldownKey, request.tick);
    if (blockedUntil !== null) return this.reject(request, "COOLDOWN", blockedUntil);

    const critical = this.critical.resolve(request.criticalEligible, request.baseDamage);
    const modifiedDamage = this.damage.resolve(critical.damage, request.modifiers);
    if (!Number.isFinite(modifiedDamage) || modifiedDamage < 0) return this.reject(request, "DAMAGE_INVALID");

    let finalDamage = modifiedDamage;
    let armorStatus: CombatStageStatus = "NOT_VERIFIED";
    if (port.mitigateDamage) {
      try {
        const mitigated = port.mitigateDamage(target, request, modifiedDamage);
        if (!Number.isFinite(mitigated) || mitigated < 0) return this.reject(request, "MITIGATION_INVALID");
        finalDamage = mitigated;
        armorStatus = "VERIFIED";
      } catch {
        armorStatus = "FAILED";
      }
    }

    if (!port.applyDamage(target, finalDamage)) return this.reject(request, "DAMAGE_REJECTED");

    const impulse = this.knockback.resolve(request.direction, request.knockback);
    port.applyKnockback(target, impulse);

    const effectStatuses: CombatStageStatus[] = [];
    if (request.effects.length === 0) {
      effectStatuses.push("NOT_APPLICABLE");
    } else if (!port.applyEffect) {
      effectStatuses.push(...request.effects.map(() => "NOT_VERIFIED" as const));
    } else {
      for (const effect of request.effects) effectStatuses.push(port.applyEffect(target, effect) ? "VERIFIED" : "FAILED");
    }

    let durabilityStatus: CombatStageStatus = "NOT_VERIFIED";
    if (request.durabilityCost === 0) durabilityStatus = "NOT_APPLICABLE";
    else if (port.applyDurability) durabilityStatus = port.applyDurability(request) ? "VERIFIED" : "FAILED";

    const projectileStatus = (request.attackType === "PROJECTILE" || request.attackType === "RANGED")
      ? port.resolveProjectileResult ? safeStage(() => port.resolveProjectileResult!(request, target)) : "NOT_VERIFIED"
      : "NOT_APPLICABLE";

    const postHit = port.resolveDeathLootXp
      ? safePostHit(() => port.resolveDeathLootXp!(request, target))
      : { death: "NOT_VERIFIED" as const, loot: "NOT_VERIFIED" as const, xp: "NOT_VERIFIED" as const };

    const cooldownReadyAt = this.cooldown.commit(cooldownKey, request.tick, request.cooldownTicks);
    return {
      accepted: true,
      reason: undefined,
      baseDamage: request.baseDamage,
      modifiedDamage,
      finalDamage,
      critical: critical.critical,
      knockback: impulse,
      cooldownReadyAt,
      durabilityCost: request.durabilityCost,
      armorStatus,
      resistanceStatus: armorStatus,
      effectStatuses,
      durabilityStatus,
      projectileStatus,
      deathStatus: postHit.death,
      lootStatus: postHit.loot,
      xpStatus: postHit.xp,
    };
  }

  private validateRequest(request: AttackRequest): string | undefined {
    if (!ATTACK_TYPES.has(request.attackType)) return "ATTACK_TYPE_INVALID";
    if (!request.weaponId || !request.attackerId || !request.targetId) return "IDENTITY_INVALID";
    if (!Number.isFinite(request.baseDamage) || request.baseDamage < 0) return "INVALID_DAMAGE";
    if (!Number.isFinite(request.range) || request.range < 0) return "INVALID_RANGE";
    if (!Number.isFinite(request.cooldownTicks) || request.cooldownTicks < 0) return "INVALID_COOLDOWN";
    if (!Number.isFinite(request.knockback) || request.knockback < 0) return "INVALID_KNOCKBACK";
    if (!Number.isFinite(request.durabilityCost) || request.durabilityCost < 0) return "INVALID_DURABILITY";
    if (!Array.isArray(request.modifiers) || request.modifiers.some(modifier => !modifier.id || !Number.isFinite(modifier.multiplier) || modifier.multiplier < 0)) return "MODIFIER_INVALID";
    if (!Array.isArray(request.effects) || request.effects.some(effect => !effect.id || !Number.isInteger(effect.durationTicks) || effect.durationTicks < 0 || !Number.isInteger(effect.amplifier) || effect.amplifier < 0)) return "EFFECT_INVALID";
    if (!Number.isFinite(request.direction.x) || !Number.isFinite(request.direction.y) || !Number.isFinite(request.direction.z)) return "DIRECTION_INVALID";
    if (!Number.isInteger(request.tick) || request.tick < 0) return "TICK_INVALID";
    return undefined;
  }

  private reject(request: AttackRequest, reason: string, blockedUntil = request.tick): CombatResult {
    return {
      accepted: false,
      reason,
      baseDamage: request.baseDamage,
      modifiedDamage: 0,
      finalDamage: 0,
      critical: false,
      knockback: { x: 0, y: 0, z: 0 },
      cooldownReadyAt: blockedUntil,
      durabilityCost: 0,
      armorStatus: "NOT_VERIFIED",
      resistanceStatus: "NOT_VERIFIED",
      effectStatuses: [],
      durabilityStatus: "NOT_VERIFIED",
      projectileStatus: "NOT_APPLICABLE",
      deathStatus: "NOT_VERIFIED",
      lootStatus: "NOT_VERIFIED",
      xpStatus: "NOT_VERIFIED",
    };
  }
}

function isValidWeaponDefinition(definition: WeaponDefinition): boolean {
  return Boolean(definition.id)
    && ATTACK_TYPES.has(definition.attackType)
    && Number.isFinite(definition.baseDamage) && definition.baseDamage >= 0
    && Number.isFinite(definition.range) && definition.range >= 0
    && Number.isFinite(definition.cooldownTicks) && definition.cooldownTicks >= 0
    && Number.isFinite(definition.knockback) && definition.knockback >= 0
    && Number.isFinite(definition.durabilityCost) && definition.durabilityCost >= 0
    && (definition.modifiers ?? []).every(modifier => Boolean(modifier.id) && Number.isFinite(modifier.multiplier) && modifier.multiplier >= 0)
    && (definition.effects ?? []).every(effect => Boolean(effect.id) && Number.isInteger(effect.durationTicks) && effect.durationTicks >= 0 && Number.isInteger(effect.amplifier) && effect.amplifier >= 0);
}

function safeStage(run: () => CombatStageStatus): CombatStageStatus {
  try {
    return run();
  } catch {
    return "FAILED";
  }
}

function safePostHit(run: () => { death: CombatStageStatus; loot: CombatStageStatus; xp: CombatStageStatus }): { death: CombatStageStatus; loot: CombatStageStatus; xp: CombatStageStatus } {
  try {
    return run();
  } catch {
    return { death: "FAILED", loot: "FAILED", xp: "FAILED" };
  }
}
