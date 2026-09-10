import type { Priority } from "./types.js";

export type GameplayClass =
  | "MOVEMENT" | "INPUT" | "CAMERA" | "COMBAT" | "INVENTORY" | "ITEM_USE"
  | "BLOCK_INTERACTION" | "BLOCK_BREAK" | "BLOCK_PLACE" | "NEAR_ENTITY"
  | "PROJECTILE" | "BOSS" | "PVP" | "IMPORTANT_EVENT" | "REDSTONE" | "FAR" | "DECORATIVE";

const PROTECTED = new Set<GameplayClass>([
  "MOVEMENT", "INPUT", "CAMERA", "COMBAT", "INVENTORY", "ITEM_USE",
  "BLOCK_INTERACTION", "BLOCK_BREAK", "BLOCK_PLACE", "NEAR_ENTITY",
  "PROJECTILE", "BOSS", "PVP", "IMPORTANT_EVENT", "REDSTONE",
]);

export interface GameplayPressureSnapshot {
  readonly active: boolean;
  readonly activeKinds: readonly GameplayClass[];
  readonly lastActivityTick: number;
}

/** Event-fed gameplay pressure. It is deliberately independent of FAR/DECORATIVE work kind. */
export class GameplayPressureTracker {
  private readonly activity = new Map<GameplayClass, number>();

  public constructor(
    private readonly holdTicks = 10,
    private readonly maxKinds = PROTECTED.size,
  ) {}

  public mark(kind: GameplayClass, tick: number): void {
    if (!PROTECTED.has(kind)) return;
    if (!this.activity.has(kind) && this.activity.size >= this.maxKinds) return;
    this.activity.set(kind, tick);
  }

  public snapshot(tick: number): GameplayPressureSnapshot {
    const activeKinds: GameplayClass[] = [];
    for (const [kind, lastTick] of this.activity) {
      if (tick - lastTick <= this.holdTicks) activeKinds.push(kind);
      else this.activity.delete(kind);
    }
    let lastActivityTick = -1;
    for (const tickValue of this.activity.values()) lastActivityTick = Math.max(lastActivityTick, tickValue);
    return { active: activeKinds.length > 0, activeKinds, lastActivityTick };
  }

  public isActive(tick: number): boolean {
    return this.snapshot(tick).active;
  }
}

export class PlayabilityShield {
  public constructor(public readonly pressure = new GameplayPressureTracker()) {}

  public isProtected(kind: GameplayClass): boolean {
    return PROTECTED.has(kind);
  }

  public priorityFor(kind: GameplayClass): Priority {
    return this.isProtected(kind)
      ? (kind === "MOVEMENT" || kind === "INPUT" || kind === "CAMERA" || kind === "COMBAT" || kind === "BOSS" || kind === "PVP" ? "CRITICAL" : "NEAR")
      : kind === "FAR" ? "FAR" : "DECORATIVE";
  }

  public shouldDegrade(kind: GameplayClass, tick: number): boolean {
    if (this.isProtected(kind)) return false;
    return this.pressure.isActive(tick);
  }
}
