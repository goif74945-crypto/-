import { world, system, type Entity, type Vector3 } from "@minecraft/server";
import type { AttackRequest, Vec3 } from "../core/types.js";
import type { CombatExecutionPort } from "../core/combat.js";

export interface RuntimeCapability {
  readonly name: string;
  readonly documented: boolean;
  readonly targetBindingVerified: boolean;
}

export const SCRIPT_API_CAPABILITIES: readonly RuntimeCapability[] = [
  { name: "system.runInterval", documented: true, targetBindingVerified: false },
  { name: "Dimension.getEntities", documented: true, targetBindingVerified: false },
  { name: "Entity.applyDamage", documented: true, targetBindingVerified: false },
  { name: "Entity.applyImpulse", documented: true, targetBindingVerified: false },
];

function resolveEntity(id: string): Entity | undefined {
  for (const dimensionId of ["overworld", "nether", "the_end"] as const) {
    try {
      const dimension = world.getDimension(dimensionId);
      const entity = dimension.getEntities().find(candidate => candidate.id === id);
      if (entity) return entity;
    } catch {
      // A missing/unavailable dimension is not a license to fabricate state.
    }
  }
  return undefined;
}

export class BedrockCombatPort implements CombatExecutionPort {
  public validateTarget(request: AttackRequest): boolean {
    const target = resolveEntity(request.targetId);
    return Boolean(target && !target.isValid);
  }

  public applyDamage(request: AttackRequest, damage: number): boolean {
    const target = resolveEntity(request.targetId);
    if (!target) return false;
    try {
      return target.applyDamage(damage);
    } catch {
      return false;
    }
  }

  public applyKnockback(request: AttackRequest, impulse: Vec3): void {
    const target = resolveEntity(request.targetId);
    if (!target) return;
    const vector: Vector3 = { x: impulse.x, y: impulse.y, z: impulse.z };
    try {
      target.applyImpulse(vector);
    } catch {
      // Runtime rejection remains a rejected runtime action; no synthetic success is emitted.
    }
  }
}

export function installRuntimeHeartbeat(onTick: (tick: number) => void): void {
  system.runInterval(() => onTick(system.currentTick), 5);
}
