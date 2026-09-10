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

  public classifyChunkDistance(distanceInChunks: number): FarViewDecision {
    if (!Number.isFinite(distanceInChunks) || distanceInChunks < 0) return { zone: "OUT_OF_RANGE", detail: "MINIMAL", simulationAllowed: false };
    if (distanceInChunks < 8) return { zone: "0-8", detail: "FULL", simulationAllowed: true };
    if (distanceInChunks < 16) return { zone: "8-16", detail: "HIGH", simulationAllowed: true };
    if (distanceInChunks < 32) return { zone: "16-32", detail: "MEDIUM", simulationAllowed: true };
    if (distanceInChunks < 64) return { zone: "32-64", detail: "LOW", simulationAllowed: false };
    if (distanceInChunks <= 100) return { zone: "64-100", detail: "MINIMAL", simulationAllowed: false };
    return { zone: "OUT_OF_RANGE", detail: "MINIMAL", simulationAllowed: false };
  }

  public transition(key: string, next: ChunkState, tick: number): void {
    const previous = this.chunks.get(key);
    if (previous && previous.state === "RELEASED" && next !== "UNKNOWN") throw new Error("Released chunk must be rediscovered from UNKNOWN");
    this.chunks.set(key, { state: next, lastRelevantTick: tick });
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
}

export function distanceInChunks(a: { x: number; z: number }, b: { x: number; z: number }): number {
  return Math.hypot(a.x - b.x, a.z - b.z) / 16;
}
