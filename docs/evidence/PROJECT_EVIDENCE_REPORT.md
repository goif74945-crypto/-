# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY

## CURRENT CODE STATE

Blocker-closure implementation is present in the source tree used for this verification baseline. No test/build/runtime success is claimed without fresh execution evidence.

Source/test files in scope:
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

The runtime scheduling path uses the single distance-to-priority mapping. Tests cover exact boundaries and invalid distance inputs.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER C / D — UNIVERSAL ATTACK API / STATUS ACCURACY

STATIC: PARTIAL

Central combat code validates weapon registration, target identity, range/hit, cooldown and attack type; preserves base/modified/final damage; and keeps armor, resistance, effects, durability, projectile, death, loot and XP status independent.

Five required adapters and seven required attack types remain centrally routed.

The Bedrock runtime port currently implements bounded entity tracking, local target lookup, `Entity.applyDamage`, and `Entity.applyImpulse`. Full armor/resistance/effect/durability/projectile/death/loot/XP runtime capability remains NOT VERIFIED.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## PLAYABILITY

STATIC: PARTIAL

Event-fed gameplay pressure remains connected to workload admission. CAMERA automatic sensing and BOSS automatic detection remain NOT VERIFIED.

## GOVERNOR / PERFORMANCE

STATIC: PARTIAL

Governor controls FAR/DECORATIVE admission and execution budget. Scheduler remains bounded and priority ordered. No global `dimension.getEntities()` attack scan exists in the reviewed source.

Measured FPS/TPS/memory/thermal performance: NOT VERIFIED.

## BEDROCK 26.45 API

Dependency: `@minecraft/server` `2.9.0`.

Microsoft documents 2.9.0 as stable for Minecraft 1.26.40 and treats Script API module versions separately from Minecraft product versions. Exact 26.45 runtime compatibility is NOT VERIFIED.

Critical used surfaces include scheduling, player/block/item/entity events, local entity raycasting, `Entity.applyDamage`, and `Entity.applyImpulse`.

## TEST / BUILD / PACKAGE

Configured commands:
- `npm install --ignore-scripts`
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

Previous confirmed CI on the pre-repair tree:
- install SUCCESS; 6 packages added; 0 vulnerabilities
- `npm run check` FAILED, exit code 2
- errors occurred in combat, performance, and tests
- addon check SKIPPED

The identified compiler errors were repaired in the current source/test tree. Fresh execution proof for the repaired tree: NOT VERIFIED.

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
