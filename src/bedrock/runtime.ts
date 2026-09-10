import { world, system, type Entity, type Vector3 } from "@minecraft/server";
import type { AttackRequest, Vec3 } from "../core/types.js";
import { GameplayPressureTracker, type GameplayClass } from "../core/playability.js";
import type { CombatExecutionPort, ResolvedCombatTarget } from "../core/combat.js";

export interface RuntimeCapability {
  readonly name: string;
  readonly documented: boolean;
  readonly targetBindingVerified: boolean;
}

export const SCRIPT_API_CAPABILITIES: readonly RuntimeCapability[] = [
  { name: "system.runInterval", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.playerButtonInput", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.playerBreakBlock", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.playerPlaceBlock", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.itemUse", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.entityHitEntity", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.projectileHitEntity/projectileHitBlock", documented: true, targetBindingVerified: false },
  { name: "Entity.getEntitiesFromViewDirection", documented: true, targetBindingVerified: false },
  { name: "Entity.applyDamage", documented: true, targetBindingVerified: false },
  { name: "Entity.applyImpulse", documented: true, targetBindingVerified: false },
];

const MAX_TRACKED_ENTITIES = 2048;
const trackedEntities = new Map<string, Entity>();

function rememberEntity(entity: Entity | undefined): void {
  if (!entity?.id || !entity.isValid) return;
  if (!trackedEntities.has(entity.id) && trackedEntities.size >= MAX_TRACKED_ENTITIES) return;
  trackedEntities.set(entity.id, entity);
}

function pruneTrackedEntities(): void {
  for (const [id, entity] of trackedEntities) {
    if (!entity.isValid) trackedEntities.delete(id);
  }
}

export const gameplayPressure = new GameplayPressureTracker();

function mark(kind: GameplayClass): void {
  gameplayPressure.mark(kind, system.currentTick);
}

export function installRuntimeEventWiring(): void {
  world.afterEvents.playerSpawn.subscribe(event => rememberEntity(event.player));
  world.afterEvents.playerButtonInput.subscribe(event => {
    rememberEntity(event.player);
    mark("INPUT");
    mark("MOVEMENT");
  });
  world.afterEvents.playerBreakBlock.subscribe(event => { rememberEntity(event.player); mark("BLOCK_BREAK"); });
  world.afterEvents.playerStartBreakingBlock.subscribe(event => { rememberEntity(event.player); mark("BLOCK_BREAK"); });
  world.afterEvents.playerPlaceBlock.subscribe(event => { rememberEntity(event.player); mark("BLOCK_PLACE"); });
  world.afterEvents.playerInteractWithBlock.subscribe(event => { rememberEntity(event.player); mark("BLOCK_INTERACTION"); });
  world.afterEvents.playerInteractWithEntity.subscribe(event => { rememberEntity(event.player); mark("NEAR_ENTITY"); });
  world.afterEvents.playerInventoryItemChange.subscribe(event => { rememberEntity(event.player); mark("INVENTORY"); });
  world.afterEvents.itemUse.subscribe(event => { rememberEntity(event.source); mark("ITEM_USE"); });
  world.afterEvents.itemStartUse.subscribe(event => { rememberEntity(event.source); mark("ITEM_USE"); });
  world.afterEvents.entityHitEntity.subscribe(event => {
    rememberEntity(event.damagingEntity);
    rememberEntity(event.hitEntity);
    mark("COMBAT");
    mark("NEAR_ENTITY");
    mark("PVP");
  });
  world.afterEvents.projectileHitEntity.subscribe(event => { rememberEntity(event.source); mark("PROJECTILE"); });
  world.afterEvents.projectileHitBlock.subscribe(event => { rememberEntity(event.source); mark("PROJECTILE"); });
  world.afterEvents.entityHurt.subscribe(event => { rememberEntity(event.hurtEntity); mark("COMBAT"); });
  world.afterEvents.leverAction.subscribe(() => mark("REDSTONE"));
  world.afterEvents.pistonActivate.subscribe(() => mark("REDSTONE"));
  world.afterEvents.pressurePlatePush.subscribe(() => mark("REDSTONE"));
}

export class BedrockCombatPort implements CombatExecutionPort {
  public resolveTarget(request: AttackRequest): ResolvedCombatTarget | undefined {
    pruneTrackedEntities();
    const direct = trackedEntities.get(request.targetId);
    if (direct?.isValid) return { id: direct.id, entity: direct, distance: this.distanceToAttacker(request, direct) };

    const attacker = trackedEntities.get(request.attackerId);
    if (!attacker?.isValid) return undefined;

    try {
      const hits = attacker.getEntitiesFromViewDirection({ maxDistance: request.range });
      const hit = hits.find(candidate => candidate.entity.id === request.targetId);
      if (!hit?.entity?.isValid) return undefined;
      rememberEntity(hit.entity);
      return { id: hit.entity.id, entity: hit.entity, distance: hit.distance };
    } catch {
      return undefined;
    }
  }

  public applyDamage(target: ResolvedCombatTarget, damage: number): boolean {
    const entity = target.entity as Entity;
    try {
      return entity.isValid && entity.applyDamage(damage);
    } catch {
      return false;
    }
  }

  public applyKnockback(target: ResolvedCombatTarget, impulse: Vec3): void {
    const entity = target.entity as Entity;
    if (!entity.isValid) return;
    const vector: Vector3 = { x: impulse.x, y: impulse.y, z: impulse.z };
    try {
      entity.applyImpulse(vector);
    } catch {
      // Runtime failure remains failure; no synthetic success.
    }
  }

  private distanceToAttacker(request: AttackRequest, target: Entity): number {
    const attacker = trackedEntities.get(request.attackerId);
    if (!attacker?.isValid || !target.isValid) return Number.POSITIVE_INFINITY;
    const a = attacker.location;
    const b = target.location;
    return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
  }
}

export function installRuntimeHeartbeat(onTick: (tick: number) => void): void {
  system.runInterval(() => onTick(system.currentTick), 5);
}

export function trackedEntityCount(): number {
  pruneTrackedEntities();
  return trackedEntities.size;
}
