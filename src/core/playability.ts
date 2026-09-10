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

export class PlayabilityShield {
  public isProtected(kind: GameplayClass): boolean {
    return PROTECTED.has(kind);
  }

  public priorityFor(kind: GameplayClass): Priority {
    return this.isProtected(kind) ? (kind === "MOVEMENT" || kind === "INPUT" || kind === "CAMERA" || kind === "COMBAT" || kind === "BOSS" || kind === "PVP" ? "CRITICAL" : "NEAR") : kind === "FAR" ? "FAR" : "DECORATIVE";
  }

  public shouldDegrade(kind: GameplayClass, localGameplayActive: boolean): boolean {
    if (this.isProtected(kind)) return false;
    return localGameplayActive;
  }
}
