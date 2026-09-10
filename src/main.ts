import type { WorkItem } from "./core/types.js";
import { FarViewCore, type FarViewDecision } from "./core/far-view.js";
import { BoundedPriorityScheduler } from "./core/performance.js";
import { PlayabilityShield, type GameplayClass } from "./core/playability.js";
import { AdaptivePerformanceGovernor } from "./core/governor.js";
import { gameplayPressure, installRuntimeEventWiring, installRuntimeHeartbeat } from "./bedrock/runtime.js";

const farView = new FarViewCore();
const scheduler = new BoundedPriorityScheduler<() => void>({ maxQueue: 256, maxPerWindow: 32 });
const shield = new PlayabilityShield(gameplayPressure);
const governor = new AdaptivePerformanceGovernor();

installRuntimeEventWiring();

export function scheduleGameplayWork(kind: GameplayClass, key: string, tick: number, payload: () => void): boolean {
  if (shield.shouldDegrade(kind, tick)) return false;

  const policy = governor.workloadPolicy();
  if (kind === "FAR" && !policy.allowFar) return false;
  if (kind === "DECORATIVE" && !policy.allowDecorative) return false;

  const item: WorkItem<() => void> = {
    key,
    priority: shield.priorityFor(kind),
    createdAtTick: tick,
    payload,
  };
  return scheduler.enqueue(item);
}

export function scheduleFarViewWork(
  distanceInChunks: number,
  key: string,
  tick: number,
  payload: () => void,
): FarViewDecision {
  const decision = farView.classifyChunkDistance(distanceInChunks);
  const kind: GameplayClass = decision.zone === "64-100" ? "FAR" : decision.zone === "OUT_OF_RANGE" ? "DECORATIVE" : "IMPORTANT_EVENT";
  if (!scheduleGameplayWork(kind, key, tick, payload)) {
    farView.release(key, tick);
  }
  return decision;
}

export function releaseFarViewWork(key: string, tick: number): void {
  scheduler.cancel(key);
  farView.release(key, tick);
  farView.clearReleased();
}

installRuntimeHeartbeat(tick => {
  const gameplay = gameplayPressure.snapshot(tick);
  const pressure = scheduler.size / 256;
  const workPressure = scheduler.size === 0 ? 0 : Math.min(1, scheduler.size / 32);
  governor.evaluate({
    queueRatio: pressure,
    workRatio: workPressure,
    memoryRatio: 0,
    localGameplayActive: gameplay.active,
  });
  scheduler.drain(item => item.payload(), governor.workloadPolicy().executionBudget);
});

export { farView, scheduler, shield, governor };
