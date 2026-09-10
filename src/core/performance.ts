import type { Priority, WorkItem } from "./types.js";

const PRIORITY: Record<Priority, number> = {
  CRITICAL: 6,
  NEAR: 5,
  IMPORTANT: 4,
  MID: 3,
  FAR: 2,
  DECORATIVE: 1,
};

export interface SchedulerLimits {
  readonly maxQueue: number;
  readonly maxPerWindow: number;
}

export interface SchedulerStats {
  readonly admitted: number;
  readonly rejected: number;
  readonly executed: number;
  readonly deferred: number;
  readonly cancelled: number;
}

export class BoundedPriorityScheduler<T> {
  private readonly queue = new Map<string, WorkItem<T>>();
  private readonly statsValue = { admitted: 0, rejected: 0, executed: 0, deferred: 0, cancelled: 0 };

  public constructor(private readonly limits: SchedulerLimits) {
    if (limits.maxQueue <= 0 || limits.maxPerWindow <= 0) throw new Error("Scheduler limits must be positive");
  }

  public enqueue(item: WorkItem<T>): boolean {
    const existing = this.queue.get(item.key);
    if (existing) {
      if (PRIORITY[item.priority] <= PRIORITY[existing.priority]) {
        this.statsValue.rejected++;
        return false;
      }
      this.queue.set(item.key, item);
      return true;
    }

    if (this.queue.size >= this.limits.maxQueue) {
      const victim = this.findLowestPriorityKey();
      const victimItem = victim ? this.queue.get(victim) : undefined;
      if (!victimItem || PRIORITY[item.priority] <= PRIORITY[victimItem.priority]) {
        this.statsValue.rejected++;
        return false;
      }
      this.queue.delete(victim);
      this.statsValue.rejected++;
    }

    this.queue.set(item.key, item);
    this.statsValue.admitted++;
    return true;
  }

  public cancel(key: string): boolean {
    const existed = this.queue.delete(key);
    if (existed) this.statsValue.cancelled++;
    return existed;
  }

  public drain(handler: (item: WorkItem<T>) => void, maxItems = this.limits.maxPerWindow): number {
    const limit = Math.max(0, Math.min(this.limits.maxPerWindow, Math.floor(maxItems)));
    const batch = [...this.queue.values()]
      .sort((a, b) => PRIORITY[b.priority] - PRIORITY[a.priority] || a.createdAtTick - b.createdAtTick)
      .slice(0, limit);

    for (const item of batch) {
      this.queue.delete(item.key);
      handler(item);
      this.statsValue.executed++;
    }

    this.statsValue.deferred += this.queue.size;
    return batch.length;
  }

  public get size(): number {
    return this.queue.size;
  }

  public stats(): SchedulerStats {
    return { ...this.statsValue };
  }

  private findLowestPriorityKey(): string | undefined {
    let candidate: WorkItem<T> | undefined;
    for (const item of this.queue.values()) {
      if (!candidate || PRIORITY[item.priority] < PRIORITY[candidate.priority]) candidate = item;
    }
    return candidate?.key;
  }
}

export function priorityForDistance(zone: string): Priority {
  switch (zone) {
    case "0-8": return "CRITICAL";
    case "8-16": return "NEAR";
    case "16-32": return "IMPORTANT";
    case "32-64": return "MID";
    case "64-100": return "FAR";
    default: return "DECORATIVE";
  }
}
