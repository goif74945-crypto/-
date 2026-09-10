import type { WorkItem, Priority } from "./core/types.js";
import { FarViewCore, type FarViewDecision } from "./core/far-view.js";
import { BoundedPriorityScheduler, priorityForDistance } from "./core/performance.js";
import { PlayabilityShield, type GameplayClass } from "./core/playability.js";
import { AdaptivePerformanceGovernor } from "./core/governor.js";
import { gameplayPressure, installRuntimeEventWiring, installRuntimeHeartbeat, installRuntimeHarness, samplePlayerPressure } from "./bedrock/runtime.js";

const farView = new FarViewCore(256);
const scheduler = new BoundedPriorityScheduler<() => void>({ maxQueue: 256, maxPerWindow: 32, maxWorkAgeTicks: 40 });
const shield = new PlayabilityShield(gameplayPressure);
const governor = new AdaptivePerformanceGovernor();

installRuntimeEventWiring();
installRuntimeHarness();

export function scheduleGameplayWork(kind: GameplayClass, key: string, tick: number, payload: () => void): boolean {
  if (shield.shouldDegrade(kind, tick)) return false;

  const policy = governor.workloadPolicy();
  if (kind === "FAR" && !policy.allowFar) return false;
  if (kind === "DECORATIVE" && !policy.allowDecorative) return false;

  const item: WorkItem<() => void> = {
    key,
    priority: shield.priorityFor(kind),
    createdAtTick: tick,
    expiresAtTick: tick + 40,
    payload,
  };
  return scheduler.enqueue(item);
}

function scheduleFarViewPriorityWork(priority: Priority, key: string, tick: number, payload: () => void): boolean {
  if (shield.shouldDegrade("FAR", tick)) return false;
  const policy = governor.workloadPolicy();
  if (priority === "FAR" && !policy.allowFar) return false;
  if (priority === "DECORATIVE" && !policy.allowDecorative) return false;
  return scheduler.enqueue({ key, priority, createdAtTick: tick, expiresAtTick: tick + 40, payload });
}

export function scheduleFarViewWork(
  distanceInChunks: number,
  key: string,
  tick: number,
  payload: () => void,
): FarViewDecision {
  const decision = farView.observeDistance(key, distanceInChunks, tick);
  const priority = priorityForDistance(decision.zone);
  if (!scheduleFarViewPriorityWork(priority, key, tick, payload)) {
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
  samplePlayerPressure(tick);
  farView.reclaimStale(tick, 80);
  farView.clearReleased();

  const gameplay = gameplayPressure.snapshot(tick);
  const queuePressure = scheduler.size / 256;
  const budget = governor.workloadPolicy().executionBudget;
  const started = Date.now();
  const drained = scheduler.drain(item => item.payload(), budget, tick);
  const elapsedMs = Math.max(0, Date.now() - started);
  const workPressure = budget <= 0 ? 0 : Math.min(1, drained / budget);
  const executionPressure = Math.min(1, elapsedMs / 50);

  governor.evaluate({
    queueRatio: queuePressure,
    workRatio: Math.max(workPressure, executionPressure),
    localGameplayActive: gameplay.active,
  });
});

export { farView, scheduler, shield, governor };
