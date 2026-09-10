# NEXY_FARVIEW_100 — Bedrock 26.45 API Proof Boundary

## Evidence identity

- Repository: `goif74945-crypto/-`
- Branch: `main`
- Project: `NEXY_FARVIEW_100`
- Target: Minecraft Bedrock 26.45 ONLY
- Implementation baseline before this evidence document commit: `b1a4b0a9c96c646b4d8041d19db7b40f8cd9b07e`
- This document is evidence classification, not a runtime certification.

## Target version facts

The repository pins `@minecraft/server` `2.9.0` in both `package.json` and `addon/manifest.json`, while the manifest minimum engine is `[1, 26, 45]`.

Microsoft's official `@minecraft/server` module documentation lists version `2.9.0` as a stable module version. Minecraft Bedrock 26.40 release notes explicitly introduced `@minecraft/server` 2.9.0; Bedrock 26.45 is a subsequent hotfix. This establishes the package/version lineage, but it does **not** constitute live Bedrock 26.45 runtime-binding proof for this repository.

## API capability classification

| API / capability | Source classification | Production usage | Runtime binding on this repo | Boundary |
|---|---|---|---|---|
| `system.run` / `system.clearRun` | Officially documented stable API | `src/bedrock/runtime.ts` | NOT VERIFIED | No live Bedrock session in repository CI |
| `system.runInterval` | Officially documented stable API | `src/bedrock/runtime.ts` | NOT VERIFIED | Same |
| `world.afterEvents.*` gameplay events | Official after-event APIs | `src/bedrock/runtime.ts` | NOT VERIFIED | Event semantics are not proven on a live 26.45 world here |
| `world.beforeEvents.entityHurt` | Official before-event API with mutable `cancel` / `damage` | Probe only; no custom damage commit uses it yet | NOT VERIFIED | Before-events restrict many gameplay-modifying calls |
| `Entity.applyDamage` | Official Entity API | Capability listed; not used as a blind post-hurt duplicate | NOT VERIFIED | A live authoritative damage path still must be proven |
| `Entity.applyImpulse` | Official Entity API | Capability available to the combat port boundary | NOT VERIFIED | Runtime effect and parity still unverified |
| `Entity.getEntitiesFromViewDirection` | Official Entity API | `BedrockCombatPort.resolveTarget()` | NOT VERIFIED | Runtime ray/obstruction behavior requires live test |
| `Entity.getBlockFromViewDirection` | Official Entity API | `BedrockCombatPort.resolveTarget()` | NOT VERIFIED | Used only to reject a nearer block obstruction |
| `Entity.addEffect` / `getEffect` | Official Entity API | Runtime effect/resistance boundary | NOT VERIFIED | Live effect semantics not tested here |
| `ItemComponentTypes.Durability` | Official item component API | Runtime durability boundary | NOT VERIFIED | No live item mutation test |
| `Player.clientSystemInfo.maxRenderDistance` | Official client-system capability | `readClientCapabilities()` | NOT VERIFIED | Reports a client maximum; does not prove actual rendering |
| `Player.camera` / view information | Official Player API | runtime capability probe | NOT VERIFIED | No live client validation |

## Authoritative damage boundary

The current runtime must **not** convert an `afterEvents.entityHurt` observation into a second damage application. `entityHurt` occurs after the hurt action. The current `BedrockCombatPort.commit()` therefore remains fail-safe and returns `committed: false` until the complete authoritative damage path is proven.

The existence of `world.beforeEvents.entityHurt` is important because the official API exposes mutable `damage` and `cancel`. However, before-event execution has restrictions on other gameplay-modifying calls. The correct architecture is therefore:

`BEFORE HURT CONTROL` → `VALIDATE / CANCEL OR MODIFY` → `ENGINE DAMAGE PATH` → `AFTER HURT OBSERVATION`

not:

`AFTER HURT` → `applyDamage()` → duplicate damage.

## Targeting boundary

`getEntitiesFromViewDirection()` is treated as a candidate ray result, not as proof that an arbitrary requested entity is the first hit. The runtime implementation now orders valid candidates by ray distance and requires the requested entity to be the first candidate. It additionally queries `getBlockFromViewDirection()` and rejects the attack when the returned block intersection is before the entity intersection.

This is a deterministic implementation improvement, but **runtime targeting proof remains NOT VERIFIED** until exercised in Bedrock 26.45 with controlled obstruction/range cases.

## Far-view boundary

The current implementation generates 100 deterministic, unique, two-dimensional logical chunk offsets across multiple radial rings from 4 through 100 chunks. These are **logical targets only**.

The following are intentionally not asserted:

- engine-loaded chunk count;
- client-rendered chunk count;
- visual view distance;
- 100 real rendered chunks;
- FPS/TPS/RAM/thermal improvement.

`CLIENT_LIMIT_ALLOWS_REQUEST` means only that the reported client maximum render distance does not numerically reject the requested distance. It is not an engine-render or visual proof.

## Performance evidence boundary

Scheduler limits, bounded queue admission, stale rejection, cancellation, priority ordering, and bounded execution count are implementation properties covered by source and unit tests. `Date.now()` around scheduler handlers is classified as **JavaScript handler wall time**, not FPS or frame-time telemetry.

No synthetic FPS, TPS, RAM, thermal, or device-performance value is emitted.

## Required remaining runtime evidence

The repository has no integrated live Bedrock 26.45 execution environment in CI. Therefore these remain `NOT VERIFIED` until a real target-world test is performed:

- addon load in Bedrock 26.45;
- API binding in the real 26.45 client/server;
- first-hit and block-obstruction behavior;
- authoritative damage control;
- projectile behavior;
- death/loot/XP completion;
- real chunk loading/rendering;
- mobile sustained performance;
- multiplayer synchronization;
- Java-like parity.

## Evidence rule

`OFFICIAL DOCUMENTATION` proves API documentation capability.

`PACKAGE/MANIFEST VERSION` proves the repository's declared dependency.

`BUILD/TYPECHECK/UNIT` proves code-level correctness for those tests.

None of the above alone proves `RUNTIME`, `VISUAL`, `PERFORMANCE`, `MULTIPLAYER`, or `PARITY`.

For NEXY_FARVIEW_100, an absent runtime measurement remains `NOT VERIFIED` rather than PASS.
