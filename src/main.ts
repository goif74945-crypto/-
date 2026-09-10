import { FarViewCore } from "./core/far-view.js";
import { BoundedPriorityScheduler } from "./core/performance.js";
import { PlayabilityShield } from "./core/playability.js";
import { AdaptivePerformanceGovernor } from "./core/governor.js";
import { installRuntimeHeartbeat } from "./bedrock/runtime.js";

const farView = new FarViewCore();
const scheduler = new BoundedPriorityScheduler<() => void>({ maxQueue: 256, maxPerWindow: 32 });
const shield = new PlayabilityShield();
const governor = new AdaptivePerformanceGovernor();

installRuntimeHeartbeat(tick => {
  const localGameplayActive = false;
  const pressure = scheduler.size / 256;
  governor.evaluate({ queueRatio: pressure, workRatio: 32 / 32, memoryRatio: 0, localGameplayActive });
  scheduler.drain(item => item.payload());
});

export { farView, scheduler, shield, governor };
