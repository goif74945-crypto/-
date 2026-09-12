# NEXY_FARVIEW_100 — MASTER CURRENT-HEAD EVIDENCE REPORT

## SCOPE

IN-SCOPE: Far View, bounded performance, Playability Shield, Java-like gameplay/combat architecture, Universal Attack API, Weapon Adapter API, exact Minecraft Bedrock 26.45 target, `@minecraft/server` 2.9.0, production paths, tests, package, CI, API evidence and required runtime gates.

OUT-OF-SCOPE: UI inside the Java-like gameplay core, other Bedrock versions, unsupported API assumptions, and any fabricated runtime/performance/multiplayer/parity evidence.

Authoritative task specification: the attached `NEXY_FARVIEW_100 — MASTER DESIGN SPECIFICATION` supplied for this execution. Repository specification control: `docs/spec/NEXY_FARVIEW_100_PHASE_0_SPEC_LOCK.md`. The repository Phase-0 lock confirms the 26.45 target, Universal Attack API centrality, A/B/C/D Far View separation, bounded work and evidence gates. fileciteturn4file0L2-L4

## CURRENT HEAD / GIT FORENSICS

Execution start HEAD: `5d7402e1f83fa13d6a718e2e6ef468471730727c`.

That commit was a documentation-only child of production commit `fff6cc813098974af19d60ee991e182f2eab9398`; the direct comparison showed exactly one added file, the historical C-06 forensic report. fileciteturn2file0L3-L7

During this execution, only `docs/evidence/PROJECT_EVIDENCE_REPORT.md` was mutated. No production source file was mutated. The final repository HEAD is therefore a documentation-only descendant of the same production implementation inspected during this execution.

## FILES / SYMBOLS INSPECTED

Production: `src/main.ts`, `src/bedrock/runtime.ts`, `src/core/types.ts`, `src/core/combat.ts`, `src/core/far-view.ts`, `src/core/performance.ts`, `src/core/governor.ts`, `src/core/playability.ts`.

Tests: `tests/core.test.ts`, `tests/foundation-order.test.ts`, `tests/production-path-wiring.test.ts`, `tests/spatial-targets.test.ts`, `tests/transaction-boundary.test.ts`.

Build/package/config: `package.json`, `addon/manifest.json`, `tsconfig.json`, `tools/package-addon.mjs`, `tools/static-blocker-check.mjs`, `.github/workflows/core-check.yml`.

Evidence: Phase-0 lock, external runtime procedure, C-06 forensic report, prior project evidence report, master build blueprint.

## REQUIREMENT COMPILATION / FREEZE

| REQ-ID | SPEC REQUIREMENT | ACTUAL | STATUS |
|---|---|---|---|
| REQ-001 | Bedrock 26.45 ONLY | manifest pins minimum engine 26.45; live version absent | NOT VERIFIED |
| REQ-002 | unsupported API/conflict => UNKNOWN/FREEZE | runtime capability table keeps target binding unverified | NOT VERIFIED |
| REQ-003 | one Far View system | FarViewCore + producer path exist | PASS static |
| REQ-004 | 5 distance zones + lifecycle | implemented and tested | PASS static |
| REQ-005 | 100 is design target, never fake rendering | logical targets separated from rendering | PASS semantic |
| REQ-006 | bounded work and no world scan every tick | scheduler/maps bounded; no unrestricted global entity/block scan | PASS static |
| REQ-007 | dedup, priority/burst protection, adaptive governor | implemented and unit tested | PASS static |
| REQ-008 | protect local gameplay classes | shield protects movement/input/camera/combat/etc. | PASS static; runtime NOT VERIFIED |
| REQ-009 | mobile/load/thermal protection | policy exists; device telemetry absent | NOT VERIFIED |
| REQ-010 | native-first Java-like behavior + parity evidence | no direct Java source port identified; no parity dataset | NOT VERIFIED |
| REQ-011 | one Universal Attack API | central API exists and is used by core tests | PASS static |
| REQ-012 | Weapon Adapter extension mechanism | 5 adapters share central pipeline | PASS static |
| REQ-013 | AttackRequest uses only supported data | concrete request is narrower than conceptual design fields | PARTIAL |
| REQ-014 | full attack pipeline through damage/effects/durability/death/loot/XP | core order exists; runtime downstream stages unproven | NOT VERIFIED |
| REQ-015 | base/modified/final damage separation | result fields are separated; before-event final damage mutation exists | PASS static; runtime NOT VERIFIED |
| REQ-016 | critical/cooldown/knockback shared and correct | runtime request hardcodes `criticalEligible:false`, cooldown 5, knockback 2 | FAIL production completeness |
| REQ-017 | bounded projectile pipeline + dedup | projectile event dedup exists; damage/result path not proven | NOT VERIFIED |
| REQ-018 | AI/movement/item/block/status/world native-first behavior | broad hooks exist; full subsystem behavior not proven | PARTIAL |
| REQ-019 | Phase-1 exact API audit for 26.45/2.9.0 | dependency pinned; live target binding unproven | NOT VERIFIED |
| REQ-020 | independent evidence categories | process enforced; required runtime/performance/parity evidence absent | NOT VERIFIED |
| REQ-021 | hard locks: no unbounded work/fake PASS | bounded design + evidence separation present | PASS static/process |
| REQ-022 | final freeze on critical unknowns | unresolved mandatory runtime claims frozen | PASS process / BLOCKED final |

Checklist frozen. No requirement was deleted, merged or weakened.

## PRODUCTION CALL PATH — FAR VIEW

`installRuntimeHeartbeat`
→ `produceFarViewWork`
→ bounded player producer
→ player location/client capability
→ `generateSpatialFarOffsets(100)`
→ scoped chunk key
→ `FarViewCore.observeDistance`
→ priority mapping
→ bounded scheduler
→ bounded callback
→ `renderCapability`.

This creates logical workload only. `far-view.ts` explicitly distinguishes logical target generation from engine loading/client rendering. fileciteturn13file0L2-L6

## PRODUCTION CALL PATH — COMBAT

`world.beforeEvents.entityHurt`
→ `dispatchBeforeHurtCombat`
→ `buildObservedAttack`
→ runtime observer in `main.ts`
→ weapon registration
→ `UniversalAttackAPI.execute`
→ target/range
→ cooldown
→ critical
→ armor
→ resistance
→ modifiers
→ knockback plan
→ `BedrockCombatPort.commit`
→ `activeBeforeHurtEvent.damage = plan.finalDamage`
→ native hurt processing.

After-hurt and projectile-after handlers do not invoke a second canonical damage path; this is explicitly protected by static production-path tests. fileciteturn21file0L2-L6

## CLAIM / GAP AUDIT

### CLAIM C-001 — Far View logical target generation
EXPECTED: deterministic 100-target logical workload with bounded state.
ACTUAL: deterministic generator and bounded lifecycle exist.
EVIDENCE: source + current CI tests.
LEVEL: L5 for test contract.
VERDICT: PASS static/logical only.

### CLAIM C-002 — Real 100 client-rendered chunks
EXPECTED: independent visual/render proof.
ACTUAL: no engine-load or client-render authority is implemented/proven; only client render-distance capability is read.
LEVEL: L2/L3 only.
VERDICT: NOT VERIFIED.

### CLAIM C-003 — Runtime critical attack behavior
EXPECTED: runtime eligibility/check must feed shared CriticalResolver.
ACTUAL: production `buildObservedAttack()` hardcodes `criticalEligible:false`.
GAP: runtime critical path cannot exercise an eligible critical request from actual state.
VERDICT: FAIL for full runtime critical support.

### CLAIM C-004 — Runtime downstream combat transaction
EXPECTED: knockback/effect/durability and downstream result behavior must match the attack pipeline.
ACTUAL: `commit()` mutates only the before-hurt damage field and returns downstream statuses as `NOT_APPLICABLE`; `applyEffect()` and `applyDurability()` are not invoked by `commit()`.
GAP: native side effects versus scripted side effects are not independently proven.
VERDICT: NOT VERIFIED.

### CLAIM C-005 — Silent fallback
EXPECTED: no silent fallback / swallowed behavior changes.
ACTUAL: `weaponAttackType()` falls back to `SPECIAL`; `weaponId()` falls back to `nexy:unarmed` on caught errors.
VERDICT: FAIL against the execution contract.

### CLAIM C-006 — Armor capability
EXPECTED: supported combat targets must have correctly mapped armor semantics.
ACTUAL: missing `Equippable` throws `ARMOR_COMPONENT_UNAVAILABLE`.
VERDICT: NOT VERIFIED for general entity combat.
Official documentation states `EntityEquippableComponent` exposes armor/toughness and exists on player entities; that does not prove universal target coverage. citeturn354384search4

## PERFORMANCE / PLAYABILITY

Scheduler is bounded by queue, per-window work and work age and includes key deduplication, priority replacement, eviction, stale rejection and failure metrics. fileciteturn14file0L2-L6

Playability protection covers movement, input, camera, combat, inventory, item use, block interaction/break/place, nearby entities, projectile, boss, PvP, important events and redstone. fileciteturn15file0L2-L6

Governor states and execution budgets are bounded. The runtime signal is queue/work pressure plus JavaScript handler wall time; this is not FPS. fileciteturn16file0L2-L6

No real-device FPS, TPS, CPU, RAM or thermal measurements were found. PERFORMANCE RUNTIME = NOT VERIFIED.

## API VERIFICATION

`package.json` declares `@minecraft/server` 2.9.0. fileciteturn5file0L2-L4

`addon/manifest.json` declares minimum engine `[1,26,45]` and `@minecraft/server` 2.9.0. fileciteturn6file0L2-L4

Current runtime capability entries intentionally keep `targetBindingVerified:false`.

Official documentation confirms `EntityHurtBeforeEvent.damage` is the mutable damage amount to be caused, before-hurt execution is restricted, gameplay-state-changing APIs are restricted there, `Entity.applyDamage` cannot be called in restricted mode, and after-hurt damage is read-only. citeturn729272search0turn729272search7turn729272search12turn260757search4turn260757search5

API verdict: documented pre-damage model is supported conceptually; exact live 26.45 binding and all required semantics are NOT VERIFIED.

## TEST / CI VERIFICATION

GitHub Actions run #119 was bound to `5d7402...` and completed successfully. Its job log proves checkout at that HEAD, static blocker PASS, TypeScript build PASS, **38/38 tests PASS, 0 failures, 0 skipped**, addon packaging/ZIP integrity PASS and artifact upload PASS. fileciteturn32file0L2-L5

Run #120 was created by the first report-only correction and also completed with all workflow steps successful. The workflow executes Node/npm on Ubuntu and does not launch Minecraft Bedrock. fileciteturn26file0L2-L6

A subsequent report-only provenance correction produced the final documentation state. No production-code file was changed by these report updates, so no production behavior changed after the verified production source.

## PACKAGE

Package construction is verified by CI: manifest/script files are present, `NEXY_FARVIEW_100.mcaddon` is generated and ZIP integrity is checked. Package installation into Bedrock 26.45 is NOT VERIFIED.

## RUNTIME / L6

L6 REAL TARGET RUNTIME evidence is absent.

Missing evidence includes exact live Bedrock version, addon load, runtime probe output, real before-hurt execution, health delta, critical state, knockback/effect/durability state, projectile behavior, death/loot/XP behavior, independent engine-loaded chunk count, independent client-render evidence, device telemetry, 2-client multiplayer evidence and Java parity observations.

Therefore every runtime-mandatory requirement remains NOT VERIFIED.

## 100-CHUNK SEMANTICS

A logical workload: PASS static.
B logical chunk targets: PASS static.
C engine-loaded chunks: NOT VERIFIED.
D client-rendered chunks: NOT VERIFIED.

No A/B result is promoted to C/D.

## CONTRADICTIONS / STALE EVIDENCE

CONTR-001: historical build blueprint describes an older fail-safe `commit:false`; current source uses before-hurt damage mutation. Current source is authoritative for current implementation.

CONTR-002: historical project reports reference older HEADs. They are stale for final-state claims and are not used as current proof. The prior report explicitly referenced older implementation/report heads. fileciteturn18file0L2-L6

CONTR-003: core critical resolver exists while production request mapping always supplies `criticalEligible:false`.

## RED-TEAM /x10

01 FALSE PASS — blocked by final verdict.
02 STALE SHA — older heads separated.
03 STALE REPORT — prior project report superseded.
04 UNREACHABLE PATH — current before-hurt chain statically traced.
05 MOCK-ONLY — tests kept separate from runtime.
06 TEST/PRODUCTION MISMATCH — critical runtime mapping gap found.
07 WRONG API SEMANTICS — documented before-event mutation is supported; live target binding unverified.
08 WRONG EXECUTION CONTEXT — no `applyDamage()` is used in restricted before commit; downstream side effects remain unresolved.
09 DOUBLE MUTATION — secondary after-hurt/projectile combat paths are statically blocked.
10 MISSING RUNTIME/PERFORMANCE PROOF — confirmed.

Additional findings: silent weapon/type fallback, armor-component target gap, incomplete downstream combat transaction, absent client render authority.

## REPAIRS / RE-VERIFICATION

Repair performed: replaced the stale single project evidence report with this evidence-bound report and corrected its provenance chronology. No production source repair was applied.

Reason for production-code freeze: the critical defects identified require exact Bedrock 26.45 runtime semantics to choose a correct repair without inventing unsupported movement/critical rules, native side-effect assumptions, or execution-context behavior.

Current CI/package evidence remains green for the unchanged production implementation. Runtime-dependent defects remain frozen rather than relabeled PASS.

## EVIDENCE LEVELS

L1: source/file/symbol — verified.
L2: static production call path — verified for inspected Far View/combat paths.
L3: specification alignment — verified where stated; mismatches recorded.
L4: documented API/version — partial; live binding absent.
L5: unit/production-equivalent CI/build/package — verified.
L6: real Bedrock 26.45 runtime — absent.

## FINAL GATE

| GATE | VERDICT |
|---|---|
| Scope | PASS |
| Current source/head provenance | PASS |
| Authoritative spec | PASS |
| Requirement checklist frozen | PASS |
| Production paths traced | PASS static |
| Expected/Actual/Gaps | PASS |
| Repairable production defects fully repaired | FAIL / BLOCKED |
| CI/build/tests/package | PASS for current verified production source |
| Runtime L6 | NOT VERIFIED |
| Performance measurement | NOT VERIFIED |
| Engine-loaded 100 | NOT VERIFIED |
| Client-rendered 100 | NOT VERIFIED |
| Multiplayer | NOT VERIFIED |
| Java parity | NOT VERIFIED |
| Critical runtime eligibility | FAIL |
| Downstream transaction | NOT VERIFIED |
| Critical unknowns | PRESENT |
| Final verdict | **BLOCKED** |

## REQUIRED NEXT EVIDENCE BOUNDARY

An exact Bedrock 26.45 session must capture the runtime harness and controlled scenarios from the repository procedure. After those observations, affected REQ-IDs must be reopened and any necessary production repair must be made, tested, API-checked, re-traced, globally rescanned and red-teamed again.

Until L6 and the other mandatory independent evidence exist, the project is **BLOCKED** and must not be called complete.

**FINAL VERDICT: BLOCKED**
