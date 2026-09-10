import type { ChunkState, DistanceZone } from "./types.js";

export type RenderCapability = "CLIENT_LIMIT_ALLOWS_REQUEST" | "CLIENT_LIMIT_UNKNOWN" | "NOT_IMPLEMENTABLE";

export interface FarViewDecision {
  readonly zone: DistanceZone;
  readonly detail: "FULL" | "HIGH" | "MEDIUM" | "LOW" | "MINIMAL";
  readonly simulationAllowed: boolean;
}

export interface RenderCapabilityDecision {
  readonly capability: RenderCapability;
  readonly requestedDistance: number;
  readonly clientMaxRenderDistance: number | null;
}

export interface ChunkRecord {
  state: ChunkState;
  lastRelevantTick: number;
}

const NEXT_STATES: Record<ChunkState, readonly ChunkState[]> = {
  UNKNOWN: ["DISCOVERED"],
  DISCOVERED: ["VISIBLE", "RELEASED"],
  VISIBLE: ["FAR", "RELEASED"],
  FAR: ["VISIBLE", "RELEASED"],
  RELEASED: ["UNKNOWN"],
};

const MAX_HISTORY_PER_KEY = 8;
const DEFAULT_SPATIAL_TARGET_COUNT = 100;
const MAX_SPATIAL_TARGET_DISTANCE = 100;
const RING_RADII = [4, 8, 16, 24, 32, 44, 56, 68, 84, 100] as const;
const TARGETS_PER_RING = 10;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export interface ChunkOffset {
  readonly dx: number;
  readonly dz: number;
}

/**
 * Deterministic two-dimensional target distribution. This only creates logical
 * chunk targets; it does not load or render chunks in the Bedrock client.
 */
export function generateSpatialFarOffsets(count = DEFAULT_SPATIAL_TARGET_COUNT): readonly ChunkOffset[] {
  if (!Number.isInteger(count) || count < 1 || count > DEFAULT_SPATIAL_TARGET_COUNT) {
    throw new Error("count must be an integer in the range 1..100");
  }

  const result: ChunkOffset[] = [];
  const seen = new Set<string>();
  for (let ringIndex = 0; ringIndex < RING_RADII.length && result.length < count; ringIndex++) {
    const radius = RING_RADII[ringIndex]!;
    for (let pointIndex = 0; pointIndex < TARGETS_PER_RING && result.length < count; pointIndex++) {
      const angle = (2 * Math.PI * pointIndex) / TARGETS_PER_RING + ringIndex * GOLDEN_ANGLE;
      const dx = Math.round(Math.cos(angle) * radius);
      const dz = Math.round(Math.sin(angle) * radius);
      const distance = Math.hypot(dx, dz);
      if (distance > MAX_SPATIAL_TARGET_DISTANCE) continue;
      const key = `${dx}:${dz}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push({ dx, dz });
    }
  }

  if (result.length !== count) throw new Error(`unable to generate ${count} unique spatial targets`);
  return result;
}

export class FarViewCore {
  private readonly chunks = new Map<string, ChunkRecord>();
  private readonly history = new Map<string, ChunkState[]>();

  public constructor(private readonly maxTrackedChunks = 256) {
    if (!Number.isInteger(maxTrackedChunks) || maxTrackedChunks <= 0) throw new Error("maxTrackedChunks must be positive");
  }

  public classifyChunkDistance(distanceInChunks: number): FarViewDecision {
    if (!Number.isFinite(distanceInChunks) || distanceInChunks < 0) {
      return { zone: "OUT_OF_RANGE", detail: "MINIMAL", simulationAllowed: false };
    }
    if (distanceInChunks < 8) return { zone: "0-8", detail: "FULL", simulationAllowed: true };
    if (distanceInChunks < 16) return { zone: "8-16", detail: "HIGH", simulationAllowed: true };
    if (distanceInChunks < 32) return { zone: "16-32", detail: "MEDIUM", simulationAllowed: true };
    if (distanceInChunks < 64) return { zone: "32-64", detail: "LOW", simulationAllowed: false };
    if (distanceInChunks <= 100) return { zone: "64-100", detail: "MINIMAL", simulationAllowed: false };
    return { zone: "OUT_OF_RANGE", detail: "MINIMAL", simulationAllowed: false };
  }

  public renderCapability(requestedDistance: number, clientMaxRenderDistance: number | null): RenderCapabilityDecision {
    if (!Number.isFinite(requestedDistance) || requestedDistance < 0) {
      return { capability: "NOT_IMPLEMENTABLE", requestedDistance, clientMaxRenderDistance };
    }
    if (clientMaxRenderDistance === null || !Number.isFinite(clientMaxRenderDistance) || clientMaxRenderDistance < 0) {
      return { capability: "CLIENT_LIMIT_UNKNOWN", requestedDistance, clientMaxRenderDistance: null };
    }
    return {
      // This only proves the client-reported configured maximum does not block
      // the request. It does not prove engine loading or client rendering.
      capability: requestedDistance <= clientMaxRenderDistance ? "CLIENT_LIMIT_ALLOWS_REQUEST" : "CLIENT_LIMIT_UNKNOWN",
      requestedDistance,
      clientMaxRenderDistance,
    };
  }

  public observeDistance(key: string, distanceInChunks: number, tick: number): FarViewDecision {
    this.validateKeyAndTick(key, tick);
    const decision = this.classifyChunkDistance(distanceInChunks);
    if (decision.zone === "OUT_OF_RANGE") {
      this.release(key, tick);
      return decision;
    }

    const targetState: ChunkState = decision.zone === "32-64" || decision.zone === "64-100" ? "FAR" : "VISIBLE";
    const current = this.chunks.get(key)?.state;

    if (current === undefined) {
      if (!this.transition(key, "DISCOVERED", tick)) return decision;
      if (!this.transition(key, "VISIBLE", tick)) return decision;
      if (targetState === "FAR" && !this.transition(key, "FAR", tick)) return decision;
      return decision;
    }

    const record = this.chunks.get(key);
    if (!record) return decision;
    if (tick < record.lastRelevantTick) throw new Error("tick must be monotonic per chunk");
    record.lastRelevantTick = tick;

    if (current !== targetState) {
      if (current === "RELEASED") {
        this.transition(key, "UNKNOWN", tick);
        this.transition(key, "DISCOVERED", tick);
        this.transition(key, "VISIBLE", tick);
        if (targetState === "FAR") this.transition(key, "FAR", tick);
      } else if (NEXT_STATES[current].includes(targetState)) {
        this.transition(key, targetState, tick);
      }
    }
    return decision;
  }

  public transition(key: string, next: ChunkState, tick: number): boolean {
    this.validateKeyAndTick(key, tick);
    const previous = this.chunks.get(key);
    if (previous) {
      if (tick < previous.lastRelevantTick) return false;
      if (previous.state !== next && !NEXT_STATES[previous.state].includes(next)) return false;
    } else {
      if (next !== "DISCOVERED") return false;
      if (this.chunks.size >= this.maxTrackedChunks) return false;
    }

    this.chunks.set(key, { state: next, lastRelevantTick: tick });
    const trail = this.history.get(key) ?? [];
    if (trail.length === 0 || trail[trail.length - 1] !== next) {
      if (trail.length >= MAX_HISTORY_PER_KEY) trail.shift();
      trail.push(next);
    }
    this.history.set(key, trail);
    return true;
  }

  public release(key: string, tick: number): void {
    this.validateKeyAndTick(key, tick);
    const current = this.chunks.get(key);
    if (!current || current.state === "RELEASED" || tick < current.lastRelevantTick) return;
    if (!NEXT_STATES[current.state].includes("RELEASED")) return;
    this.transition(key, "RELEASED", tick);
  }

  public reclaimStale(currentTick: number, maxIdleTicks: number): number {
    if (!Number.isInteger(currentTick) || currentTick < 0) throw new Error("currentTick must be a non-negative integer");
    if (!Number.isInteger(maxIdleTicks) || maxIdleTicks < 1) throw new Error("maxIdleTicks must be a positive integer");
    let released = 0;
    for (const [key, record] of this.chunks) {
      if (record.state !== "RELEASED" && currentTick - record.lastRelevantTick >= maxIdleTicks) {
        this.release(key, currentTick);
        released++;
      }
    }
    return released;
  }

  public getState(key: string): ChunkState | undefined {
    return this.chunks.get(key)?.state;
  }

  public getTransitionHistory(key: string): readonly ChunkState[] {
    return [...(this.history.get(key) ?? [])];
  }

  public clearReleased(): number {
    let removed = 0;
    for (const [key, record] of this.chunks) {
      if (record.state === "RELEASED") {
        this.chunks.delete(key);
        this.history.delete(key);
        removed++;
      }
    }
    return removed;
  }

  public get trackedCount(): number {
    return this.chunks.size;
  }

  private validateKeyAndTick(key: string, tick: number): void {
    if (!key || typeof key !== "string") throw new Error("key must be a non-empty string");
    if (!Number.isInteger(tick) || tick < 0) throw new Error("tick must be a non-negative integer");
  }
}

export function distanceInChunks(a: { x: number; z: number }, b: { x: number; z: number }): number {
  return Math.hypot(a.x - b.x, a.z - b.z) / 16;
}
