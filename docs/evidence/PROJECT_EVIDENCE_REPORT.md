# NEXY_FARVIEW_100 — PROJECT EVIDENCE REPORT

**ONE PROJECT = ONE EVIDENCE/AUDIT/BUILD/VALIDATION REPORT**

This file is the single project evidence record. It is not proof by itself. Proof is the actual GitHub tree, source, symbols, executable paths, test output and real runtime evidence.

## 1. PHASE / SCOPE

Project: `NEXY_FARVIEW_100`
Target: **Minecraft Bedrock 26.45 ONLY**
Current phase: **PHASE 3 — Core Implementation**
Scope: bounded work scheduling, logical far-view policy, Playability Shield, adaptive governor, centralized combat core, Bedrock execution port, and source-level tests.

Out of scope/not claimed: 100 real rendered chunks, full 100-chunk simulation, full Java parity, final addon packaging, runtime PASS, performance PASS, visual PASS, mobile PASS, parity PASS.

## 2. REPOSITORY / BRANCH / HEAD

Repository: `goif74945-crypto/-`
Branch: `main`
Phase 3 start HEAD: `75f062df0ce62c9616cb2740906a352204002a06`
Current final HEAD: `4425148f5e11bef28bbb6a35c7224ae6783327e1`

The final `main` ref was directly verified against GitHub at the current HEAD. The repository and branch were never changed.

## 3. AUTHORITATIVE REQUIREMENTS

Authoritative source:
`ข้อมูลการออกแบบ+%20การโจมตีแบบจ้าว้าเปิดAPI%20ให้อาวุธอื่นๆเป็นเหมื่อนกัน.txt`

Authority order:
1. Authoritative specification
2. Actual GitHub code
3. Actual test output
4. Actual runtime evidence
5. This report

Locked requirements:
- Far-view zones: `0–8`, `8–16`, `16–32`, `32–64`, `64–100`.
- Visual distance != simulation distance.
- 100 chunks is a design target only.
- No global entity/block scan every tick.
- No unbounded queue/cache/task state.
- Priority: `CRITICAL > NEAR > IMPORTANT > MID > FAR > DECORATIVE`.
- Gameplay-critical work outranks far/decorative work.
- Native-first Bedrock behavior.
- One Universal Attack API convergence point.
- Required adapters: Sword/Axe/Spear/Bow/Custom.
- Unsupported or uncertain API capability stays `NOT VERIFIED` / `UNKNOWN` / `FREEZE`.

## 4. ACTUAL GITHUB TREE

Final implementation/config/test tree verified:

```text
.github/workflows/core-check.yml
package.json
tsconfig.json
src/
  bedrock/runtime.ts
  core/types.ts
  core/performance.ts
  core/far-view.ts
  core/playability.ts
  core/governor.ts
  core/combat.ts
  main.ts
tests/core.test.ts
docs/evidence/PROJECT_EVIDENCE_REPORT.md
```

Historical duplicate evidence files are absent from the final tree:
- `docs/evidence/BUILD_SCOPE_AND_BASELINE.md`
- `docs/evidence/PHASE_0_1_AUDIT.md`
- `docs/evidence/PHASE_2_ARCHITECTURE.md`
- `docs/evidence/PHASE_3_EVIDENCE.md`

No `manifest.json` or release `.mcaddon` artifact exists.

## 5. IMPLEMENTATION FILE INVENTORY

IMPLEMENTATION SOURCE FILE COUNT: **8**

- `src/core/types.ts` — domain types, priorities, attack/work contracts.
- `src/core/performance.ts` — bounded priority scheduler, deduplication, admission, eviction and bounded drain.
- `src/core/far-view.ts` — five logical distance zones, visual/detail policy and bounded chunk lifecycle storage.
- `src/core/playability.ts` — gameplay protection and degradation rules.
- `src/core/governor.ts` — workload-pressure state machine.
- `src/core/combat.ts` — adapters, cooldown/critical/damage/knockback resolvers and `UniversalAttackAPI`.
- `src/bedrock/runtime.ts` — capability inventory and Bedrock execution port.
- `src/main.ts` — runtime scheduling wiring and Playability Shield integration.

TEST FILE COUNT: **1** — `tests/core.test.ts`

Build/config files:
`package.json`, `tsconfig.json`, `.github/workflows/core-check.yml`.

## 6. DOCUMENTATION-TO-CODE RATIO

REPORT SIZE AT CONSOLIDATION COMMIT: **24,412 bytes**. This size is a documentation metric only.
IMPLEMENTATION SOURCE FILE COUNT: **8**.
IMPLEMENTATION SOURCE LOC: **502 added LOC recorded by the GitHub compare for the original implementation set; later hardening edits were made afterward, so 502 is not treated as an exact final LOC count**.
TEST FILE COUNT: **1**.
TEST LOC: **79 added LOC recorded by the GitHub compare**.
RUNTIME ARTIFACT COUNT: **0**.
RELEASE ARTIFACT COUNT: **0**.

The report never substitutes for source code.

## 7. PHASE 0 — SPECIFICATION LOCK

PHASE: 0
EXPECTED: target/specification/evidence rules locked.
ACTUAL: Bedrock 26.45-only target, hard locks and evidence rules are recorded and preserved.
FILES: consolidated into this single report.
SYMBOLS: N/A.
CODE PATHS: N/A.
TESTS: N/A.
ACTUAL OUTPUT: specification evidence recorded.
RUNTIME EVIDENCE: none.
LIMITATIONS: specification is not implementation proof.
BLOCKERS: none for specification lock.
STATUS: **PASS** at specification-record level.

## 8. PHASE 1 — API CAPABILITY CONTROL

PHASE: 1
EXPECTED: API support must be evidence-gated.
ACTUAL: documented Script API surfaces were identified, but exact Bedrock 26.45 product-to-module binding remains unproven.
FILES: `package.json`, `src/bedrock/runtime.ts`.
SYMBOLS: `SCRIPT_API_CAPABILITIES`, `BedrockCombatPort`, `installRuntimeHeartbeat`.
CODE PATHS: runtime import -> selected API surface -> caught failure/no synthetic success.
TESTS: no Bedrock target-runtime execution.
ACTUAL OUTPUT: no runtime output.
RUNTIME EVIDENCE: none.
LIMITATIONS: `@minecraft/server` 2.9.0 is declared but not proven to be the exact 26.45 binding.
BLOCKERS: direct product/API compatibility proof.
STATUS: **NOT VERIFIED**.

## 9. PHASE 2 — ARCHITECTURE

PHASE: 2
EXPECTED: far-view/performance/playability/combat boundaries and evidence gates.
ACTUAL: architecture was defined and its factual content was later consolidated into this report; the historical architecture report was removed to enforce the one-report rule.
FILES: source implementation set plus this report.
SYMBOLS: architecture-level only.
CODE PATHS: design only.
TESTS: no runtime tests in Phase 2.
ACTUAL OUTPUT: architecture was recorded before implementation.
RUNTIME EVIDENCE: none.
LIMITATIONS: architecture alone is not proof.
BLOCKERS: implementation/runtime evidence required.
STATUS: **PASS** for architecture record; runtime-dependent capabilities **NOT VERIFIED**.

## 10. PHASE 3 — CORE IMPLEMENTATION

PHASE: 3
EXPECTED: real executable source for each claimed core capability.
ACTUAL: 8 implementation source files and 1 test source file exist in the locked repository.
STATUS: **PARTIAL**.

## 11. REQUIREMENT → CODE PROOF

### FVR-01
EXPECTED: five logical far-view zones.
ACTUAL: `FarViewCore.classifyChunkDistance` returns `0-8/FULL`, `8-16/HIGH`, `16-32/MEDIUM`, `32-64/LOW`, `64-100/MINIMAL`, with out-of-range handling.
FILE: `src/core/far-view.ts`
SYMBOL: `FarViewCore.classifyChunkDistance`
CODE PATH: distance -> zone -> detail/simulation flag.
TEST: `tests/core.test.ts`.
ACTUAL OUTPUT: not executed.
RUNTIME EVIDENCE: none.
STATUS: **PARTIAL**.

### FVR-02
EXPECTED: visual distance separated from simulation distance.
ACTUAL: `simulationAllowed` is independent; 32–64 and 64–100 are not simulation-enabled.
FILE: `src/core/far-view.ts`
SYMBOL: `FarViewCore.classifyChunkDistance`
CODE PATH: distance -> logical detail + simulation decision.
TEST: source assertion for 80 chunks.
ACTUAL OUTPUT: not executed.
RUNTIME EVIDENCE: none.
STATUS: **PARTIAL**.

### FVR-03
EXPECTED: lifecycle `UNKNOWN -> DISCOVERED -> VISIBLE -> FAR -> RELEASED`, bounded state.
ACTUAL: `ChunkState` plus transition/release/clear logic and `maxTrackedChunks` bound.
FILE: `src/core/types.ts`, `src/core/far-view.ts`
SYMBOL: `ChunkState`, `FarViewCore.transition`, `release`, `clearReleased`.
CODE PATH: transition -> released check -> bounded admission -> cleanup.
TEST: source test exists; not executed.
ACTUAL OUTPUT: none.
RUNTIME EVIDENCE: none.
STATUS: **PARTIAL**.

### PERF-01
EXPECTED: bounded work queue with admission, dedup, backpressure/priority, bounded execution.
ACTUAL: `BoundedPriorityScheduler` uses finite `Map`, key deduplication, priority eviction and `maxPerWindow` drain.
FILE: `src/core/performance.ts`
SYMBOL: `BoundedPriorityScheduler.enqueue`, `drain`.
CODE PATH: request -> dedup -> capacity -> priority -> bounded drain.
TEST: source test exercises queue 2 / window 1.
ACTUAL OUTPUT: not executed.
RUNTIME EVIDENCE: none.
STATUS: **PARTIAL**.

### PERF-02
EXPECTED: adaptive workload control.
ACTUAL: `AdaptivePerformanceGovernor.evaluate` maps queue/work/memory pressure and local gameplay state to a degradation state.
FILE: `src/core/governor.ts`
SYMBOL: `AdaptivePerformanceGovernor.evaluate`.
CODE PATH: pressure -> state -> degradation policy.
TEST: source test checks saturated pressure.
ACTUAL OUTPUT: not executed.
RUNTIME EVIDENCE: none.
STATUS: **PARTIAL**.

### PLAY-01
EXPECTED: protected gameplay cannot be sacrificed for cosmetic work.
ACTUAL: protected classes cover movement/input/camera/combat/inventory/item use/block interaction/break/place/near entity/projectile/boss/PVP/events/redstone; `scheduleGameplayWork` applies the shield before enqueue.
FILE: `src/core/playability.ts`, `src/main.ts`
SYMBOL: `PlayabilityShield.isProtected`, `shouldDegrade`, `priorityFor`, `scheduleGameplayWork`.
CODE PATH: gameplay class -> shield -> priority -> bounded scheduler.
TEST: source tests cover protected/unprotected behavior.
ACTUAL OUTPUT: not executed.
RUNTIME EVIDENCE: none.
STATUS: **PARTIAL**.

### COMBAT-01
EXPECTED: one central Universal Attack API.
ACTUAL: required adapters inherit `BaseAdapter`; every request enters `UniversalAttackAPI.execute`.
FILE: `src/core/combat.ts`
SYMBOL: `BaseAdapter`, `UniversalAttackAPI.execute`.
CODE PATH: weapon -> adapter -> request -> universal API -> validation -> cooldown -> critical -> damage -> knockback -> result.
TEST: source test checks shared execution path.
ACTUAL OUTPUT: not executed.
RUNTIME EVIDENCE: none.
STATUS: **PARTIAL**.

### COMBAT-02
EXPECTED: Sword/Axe/Spear/Bow/Custom adapters.
ACTUAL: all five classes exist and share conversion logic.
FILE: `src/core/combat.ts`
SYMBOL: `SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`.
CODE PATH: `WeaponDefinition -> BaseAdapter.toAttackRequest`.
TEST: source test instantiates all five.
ACTUAL OUTPUT: not executed.
RUNTIME EVIDENCE: none.
STATUS: **PARTIAL**.

### COMBAT-03
EXPECTED: shared cooldown/critical/damage/knockback with bounded state.
ACTUAL: all four resolvers are shared dependencies of `UniversalAttackAPI`; cooldown map has `maxEntries`, pruning and bounded eviction.
FILE: `src/core/combat.ts`
SYMBOL: `CooldownResolver`, `CriticalResolver`, `DamageResolver`, `KnockbackResolver`.
CODE PATH: shared resolvers -> execution port -> result.
TEST: source test covers cooldown/critical/damage/knockback.
ACTUAL OUTPUT: not executed.
RUNTIME EVIDENCE: none.
STATUS: **PARTIAL**.

### API-01
EXPECTED: selected APIs remain capability-gated.
ACTUAL: `SCRIPT_API_CAPABILITIES` marks the selected APIs as documented but `targetBindingVerified: false`; runtime failures are not converted to success.
FILE: `src/bedrock/runtime.ts`
SYMBOL: `SCRIPT_API_CAPABILITIES`, `BedrockCombatPort`, `installRuntimeHeartbeat`.
CODE PATH: runtime -> API -> failure catch -> unavailable state.
TEST: no target runtime.
ACTUAL OUTPUT: none.
RUNTIME EVIDENCE: none.
STATUS: **NOT VERIFIED**.

### API-02
EXPECTED: exact 26.45 Script API binding.
ACTUAL: repository declares `@minecraft/server` `2.9.0`; exact 26.45 binding remains unproven.
FILE: `package.json`
SYMBOL: dependency declaration.
CODE PATH: dependency -> runtime module.
TEST: no target runtime.
ACTUAL OUTPUT: none.
RUNTIME EVIDENCE: none.
STATUS: **NOT VERIFIED**.

### FAR-100
EXPECTED: 100 real rendered chunks only with direct engine proof.
ACTUAL: no code claims or fakes engine rendering at 100 chunks; implementation only classifies logical distance.
FILE: `src/core/far-view.ts`
SYMBOL: `FarViewCore.classifyChunkDistance`.
CODE PATH: distance -> logical zone only.
TEST: no engine visual test.
ACTUAL OUTPUT: none.
RUNTIME EVIDENCE: none.
STATUS: **NOT VERIFIED**.

### PARITY-01
EXPECTED: exact Java-like parity only after category-specific parity testing.
ACTUAL: no complete parity claim; exact Java critical/cooldown/armor/resistance/durability/loot/XP/AI/world/redstone behavior is not established.
FILE: `src/core/combat.ts` plus future scope.
SYMBOL: shared combat resolvers.
CODE PATH: request -> explicit domain resolver logic.
TEST: no parity execution.
ACTUAL OUTPUT: none.
RUNTIME EVIDENCE: none.
STATUS: **NOT VERIFIED**.

### RUNTIME-01
EXPECTED: real Bedrock 26.45 runtime evidence.
ACTUAL: runtime entry and execution port exist but no Bedrock runtime output exists.
FILE: `src/main.ts`, `src/bedrock/runtime.ts`
SYMBOL: `installRuntimeHeartbeat`, `scheduleGameplayWork`, `BedrockCombatPort`.
CODE PATH: Bedrock entry -> 5-tick heartbeat -> governor/scheduler; combat port -> entity query/action.
TEST: no Bedrock runtime.
ACTUAL OUTPUT: none.
RUNTIME EVIDENCE: none.
STATUS: **NOT VERIFIED**.

## 12. API CAPABILITY TABLE

| Dependency | Source | Documented surface | Exact 26.45 binding | Status |
|---|---|---|---|---|
| `system.runInterval` | `src/bedrock/runtime.ts` | Yes | Not established | NOT VERIFIED |
| `Dimension.getEntities` | `src/bedrock/runtime.ts` | Yes | Not established | NOT VERIFIED |
| `Entity.applyDamage` | `src/bedrock/runtime.ts` | Yes | Not established | NOT VERIFIED |
| `Entity.applyImpulse` | `src/bedrock/runtime.ts` | Yes | Not established | NOT VERIFIED |
| `@minecraft/server 2.9.0` | `package.json` | Package exists | Exact 26.45 binding not established | NOT VERIFIED |

## 13. ACTUAL CODE PATHS

Scheduler: `WorkItem -> enqueue -> dedup/capacity/priority -> bounded drain -> payload`.
Far view: `distance -> classifyChunkDistance -> zone/detail/simulationAllowed`.
Playability: `GameplayClass -> shield -> priority -> scheduler`.
Combat: `WeaponDefinition -> Adapter -> AttackRequest -> UniversalAttackAPI.execute -> shared resolvers -> execution port -> result`.
Bedrock target: `AttackRequest -> BedrockCombatPort.validateTarget -> resolveEntity -> isValid -> applyDamage/applyImpulse`.

## 14. BUILD / TEST EVIDENCE

COMMAND: `npm run build`
EXPECTED: TypeScript build succeeds.
ACTUAL OUTPUT: **NOT EXECUTED**.
STATUS: **NOT VERIFIED**.

COMMAND: `npm test`
EXPECTED: core tests execute successfully.
ACTUAL OUTPUT: **NOT EXECUTED**.
STATUS: **NOT VERIFIED**.

COMMAND: `npm run check`
EXPECTED: build + tests succeed.
ACTUAL OUTPUT: **NOT EXECUTED**.
STATUS: **NOT VERIFIED**.

GitHub Actions: no executed workflow output was available for this implementation record.

## 15. RUNTIME / PERFORMANCE / VISUAL / MOBILE / PARITY

RUNTIME STATUS: **NOT VERIFIED**.

PERFORMANCE STATUS: **NOT VERIFIED** — bounds exist in source, but there are no measured FPS/tick/memory/thermal/stress results.

VISUAL STATUS: **NOT VERIFIED** — no Bedrock visual evidence.

MOBILE STATUS: **NOT VERIFIED** — no target-device evidence.

PARITY STATUS: **NOT VERIFIED** — no category-specific parity test evidence.

100-CHUNK STATUS: **NOT VERIFIED** — design target only; no engine proof.

## 16. NOT IMPLEMENTED

- Bedrock addon manifest/release packaging.
- Full engine-level far-view/render-distance control.
- Full Java-like gameplay/combat parity.
- Full projectile/entity/AI/item/block/status/loot/XP/world-mechanics implementation.
- Runtime/performance/mobile/visual validation harness.
- Final release artifact.

## 17. NOT VERIFIED / UNKNOWN

- Exact `@minecraft/server` binding for Bedrock 26.45.
- Target runtime behavior of selected Script APIs.
- Real 100 rendered chunks.
- Java parity.
- Build/test execution output.
- Bedrock runtime output.
- Performance measurements.
- Mobile/thermal behavior.
- Visual behavior.
- Long-run stability.

UNKNOWN: any target-runtime behavior not directly exercised.

## 18. BLOCKERS

1. Direct Bedrock 26.45 runtime and test environment.
2. Exact product-to-Script-API compatibility proof.
3. Performance/mobile/visual measurements.
4. Category-specific Java parity tests.
5. Add-on manifest/package/release validation.

## 19. SINGLE-REPORT CONSOLIDATION

The project-wide one-report rule is now enforced by:
`docs/evidence/PROJECT_EVIDENCE_REPORT.md`

Historical parallel report files were consolidated and deleted. The final tree contains only this project evidence report under `docs/evidence`.

This report remains a RECORD only; actual source/tree/test/runtime evidence has priority.

## 20. FINAL SELF-AUDIT

Repository: **PASS**.
Branch: **PASS**.
Start HEAD captured: **PASS**.
Final HEAD verified: **PASS** (`4425148f5e11bef28bbb6a35c7224ae6783327e1`).
Actual tree inspected: **PASS**.
Implementation files identified: **PASS**.
Major symbols checked: **PASS**.
Universal Attack API convergence exists in source: **PASS at source level**.
Five required adapters exist: **PASS at source level**.
Bounded scheduler exists: **PASS at source level**.
Far-view logical separation exists: **PASS at source level**.
Playability Shield is wired into scheduling: **PASS at source level**.
Cooldown state is bounded: **PASS at source level**.
Bedrock target validity gate corrected: **PASS at source level**.
Build output: **NOT VERIFIED**.
Unit-test output: **NOT VERIFIED**.
Runtime output: **NOT VERIFIED**.
Performance evidence: **NOT VERIFIED**.
Mobile evidence: **NOT VERIFIED**.
Parity evidence: **NOT VERIFIED**.
100-chunk engine proof: **NOT VERIFIED**.
Duplicate report files in final tree: **NONE**.

## 21. PROJECT STATUS

IMPLEMENTED:
- 8 real implementation source files.
- bounded priority scheduler.
- logical five-zone far-view classifier with simulation separation.
- bounded chunk state.
- Playability Shield and runtime scheduling gate.
- adaptive governor.
- central Universal Attack API and five required adapters.
- shared cooldown/critical/damage/knockback resolvers.
- Bedrock execution port with valid-target checks.
- source-level core test suite.

PARTIAL:
- Phase 3 core implementation as a whole.

NOT IMPLEMENTED:
- full addon packaging/release.
- full far-view engine/render control.
- full Java-like gameplay parity.
- remaining gameplay subsystems not yet implemented.

NOT VERIFIED:
- exact 26.45 API binding.
- build/test execution output.
- runtime.
- performance.
- visual.
- mobile.
- parity.
- 100 real rendered chunks.

UNKNOWN:
- target-runtime behavior not directly exercised.

BLOCKERS:
- runtime/API compatibility evidence, measurements, parity tests, packaging.

ACTUAL SOURCE FILE COUNT: **8**
ACTUAL SOURCE LOC: **502 added LOC baseline measurement; exact final LOC not independently executed**
ACTUAL TEST FILE COUNT: **1**
ACTUAL TEST RESULT: **NOT VERIFIED**
RUNTIME STATUS: **NOT VERIFIED**
PERFORMANCE STATUS: **NOT VERIFIED**
MOBILE STATUS: **NOT VERIFIED**
PARITY STATUS: **NOT VERIFIED**
100-CHUNK STATUS: **NOT VERIFIED**
FINAL VERDICT: **PARTIAL / NOT VERIFIED**

If report and repository diverge, trust the repository. If evidence is missing or contradictory, FREEZE.
