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
    if (!Number.isInteger(maxEntries) || maxEntries <= 0) throw new Error("maxEntries must be a positive integer");
  }
  public register(definition: WeaponDefinition): boolean {
    if (!isValidWeaponDefinition(definition)) return false;
    if (!this.weapons.has(definition.id) && this.weapons.size >= this.maxEntries) return false;
    this.weapons.set(definition.id, definition);
    return true;
  }
  public unregister(id: string): boolean { return this.weapons.delete(id); }
  public get(id: string): WeaponDefinition | undefined { return this.weapons.get(id); }
  public get size(): number { return this.weapons.size; }
}

export class CooldownResolver {
  private readonly readyAt = new Map<string, number>();
  public constructor(private readonly maxEntries = 4096) {
    if (!Number.isInteger(maxEntries) || maxEntries <= 0) throw new Error("maxEntries must be a positive integer");
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
  private prune(tick: number): void { for (const [key, readyAt] of this.readyAt) if (readyAt <= tick) this.readyAt.delete(key); }
  private evictEarliest(): void {
    let victim: string | undefined;
    let earliest = Number.POSITIVE_INFINITY;
    for (const [key, readyAt] of this.readyAt) if (readyAt < earliest) { earliest = readyAt; victim = key; }
    if (victim !== undefined) this.readyAt.delete(victim);
  }
  public get size(): number { return this.readyAt.size; }
}

export class CriticalResolver {
  public resolve(eligible: boolean, baseDamage: number): { critical: boolean; damage: number } {
    return eligible ? { critical: true, damage: baseDamage * 1.5 } : { critical: false, damage: baseDamage };
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

export interface ResolvedCombatTarget { readonly id: string; readonly entity: unknown; readonly distance: number; }

export interface CombatCommitPlan {
  readonly finalDamage: number;
  readonly impulse: Vec3;
  readonly armorStatus: CombatStageStatus;
  readonly resistanceStatus: CombatStageStatus;
  readonly projectileStatus: CombatStageStatus;
}

export interface CombatCommitResult {
  readonly committed: boolean;
  readonly effectStatuses: readonly CombatStageStatus[];
  readonly durabilityStatus: CombatStageStatus;
  readonly projectileStatus: CombatStageStatus;
  readonly deathStatus: CombatStageStatus;
  readonly lootStatus: CombatStageStatus;
  readonly xpStatus: CombatStageStatus;
}

export interface CombatExecutionPort {
  resolveTarget(request: AttackRequest): ResolvedCombatTarget | undefined;
  mitigateArmorDamage?: (target: ResolvedCombatTarget, request: AttackRequest, incomingDamage: number) => number;
  mitigateResistanceDamage?: (target: ResolvedCombatTarget, request: AttackRequest, incomingDamage: number) => number;
  commit: (request: AttackRequest, target: ResolvedCombatTarget, plan: CombatCommitPlan) => CombatCommitResult;
}

export class UniversalAttackAPI {
  public readonly weapons: WeaponRegistry;
  public constructor(
    private readonly cooldown: CooldownResolver,
    private readonly critical: CriticalResolver,
    private readonly damage: DamageResolver,
    private readonly knockback: KnockbackResolver,
    weapons = new WeaponRegistry(),
  ) { this.weapons = weapons; }

  public executeAdapter(adapter: WeaponAdapter, context: AttackContext, port: CombatExecutionPort): CombatResult {
    const request = adapter.toAttackRequest(context);
    const validation = this.validateRequest(request);
    if (validation) return this.reject(request, validation);
    if (!isValidWeaponDefinition(adapter.definition)) return this.reject(request, "WEAPON_INVALID");

    const existing = this.weapons.get(adapter.definition.id);
    if (existing && !weaponDefinitionsEqual(existing, adapter.definition)) {
      return this.reject(request, "WEAPON_DEFINITION_CONFLICT");
    }

    const registeredHere = existing === undefined;
    if (registeredHere && !this.weapons.register(adapter.definition)) return this.reject(request, "WEAPON_INVALID");

    const result = this.execute(request, port);
    if (!result.accepted && registeredHere) this.weapons.unregister(adapter.definition.id);
    return result;
  }

  public execute(request: AttackRequest, port: CombatExecutionPort): CombatResult {
    const validation = this.validateRequest(request);
    if (validation) return this.reject(request, validation);
    const registeredWeapon = this.weapons.get(request.weaponId);
    if (!registeredWeapon) return this.reject(request, "WEAPON_UNREGISTERED");
    if (registeredWeapon.attackType !== request.attackType) return this.reject(request, "WEAPON_ATTACK_TYPE_MISMATCH");
    if (registeredWeapon.range !== request.range) return this.reject(request, "WEAPON_RANGE_MISMATCH");
    if (!port.commit) return this.reject(request, "ATOMIC_COMMIT_UNAVAILABLE");

    const target = port.resolveTarget(request);
    if (!target || target.id !== request.targetId || target.entity === undefined || target.entity === null) return this.reject(request, "TARGET_INVALID");
    if (!Number.isFinite(target.distance) || target.distance > request.range) return this.reject(request, "OUT_OF_RANGE");

    const cooldownKey = `${request.attackerId}:${request.weaponId}`;
    const blockedUntil = this.cooldown.validate(cooldownKey, request.tick);
    if (blockedUntil !== null) return this.reject(request, "COOLDOWN", blockedUntil);

    const critical = this.critical.resolve(request.criticalEligible, request.baseDamage);
    if (!Number.isFinite(critical.damage) || critical.damage < 0) return this.reject(request, "CRITICAL_DAMAGE_INVALID");

    let postArmorDamage = critical.damage;
    let armorStatus: CombatStageStatus = "NOT_VERIFIED";
    if (port.mitigateArmorDamage) {
      const result = safeNumberStage(() => port.mitigateArmorDamage!(target, request, postArmorDamage));
      if (result.status === "FAILED") return this.reject(request, "ARMOR_FAILED");
      postArmorDamage = result.value;
      armorStatus = "VERIFIED";
    } else return this.reject(request, "ARMOR_CAPABILITY_UNVERIFIED");

    let postResistanceDamage = postArmorDamage;
    let resistanceStatus: CombatStageStatus = "NOT_VERIFIED";
    if (port.mitigateResistanceDamage) {
      const result = safeNumberStage(() => port.mitigateResistanceDamage!(target, request, postArmorDamage));
      if (result.status === "FAILED") return this.reject(request, "RESISTANCE_FAILED");
      postResistanceDamage = result.value;
      resistanceStatus = "VERIFIED";
    } else return this.reject(request, "RESISTANCE_CAPABILITY_UNVERIFIED");

    const modifiedDamage = this.damage.resolve(postResistanceDamage, request.modifiers);
    if (!Number.isFinite(modifiedDamage) || modifiedDamage < 0) return this.reject(request, "DAMAGE_INVALID");
    const finalDamage = modifiedDamage;

    const impulse = this.knockback.resolve(request.direction, request.knockback);
    const projectileStatus: CombatStageStatus = (request.attackType === "PROJECTILE" || request.attackType === "RANGED") ? "NOT_VERIFIED" : "NOT_APPLICABLE";
    const plan: CombatCommitPlan = { finalDamage, impulse, armorStatus, resistanceStatus, projectileStatus };

    let commit: CombatCommitResult;
    try { commit = port.commit(request, target, plan); }
    catch { return this.reject(request, "COMMIT_EXCEPTION"); }
    if (!commit.committed) return this.rejectWithStages(request, "COMMIT_REJECTED", commit, projectileStatus);

    const mandatory = [
      ...commit.effectStatuses,
      commit.durabilityStatus,
      commit.projectileStatus,
      commit.deathStatus,
      commit.lootStatus,
      commit.xpStatus,
    ];
    if (mandatory.some(status => status !== "VERIFIED" && status !== "NOT_APPLICABLE")) {
      throw new Error("COMMIT_CONTRACT_VIOLATION: committed transaction returned an unverified mandatory stage");
    }

    const cooldownReadyAt = this.cooldown.commit(cooldownKey, request.tick, request.cooldownTicks);
    return {
      accepted: true,
      baseDamage: request.baseDamage,
      modifiedDamage,
      finalDamage,
      critical: critical.critical,
      knockback: impulse,
      cooldownReadyAt,
      durabilityCost: request.durabilityCost,
      armorStatus,
      resistanceStatus,
      effectStatuses: commit.effectStatuses,
      durabilityStatus: commit.durabilityStatus,
      projectileStatus: commit.projectileStatus,
      deathStatus: commit.deathStatus,
      lootStatus: commit.lootStatus,
      xpStatus: commit.xpStatus,
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

  private rejectWithStages(request: AttackRequest, reason: string, commit: CombatCommitResult, fallbackProjectile: CombatStageStatus): CombatResult {
    return {
      accepted: false,
      reason,
      baseDamage: request.baseDamage,
      modifiedDamage: 0,
      finalDamage: 0,
      critical: false,
      knockback: { x: 0, y: 0, z: 0 },
      cooldownReadyAt: request.tick,
      durabilityCost: 0,
      armorStatus: "NOT_VERIFIED",
      resistanceStatus: "NOT_VERIFIED",
      effectStatuses: commit.effectStatuses,
      durabilityStatus: commit.durabilityStatus,
      projectileStatus: commit.projectileStatus === "NOT_APPLICABLE" ? fallbackProjectile : commit.projectileStatus,
      deathStatus: commit.deathStatus,
      lootStatus: commit.lootStatus,
      xpStatus: commit.xpStatus,
    };
  }
}

function weaponDefinitionsEqual(a: WeaponDefinition, b: WeaponDefinition): boolean {
  if (a.id !== b.id || a.attackType !== b.attackType || a.baseDamage !== b.baseDamage || a.range !== b.range || a.cooldownTicks !== b.cooldownTicks || a.knockback !== b.knockback || a.durabilityCost !== b.durabilityCost) return false;
  if (!modifiersEqual(a.modifiers ?? [], b.modifiers ?? [])) return false;
  const ae = a.effects ?? [];
  const be = b.effects ?? [];
  return ae.length === be.length && ae.every((effect, index) => {
    const other = be[index];
    return Boolean(other) && effect.id === other.id && effect.durationTicks === other.durationTicks && effect.amplifier === other.amplifier;
  });
}

function modifiersEqual(a: readonly CombatModifier[], b: readonly CombatModifier[]): boolean {
  return a.length === b.length && a.every((modifier, index) => {
    const other = b[index];
    return Boolean(other) && modifier.id === other.id && modifier.multiplier === other.multiplier;
  });
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

function safeNumberStage(run: () => number): { status: "VERIFIED" | "FAILED"; value: number } {
  try { const value = run(); return Number.isFinite(value) && value >= 0 ? { status: "VERIFIED", value } : { status: "FAILED", value: 0 }; }
  catch { return { status: "FAILED", value: 0 }; }
}
