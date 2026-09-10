# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

## 1. PROJECT / SCOPE

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY

## 2. IMPLEMENTATION STATE

Current source modules are limited to the existing FAR VIEW, performance, playability, governor, combat, Bedrock runtime, and type layers.

Current tests:
`tests/core.test.ts`

Single evidence report:
`docs/evidence/PROJECT_EVIDENCE_REPORT.md`

No additional report file was created.

## 3. BLOCKER A — FAR VIEW LIFECYCLE

STATIC: VERIFIED

`src/core/far-view.ts` now rejects direct `DISCOVERED -> FAR`. A first distant observation performs `DISCOVERED -> VISIBLE -> FAR`, preserving the required lifecycle stage. `FAR -> VISIBLE` is explicitly legal when distance decreases. `VISIBLE/FAR -> RELEASED` remains legal, and released records can be cleaned.

Tests added for first observation, VISIBLE->FAR, FAR->VISIBLE, RELEASED/cleanup, and invalid transitions.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## 4. BLOCKER B — DISTANCE / PRIORITY

STATIC: VERIFIED

Visual zones:
`0-8 FULL`, `8-16 HIGH`, `16-32 MEDIUM`, `32-64 LOW`, `64-100 MINIMAL/FAR`.

Scheduler priority is independent:
`0-8 CRITICAL`, `8-16 NEAR`, `16-32 IMPORTANT`, `32-64 MID`, `64-100 FAR`.

`src/main.ts` uses `priorityForDistance()` directly. `32-64` cannot become FAR merely because its visual detail is LOW.

Tests cover 8, 16, 32, 64, 100, >100, negative, NaN, Infinity, and queued priority.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED

## 5. BLOCKER C / D — UNIVERSAL ATTACK API / STATUS ACCURACY

STATIC: PARTIAL

Central path:
weapon -> adapter -> request -> weapon validation -> target validation -> range/hit -> cooldown -> attack type -> critical -> base damage -> modified damage -> independent armor -> independent resistance -> final damage -> damage -> knockback -> effects -> durability -> projectile result -> death/loot/XP status -> combat result.

Required adapters:
`SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`.

Required attack types:
`MELEE`, `HEAVY_MELEE`, `THRUST`, `SWEEP`, `RANGED`, `PROJECTILE`, `SPECIAL`.

`WeaponRegistry` is bounded and central. `executeAdapter()` routes every adapter through the same resolver.

Damage remains explicitly separated as `baseDamage`, `modifiedDamage`, and `finalDamage`.

Armor and resistance are independently reported through separate hooks. A single generic mitigation callback can no longer mark both capabilities VERIFIED.

The Bedrock runtime port currently contains only the source-level execution surfaces already proven/documented in project code: bounded entity tracking, local view-direction target resolution, `Entity.applyDamage`, and `Entity.applyImpulse`.

Armor, resistance, effects, durability, projectile result, death, loot and XP remain NOT VERIFIED at Bedrock 26.45 runtime level. No guessed API was added.

TEST: NOT VERIFIED
RUNTIME: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## 6. PLAYABILITY SHIELD

STATIC: PARTIAL

Event-fed pressure remains connected to the workload path. Protected categories include INPUT, MOVEMENT, CAMERA, COMBAT, INVENTORY, ITEM_USE, BLOCK_INTERACTION, BLOCK_BREAK, BLOCK_PLACE, NEAR_ENTITY, PROJECTILE, BOSS, PVP, IMPORTANT_EVENT and REDSTONE.

CAMERA automatic sensing: NOT VERIFIED
BOSS automatic detection: NOT VERIFIED

## 7. GOVERNOR / PERFORMANCE

STATIC: PARTIAL

Governor output controls FAR/DECORATIVE admission and scheduler execution budget. Scheduler capacity is finite and priority ordered. Combat target resolution remains bounded/local with no committed global `dimension.getEntities()` attack scan.

Measured FPS/TPS/memory/thermal performance: NOT VERIFIED.
Runtime starvation/performance behavior: NOT VERIFIED.

## 8. BEDROCK 26.45 API AUDIT

Declared dependency: `@minecraft/server` `2.9.0`.

Microsoft documentation confirms `@minecraft/server` 2.9.0 is a stable module shipped with Minecraft 1.26.40, and explains that Script API module versions are distinct from Minecraft product versions. Therefore the dependency declaration does not itself prove exact 26.45 runtime compatibility. citeturn703287search1turn703287search3turn703287search6

Used critical runtime surfaces include:
- `system.runInterval`
- player/block/item/entity after-events
- `Entity.getEntitiesFromViewDirection`
- `Entity.applyDamage`
- `Entity.applyImpulse`

Exact Bedrock 26.45 execution evidence: NOT VERIFIED.

## 9. TEST / BUILD / PACKAGE EVIDENCE

Configured commands:
- `npm install --ignore-scripts`
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

Latest observed GitHub Actions run on pre-compiler-fix commit `5ec43d3ded9c6892a347ac1ac64ae0a163f39355`:
- `npm install --ignore-scripts`: SUCCESS; 6 packages added; 0 vulnerabilities.
- `npm run check`: FAILED, exit code 2.
- Exact compiler errors were fixed in the following code commit:
  - `src/core/combat.ts(244,5)` optional `reason` with `exactOptionalPropertyTypes`.
  - `src/core/performance.ts(51,25)` possibly undefined scheduler key.
  - `tests/core.test.ts(139,39)` possibly undefined adapter.
- `npm run check:addon`: SKIPPED after the failed `check` step.

A subsequent push-triggered Actions run for the same pre-compiler-fix report commit was observed and failed at the same `npm run check` stage; those errors are now addressed in source.

Current HEAD execution proof after the new fixes: NOT VERIFIED until a new Actions run completes.

PACKAGE ARTIFACT: NOT VERIFIED.

## 10. RUNTIME / PERFORMANCE / VISUAL / MOBILE / MULTIPLAYER

RUNTIME: NOT VERIFIED
PERFORMANCE: NOT VERIFIED
VISUAL: NOT VERIFIED
MOBILE: NOT VERIFIED
MULTIPLAYER: NOT VERIFIED
100 REAL RENDERED CHUNKS: NOT VERIFIED
JAVA-LIKE PARITY: NOT VERIFIED

## 11. CURRENT STATUS

STATIC IMPLEMENTATION: PARTIAL
TEST EXECUTION: NOT VERIFIED
BUILD: NOT VERIFIED
API 26.45: NOT VERIFIED
RUNTIME: NOT VERIFIED
PERFORMANCE: NOT VERIFIED
VISUAL: NOT VERIFIED
MOBILE: NOT VERIFIED
MULTIPLAYER: NOT VERIFIED

FINAL STATUS: PARTIAL
