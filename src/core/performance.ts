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
  readonly maxWorkAgeTicks?: number;
}

export interface SchedulerStats {
  readonly admitted: number;
  readonly rejected: number;
  readonly executed: number;
  readonly failed: number;
  readonly deferred: number;
  readonly cancelled: number;
  readonly staleRejected: number;
  readonly evicted: number;
  readonly maxObservedQueue: number;
  readonly executionTimeMsTotal: number;
  readonly executionTimeMsMax: number;
}

export class BoundedPriorityScheduler<T> {
  private readonly queue = new Map<string, WorkItem<T>>();
  private readonly statsValue = {
    admitted: 0,
    rejected: 0,
    executed: 0,
    failed: 0,
    deferred: 0,
    cancelled: 0,
    staleRejected: 0,
    evicted: 0,
    maxObservedQueue: 0,
    executionTimeMsTotal: 0,
    executionTimeMsMax: 0,
  };
  private readonly maxWorkAgeTicks: number;

  public constructor(private readonly limits: SchedulerLimits) {
    if (!Number.isInteger(limits.maxQueue) || limits.maxQueue <= 0 || !Number.isInteger(limits.maxPerWindow) || limits.maxPerWindow <= 0) {
      throw new Error("Scheduler limits must be positive integers");
    }
    this.maxWorkAgeTicks = limits.maxWorkAgeTicks ?? 40;
    if (!Number.isInteger(this.maxWorkAgeTicks) || this.maxWorkAgeTicks < 1) throw new Error("maxWorkAgeTicks must be a positive integer");
  }

  public enqueue(item: WorkItem<T>): boolean {
    if (!item.key || !Number.isInteger(item.createdAtTick) || item.createdAtTick < 0) {
      this.statsValue.rejected++;
      return false;
    }
    if (this.isExpired(item, item.createdAtTick)) {
      this.statsValue.rejected++;
      this.statsValue.staleRejected++;
      return false;
    }

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
      if (victim === undefined) {
        this.statsValue.rejected++;
        return false;
      }
      const victimItem = this.queue.get(victim);
      if (!victimItem || PRIORITY[item.priority] <= PRIORITY[victimItem.priority]) {
        this.statsValue.rejected++;
        return false;
      }
      this.queue.delete(victim);
      this.statsValue.evicted++;
    }

    this.queue.set(item.key, item);
    this.statsValue.admitted++;
    this.statsValue.maxObservedQueue = Math.max(this.statsValue.maxObservedQueue, this.queue.size);
    return true;
  }

  public cancel(key: string): boolean {
    const existed = this.queue.delete(key);
    if (existed) this.statsValue.cancelled++;
    return existed;
  }

  public drain(handler: (item: WorkItem<T>) => void, maxItems = this.limits.maxPerWindow, currentTick = Number.POSITIVE_INFINITY): number {
    const safeMaxItems = Number.isFinite(maxItems) && maxItems >= 0 ? Math.floor(maxItems) : 0;
    this.pruneStale(currentTick);
    const limit = Math.min(this.limits.maxPerWindow, safeMaxItems);
    const batch = [...this.queue.values()]
      .sort((a, b) => PRIORITY[b.priority] - PRIORITY[a.priority] || a.createdAtTick - b.createdAtTick || a.key.localeCompare(b.key))
      .slice(0, limit);

    for (const item of batch) {
      this.queue.delete(item.key);
      const started = Date.now();
      try {
        handler(item);
        this.statsValue.executed++;
      } catch {
        this.statsValue.failed++;
      } finally {
        const elapsed = Math.max(0, Date.now() - started);
        this.statsValue.executionTimeMsTotal += elapsed;
        this.statsValue.executionTimeMsMax = Math.max(this.statsValue.executionTimeMsMax, elapsed);
      }
    }

    this.statsValue.deferred += this.queue.size;
    return batch.length;
  }

  public get size(): number { return this.queue.size; }

  public stats(): SchedulerStats { return { ...this.statsValue }; }

  public peekPriority(key: string): Priority | undefined { return this.queue.get(key)?.priority; }

  public rejectStale(currentTick: number): number {
    if (!Number.isInteger(currentTick) || currentTick < 0) throw new Error("currentTick must be a non-negative integer");
    return this.pruneStale(currentTick);
  }

  private pruneStale(currentTick: number): number {
    if (!Number.isFinite(currentTick)) return 0;
    let removed = 0;
    for (const [key, item] of this.queue) {
      if (this.isExpired(item, currentTick)) {
        this.queue.delete(key);
        this.statsValue.staleRejected++;
        removed++;
      }
    }
    return removed;
  }

  private isExpired(item: WorkItem<T>, currentTick: number): boolean {
    const explicitExpiry = item.expiresAtTick;
    if (explicitExpiry !== undefined && (!Number.isInteger(explicitExpiry) || explicitExpiry < item.createdAtTick)) return true;
    if (Number.isFinite(currentTick) && currentTick - item.createdAtTick >= this.maxWorkAgeTicks) return true;
    return explicitExpiry !== undefined && Number.isFinite(currentTick) && currentTick > explicitExpiry;
  }

  private findLowestPriorityKey(): string | undefined {
    let candidate: WorkItem<T> | undefined;
    for (const item of this.queue.values()) {
      if (!candidate || PRIORITY[item.priority] < PRIORITY[candidate.priority] || (PRIORITY[item.priority] === PRIORITY[candidate.priority] && item.createdAtTick > candidate.createdAtTick)) candidate = item;
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
