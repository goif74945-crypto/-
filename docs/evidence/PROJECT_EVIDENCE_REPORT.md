# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for Bedrock runtime, visual, mobile, multiplayer, or client-rendering proof.

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY
Dependency: `@minecraft/server` `2.9.0`

## CURRENT HEAD

`cff52a08a868708e87f4e6e3f849980286f8fbb0`

The requested implementation target `bc4a0d7b4cbc05283af5421e1800fcc99f2f8d8e` has been advanced by blocker-closure commits. The evidence in this report refers only to the current HEAD above and GitHub Actions run #70 below.

## FILES CHANGED IN THIS COMPLETION PASS

- `src/core/far-view.ts`
- `src/core/performance.ts`
- `src/core/types.ts`
- `src/core/governor.ts`
- `src/core/playability.ts`
- `src/core/combat.ts`
- `src/bedrock/runtime.ts`
- `src/main.ts`
- `tests/core.test.ts`
- `tools/static-blocker-check.mjs`
- `tools/package-addon.mjs`
- `package.json`
- `addon/manifest.json`
- `.github/workflows/core-check.yml`

This evidence report was updated only after implementation and fresh CI validation.

## FAR VIEW CAPABILITY

STATIC: VERIFIED

Lifecycle is explicitly constrained to `UNKNOWN -> DISCOVERED -> VISIBLE -> FAR -> VISIBLE -> RELEASED`, with `RELEASED -> UNKNOWN` represented by deterministic cleanup/re-entry. Direct `DISCOVERED -> FAR` is rejected. State history is bounded to 8 entries per key; tracked state is bounded; stale entries can be reclaimed; ticks are monotonic per tracked key; invalid distance (`negative`, `NaN`, `Infinity`) is rejected safely.

The implementation does not pretend that logical chunk bookkeeping forces client rendering. `renderCapability()` reports `ENGINE_SUPPORTED`, `ENGINE_LIMITED`, or `NOT_IMPLEMENTABLE` from requested distance and known client maximum render distance.

TEST: VERIFIED in run #70 with exhaustive distance boundaries and lifecycle/reclamation tests.
RUNTIME: NOT VERIFIED
REAL CLIENT RENDER: NOT VERIFIED

## DISTANCE / PRIORITY / WORKLOAD

STATIC: VERIFIED

Single mapping:
- `0-8` -> `CRITICAL`
- `8-16` -> `NEAR`
- `16-32` -> `IMPORTANT`
- `32-64` -> `MID`
- `64-100` -> `FAR`

Scheduler limits are bounded (`maxQueue=256`, `maxPerWindow=32`, configurable work age), with key deduplication, higher-priority replacement, low-priority eviction, cancellation, stale-work rejection, priority ordering, and execution timing/failure counters.

TEST: VERIFIED in run #70. The suite includes a 10,000-FAR-request stress case, continuous critical-vs-low pressure, cancellation/stale rejection, and handler-exception containment.
RUNTIME: NOT VERIFIED

## PLAYABILITY / GOVERNOR

STATIC: VERIFIED FOR ARCHITECTURE

Protected gameplay classes include MOVEMENT, INPUT, CAMERA, COMBAT, INVENTORY, ITEM_USE, BLOCK_INTERACTION, BLOCK_BREAK, BLOCK_PLACE, NEAR_ENTITY, PROJECTILE, BOSS, PVP, IMPORTANT_EVENT, and REDSTONE. FAR/DECORATIVE work is deprioritized/degraded when protected gameplay pressure is active.

CAMERA sensing uses supported player view-direction/client information in runtime code. BOSS classification uses deterministic type IDs for Ender Dragon, Wither, Warden, and Elder Guardian.

The governor no longer depends on a synthetic `memoryRatio=0`. Queue pressure, measured handler elapsed time, and workload pressure drive its evaluation; memory remains optional because no supported direct runtime memory metric has been proven.

TEST: VERIFIED in run #70.
RUNTIME: NOT VERIFIED
ACTUAL FPS/TPS/MEMORY/THERMAL: NOT AVAILABLE FROM CI

## UNIVERSAL ATTACK API

STATIC: VERIFIED FOR CORE PIPELINE; RUNTIME BLOCKED

Required adapters exist: Sword, Axe, Spear, Bow, CustomWeapon.
Required attack types exist: MELEE, HEAVY_MELEE, THRUST, SWEEP, RANGED, PROJECTILE, SPECIAL.

The central API validates request/weapon/target/range/cooldown and separates base, modified, armor-mitigated, resistance-mitigated, and final damage. Accepted results require mandatory capability callbacks; absent mandatory capabilities cause rejection instead of an unverified accepted result.

Runtime code uses bounded target resolution and supported-style operations for view-direction lookup, damage, impulse, armor/equipment inspection, resistance effect inspection, effect application, and mainhand durability mutation.

However, the real runtime port does not yet provide verified callbacks for projectile result completion or death/loot/XP completion. Therefore an actual runtime attack cannot truthfully be marked fully verified/accepted. This is intentional and blocks completion rather than synthesizing success.

TEST: VERIFIED in run #70 at unit-contract level only.
RUNTIME: NOT VERIFIED
FULL END-TO-END RUNTIME COMBAT: BLOCKED
JAVA-LIKE PARITY: NOT VERIFIED

## BEDROCK 26.45 API

Static dependency is pinned to `@minecraft/server` `2.9.0`, and the add-on manifest requires minimum engine `[1,26,45]`.

The runtime harness contains direct probes for system scheduling, player view/camera/client information, equipment/inventory/effects, projectile event binding, and death event binding. The harness emits `NEXY_RUNTIME_EVIDENCE` in-game.

Exact execution of that harness inside Minecraft Bedrock 26.45 is NOT VERIFIED in this environment. TypeScript compilation and CI packaging are not treated as runtime proof.

STATUS: NOT VERIFIED / COMPLETION BLOCKER

## PERFORMANCE / SAFETY

STATIC: VERIFIED FOR BOUNDED CODE PATHS

The known attack hot path does not use unrestricted `dimension.getEntities()`. Entity tracking is capped at 2048. Projectile de-duplication state is capped at 256. Runtime error storage is capped at 32. Camera samples are capped at 128 inspected players per sampling pass. Scheduler queues and work age are bounded.

TEST: VERIFIED in run #70 for logical stress and exception containment.
REAL DEVICE PERFORMANCE: NOT VERIFIED
REAL 100-CHUNK ENGINE LOAD: NOT VERIFIED

## 100-CHUNK SEMANTICS

A: 100 logical workload entries: TEST-VERIFIED by bounded scheduler stress architecture.
B: 100 actual chunk targets: NOT VERIFIED.
C: 100 chunks loaded/available to the engine: NOT VERIFIED.
D: 100 chunks actually rendered by the client: NOT VERIFIED.

The implementation does not label A/B/C as D. Real rendered 100 remains a separate client/engine gate.

## PACKAGE / INSTALLATION

GitHub Actions run #70 (`34450219195`) checked exact HEAD `cff52a08a868708e87f4e6e3f849980286f8fbb0`.

Executed commands and results:

`npm install --ignore-scripts`
- SUCCESS
- `added 6 packages, and audited 7 packages in 4s`
- `found 0 vulnerabilities`

`npm run check`
- SUCCESS
- `check:static`: `STATIC_BLOCKER_CHECK_PASS 9 source files scanned`
- TypeScript build: SUCCESS
- Node test runner: `1..23`, `# pass 23`, `# fail 0`, `# skipped 0`

`npm run check:addon`
- SUCCESS
- Generated `NEXY_FARVIEW_100.mcaddon`
- `manifest.json`: OK
- `scripts/main.js`: OK
- generated runtime/core JS files: OK
- ZIP integrity: `No errors detected in compressed data of NEXY_FARVIEW_100.mcaddon.`

Artifact upload:
- Name: `NEXY_FARVIEW_100-mcaddon`
- Artifact ID: `10141226546`
- Uploaded size: `13151 bytes`
- Upload SHA-256: `ad2799d7c6028343eaa2dd92ca6e53b4479d6f8cf721cb4a4c6af295b0b7e4ce`

PACKAGE BUILD: VERIFIED
PACKAGE INSTALLATION INTO BEDROCK: NOT VERIFIED

## RUNTIME / VISUAL / MOBILE / MULTIPLAYER

RUNTIME: NOT VERIFIED
VISUAL: NOT VERIFIED
MOBILE: NOT VERIFIED
MULTIPLAYER: NOT VERIFIED

No CI or source-only result is promoted to runtime/visual/mobile/multiplayer PASS.

## CURRENT LIMITATIONS / BLOCKERS

1. Exact Bedrock 26.45 live runtime binding is NOT VERIFIED.
2. The runtime combat port lacks proven projectile-result and death/loot/XP completion callbacks; fully accepted runtime attacks are therefore blocked by design.
3. Real 100-chunk client rendering is NOT VERIFIED and remains engine/client controlled rather than add-on-forced.
4. Real package installation/loading in Bedrock is NOT VERIFIED.
5. Visual, mobile, multiplayer, FPS/TPS, memory, and thermal evidence are NOT VERIFIED/NOT AVAILABLE from this CI environment.

## FINAL STATUS

BLOCKED

Reason: critical requirements remain unproven in real Bedrock 26.45 runtime and real client execution. CI/build/package/unit-test evidence is current and passing, but it cannot substitute for the missing runtime/installation/rendering evidence.
