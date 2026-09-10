# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY

## CURRENT IMPLEMENTATION

Implementation fix commit: `86010aa9292ab718531a9c8fc25d9536f284b804`.
Changed source/test files:
- `src/core/far-view.ts`
- `src/core/performance.ts`
- `src/core/combat.ts`
- `tests/core.test.ts`

Only evidence report:
`docs/evidence/PROJECT_EVIDENCE_REPORT.md`

## BLOCKER A — FAR VIEW LIFECYCLE

STATIC: VERIFIED

Direct `DISCOVERED -> FAR` is rejected. A first distant observation traverses `DISCOVERED -> VISIBLE -> FAR`. Recovery permits `FAR -> VISIBLE`. Release remains `VISIBLE/FAR -> RELEASED`.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER B — DISTANCE / PRIORITY

STATIC: VERIFIED

Visual zones: `0-8 FULL`, `8-16 HIGH`, `16-32 MEDIUM`, `32-64 LOW`, `64-100 MINIMAL/FAR`.

Scheduler priority: `0-8 CRITICAL`, `8-16 NEAR`, `16-32 IMPORTANT`, `32-64 MID`, `64-100 FAR`.

`src/main.ts` uses the single `priorityForDistance()` mapping. Tests cover exact boundaries plus invalid/negative/NaN/Infinity inputs and queued priority.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER C / D — UNIVERSAL ATTACK API / STATUS ACCURACY

STATIC: PARTIAL

Central pipeline validates weapon registration, target identity, range/hit, cooldown and attack type; computes critical/base/modified/final damage; then routes through independent armor/resistance, damage, knockback, effect, durability, projectile and death/loot/XP status stages.

Required adapters: `SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`.
Required attack types: `MELEE`, `HEAVY_MELEE`, `THRUST`, `SWEEP`, `RANGED`, `PROJECTILE`, `SPECIAL`.

Armor and resistance use independent hooks and independent statuses. Unsupported runtime capabilities remain `NOT_VERIFIED`; no guessed API was added.

The Bedrock runtime source itself currently executes only bounded entity tracking, local view-direction target lookup, `Entity.applyDamage`, and `Entity.applyImpulse`. Full gameplay parity is therefore NOT VERIFIED.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## PLAYABILITY

STATIC: PARTIAL

Event-fed pressure remains connected to workload admission for protected gameplay classes. CAMERA automatic sensing and BOSS automatic detection are NOT VERIFIED.

## GOVERNOR / PERFORMANCE

STATIC: PARTIAL

Governor controls FAR/DECORATIVE admission and execution budget. Scheduler is bounded and priority ordered. No committed global `dimension.getEntities()` attack scan exists.

Measured FPS/TPS/memory/thermal performance: NOT VERIFIED.

## API — BEDROCK 26.45

Dependency: `@minecraft/server` `2.9.0`.

Microsoft documents 2.9.0 as stable in Minecraft 1.26.40 and explains that Script API module versions are distinct from Minecraft product versions. Exact Bedrock 26.45 runtime compatibility therefore remains NOT VERIFIED. citeturn703287search1turn703287search3turn703287search6

Critical used APIs include scheduling, player/block/item/entity events, `Entity.getEntitiesFromViewDirection`, `Entity.applyDamage`, and `Entity.applyImpulse`.

## TEST / BUILD / PACKAGE

Configured commands:
`npm install --ignore-scripts`, `npm run build`, `npm test`, `npm run check`, `npm run package:addon`, `npm run check:addon`.

Latest observed CI before the current code fix: install SUCCESS; `npm run check` FAILED with three TypeScript errors in combat, performance, and tests; addon check was skipped. Those three compiler errors were corrected in the current implementation commit.

Current implementation commit CI: NOT VERIFIED until its new Actions run completes.
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
