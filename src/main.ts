import type { WorkItem } from "./core/types.js";
import { FarViewCore } from "./core/far-view.js";
import { BoundedPriorityScheduler } from "./core/performance.js";
import { PlayabilityShield, type GameplayClass } from "./core/playability.js";
import { AdaptivePerformanceGovernor } from "./core/governor.js";
import { installRuntimeHeartbeat } from "./bedrock/runtime.js";

const farView = new FarViewCore();
const scheduler = new BoundedPriorityScheduler<() => void>({ maxQueue: 256, maxPerWindow: 32 });
const shield = new PlayabilityShield();
const governor = new AdaptivePerformanceGovernor();

export function scheduleGameplayWork(kind: GameplayClass, key: string, tick: number, payload: () => void): boolean {
  const localGameplayActive = kind !== "FAR" && kind !== "DECORATIVE";
  if (shield.shouldDegrade(kind, localGameplayActive)) return false;

  const item: WorkItem<() => void> = {
    key,
    priority: shield.priorityFor(kind),
    createdAtTick: tick,
    payload,
  };
  return scheduler.enqueue(item);
}

installRuntimeHeartbeat(tick => {
  const localGameplayActive = scheduler.size > 0;
  const pressure = scheduler.size / 256;
  const workPressure = scheduler.size === 0 ? 0 : Math.min(1, scheduler.size / 32);
  governor.evaluate({ queueRatio: pressure, workRatio: workPressure, memoryRatio: 0, localGameplayActive });
  scheduler.drain(item => item.payload());
});

export { farView, scheduler, shield, governor };
