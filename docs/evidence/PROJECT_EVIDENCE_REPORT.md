# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY

## CURRENT CODE STATE

Blocker-closure source is now applied to `main` in commit `380b12f0f9b3f2402dc77389d859a408d684164e`.

Changed by the blocker-closure implementation:
- `src/core/far-view.ts`
- `src/core/performance.ts`
- `src/core/combat.ts`
- `tests/core.test.ts`

Existing runtime/governor/playability/package files remain in scope and were not replaced by unrelated changes.

Only evidence report:
`docs/evidence/PROJECT_EVIDENCE_REPORT.md`

## BLOCKER A — FAR VIEW LIFECYCLE

STATIC: VERIFIED

`DISCOVERED -> FAR` is rejected. A first distant observation performs `DISCOVERED -> VISIBLE -> FAR`. `FAR -> VISIBLE` is legal when distance returns to a visible zone. `VISIBLE/FAR -> RELEASED` remains legal.

Tests cover first observation, VISIBLE->FAR, FAR->VISIBLE, RELEASED/cleanup, and invalid transitions.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER B — DISTANCE / PRIORITY

STATIC: VERIFIED

Visual zones:
`0-8 FULL`, `8-16 HIGH`, `16-32 MEDIUM`, `32-64 LOW`, `64-100 MINIMAL/FAR`.

Scheduler priorities:
`0-8 CRITICAL`, `8-16 NEAR`, `16-32 IMPORTANT`, `32-64 MID`, `64-100 FAR`.

`src/main.ts` uses the single `priorityForDistance()` mapping. Boundary tests include 8, 16, 32, 64, 100, >100, negative, NaN and Infinity and inspect queued priority.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER C / D — UNIVERSAL ATTACK API / STATUS ACCURACY

STATIC: PARTIAL

The central combat implementation now validates weapon registration, target identity, range/hit, cooldown and attack type; separates base/modified/final damage; and exposes independent capability stages for armor, resistance, effects, durability, projectile results and death/loot/XP status.

Required adapters:
`SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`.

Required attack types:
`MELEE`, `HEAVY_MELEE`, `THRUST`, `SWEEP`, `RANGED`, `PROJECTILE`, `SPECIAL`.

Armor and resistance status are independent. A single generic mitigation callback cannot mark both VERIFIED.

Runtime support remains limited to the Bedrock surfaces already implemented in `src/bedrock/runtime.ts`: bounded entity tracking, local view-direction lookup, `Entity.applyDamage`, and `Entity.applyImpulse`.

Armor, resistance, effects, durability, projectile result, death, loot and XP remain NOT VERIFIED at exact Bedrock 26.45 runtime level.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## PLAYABILITY

STATIC: PARTIAL

Event-fed gameplay pressure remains wired into workload admission. CAMERA automatic sensing and BOSS automatic detection remain NOT VERIFIED.

## GOVERNOR / PERFORMANCE

STATIC: PARTIAL

Governor output controls FAR/DECORATIVE admission and execution budget. Scheduler remains finite, priority ordered and bounded. No committed global `dimension.getEntities()` attack scan exists.

Measured FPS/TPS/memory/thermal performance: NOT VERIFIED.

## API — BEDROCK 26.45

Dependency remains `@minecraft/server` `2.9.0`.

Microsoft documents `@minecraft/server` 2.9.0 as a stable module for Minecraft 1.26.40 and documents Script API module versioning separately from Minecraft product versioning. Therefore the dependency declaration alone does not prove exact 26.45 runtime compatibility. citeturn703287search1turn703287search3

Critical used surfaces include scheduling, player/block/item/entity events, `Entity.getEntitiesFromViewDirection`, `Entity.applyDamage`, and `Entity.applyImpulse`.

Exact Bedrock 26.45 runtime evidence: NOT VERIFIED.

## TEST / BUILD / PACKAGE

Configured commands:
- `npm install --ignore-scripts`
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

Pre-fix CI evidence on `5ec43d3ded9c6892a347ac1ac64ae0a163f39355`:
- install SUCCESS; 6 packages added; 0 vulnerabilities
- `npm run check` FAILED, exit code 2
- compiler errors were in `src/core/combat.ts`, `src/core/performance.ts`, and `tests/core.test.ts`
- `npm run check:addon` SKIPPED after failed `check`

Those compiler errors are addressed in the current source commit `380b12f0f9b3f2402dc77389d859a408d684164e`.

Current commit build/test/package execution: NOT VERIFIED until a new Actions run completes.

PACKAGE ARTIFACT: NOT VERIFIED.

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
