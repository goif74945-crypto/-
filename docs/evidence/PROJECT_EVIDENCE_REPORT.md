# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY

## CURRENT IMPLEMENTATION

Current blocker-closure source is present in `src/core/far-view.ts`, `src/core/performance.ts`, and `src/core/combat.ts`; regression coverage is in `tests/core.test.ts`.

Only evidence report:
`docs/evidence/PROJECT_EVIDENCE_REPORT.md`

## BLOCKER A — FAR VIEW LIFECYCLE

STATIC: VERIFIED

`DISCOVERED -> FAR` is rejected. A first distant observation traverses `DISCOVERED -> VISIBLE -> FAR`. Recovery permits `FAR -> VISIBLE`. Release remains `VISIBLE/FAR -> RELEASED`.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER B — DISTANCE / PRIORITY

STATIC: VERIFIED

Visual zones: `0-8 FULL`, `8-16 HIGH`, `16-32 MEDIUM`, `32-64 LOW`, `64-100 MINIMAL/FAR`.

Scheduler priorities: `0-8 CRITICAL`, `8-16 NEAR`, `16-32 IMPORTANT`, `32-64 MID`, `64-100 FAR`.

`src/main.ts` uses the single `priorityForDistance()` mapping. Exact boundary and invalid-distance regression tests are present.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## BLOCKER C / D — UNIVERSAL ATTACK API / STATUS ACCURACY

STATIC: PARTIAL

Central pipeline: weapon -> adapter -> request -> weapon validation -> target validation -> range/hit -> cooldown -> attack type -> critical -> base damage -> modified damage -> independent armor -> independent resistance -> final damage -> damage -> knockback -> effects -> durability -> projectile result -> death/loot/XP status -> result.

Five adapters: `SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`.
Seven attack types: `MELEE`, `HEAVY_MELEE`, `THRUST`, `SWEEP`, `RANGED`, `PROJECTILE`, `SPECIAL`.

`baseDamage`, `modifiedDamage`, and `finalDamage` remain distinct. Armor and resistance have independent hooks/statuses; one generic callback cannot mark both VERIFIED.

The runtime port currently exposes bounded entity tracking, local target resolution, `Entity.applyDamage`, and `Entity.applyImpulse`. Armor, resistance, effects, durability, projectile result, death, loot and XP remain NOT VERIFIED at Bedrock 26.45 runtime level. No unsupported API was invented.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## PLAYABILITY

STATIC: PARTIAL

Event-fed gameplay pressure remains connected to workload admission. CAMERA automatic sensing: NOT VERIFIED. BOSS automatic detection: NOT VERIFIED.

## GOVERNOR / PERFORMANCE

STATIC: PARTIAL

Governor controls FAR/DECORATIVE admission and scheduler execution budget. Scheduler remains bounded and priority ordered. No committed global `dimension.getEntities()` attack scan exists.

Measured FPS/TPS/memory/thermal performance: NOT VERIFIED.

## BEDROCK 26.45 API

Dependency: `@minecraft/server` `2.9.0`.

Microsoft documents 2.9.0 as stable in Minecraft 1.26.40 and explains that Script API module versions are distinct from Minecraft product versions. Exact 26.45 runtime compatibility is therefore NOT VERIFIED by the dependency declaration alone. citeturn703287search1turn703287search3turn703287search6

Critical used APIs include scheduling, player/block/item/entity events, `Entity.getEntitiesFromViewDirection`, `Entity.applyDamage`, and `Entity.applyImpulse`.

Exact Bedrock 26.45 execution evidence: NOT VERIFIED.

## TEST / BUILD / PACKAGE

Configured commands:
- `npm install --ignore-scripts`
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

Last confirmed CI failure before this source repair was on commit `5ec43d3ded9c6892a347ac1ac64ae0a163f39355`:
- `npm install --ignore-scripts`: SUCCESS; 6 packages added; 0 vulnerabilities.
- `npm run check`: FAILED, exit code 2.
- Compiler errors were fixed in the blocker-closure source.
- `npm run check:addon`: SKIPPED after failed `check`.

A new push-triggered verification is required for the current source. Current build/test/package proof: NOT VERIFIED.

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
