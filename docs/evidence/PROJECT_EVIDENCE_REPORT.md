# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY

## CURRENT CODE STATE

Blocker-closure implementation is applied to the source tree in this verification baseline. The report does not claim test/build/runtime success without fresh execution evidence.

Changed source/test files:
- `src/core/far-view.ts`
- `src/core/performance.ts`
- `src/core/combat.ts`
- `tests/core.test.ts`

Only evidence report:
`docs/evidence/PROJECT_EVIDENCE_REPORT.md`

## BLOCKER A — FAR VIEW LIFECYCLE

STATIC: VERIFIED

Direct `DISCOVERED -> FAR` is rejected. A first distant observation traverses `DISCOVERED -> VISIBLE -> FAR`. `FAR -> VISIBLE` is legal on recovery. `VISIBLE/FAR -> RELEASED` remains legal.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER B — DISTANCE / PRIORITY

STATIC: VERIFIED

Visual zones: `0-8 FULL`, `8-16 HIGH`, `16-32 MEDIUM`, `32-64 LOW`, `64-100 MINIMAL/FAR`.
Scheduler priorities: `0-8 CRITICAL`, `8-16 NEAR`, `16-32 IMPORTANT`, `32-64 MID`, `64-100 FAR`.

`src/main.ts` uses the single distance-to-priority mapping. `32-64` is MID rather than FAR.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER C / D — UNIVERSAL ATTACK API / STATUS ACCURACY

STATIC: PARTIAL

Central combat code validates weapon registration, target identity, range/hit, cooldown and attack type; preserves base/modified/final damage; and keeps armor, resistance, effects, durability, projectile, death, loot and XP capability status independent.

Required adapters and seven required attack types remain centrally routed.

Runtime support remains limited to bounded entity tracking, local target lookup, `Entity.applyDamage`, and `Entity.applyImpulse`. Remaining combat stages are NOT VERIFIED at exact Bedrock 26.45 runtime level.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## PLAYABILITY

STATIC: PARTIAL

Event-fed gameplay pressure remains connected to workload admission. CAMERA automatic sensing: NOT VERIFIED. BOSS automatic detection: NOT VERIFIED.

## GOVERNOR / PERFORMANCE

STATIC: PARTIAL

Governor controls FAR/DECORATIVE admission and scheduler execution budget. Scheduler remains finite and priority ordered. No global `dimension.getEntities()` attack scan exists in the reviewed implementation.

Measured FPS/TPS/memory/thermal performance: NOT VERIFIED.

## BEDROCK 26.45 API

Dependency: `@minecraft/server` `2.9.0`.

Exact Bedrock 26.45 runtime compatibility: NOT VERIFIED.

Critical used surfaces include scheduling, player/block/item/entity events, `Entity.getEntitiesFromViewDirection`, `Entity.applyDamage`, and `Entity.applyImpulse`.

## TEST / BUILD / PACKAGE

Configured commands:
- `npm install --ignore-scripts`
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

Confirmed previous CI failure before the compiler repair:
- install SUCCESS; 6 packages added; 0 vulnerabilities
- `npm run check` FAILED, exit code 2
- TypeScript errors were found in combat, performance and tests
- addon check was SKIPPED

Those three compiler errors were repaired in the current source/test tree.

Fresh current-tree execution evidence: NOT VERIFIED.
BUILD: NOT VERIFIED
TEST: NOT VERIFIED
PACKAGE ARTIFACT: NOT VERIFIED

## RUNTIME / PERFORMANCE / VISUAL / MOBILE / MULTIPLAYER

RUNTIME: NOT VERIFIED
PERFORMANCE: NOT VERIFIED
VISUAL: NOT VERIFIED
MOBILE: NOT VERIFIED
MULTIPLAYER: NOT VERIFIED
100 REAL RENDERED CHUNKS: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## FINAL STATUS

PARTIAL
