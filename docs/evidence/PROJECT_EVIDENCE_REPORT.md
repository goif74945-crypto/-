# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

ONE PROJECT = ONE EVIDENCE/AUDIT/BUILD/VALIDATION REPORT.
This file is a record, not implementation proof. GitHub source, tree, executed test output and real runtime evidence remain authoritative.

## 1. PROJECT / SCOPE

Project: `NEXY_FARVIEW_100`
Repository: `goif74945-crypto/-`
Branch: `main`
Target: Minecraft Bedrock 26.45 ONLY
Phase: Core Implementation Fix

Authoritative design source:
`ข้อมูลการออกแบบ+%20การโจมตีแบบจ้าว้าเปิดAPI%20ให้อาวุธอื่นๆเป็นเหมื่อนกัน.txt`

Authority:
1. specification
2. GitHub code
3. executed test output
4. runtime evidence
5. this report

## 2. PHASE HISTORY

Phase 0: specification/evidence lock — recorded.
Phase 1: API capability control — exact target binding remains evidence-gated.
Phase 2: architecture — recorded before implementation.
Phase 3: core implementation — implemented source exists; execution proof was initially missing.
Current fix pass: corrected Playability Shield state source, combat target resolution, far-view runtime integration, governor workload control, bounded scheduler cancellation/budgeting, and addon packaging configuration.

## 3. ACTUAL FINAL TREE AT PRE-REPORT-UPDATE HEAD

Verified immediately before this report update:

```text
.github/workflows/core-check.yml
README.md
addon/manifest.json
package.json
tools/package-addon.mjs
tsconfig.json
src/main.ts
src/bedrock/runtime.ts
src/core/types.ts
src/core/performance.ts
src/core/far-view.ts
src/core/playability.ts
src/core/governor.ts
src/core/combat.ts
tests/core.test.ts
docs/evidence/PROJECT_EVIDENCE_REPORT.md
```

There is no second report file in `docs/evidence/`.
No phase/API/performance/runtime/parity/validation report was recreated.

## 4. IMPLEMENTATION INVENTORY

Implementation source files: 8
Test files: 1
Packaging/build support files: 3 (`package.json`, `addon/manifest.json`, `tools/package-addon.mjs`)
Runtime artifacts committed: 0
Release `.mcaddon` artifact committed: 0
Implementation LOC: NOT MEASURED by a local checkout; byte/tree evidence exists in GitHub. No LOC inflation is claimed.
Test LOC: NOT MEASURED by a local checkout.

## 5. REQUIREMENT -> CODE PROOF

### PLAY-01 — Real gameplay pressure
EXPECTED: FAR/DECORATIVE workload must be controlled by actual gameplay state, not by the work item's own kind.
ACTUAL: `GameplayPressureTracker` records real Bedrock gameplay events; `PlayabilityShield.shouldDegrade(kind,tick)` reads the event-fed tracker. `scheduleGameplayWork` no longer derives gameplay activity from `kind`.
FILES: `src/core/playability.ts`, `src/bedrock/runtime.ts`, `src/main.ts`
SYMBOLS: `GameplayPressureTracker`, `PlayabilityShield.shouldDegrade`, `installRuntimeEventWiring`, `scheduleGameplayWork`
CODE PATH: Bedrock event -> tracker -> pressure snapshot -> shield -> scheduler admission.
TEST: `tests/core.test.ts` contains pressure activation/expiry assertions.
ACTUAL OUTPUT: latest GitHub Actions check failed before a passing result was produced; no local project execution available.
RUNTIME EVIDENCE: none.
STATUS: PARTIAL

### PLAY-02 — Protected gameplay classes
EXPECTED: movement/input/camera/combat/inventory/item use/block interaction/break/place/near entity/projectile/boss/PVP/events/redstone remain protected.
ACTUAL: protected class set contains these classes; direct camera sensing is not exposed by a proven target-26.45 event path, so CAMERA remains a protected class but automatic camera-specific detection is NOT VERIFIED.
FILES: `src/core/playability.ts`, `src/bedrock/runtime.ts`
SYMBOLS: `PROTECTED`, event wiring
CODE PATH: gameplay event -> protected class -> CRITICAL/NEAR priority.
TEST: source tests cover protected combat and pressure behavior.
ACTUAL OUTPUT: not passing/verified.
RUNTIME EVIDENCE: none.
STATUS: PARTIAL

### PERF-01 — No global entity scan hot path
EXPECTED: remove repeated `dimension.getEntities()` enumeration from combat target resolution.
ACTUAL: current repository search for `getEntities()` returned no matches. Combat target resolution uses a finite entity registry and, on cache miss, one attacker-local `getEntitiesFromViewDirection` raycast. Target is resolved once and reused for damage/knockback.
FILES: `src/bedrock/runtime.ts`, `src/core/combat.ts`
SYMBOLS: `BedrockCombatPort.resolveTarget`, `UniversalAttackAPI.execute`
CODE PATH: target id -> bounded registry OR local view raycast -> one resolved target -> damage/knockback.
TEST: test asserts `resolveTarget` is called once.
ACTUAL OUTPUT: no passing test output.
RUNTIME EVIDENCE: none.
STATUS: PARTIAL

### COMBAT-01 — Universal Attack API convergence
EXPECTED: Weapon -> Adapter -> Attack Request -> central resolver -> validation -> cooldown -> critical -> damage -> knockback -> result.
ACTUAL: all five adapters inherit `BaseAdapter`; all requests converge at `UniversalAttackAPI.execute`. Central validation now checks attack type, identities, damage, range, cooldown, knockback and durability fields. Target is resolved once and range-checked before mutation.
FILES: `src/core/combat.ts`
SYMBOLS: `BaseAdapter`, `SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`, `UniversalAttackAPI.execute`, `CooldownResolver`, `CriticalResolver`, `DamageResolver`, `KnockbackResolver`
CODE PATH: adapter -> request -> central validation -> resolve target once -> cooldown -> critical -> damage -> knockback -> result.
TEST: adapter convergence, single target resolution, cooldown and range tests exist.
ACTUAL OUTPUT: no passing test output.
RUNTIME EVIDENCE: none.
STATUS: PARTIAL

### FAR-01 — Far-view runtime integration
EXPECTED: five logical zones, visual/simulation separation, bounded lifecycle, scheduler integration and release.
ACTUAL: `FarViewCore.observeDistance` now drives chunk lifecycle; `scheduleFarViewWork` calls it before scheduler admission; `releaseFarViewWork` cancels scheduler work and releases chunk state.
FILES: `src/core/far-view.ts`, `src/main.ts`, `src/core/performance.ts`
SYMBOLS: `classifyChunkDistance`, `observeDistance`, `transition`, `release`, `scheduleFarViewWork`, `releaseFarViewWork`
CODE PATH: distance -> zone/detail/simulation policy -> lifecycle -> gameplay shield/governor -> bounded scheduler -> execution/release.
TEST: far-view zone tests exist; lifecycle runtime test is not executed.
ACTUAL OUTPUT: no passing test output.
RUNTIME EVIDENCE: none.
STATUS: PARTIAL

### GOV-01 — Governor actually governs workload
EXPECTED: governor state changes scheduler budget/admission and suppresses FAR/DECORATIVE work under critical pressure.
ACTUAL: `AdaptivePerformanceGovernor.workloadPolicy()` supplies execution budget and FAR/DECORATIVE admission flags. `main.ts` uses this policy both before enqueue and during drain.
FILES: `src/core/governor.ts`, `src/main.ts`
SYMBOLS: `evaluate`, `workloadPolicy`, `scheduleGameplayWork`, heartbeat drain
CODE PATH: pressure -> governor state -> policy -> admission + execution budget.
TEST: critical-pressure policy assertions exist.
ACTUAL OUTPUT: no passing test output.
RUNTIME EVIDENCE: none.
STATUS: PARTIAL

### BOUND-01 — Bounded memory/work
EXPECTED: queues, tracked chunks, cooldowns and entity registry remain finite.
ACTUAL: scheduler max queue 256; per-window max 32; chunk tracking max 256; cooldown max 4096; entity registry max 2048; explicit cancellation/pruning exists.
FILES: `src/core/performance.ts`, `src/core/far-view.ts`, `src/core/combat.ts`, `src/bedrock/runtime.ts`
SYMBOLS: bounds and eviction/pruning methods.
CODE PATH: admission -> finite map -> dedup/eviction -> bounded drain/recovery.
TEST: scheduler/cooldown bounds are covered statically by source tests, but no executed output is available.
ACTUAL OUTPUT: not verified.
RUNTIME EVIDENCE: none.
STATUS: PARTIAL

### API-01 — Critical API surfaces
EXPECTED: used APIs must be capability-gated and not guessed.
ACTUAL: `SCRIPT_API_CAPABILITIES` records documented surfaces with `targetBindingVerified:false`. Official Microsoft documentation confirms `playerButtonInput` and the relevant entity raycast/damage surfaces exist in the stable Script API; exact product-26.45 runtime execution is still not proven.
FILES: `src/bedrock/runtime.ts`, `package.json`, `addon/manifest.json`
SYMBOLS: `SCRIPT_API_CAPABILITIES`
CODE PATH: declared dependency -> runtime import -> guarded execution.
TEST: no Bedrock target runtime.
ACTUAL OUTPUT: none.
RUNTIME EVIDENCE: none.
STATUS: NOT VERIFIED

### API-02 — @minecraft/server version
EXPECTED: exact target-compatible module version must be proven.
ACTUAL: project declares `@minecraft/server` `2.9.0`; Microsoft documentation identifies 2.9.0 as a stable module and current changelog records its API additions. A direct 1.26.45 <-> 2.9.0 runtime execution proof is still absent.
FILES: `package.json`, `addon/manifest.json`
STATUS: NOT VERIFIED

### PACK-01 — Add-on packaging structure
EXPECTED: distributable behavior-pack structure with manifest/script entry.
ACTUAL: `addon/manifest.json` declares script entry `scripts/main.js`; `tools/package-addon.mjs` copies compiled `dist/src` into `addon/scripts`; CI now runs `check:addon` after `check`.
FILES: `addon/manifest.json`, `tools/package-addon.mjs`, `package.json`, workflow
TEST: CI packaging step configured but latest run stopped at `npm run check`.
ACTUAL OUTPUT: no packaging PASS.
RUNTIME EVIDENCE: none.
STATUS: PARTIAL

### FAR-100
EXPECTED: 100 real rendered chunks only with direct engine evidence.
ACTUAL: no claim or fake renderer exists. Code only defines logical 64–100 FAR policy.
STATUS: NOT VERIFIED

### PARITY-01
EXPECTED: Java-like parity only after category-specific parity tests.
ACTUAL: central combat infrastructure exists, but armor/protection/resistance, durability mutation, projectile semantics, death/loot/XP, AI, world mechanics and redstone parity are not proven.
STATUS: NOT VERIFIED

## 6. TEST / BUILD EVIDENCE

Configured commands:
- `npm run build`
- `npm test`
- `npm run check`
- `npm run package:addon`
- `npm run check:addon`

Actual CI evidence:
- GitHub Actions `core-check` run #27 executed against commit `1376fb6d0aca0883c22939095219e7e28298808e`.
- `npm install --ignore-scripts`: SUCCESS.
- `npm run check`: FAILED.
- `npm run check:addon`: SKIPPED because the previous step failed.
- Failure details were not exposed by the available GitHub connector log endpoint; therefore no fabricated compiler/test output is recorded.

Local execution:
- No local repository checkout with project dependencies was available in this execution environment.
- `npm view @minecraft/server@2.9.0` could not complete because external DNS/network access was unavailable.
- Therefore local `npm run build/test/check` output is NOT VERIFIED.

## 7. RUNTIME / PERFORMANCE / VISUAL / MOBILE / MULTIPLAYER

RUNTIME: NOT VERIFIED — no Bedrock 26.45 execution log.
PERFORMANCE: NOT VERIFIED — implementation contains finite controls but no measured frame/tick/memory data.
VISUAL: NOT VERIFIED — no device/render evidence.
MOBILE: NOT VERIFIED — no device execution evidence.
MULTIPLAYER: NOT VERIFIED — no multiplayer execution evidence.
PARITY: NOT VERIFIED — no category-specific parity suite/runtime evidence.
100-CHUNK: NOT VERIFIED — design target only; no real-render proof.

## 8. BLOCKERS / KNOWN LIMITATIONS

1. Latest CI run is FAIL; exact compiler/test failure text is unavailable through the current connector, so the failure is not guessed away.
2. Exact Bedrock 26.45 runtime compatibility is not executed.
3. Automatic camera-specific pressure detection is not proven by a target-specific event path; CAMERA remains protected but is not claimed as automatically sensed.
4. Combat durability mutation, armor/protection/resistance, death/loot/XP and complete projectile semantics are not implemented/proven.
5. No `.mcaddon` release artifact has been produced or runtime-installed.
6. No performance/mobile/visual/multiplayer measurements exist.

## 9. SELF-AUDIT

Repository: locked `goif74945-crypto/-`.
Branch: locked `main`.
No `getEntities()` global enumeration remains in the current repository search.
No duplicate evidence report exists in `docs/evidence/`.
No 100-real-rendered-chunk claim exists.
No Java-parity PASS is claimed.
No runtime PASS is claimed.
No performance PASS is claimed.

## 10. CURRENT STATUS

IMPLEMENTED STATIC CODE:
- event-fed gameplay pressure tracker
- bounded scheduler with dedup/priority/cancel/budgeted drain
- far-view zones and bounded lifecycle
- governor policy connected to admission and execution budget
- centralized Universal Attack API and five required adapters
- single target resolution path with local raycast fallback
- bounded entity registry
- Bedrock behavior-pack manifest and deterministic packaging step

PARTIAL:
- playability runtime control
- far-view runtime execution
- governor runtime execution
- combat runtime integration
- packaging verification

NOT IMPLEMENTED:
- complete Java-like gameplay parity
- complete armor/resistance/durability/loot/XP integration
- complete runtime far rendering system
- 100 real rendered chunks

NOT VERIFIED:
- `npm run build` final passing result
- `npm test` final passing result
- `npm run check` final passing result
- addon package execution in Bedrock 26.45
- exact API/product binding through runtime
- performance measurements
- visual/mobile/multiplayer evidence
- parity evidence

FINAL VERDICT: PARTIAL / NOT VERIFIED

The repository contains real implementation code and the requested blocker fixes, but the project is deliberately not declared complete because the latest CI check is failing and Bedrock runtime evidence is absent.
