# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY

## CURRENT CODE STATE

Blocker-closure implementation is applied to the main source tree in the code commit used as the verification baseline. The report does not claim test/build/runtime success without fresh execution evidence.

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

`src/main.ts` uses the single `priorityForDistance()` mapping directly. The regression suite covers exact boundaries, invalid distance, and queued priority.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER C / D — UNIVERSAL ATTACK API / STATUS ACCURACY

STATIC: PARTIAL

Central combat code validates weapon registration, target identity, range/hit, cooldown and attack type; preserves base/modified/final damage; and separates armor, resistance, effects, durability, projectile, death, loot and XP capability statuses.

Required adapters: `SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`.
Required attack types: `MELEE`, `HEAVY_MELEE`, `THRUST`, `SWEEP`, `RANGED`, `PROJECTILE`, `SPECIAL`.

Armor and resistance have independent capability hooks/statuses. Unsupported runtime capabilities remain NOT VERIFIED. No guessed Bedrock API was added.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## PLAYABILITY

STATIC: PARTIAL

Event-fed gameplay pressure remains connected to workload admission. CAMERA automatic sensing: NOT VERIFIED. BOSS automatic detection: NOT VERIFIED.

## GOVERNOR / PERFORMANCE

STATIC: PARTIAL

Governor controls FAR/DECORATIVE admission and scheduler execution budget. Scheduler remains finite and priority ordered. No global `dimension.getEntities()` attack scan exists in the reviewed source.

Measured FPS/TPS/memory/thermal performance: NOT VERIFIED.

## BEDROCK 26.45 API

Dependency: `@minecraft/server` `2.9.0`.

Microsoft documents 2.9.0 as stable for Minecraft 1.26.40 and distinguishes Script API module versions from Minecraft product versions. Exact 26.45 runtime compatibility is therefore NOT VERIFIED.

Critical used surfaces include scheduling, player/block/item/entity events, `Entity.getEntitiesFromViewDirection`, `Entity.applyDamage`, and `Entity.applyImpulse`.

## TEST / BUILD / PACKAGE

Configured commands:
- `npm install --ignore-scripts`
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

Latest confirmed CI before the compiler repair:
- install: SUCCESS; 6 packages added; 0 vulnerabilities
- `npm run check`: FAILED, exit code 2
- errors were in combat, performance, and tests
- `npm run check:addon`: SKIPPED

Those compiler errors were repaired in the blocker-closure source now applied to `main`. A completed fresh CI result for that repaired source is not yet available.

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
