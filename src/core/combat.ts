import type { AttackRequest, AttackType, CombatResult, CombatModifier, Vec3 } from "./types.js";

export interface WeaponDefinition {
  readonly id: string;
  readonly attackType: AttackType;
  readonly baseDamage: number;
  readonly range: number;
  readonly cooldownTicks: number;
  readonly knockback: number;
  readonly durabilityCost: number;
  readonly modifiers?: readonly CombatModifier[];
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
      tick: context.tick,
    };
  }
}

export class SwordAdapter extends BaseAdapter {}
export class AxeAdapter extends BaseAdapter {}
export class SpearAdapter extends BaseAdapter {}
export class BowAdapter extends BaseAdapter {}
export class CustomWeaponAdapter extends BaseAdapter {}

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

export interface CombatExecutionPort {
  validateTarget(request: AttackRequest): boolean;
  applyDamage(request: AttackRequest, damage: number): boolean;
  applyKnockback(request: AttackRequest, impulse: Vec3): void;
}

export class UniversalAttackAPI {
  public constructor(
    private readonly cooldown: CooldownResolver,
    private readonly critical: CriticalResolver,
    private readonly damage: DamageResolver,
    private readonly knockback: KnockbackResolver,
  ) {}

  public execute(request: AttackRequest, port: CombatExecutionPort): CombatResult {
    if (!Number.isFinite(request.baseDamage) || request.baseDamage < 0) return this.reject(request, "INVALID_DAMAGE");
    if (!Number.isFinite(request.range) || request.range < 0) return this.reject(request, "INVALID_RANGE");
    if (!Number.isFinite(request.cooldownTicks) || request.cooldownTicks < 0) return this.reject(request, "INVALID_COOLDOWN");
    if (!Number.isFinite(request.knockback) || request.knockback < 0) return this.reject(request, "INVALID_KNOCKBACK");
    if (!port.validateTarget(request)) return this.reject(request, "TARGET_INVALID");

    const cooldownKey = `${request.attackerId}:${request.weaponId}`;
    const blockedUntil = this.cooldown.validate(cooldownKey, request.tick);
    if (blockedUntil !== null) return this.reject(request, "COOLDOWN", blockedUntil);

    const critical = this.critical.resolve(request.criticalEligible, request.baseDamage);
    const finalDamage = this.damage.resolve(critical.damage, request.modifiers);
    const impulse = this.knockback.resolve(request.direction, request.knockback);
    if (!port.applyDamage(request, finalDamage)) return this.reject(request, "DAMAGE_REJECTED");

    port.applyKnockback(request, impulse);
    const cooldownReadyAt = this.cooldown.commit(cooldownKey, request.tick, request.cooldownTicks);
    return { accepted: true, finalDamage, critical: critical.critical, knockback: impulse, cooldownReadyAt, durabilityCost: request.durabilityCost };
  }

  private reject(request: AttackRequest, reason: string, blockedUntil = request.tick): CombatResult {
    return { accepted: false, reason, finalDamage: 0, critical: false, knockback: { x: 0, y: 0, z: 0 }, cooldownReadyAt: blockedUntil, durabilityCost: 0 };
  }
}
