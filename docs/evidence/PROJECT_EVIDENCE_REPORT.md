# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY

## CURRENT CODE STATE

Blocker-closure implementation and regression tests are present in the main source tree. Fresh CI verification for the repaired source is recorded below.

Changed source/test files in this fix pass:
- `src/core/far-view.ts`
- `src/core/performance.ts`
- `src/core/combat.ts`
- `tests/core.test.ts`

Only evidence report:
`docs/evidence/PROJECT_EVIDENCE_REPORT.md`

## BLOCKER A — FAR VIEW LIFECYCLE

STATIC: VERIFIED

Direct `DISCOVERED -> FAR` is rejected. A first distant observation traverses `DISCOVERED -> VISIBLE -> FAR`. `FAR -> VISIBLE` is legal on recovery. `VISIBLE/FAR -> RELEASED` remains legal.

TEST: VERIFIED through GitHub Actions run #43 (`npm run check` succeeded).
RUNTIME: NOT VERIFIED

## BLOCKER B — DISTANCE / PRIORITY

STATIC: VERIFIED

Visual zones: `0-8 FULL`, `8-16 HIGH`, `16-32 MEDIUM`, `32-64 LOW`, `64-100 MINIMAL/FAR`.
Scheduler priorities: `0-8 CRITICAL`, `8-16 NEAR`, `16-32 IMPORTANT`, `32-64 MID`, `64-100 FAR`.

The scheduling path uses the single distance-to-priority mapping and does not convert `32-64 LOW` into FAR.

TEST: VERIFIED through GitHub Actions run #43 (`npm run check` succeeded).
RUNTIME: NOT VERIFIED

## BLOCKER C / D — UNIVERSAL ATTACK API / STATUS ACCURACY

STATIC: PARTIAL

Central combat code validates weapon registration, target identity, range/hit, cooldown and attack type; preserves base/modified/final damage; and keeps armor, resistance, effects, durability, projectile, death, loot and XP capability status independent.

Required adapters: `SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`.
Required attack types: `MELEE`, `HEAVY_MELEE`, `THRUST`, `SWEEP`, `RANGED`, `PROJECTILE`, `SPECIAL`.

Armor and resistance are independently reportable. Unsupported runtime capabilities remain NOT VERIFIED. No guessed Bedrock API was added.

TEST: VERIFIED through GitHub Actions run #43 (`npm run check` succeeded).
RUNTIME: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## PLAYABILITY

STATIC: PARTIAL

Event-fed gameplay pressure remains connected to workload admission. CAMERA automatic sensing and BOSS automatic detection remain NOT VERIFIED.

## GOVERNOR / PERFORMANCE

STATIC: PARTIAL

Governor controls FAR/DECORATIVE admission and execution budget. Scheduler remains bounded and priority ordered. No global `dimension.getEntities()` attack scan exists in the reviewed implementation.

Measured FPS/TPS/memory/thermal performance: NOT VERIFIED.

## BEDROCK 26.45 API

Dependency: `@minecraft/server` `2.9.0`.

Exact Bedrock 26.45 runtime compatibility remains NOT VERIFIED.

Critical used surfaces include scheduling, player/block/item/entity events, `Entity.getEntitiesFromViewDirection`, `Entity.applyDamage`, and `Entity.applyImpulse`.

## TEST / BUILD / PACKAGE

Configured commands:
- `npm install --ignore-scripts`
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

GitHub Actions run #43 for source commit `cbf2c41f53a23c16348aad9b995e8f7d96c5d2ad`:
- `npm install --ignore-scripts`: SUCCESS; 6 packages added; 0 vulnerabilities.
- `npm run check`: SUCCESS.
- `npm run check:addon`: SUCCESS.

Because `npm run check` invokes `npm run build && npm test`, the build and test stages both completed successfully in run #43.

Package validation in `check:addon` completed successfully, but no committed `.mcaddon` release artifact or Bedrock-installed package exists.

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
