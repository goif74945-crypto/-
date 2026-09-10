# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE / AUDIT / BUILD / VALIDATION REPORT.
This file records evidence; it is not a substitute for source, executed output, or Bedrock runtime proof.

## 1. PROJECT / SCOPE

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY
Current implementation commit before this report commit: `fa1e87511a3ea7851bbbdd16639183589deeddcf`

Authoritative specification:
`NEXY_FARVIEW_100 — MASTER DESIGN SPECIFICATION`

Authority order:
1. authoritative specification
2. actual GitHub code
3. executed test output
4. real runtime evidence
5. this report

## 2. CURRENT BLOCKER-CLOSURE RESULT

### BLOCKER A — FAR -> VISIBLE

FIXED IN CODE.

`src/core/far-view.ts` now permits:
`UNKNOWN -> DISCOVERED -> VISIBLE -> FAR -> VISIBLE`
and `VISIBLE/FAR -> RELEASED`.

`observeDistance()` drives state from the actual distance policy. Both `32-64` and `64-100` use `FAR`; a closer `0-8`, `8-16`, or `16-32` observation can recover `FAR -> VISIBLE`.

Regression coverage exists for UNKNOWN->DISCOVERED, DISCOVERED->VISIBLE, VISIBLE->FAR, FAR->VISIBLE, RELEASED/cleanup, and invalid transitions.

STATIC STATUS: VERIFIED
EXECUTED TEST STATUS: NOT VERIFIED
RUNTIME STATUS: NOT VERIFIED

### BLOCKER B — 32–64 priority

FIXED IN CODE.

`src/core/performance.ts` is the single distance-to-priority mapping:
- `0-8` -> `CRITICAL`
- `8-16` -> `NEAR`
- `16-32` -> `IMPORTANT`
- `32-64` -> `MID`
- `64-100` -> `FAR`

`src/main.ts` now calls `priorityForDistance(decision.zone)` directly for far-view scheduling. The previous conflicting conversion of `32-64` to gameplay kind `FAR` was removed.

Regression coverage checks exact zone boundaries and scheduler priority, including an assertion that `32-64` is not `FAR`.

STATIC STATUS: VERIFIED
EXECUTED TEST STATUS: NOT VERIFIED
RUNTIME STATUS: NOT VERIFIED

### BLOCKER C — Universal Attack API

HARDENED IN CODE, BUT COMPLETE GAMEPLAY PARITY IS NOT CLAIMED.

`src/core/combat.ts` now contains a central pipeline:
weapon adapter -> attack request -> weapon validation -> target validation -> range/hit validation -> cooldown -> attack type -> critical -> base damage -> modifier damage -> optional mitigation -> final damage -> Bedrock damage port -> knockback -> effects -> durability -> projectile result -> death/loot/XP status -> result.

Required adapters remain:
`SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`.

Required attack types remain:
`MELEE`, `HEAVY_MELEE`, `THRUST`, `SWEEP`, `RANGED`, `PROJECTILE`, `SPECIAL`.

A bounded `WeaponRegistry` was added. `UniversalAttackAPI.executeAdapter()` registers the adapter definition and routes the generated request through the same central `execute()` path. Direct execution rejects unregistered weapons and attack-type/range mismatches.

Damage is explicitly separated as:
`baseDamage`, `modifiedDamage`, `finalDamage`.

Target resolution remains one call per attack and the resolved target is reused for range validation, damage, effects, durability, knockback, projectile and post-hit hooks.

STATIC STATUS: VERIFIED for central architecture and validations.
EXECUTED TEST STATUS: NOT VERIFIED.
RUNTIME STATUS: NOT VERIFIED.

## 3. COMBAT STAGE CAPABILITY GATE

The combat interface contains explicit optional runtime hooks rather than fake implementations:

- armor/protection/resistance: `mitigateDamage`
- status effects: `applyEffect`
- durability mutation: `applyDurability`
- projectile result: `resolveProjectileResult`
- death/loot/XP: `resolveDeathLootXp`

When a capability is not supplied by the Bedrock execution port, the result records `NOT_VERIFIED` instead of pretending success.

Current `src/bedrock/runtime.ts` implements only the proven execution surfaces already present in the project:
- bounded entity registry
- local view-direction target lookup
- `Entity.applyDamage`
- `Entity.applyImpulse`

No unsupported durability, effect, armor, resistance, loot, XP, or death API was guessed into runtime code.

Therefore Java-like combat parity remains NOT VERIFIED.

## 4. PLAYABILITY SHIELD

Event-fed gameplay pressure remains connected to runtime events in `src/bedrock/runtime.ts` and consumed by `PlayabilityShield` in `src/core/playability.ts`.

Protected classes include input, movement, camera, combat, inventory, item use, block interaction, breaking, placing, nearby entities, projectiles, bosses, PVP, important events and redstone.

CAMERA and BOSS are protected categories, but automatic camera-specific sensing and a dedicated boss-detection event path are not proven against Bedrock 26.45. The project does not claim those detections are automatically verified.

STATIC STATUS: PARTIAL
EXECUTED TEST STATUS: NOT VERIFIED
RUNTIME STATUS: NOT VERIFIED

## 5. GOVERNOR / WORKLOAD CONTROL

`AdaptivePerformanceGovernor.workloadPolicy()` is still used by the real scheduling path.

`src/main.ts` applies governor policy during far-view admission and uses `executionBudget` during scheduler drain.

The bounded scheduler remains limited by queue size and per-window drain budget.

STATIC STATUS: VERIFIED
EXECUTED TEST STATUS: NOT VERIFIED
RUNTIME STATUS: NOT VERIFIED

## 6. PERFORMANCE / TARGET RESOLUTION

No global `dimension.getEntities()` hot-path is present in the current repository source reviewed for this fix.

`BedrockCombatPort.resolveTarget()` uses:
1. bounded tracked-entity lookup, then
2. one attacker-local `getEntitiesFromViewDirection({ maxDistance })` fallback.

The target is resolved once by `UniversalAttackAPI.execute()` and then reused. No repeated entity enumeration is performed by `validateTarget`, `applyDamage`, or `applyKnockback` because those stages receive the already resolved target.

Bounded structures remain:
- scheduler queue: 256
- chunk records: 256
- cooldown entries: 4096
- tracked entities: 2048
- weapon registry: 512

PERFORMANCE IMPLEMENTATION STATUS: STATIC VERIFIED
MEASURED PERFORMANCE STATUS: NOT VERIFIED

## 7. API AUDIT — BEDROCK 26.45

The repository records these critical API surfaces in `src/bedrock/runtime.ts` with `documented: true` and `targetBindingVerified: false`:

| API | Expected capability | Usage location | Target 26.45 binding |
|---|---|---|---|
| `system.runInterval` | bounded heartbeat | `installRuntimeHeartbeat` | NOT VERIFIED |
| `world.afterEvents.playerButtonInput` | input/movement pressure | event wiring | NOT VERIFIED |
| `world.afterEvents.playerBreakBlock` | block-break pressure | event wiring | NOT VERIFIED |
| `world.afterEvents.playerPlaceBlock` | block-place pressure | event wiring | NOT VERIFIED |
| `world.afterEvents.itemUse` | item-use pressure | event wiring | NOT VERIFIED |
| `world.afterEvents.entityHitEntity` | combat/PVP pressure | event wiring | NOT VERIFIED |
| `world.afterEvents.projectileHitEntity/projectileHitBlock` | projectile pressure | event wiring | NOT VERIFIED |
| `Entity.getEntitiesFromViewDirection` | local bounded target resolution | `BedrockCombatPort.resolveTarget` | NOT VERIFIED |
| `Entity.applyDamage` | actual damage mutation | `BedrockCombatPort.applyDamage` | NOT VERIFIED |
| `Entity.applyImpulse` | actual knockback mutation | `BedrockCombatPort.applyKnockback` | NOT VERIFIED |

The dependency remains `@minecraft/server` `2.9.0` in `package.json` and `addon/manifest.json`.

Compilation/API documentation does not prove an exact Bedrock 26.45 product binding. Exact target runtime execution is still absent.

API STATUS: NOT VERIFIED.

## 8. TEST / BUILD / PACKAGING EVIDENCE

Configured commands:
- `npm install --ignore-scripts`
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

Previously observed GitHub Actions evidence for commit `1376fb6d0aca0883c22939095219e7e28298808e`:
- `npm install --ignore-scripts`: SUCCESS
- `npm run check`: FAILED
- `npm run check:addon`: SKIPPED
- detailed failure text was not exposed by the available connector endpoint, so no failure reason is invented here.

For the blocker-closure commit `fa1e87511a3ea7851bbbdd16639183589deeddcf`, the repository workflow is configured to run on pushes to `main`, but the current connector returned no new commit status/workflow result when checked.

Therefore this fix pass has:
- real code changes committed: YES
- current real `npm run check` output: NOT VERIFIED
- current real `npm run check:addon` output: NOT VERIFIED
- current build PASS: NOT VERIFIED
- current package PASS: NOT VERIFIED

No `.mcaddon` release artifact is committed.

## 9. STATIC / TEST / RUNTIME / PERFORMANCE / VISUAL / MOBILE / MULTIPLAYER

STATIC CODE: VERIFIED for the blocker fixes described above.
TEST: NOT VERIFIED.
BUILD: NOT VERIFIED.
PACKAGING: NOT VERIFIED.
API 26.45 BINDING: NOT VERIFIED.
RUNTIME: NOT VERIFIED.
PERFORMANCE MEASUREMENTS: NOT VERIFIED.
VISUAL: NOT VERIFIED.
MOBILE: NOT VERIFIED.
MULTIPLAYER: NOT VERIFIED.
100 REAL RENDERED CHUNKS: NOT VERIFIED.
JAVA-LIKE GAMEPLAY PARITY: NOT VERIFIED.

## 10. REMAINING UNVERIFIED / BLOCKED ITEMS

1. Current CI/build/test output for `fa1e87511a3ea7851bbbdd16639183589deeddcf` is not available through the connector result observed during this fix.
2. Exact Bedrock 26.45 runtime binding and in-game execution are not proven.
3. Armor/protection/resistance runtime behavior is not proven.
4. Status-effect runtime application is not proven.
5. Durability mutation is not proven.
6. Projectile semantics are not proven beyond event wiring/explicit result gating.
7. Death/loot/XP integration is not proven.
8. Automatic camera-specific and boss-specific detection is not proven.
9. Performance, thermal, mobile, visual and multiplayer measurements are absent.
10. 100 real rendered chunks are not proven.

## 11. ONE-REPORT / NO-FALSE-PASS SELF-AUDIT

Repository lock: `goif74945-crypto/-` — preserved.
Branch lock: `main` — preserved.
Target lock: Bedrock 26.45 ONLY — preserved.
Additional evidence report files: none.
Global `dimension.getEntities()` hot path: not present in reviewed source.
False runtime PASS: not claimed.
False performance PASS: not claimed.
False 100-chunk PASS: not claimed.
False Java-parity PASS: not claimed.
Unsupported Bedrock APIs: not guessed.

## 12. FINAL STATUS

FAR-VIEW BLOCKER A: FIXED STATICALLY.
DISTANCE/PRIORITY BLOCKER B: FIXED STATICALLY.
UNIVERSAL ATTACK API BLOCKER C: CENTRALIZED / HARDENED STATICALLY; unsupported runtime stages remain explicitly NOT VERIFIED.

FINAL STATUS: PARTIAL

This is intentionally not PASS because current CI/test output and Bedrock 26.45 runtime evidence are still missing.