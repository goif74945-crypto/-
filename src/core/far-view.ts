import type { ChunkState, DistanceZone } from "./types.js";

export interface FarViewDecision {
  readonly zone: DistanceZone;
  readonly detail: "FULL" | "HIGH" | "MEDIUM" | "LOW" | "MINIMAL";
  readonly simulationAllowed: boolean;
}

export interface ChunkRecord {
  state: ChunkState;
  lastRelevantTick: number;
}

export class FarViewCore {
  private readonly chunks = new Map<string, ChunkRecord>();

  public constructor(private readonly maxTrackedChunks = 256) {
    if (maxTrackedChunks <= 0) throw new Error("maxTrackedChunks must be positive");
  }

  public classifyChunkDistance(distanceInChunks: number): FarViewDecision {
    if (!Number.isFinite(distanceInChunks) || distanceInChunks < 0) return { zone: "OUT_OF_RANGE", detail: "MINIMAL", simulationAllowed: false };
    if (distanceInChunks < 8) return { zone: "0-8", detail: "FULL", simulationAllowed: true };
    if (distanceInChunks < 16) return { zone: "8-16", detail: "HIGH", simulationAllowed: true };
    if (distanceInChunks < 32) return { zone: "16-32", detail: "MEDIUM", simulationAllowed: true };
    if (distanceInChunks < 64) return { zone: "32-64", detail: "LOW", simulationAllowed: false };
    if (distanceInChunks <= 100) return { zone: "64-100", detail: "MINIMAL", simulationAllowed: false };
    return { zone: "OUT_OF_RANGE", detail: "MINIMAL", simulationAllowed: false };
  }

  public transition(key: string, next: ChunkState, tick: number): boolean {
    const previous = this.chunks.get(key);
    if (previous && previous.state === "RELEASED" && next !== "UNKNOWN") throw new Error("Released chunk must be rediscovered from UNKNOWN");
    if (!previous && this.chunks.size >= this.maxTrackedChunks) return false;
    this.chunks.set(key, { state: next, lastRelevantTick: tick });
    return true;
  }

  public release(key: string, tick: number): void {
    const current = this.chunks.get(key);
    if (!current) return;
    this.chunks.set(key, { state: "RELEASED", lastRelevantTick: tick });
  }

  public getState(key: string): ChunkState | undefined {
    return this.chunks.get(key)?.state;
  }

  public clearReleased(): number {
    let removed = 0;
    for (const [key, record] of this.chunks) {
      if (record.state === "RELEASED") {
        this.chunks.delete(key);
        removed++;
      }
    }
    return removed;
  }

  public get trackedCount(): number {
    return this.chunks.size;
  }
}

export function distanceInChunks(a: { x: number; z: number }, b: { x: number; z: number }): number {
  return Math.hypot(a.x - b.x, a.z - b.z) / 16;
}
