import { world } from "@minecraft/server";
import type { WorkItem, Priority } from "./core/types.js";
import { FarViewCore, generateSpatialFarOffsets, type FarViewDecision } from "./core/far-view.js";
import { BoundedPriorityScheduler, priorityForDistance } from "./core/performance.js";
import { PlayabilityShield, type GameplayClass } from "./core/playability.js";
import { AdaptivePerformanceGovernor } from "./core/governor.js";
import {
  AxeAdapter, BowAdapter, CooldownResolver, CriticalResolver, CustomWeaponAdapter,
  DamageResolver, KnockbackResolver, SpearAdapter, SwordAdapter, UniversalAttackAPI,
} from "./core/combat.js";
import {
  BedrockCombatPort, gameplayPressure, installRuntimeEventWiring,
  installRuntimeHeartbeat, installRuntimeHarness, readClientCapabilities, recordRuntimeError,
} from "./bedrock/runtime.js";

const farView = new FarViewCore(256);
const scheduler = new BoundedPriorityScheduler<() => void>({ maxQueue: 256, maxPerWindow: 32, maxWorkAgeTicks: 40 });
const shield = new PlayabilityShield(gameplayPressure);
const governor = new AdaptivePerformanceGovernor();
const combat = new UniversalAttackAPI(new CooldownResolver(), new CriticalResolver(), new DamageResolver(), new KnockbackResolver());
const combatPort = new BedrockCombatPort();
const MAX_FAR_TARGETS_PER_PLAYER = 100;
const MAX_PLAYERS_PER_PRODUCER_TICK = 8;
const FAR_OFFSETS = generateSpatialFarOffsets(MAX_FAR_TARGETS_PER_PLAYER);

installRuntimeEventWiring();
installRuntimeHarness();

/**
 * Runtime combat remains observer-only until the canonical weapon catalogue and
 * authoritative pre-damage mutation path are proven on Bedrock 26.45. This
 * intentionally avoids manufacturing WeaponDefinition values from after-event
 * observations and therefore avoids double damage / duplicated side effects.
 */

export function scheduleGameplayWork(kind: GameplayClass, key: string, tick: number, payload: () => void): boolean {
  if (shield.shouldDegrade(kind, tick)) return false;
  const policy = governor.workloadPolicy();
  if (kind === "FAR" && !policy.allowFar) return false;
  if (kind === "DECORATIVE" && !policy.allowDecorative) return false;
  const item: WorkItem<() => void> = { key, priority: shield.priorityFor(kind), createdAtTick: tick, expiresAtTick: tick + 40, payload };
  return scheduler.enqueue(item);
}

function scheduleFarViewPriorityWork(priority: Priority, key: string, tick: number, payload: () => void): boolean {
  if (shield.shouldDegrade("FAR", tick)) return false;
  const policy = governor.workloadPolicy();
  if (priority === "FAR" && !policy.allowFar) return false;
  if (priority === "DECORATIVE" && !policy.allowDecorative) return false;
  return scheduler.enqueue({ key, priority, createdAtTick: tick, expiresAtTick: tick + 40, payload });
}

export function scheduleFarViewWork(distanceInChunks: number, key: string, tick: number, payload: () => void): FarViewDecision {
  const decision = farView.observeDistance(key, distanceInChunks, tick);
  const priority = priorityForDistance(decision.zone);
  if (!scheduleFarViewPriorityWork(priority, key, tick, payload)) farView.release(key, tick);
  return decision;
}

export function releaseFarViewWork(key: string, tick: number): void { scheduler.cancel(key); farView.release(key, tick); farView.clearReleased(); }

function produceFarViewWork(tick: number): void {
  let players = 0;
  for (const player of world.getAllPlayers()) {
    if (players++ >= MAX_PLAYERS_PER_PRODUCER_TICK) break;
    try {
      const location = player.location;
      const client = readClientCapabilities(player);
      const centerX = Math.floor(location.x / 16);
      const centerZ = Math.floor(location.z / 16);
      for (const offset of FAR_OFFSETS) {
        const chunkX = centerX + offset.dx;
        const chunkZ = centerZ + offset.dz;
        const dx = (chunkX * 16 + 8) - location.x;
        const dz = (chunkZ * 16 + 8) - location.z;
        const distance = Math.hypot(dx, dz) / 16;
        const key = `${player.id}:${player.dimension.id}:${chunkX}:${chunkZ}`;
        scheduleFarViewWork(distance, key, tick, () => {
          const capability = farView.renderCapability(distance, client.maxRenderDistance);
          if (capability.capability === "NOT_IMPLEMENTABLE") farView.release(key, tick);
        });
      }
    } catch (error) {
      recordRuntimeError(error);
    }
  }
}

installRuntimeHeartbeat(tick => {
  produceFarViewWork(tick);
  farView.reclaimStale(tick, 80);
  farView.clearReleased();
  scheduler.rejectStale(tick);
  const gameplay = gameplayPressure.snapshot(tick);
  const queuePressure = scheduler.size / 256;
  const budget = governor.workloadPolicy().executionBudget;
  const started = Date.now();
  const drained = scheduler.drain(item => item.payload(), budget, tick);
  const elapsedMs = Math.max(0, Date.now() - started);
  const workPressure = budget <= 0 ? 0 : Math.min(1, drained / budget);
  // DERIVED SIGNAL: JavaScript handler wall time, not FPS/frame-time telemetry.
  const scriptExecutionPressure = Math.min(1, elapsedMs / 50);
  governor.evaluate({ queueRatio: queuePressure, workRatio: Math.max(workPressure, scriptExecutionPressure), localGameplayActive: gameplay.active });
});

export { farView, scheduler, shield, governor, combat, combatPort };
