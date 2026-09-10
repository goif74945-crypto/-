# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for Bedrock runtime, visual, mobile, multiplayer, or client-rendering proof.

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY
Dependency: `@minecraft/server` `2.9.0`

## HEAD / VALIDATION REFERENCES

Report-update source HEAD before this documentation commit:
`2a60d827c73d91c5f09369e8e59a1ec5477847ad`

Implementation HEAD validated by the completion CI:
`cff52a08a868708e87f4e6e3f849980286f8fbb0`

Fresh CI run against the documentation-updated repository HEAD:
GitHub Actions run #71 (`34450280973`) completed successfully.

The evidence below never promotes documentation-only changes to implementation evidence. Source behavior is validated at `cff52a08...`; run #71 additionally confirms the report-updated HEAD still builds, tests, packages, and uploads successfully.

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
- `docs/evidence/PROJECT_EVIDENCE_REPORT.md`

## FAR VIEW CAPABILITY

STATIC: VERIFIED

Lifecycle is constrained to `UNKNOWN -> DISCOVERED -> VISIBLE -> FAR -> VISIBLE -> RELEASED`; cleanup permits deterministic re-entry. Direct `DISCOVERED -> FAR` is rejected. History is bounded to 8 entries per key; tracked state is bounded; stale entries can be reclaimed; tick order is monotonic per key; negative, NaN, and infinite distances are handled as out-of-range.

`renderCapability()` explicitly distinguishes `ENGINE_SUPPORTED`, `ENGINE_LIMITED`, and `NOT_IMPLEMENTABLE`. It does not pretend logical bookkeeping forces client chunk rendering.

TEST: VERIFIED in run #70 and revalidated by run #71.
RUNTIME: NOT VERIFIED
REAL CLIENT RENDER: NOT VERIFIED

## DISTANCE / PRIORITY / WORKLOAD

STATIC: VERIFIED

Single authoritative mapping:
`0-8 -> CRITICAL`, `8-16 -> NEAR`, `16-32 -> IMPORTANT`, `32-64 -> MID`, `64-100 -> FAR`.

Scheduler is bounded at queue/per-window/work-age level and has deduplication, higher-priority replacement, lower-priority eviction, cancellation, stale rejection, deterministic ordering, execution timing, and failure metrics.

TEST: VERIFIED in run #70 and revalidated by run #71. The suite includes 10,000 FAR-request stress, pressure/eviction, cancellation/stale work, and handler exception containment.
RUNTIME: NOT VERIFIED

## PLAYABILITY / GOVERNOR

STATIC: VERIFIED FOR ARCHITECTURE

Protected gameplay classes: MOVEMENT, INPUT, CAMERA, COMBAT, INVENTORY, ITEM_USE, BLOCK_INTERACTION, BLOCK_BREAK, BLOCK_PLACE, NEAR_ENTITY, PROJECTILE, BOSS, PVP, IMPORTANT_EVENT, REDSTONE.

Camera sensing uses supported player view-direction/client information in runtime code. Boss classification is deterministic for Ender Dragon, Wither, Warden, and Elder Guardian.

Synthetic `memoryRatio=0` was removed. Governor pressure uses bounded queue/work pressure and measured handler elapsed time; direct memory measurement remains unavailable.

TEST: VERIFIED in run #70/#71.
RUNTIME: NOT VERIFIED
ACTUAL FPS/TPS/MEMORY/THERMAL: NOT AVAILABLE FROM CI

## UNIVERSAL ATTACK API

STATIC: VERIFIED FOR CORE PIPELINE; RUNTIME BLOCKED

Adapters: Sword, Axe, Spear, Bow, CustomWeapon.
Attack types: MELEE, HEAVY_MELEE, THRUST, SWEEP, RANGED, PROJECTILE, SPECIAL.

The core API rejects an attack instead of accepting a result that contains unverified mandatory stages. Unit tests cover the complete contract and negative validation cases.

Runtime code has bounded target resolution and uses supported-style operations for target view lookup, damage, impulse, equipment/armor inspection, resistance effect inspection, effect application, and mainhand durability mutation.

The real runtime port does not provide proven projectile-result completion or death/loot/XP completion callbacks. Therefore a real runtime attack cannot be marked fully verified. This is an explicit completion blocker, not a hidden UNKNOWN.

TEST: VERIFIED at unit-contract level in run #70/#71.
RUNTIME: NOT VERIFIED
FULL END-TO-END RUNTIME COMBAT: BLOCKED
JAVA-LIKE PARITY: NOT VERIFIED

## BEDROCK 26.45 API

Manifest and dependency are pinned to minimum engine `[1,26,45]` and `@minecraft/server` `2.9.0`.

The runtime harness directly probes scheduling, view direction, camera/client information, equipment/inventory/effects, projectile event binding, and death-event binding, and emits `NEXY_RUNTIME_EVIDENCE` in-game.

Actual execution of that harness inside Minecraft Bedrock 26.45 is NOT VERIFIED in this environment. Compilation is not treated as runtime proof.

STATUS: NOT VERIFIED / COMPLETION BLOCKER

## PERFORMANCE / SAFETY

STATIC: VERIFIED FOR BOUNDED CODE PATHS

Known attack target resolution does not use unrestricted `dimension.getEntities()`. Entity tracking is capped at 2048; projectile dedup state at 256; camera samples at 128 inspected players/pass; runtime errors at 32; scheduler queue/work age are bounded.

TEST: VERIFIED in run #70/#71.
REAL DEVICE PERFORMANCE: NOT VERIFIED
REAL 100-CHUNK ENGINE LOAD: NOT VERIFIED

## 100-CHUNK SEMANTICS

A. 100 logical workload entries: TEST-VERIFIED only as a bounded logical stress condition.
B. 100 actual chunk targets: NOT VERIFIED.
C. 100 chunks loaded/available to the engine: NOT VERIFIED.
D. 100 chunks actually rendered by the client: NOT VERIFIED.

No A/B/C result is promoted to D.

## PACKAGE / INSTALLATION

Run #70 validated implementation HEAD `cff52a08...`; run #71 revalidated the documentation-updated repository HEAD `2a60d827...`.

Real executed commands:

`npm install --ignore-scripts`
- SUCCESS
- 6 packages added; audited 7 packages
- 0 vulnerabilities

`npm run check`
- SUCCESS
- `STATIC_BLOCKER_CHECK_PASS 9 source files scanned`
- TypeScript build: SUCCESS
- Node test runner: `1..23`, `# pass 23`, `# fail 0`, `# skipped 0`

`npm run check:addon`
- SUCCESS
- `NEXY_FARVIEW_100.mcaddon` generated
- manifest and `scripts/main.js` verified
- generated runtime/core scripts verified
- ZIP integrity: `No errors detected in compressed data of NEXY_FARVIEW_100.mcaddon.`

Run #70 artifact:
- Name: `NEXY_FARVIEW_100-mcaddon`
- Artifact ID: `10141226546`
- Size: `13151 bytes`
- Upload SHA-256: `ad2799d7c6028343eaa2dd92ca6e53b4479d6f8cf721cb4a4c6af295b0b7e4ce`

PACKAGE BUILD: VERIFIED
PACKAGE INSTALLATION INTO BEDROCK: NOT VERIFIED

## RUNTIME / VISUAL / MOBILE / MULTIPLAYER

RUNTIME: NOT VERIFIED
VISUAL: NOT VERIFIED
MOBILE: NOT VERIFIED
MULTIPLAYER: NOT VERIFIED

## REMAINING LIMITATIONS / BLOCKERS

1. Exact Bedrock 26.45 live runtime binding is NOT VERIFIED.
2. Fully verified runtime projectile completion and death/loot/XP completion are not implemented/proven; accepted runtime attacks remain blocked by design.
3. Real 100-chunk client rendering is NOT VERIFIED and is engine/client controlled rather than add-on-forced.
4. Package installation/loading in Bedrock is NOT VERIFIED.
5. Visual, mobile, multiplayer, FPS/TPS, memory, and thermal evidence are NOT VERIFIED or NOT AVAILABLE in CI.

## FINAL STATUS

BLOCKED

Critical runtime and client evidence is missing. CI/build/test/package evidence is current and passing, but it cannot substitute for live Bedrock 26.45 execution or actual client rendering/install evidence.
