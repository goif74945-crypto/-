# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

## 1. PROJECT / SCOPE

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY
Current implementation commit before this report commit: `801f6a1067db93d20bdaa35ed1a2fd3df58af439`

Authority order:
1. authoritative specification
2. actual GitHub code
3. executed test output
4. real runtime evidence
5. this report

## 2. CURRENT BLOCKER-CLOSURE RESULT

### BLOCKER A — FAR VIEW LIFECYCLE

STATIC STATUS: VERIFIED.

`src/core/far-view.ts` now enforces `UNKNOWN -> DISCOVERED -> VISIBLE -> FAR`, permits `FAR -> VISIBLE`, and permits release from `VISIBLE` or `FAR`. A first observation at a FAR distance passes through `VISIBLE` before entering `FAR`, so the required lifecycle stage is not bypassed.

Invalid direct `DISCOVERED -> FAR` is rejected by `transition()`.

Executed test status: NOT VERIFIED.
Runtime status: NOT VERIFIED.

### BLOCKER B — DISTANCE / PRIORITY

STATIC STATUS: VERIFIED.

Distance zones are:
- `0-8` FULL
- `8-16` HIGH
- `16-32` MEDIUM
- `32-64` LOW
- `64-100` FAR/MINIMAL

`src/core/performance.ts` is the single distance-to-scheduler-priority mapping:
- `0-8` -> `CRITICAL`
- `8-16` -> `NEAR`
- `16-32` -> `IMPORTANT`
- `32-64` -> `MID`
- `64-100` -> `FAR`

`src/main.ts` uses this helper directly. Visual LOW for `32-64` no longer forces scheduler priority FAR.

Boundary tests cover 8, 16, 32, 64, 100, >100, negative, NaN and Infinity.

Executed test status: NOT VERIFIED.
Runtime status: NOT VERIFIED.

### BLOCKER C — UNIVERSAL ATTACK API

STATIC STATUS: PARTIAL.

The central pipeline now performs weapon registration/validation, target validation, range validation, cooldown, attack type validation, critical calculation, modifier damage, independent armor and resistance stages, final damage, knockback, effects, durability, projectile result and post-hit death/loot/XP status collection.

Required adapters remain connected through `UniversalAttackAPI.executeAdapter()` and all seven attack types are accepted by the central request contract.

`baseDamage`, `modifiedDamage` and `finalDamage` are separate result fields.

Independent capability reporting was corrected: armor and resistance now require separate execution hooks. One generic mitigation callback can no longer mark both statuses VERIFIED.

Runtime implementation is still limited to the Bedrock surfaces actually present in `src/bedrock/runtime.ts`: bounded entity tracking, local view-direction target resolution, `Entity.applyDamage`, and `Entity.applyImpulse`.

Armor, resistance, effects, durability, projectile result, death, loot and XP are NOT VERIFIED at Bedrock 26.45 runtime level unless a real execution port supplies those capabilities.

Executed test status: NOT VERIFIED.
Runtime status: NOT VERIFIED.

## 3. PLAYABILITY SHIELD

STATIC STATUS: PARTIAL.

Gameplay pressure remains event-fed and independent from FAR/DECORATIVE work kind. Protected categories include input, movement, camera, combat, inventory, item use, block interaction/break/place, nearby entities, projectiles, bosses, PVP, important events and redstone.

CAMERA remains a protected category, but automatic camera-specific detection is NOT VERIFIED. BOSS remains a protected category, but a dedicated automatic boss-detection runtime path is NOT VERIFIED.

## 4. GOVERNOR / PERFORMANCE

STATIC STATUS: PARTIAL.

Governor state controls FAR/DECORATIVE admission and scheduler execution budget. Scheduler remains finite and priority-based. Entity target resolution remains bounded/local and there is no committed `dimension.getEntities()` global combat scan.

Measured FPS/TPS/memory/thermal performance is NOT VERIFIED. Runtime starvation behavior is NOT VERIFIED.

## 5. API AUDIT — BEDROCK 26.45

`package.json` and `addon/manifest.json` declare `@minecraft/server` `2.9.0`.

Microsoft documentation confirms `@minecraft/server` 2.9.0 is a stable module released with Minecraft 1.26.40. Microsoft also documents stable Script API surfaces used by this project. However, module semantic versioning is separate from Minecraft product versioning, and an exact Bedrock 26.45 execution proof is absent.

Therefore exact product binding status remains:
`NOT VERIFIED`.

Critical runtime APIs used by source include:
- `system.runInterval`
- `world.afterEvents.playerButtonInput`
- block/player interaction events
- item-use events
- combat/projectile entity events
- `Entity.getEntitiesFromViewDirection`
- `Entity.applyDamage`
- `Entity.applyImpulse`

All exact 26.45 runtime compatibility claims remain NOT VERIFIED until executed on the target.

## 6. TEST / BUILD / PACKAGE EVIDENCE

Configured scripts include:
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

Previous confirmed GitHub Actions evidence before this implementation fix:
- `npm install --ignore-scripts`: SUCCESS
- `npm run check`: FAILED
- `npm run check:addon`: SKIPPED after failed check

For the current implementation commits, the available GitHub connector does not expose a completed Actions run proving current build/test success. Therefore:

BUILD: NOT VERIFIED
TEST: NOT VERIFIED
PACKAGE EXECUTION: NOT VERIFIED

No generated `.mcaddon` artifact is claimed as verified.

## 7. RUNTIME / PERFORMANCE / VISUAL / MOBILE / MULTIPLAYER

RUNTIME: NOT VERIFIED
PERFORMANCE: NOT VERIFIED
VISUAL: NOT VERIFIED
MOBILE: NOT VERIFIED
MULTIPLAYER: NOT VERIFIED
100-CHUNK REAL RENDER: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## 8. CURRENT TREE / SCOPE CONTROL

Expected project tree remains limited to the existing implementation, build and single-report files. No additional evidence report was created.

Changed by this fix pass:
- `src/core/far-view.ts`
- `src/core/combat.ts`
- `tests/core.test.ts`
- `docs/evidence/PROJECT_EVIDENCE_REPORT.md`

No repository, branch, target version or architecture authority was changed.

## 9. FINAL STATUS

STATIC IMPLEMENTATION: PARTIAL
TEST EXECUTION: NOT VERIFIED
BUILD: NOT VERIFIED
API 26.45: NOT VERIFIED
RUNTIME: NOT VERIFIED
PERFORMANCE: NOT VERIFIED
VISUAL: NOT VERIFIED
MOBILE: NOT VERIFIED
MULTIPLAYER: NOT VERIFIED

Final status: PARTIAL
