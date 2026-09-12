# NEXY_FARVIEW_100 — MASTER CURRENT-HEAD EVIDENCE REPORT

## SCOPE

PROJECT: NEXY_FARVIEW_100
REPOSITORY: goif74945-crypto/-
BRANCH: main
TARGET: Minecraft Bedrock EXACT 26.45
SCRIPT API TARGET: @minecraft/server EXACT 2.9.0

IN-SCOPE: Far View, bounded performance, Playability Shield, Java-like gameplay/combat, Universal Attack API, Weapon Adapter API, production paths, tests, package, CI, official API semantics, required runtime gates, forensic repair planning, and adversarial verification.
OUT-OF-SCOPE: UI inside Java-like gameplay core, other target versions, unsupported API assumptions, fake runtime/performance/parity evidence.

AUTHORITATIVE DESIGN: attached NEXY_FARVIEW_100 MASTER DESIGN SPECIFICATION. Repository Phase-0 control: docs/spec/NEXY_FARVIEW_100_PHASE_0_SPEC_LOCK.md.

## CURRENT HEAD / GIT FORENSICS

Previous verified report commit: 27ae4d652a0e8f1de0d6668aeabef184f7df96b5.
Previous report blob SHA: 109226ce67393124014bcdbb3a2e9d1dc3978368.
Latest verified documentation revision before this /x10 expansion was committed at: fe6be59575358b732f84746283489390d5482775.
This revision is documentation-only; no production source is intentionally changed.
The commit returned by this update is the authoritative new branch tip for this report revision. Because a report cannot truthfully embed its own future commit SHA before the commit exists, the returned mutation SHA is the final provenance anchor. Any later repository mutation makes this report stale and requires re-verification.

## FILES / SYMBOLS INSPECTED

Production: src/main.ts, src/bedrock/runtime.ts, src/core/types.ts, src/core/combat.ts, src/core/far-view.ts, src/core/performance.ts, src/core/governor.ts, src/core/playability.ts.
Tests: tests/core.test.ts, tests/foundation-order.test.ts, tests/production-path-wiring.test.ts, tests/spatial-targets.test.ts, tests/transaction-boundary.test.ts.
Build/config: package.json, addon/manifest.json, tsconfig.json, tools/package-addon.mjs, tools/static-blocker-check.mjs, .github/workflows/core-check.yml.
Evidence/spec: Phase-0 lock, runtime procedure, C-06 forensic report, prior evidence report, master build blueprint, attached design specifications, official Microsoft Learn API documentation.

## PRODUCTION CALL PATH — FAR VIEW

installRuntimeHeartbeat
→ produceFarViewWork
→ bounded player producer
→ player location/client capability
→ generateSpatialFarOffsets(100)
→ scoped chunk key
→ FarViewCore.observeDistance
→ priority mapping
→ bounded scheduler
→ bounded callback
→ renderCapability.

This proves a logical bounded workload, not engine chunk loading or client rendering.

## PRODUCTION CALL PATH — COMBAT

world.beforeEvents.entityHurt
→ dispatchBeforeHurtCombat
→ buildObservedAttack
→ runtime observer
→ weapon registration
→ UniversalAttackAPI.execute
→ target/range
→ cooldown
→ critical
→ armor
→ resistance
→ modifiers
→ knockback plan
→ BedrockCombatPort.commit
→ activeBeforeHurtEvent.damage = plan.finalDamage
→ native hurt processing.

After-hurt/projectile-after paths are not allowed to become a second canonical damage path.

## REQUIREMENT / CLAIM STATUS

| ID | Requirement / Claim | Evidence | Verdict |
|---|---|---|---|
| REQ-001 | Bedrock 26.45 ONLY | manifest minimum engine 26.45; live runtime absent | NOT VERIFIED |
| REQ-002 | unknown API/conflict => FREEZE | capability boundary explicitly freezes unproven runtime | PASS process / BLOCKED final |
| REQ-003 | one Far View system | core + production producer | PASS static |
| REQ-004 | five distance zones/lifecycle | implementation + tests | PASS static |
| REQ-005 | 100 is design target, never fake rendering | logical/render distinction | PASS semantic |
| REQ-006 | bounded work; no global scan every tick | scheduler/maps/source audit | PASS static |
| REQ-007 | dedup/priority/burst/governor | implementation + tests | PASS static |
| REQ-008 | protect local gameplay | shield implementation | PASS static; runtime NOT VERIFIED |
| REQ-009 | mobile/load/thermal | policy exists, real telemetry absent | NOT VERIFIED |
| REQ-010 | Java-like parity | no parity dataset/runtime evidence | NOT VERIFIED |
| REQ-011 | Universal Attack API | central API + tests | PASS static |
| REQ-012 | Weapon Adapter extension | shared adapters/pipeline | PASS static |
| REQ-013 | AttackRequest supported data | concrete request narrower than conceptual design | PARTIAL |
| REQ-014 | full damage/effects/durability/death/loot/XP transaction | downstream execution not proven | NOT VERIFIED |
| REQ-015 | base/modified/final damage | separated result + before-event mutation | PASS static; runtime NOT VERIFIED |
| REQ-016 | critical/cooldown/knockback correctness | production hardcodes false/5/2 | FAIL production completeness |
| REQ-017 | projectile bounded pipeline | dedup exists, end-to-end result unproven | NOT VERIFIED |
| REQ-018 | native-first entity/item/block/world behavior | broad hooks, full behavior unproven | PARTIAL |
| REQ-019 | exact API audit for target | 2.9.0 documented and pinned; exact live 26.45 execution absent | NOT VERIFIED |
| REQ-020 | independent evidence categories | runtime/performance/parity evidence absent | NOT VERIFIED |
| REQ-021 | no unbounded work/fake PASS | source/process controls | PASS static/process |
| REQ-022 | freeze on critical unknowns | final gate enforced | PASS process |

## OFFICIAL API CAPABILITY MATRIX — REQUIRED BY THIS ADD-ON

The matrix below is the authoritative implementation-selection boundary. It distinguishes API existence/documentation from exact live 26.45 execution. No row is upgraded to L6 without target-runtime evidence.

| API / surface | Required by design | Documented semantics | Execution-context constraint | Implementation use | Evidence level | Verdict |
|---|---|---|---|---|---|---|
| world.beforeEvents.entityHurt | canonical combat interception | fires before entity hurt | restricted execution | receive native hit | L4 | PASS documented; L6 NOT VERIFIED |
| EntityHurtBeforeEvent.damage | final canonical damage | writable amount of damage that will be caused | allowed in before event | assign finalDamage | L4 | PASS documented |
| EntityHurtBeforeEvent.cancel | attack cancellation | writable boolean | before-event decision | cancel invalid/blocked hit | L4 | PASS documented |
| EntityHurtBeforeEvent.damageSource | source fidelity | read-only EntityDamageSource | observation | attacker/projectile/cause mapping | L4 | PASS documented |
| EntityHurtBeforeEvent.hurtEntity | target fidelity | read-only Entity | observation | target resolution | L4 | PASS documented |
| EntityDamageSource | source mapping | cause + optional damagingEntity + optional damagingProjectile | observation | populate AttackRequest context | L4 | PASS documented |
| Entity.applyDamage | separate scripted damage origin | applies damage; may return false/throw | NOT allowed in restricted execution | only for a deliberately separate attack origin, never duplicate canonical before-hit damage | L4 | PASS semantics / NOT replacement for before-event mutation |
| Entity.applyImpulse | knockback/velocity | mutates entity velocity | NOT allowed in restricted execution | deferred side effect only | L4 | PASS semantics; runtime ordering NOT VERIFIED |
| Entity.applyKnockback | knockback | world-state mutation | must not be assumed safe in restricted before callback | deferred side effect only | L4 | NOT VERIFIED for exact transaction behavior |
| EntityHurtAfterEvent | post-hit observation | damage/damageSource are read-only | post-event | observe result; no second damage | L4 | PASS documented |
| EntityEquippableComponent | armor/equipment | equipment access, totalArmor, totalToughness; documented on player entities | setEquipment restricted; reads have capability/throw boundaries | armor resolver with explicit capability check | L4 | PASS player capability; universal target coverage NOT VERIFIED |
| EquipmentSlot.Mainhand | active weapon | player mainhand/active hotbar slot | normal read context | weapon adapter source | L4 | PASS documented |
| ItemDurabilityComponent | durability | damage is mutable in normal execution | cannot edit in restricted execution | deferred durability commit | L4 | PASS semantics; transaction runtime NOT VERIFIED |
| system.run | deferred side effects | schedules future available execution point; event use generally end-of-tick, timing not guaranteed under load | non-restricted future callback | defer knockback/durability/effects | L4 | PASS as boundary; ordering NOT VERIFIED |
| @minecraft/server 2.9.0 | target script module | official module version exists | stable API track | dependency target | L4 | PASS documented |
| Dimension.getEntities / getPlayers / getBlock / isChunkLoaded | bounded local spatial work | documented module surfaces | normal execution | local target/projectile/far-view queries | L4 | PASS API family; exact project load behavior L6 NOT VERIFIED |
| System.currentTick / runInterval / runTimeout | bounded scheduling | documented scheduler surfaces | normal execution | central cooldown/queue scheduling | L4 | PASS API family; runtime timing L6 NOT VERIFIED |

## API SEMANTICS — EXACT IMPLEMENTATION RULES

### API-SEM-001 — Before-hurt damage
FACT: Microsoft Learn documents EntityHurtBeforeEvent.damage as writable and representing the amount of damage that will be caused.
RULE: canonical native hits use event.damage for final damage. Do not call applyDamage() for the same hit.

### API-SEM-002 — Restricted before-event boundary
FACT: entityHurt before callbacks use restricted execution.
RULE: calculate/validate in before callback and only perform documented permitted mutations. Do not directly mutate velocity, durability, equipment, effects, or other world state unless the specific API explicitly permits restricted execution.

### API-SEM-003 — applyDamage
FACT: Entity.applyDamage exists but cannot be called in restricted execution.
RULE: it is not a substitute for event.damage in the canonical before-hurt path. A separate scripted attack origin needs its own source semantics and deduplication.

### API-SEM-004 — knockback
FACT: applyImpulse is restricted; knockback is a world-state mutation.
RULE: calculate a knockback plan during the before event, then commit once from an allowed deferred context. Exact same-tick behavior remains a runtime test requirement.

### API-SEM-005 — after-hurt
FACT: after-hurt damage/source are read-only.
RULE: after-hurt is observation/post-processing, never a second canonical damage application.

### API-SEM-006 — damage source
FACT: EntityDamageSource exposes cause, damagingEntity and damagingProjectile when present.
RULE: AttackRequest source fields must derive from the real event source where source fidelity is required; no fabricated source identity.

### API-SEM-007 — armor/equipment
FACT: EntityEquippableComponent exposes totalArmor/totalToughness and equipment access; official documentation does not establish universal availability on every entity type.
RULE: armor capability is explicit. No silent fallback and no universal Equippable assumption.

### API-SEM-008 — durability
FACT: ItemDurabilityComponent.damage is not editable in restricted execution.
RULE: durability commit must be deferred/allowed and deduplicated.

### API-SEM-009 — deferred execution
FACT: system.run schedules a future available execution point and timing is not guaranteed under load.
RULE: it is a scheduling boundary, not proof of deterministic ordering. Runtime tests must verify combat transaction ordering.

## VERSION / BEDROCK COMPATIBILITY PROOF

FACT-1: addon/manifest.json targets minimum engine [1,26,45] and pins @minecraft/server 2.9.0.
FACT-2: Microsoft Learn officially documents @minecraft/server version 2.9.0.
FACT-3: Microsoft Learn Bedrock 1.26.40 update notes state that @minecraft/server v2.9.0 was released to stable in that product release.
FACT-4: Microsoft Learn script-module versioning states API module versions are separate from Minecraft product versions and should be declared as manifest dependencies; stable APIs are preferred.

CRITICAL LIMIT: these facts prove the documented module/version relationship and repository dependency declaration. They do NOT by themselves prove that a live Minecraft Bedrock 26.45 process has loaded this exact addon and executed every API path. Exact target-runtime availability/execution remains L6 NOT VERIFIED.

Therefore:
API EXISTS = PROVEN for the documented surfaces.
API DOCUMENTED = PROVEN.
API VERSIONED = PROVEN for @minecraft/server 2.9.0.
API DECLARED BY ADDON = PROVEN.
API AVAILABLE IN THIS EXACT LIVE 26.45 SESSION = NOT VERIFIED.
API SEMANTICS MATCH DOCUMENTATION = L4 PROVEN.
RUNTIME ACTUALLY EXECUTES = NOT VERIFIED until L6.

## UNIVERSAL ATTACK / WEAPON ADAPTER DECISION

The design requires one combat pipeline: WEAPON → ADAPTER → UNIVERSAL ATTACK API → validation → damage → critical → knockback → effects → durability → result. The attached specification requires API capability audit before final implementation.

The official API set supports the native interception and damage-commit boundary, but does not expose a single native Java-style "attack API" that supplies every conceptual AttackRequest field. Therefore UniversalAttackAPI and WeaponAdapter remain project-level abstractions; they must map only to verified Bedrock primitives and must not pretend to be Microsoft APIs.

Critical fields such as criticalEligible, cooldown, knockback, durabilityCost and projectileData are project-domain data. Each must be derived from actual supported runtime state or explicitly marked NOT VERIFIED. Hardcoded values are not runtime proof.

## CURRENT PRODUCTION DEFECTS / RED-TEAM FINDINGS

1. buildObservedAttack() hardcodes criticalEligible=false, cooldown=5, knockback=2; this prevents full runtime critical/cooldown/knockback fidelity.
2. BedrockCombatPort.commit() currently proves the before-event damage mutation but not a complete downstream transaction for effects/durability/death/loot/XP.
3. Silent fallbacks exist: weapon type can fall back to SPECIAL and weapon ID can fall back to nexy:unarmed after caught errors; this violates the no-silent-fallback contract.
4. Armor resolution can fail when Equippable is unavailable; universal target coverage is not proven.
5. Projectile dedup exists but end-to-end projectile damage/result proof is absent.
6. Exact target runtime L6 is absent.
7. No real-device FPS/TPS/CPU/RAM/thermal measurements are present.
8. No independent real client proof of 100 rendered chunks is present.
9. No multiplayer parity proof and no Java parity dataset/runtime proof are present.

## TEST / CI VERIFICATION

Prior CI run #122 was tied to production HEAD e5ae5b4be582172550930f87050e356489cffc4f and completed successfully. The workflow runs Node/npm checks and packaging on Ubuntu; it does not launch Minecraft Bedrock. Therefore CI PASS is not live Bedrock PASS.

Static tests prove only the assertions they actually execute. Mock/fixture behavior is not runtime proof.

## PERFORMANCE / PLAYABILITY

Bounded scheduler, deduplication, priority, queue/work-age limits, stale rejection, eviction and governor logic are present. Playability protection covers movement/input/camera/combat/inventory/item use/block interaction/nearby entities/projectiles/boss/PvP/important events/redstone.

No real-device FPS, TPS, CPU, RAM or thermal measurements were found. PERFORMANCE RUNTIME = NOT VERIFIED.

## FAR VIEW / 100-CHUNK BOUNDARY

100 chunks is a design target only. Logical target generation is not equivalent to engine loading, simulation distance, or client rendering. No evidence currently proves 100 real rendered chunks on Bedrock 26.45. Do not claim it.

The remaining work must keep three distinct claims separate:
1. LOGICAL TARGET COVERAGE — what the add-on scheduler generates/queues.
2. ENGINE LOADED COVERAGE — what Bedrock actually loads/keeps available.
3. CLIENT RENDERED COVERAGE — what the player client visibly renders.
No one of these may be substituted for another.

## EVIDENCE LEVELS

L0 claim/report only.
L1 source/file/symbol exists.
L2 static production call-path proven.
L3 specification alignment proven.
L4 official API/runtime semantics aligned by documentation.
L5 production-equivalent test proven.
L6 real target runtime proven.

L0-L5 are not LIVE RUNTIME PROOF.

## RUNTIME VERIFICATION GATE

L6 remains REQUIRED for claims that explicitly require exact Bedrock 26.45 runtime execution. Required evidence: exact runtime/product version, exact addon package, exact @minecraft/server module loaded, startup/content log evidence, executable combat/far-view probes, before/after event observations, knockback/durability/effect results, no duplicate damage, and target-load measurements where applicable.

## WHAT IS STILL MISSING — MASTER BLOCKER REGISTER

### BLOCKER-01 — Exact Bedrock 26.45 L6 proof
REQUIRED: start the exact target runtime, load the exact package, confirm product version, confirm addon activation and module load, collect startup/content logs, execute representative probes, and preserve artifacts.
CURRENT: no direct runtime session evidence.
VERDICT: NOT VERIFIED.

### BLOCKER-02 — Production critical/cooldown/knockback field correctness
REQUIRED: replace hardcoded criticalEligible=false, cooldown=5, knockback=2 with runtime-derived or explicitly contract-bound values. The source of each field must be traceable to supported player/entity/item state.
CURRENT: hardcoded values.
VERDICT: FAIL.

### BLOCKER-03 — No-silent-fallback enforcement
REQUIRED: error states must be explicit, observable, and testable. Unknown weapon type/ID, missing components, unsupported target capability, and unsupported source data must not silently become SPECIAL/unarmed or equivalent values.
CURRENT: silent fallback paths exist.
VERDICT: FAIL.

### BLOCKER-04 — Full combat transaction completion
REQUIRED: define and prove transaction phases: INPUT → VALIDATION → CALCULATION → BEFORE-EVENT DAMAGE COMMIT → NATIVE HURT → DEFERRED SIDE EFFECTS → OBSERVATION/RESULT → ONCE-ONLY FINALIZATION. Effects, durability, death consequences, loot/XP interactions and failure paths need explicit ownership.
CURRENT: only the damage mutation boundary is statically demonstrated.
VERDICT: NOT VERIFIED.

### BLOCKER-05 — Armor capability contract
REQUIRED: distinguish player/equippable targets from entities without the capability. Missing armor capability must have an explicit behavior defined by spec, not an exception-driven universal assumption.
CURRENT: universal target coverage not proven.
VERDICT: NOT VERIFIED.

### BLOCKER-06 — Projectile end-to-end proof
REQUIRED: trace projectile source → dedup identity → target resolution → universal attack calculation → single canonical damage commit → post-hit observation/result. Prove no double-damage path.
CURRENT: dedup exists; end-to-end runtime result absent.
VERDICT: NOT VERIFIED.

### BLOCKER-07 — Java-like parity dataset
REQUIRED: establish an explicit parity matrix for base damage, criticals, sprint/air timing assumptions, cooldown rules, knockback, armor, resistance, projectile behavior, weapon-specific behavior, and edge cases. Runtime parity evidence must be separated from design intent.
CURRENT: no complete parity dataset/runtime evidence.
VERDICT: NOT VERIFIED.

### BLOCKER-08 — Real performance/thermal measurements
REQUIRED: controlled measurements on representative target hardware: FPS, TPS/tick cost, CPU, memory/RAM, queue depth/work age, thermal/load behavior, and long-run stability. Compare baseline vs feature enabled.
CURRENT: policy exists but real telemetry absent.
VERDICT: NOT VERIFIED.

### BLOCKER-09 — 100-chunk evidence split
REQUIRED: independently test logical coverage, engine-loaded coverage, and client-rendered coverage. Do not report the design target as rendered distance.
CURRENT: only logical bounded target generation is statically supported.
VERDICT: NOT VERIFIED.

### BLOCKER-10 — Multiplayer and long-run stability
REQUIRED: multi-player sessions, concurrent combat, projectile bursts, chunk churn, disconnect/rejoin, sustained scheduling, duplicate execution checks, memory growth, and long-run governor behavior.
CURRENT: no independent runtime evidence.
VERDICT: NOT VERIFIED.

## RECOMMENDED REPAIR / VERIFICATION ORDER

1. REPAIR critical production-path defects first: runtime-derived combat fields, no-silent-fallback, armor capability boundary, and explicit combat transaction ownership.
2. Re-run repository tests/static checks/build/package and re-trace the production call path on the new HEAD.
3. Re-run official API cross-check against exact implementation decisions.
4. Establish the exact Bedrock 26.45 runtime environment and capture L6 loading/execution evidence.
5. Prove canonical combat transactions, including no duplicate damage and deferred side-effect ordering.
6. Prove projectile path end-to-end.
7. Build and execute the Java parity dataset.
8. Measure real performance/mobile/thermal behavior.
9. Verify logical vs engine-loaded vs client-rendered Far View separately.
10. Run multiplayer/long-run stress and final red-team verification.

## /x10 — ADVERSARIAL TEN-ROUND FORENSIC ATTACK ON THE CURRENT CLAIMS

Purpose: actively attempt to destroy a PASS. These rounds are evidence audits, not runtime substitutes. A round can produce FAIL/NOT VERIFIED even when static tests are green.

### X10-01 — FALSE-PASS ATTACK: "CI GREEN = PROJECT GREEN"
CLAIM-ID: X10-CI-001
TARGET CLAIM: successful CI means Bedrock behavior is correct.
ATTACK: inspect workflow boundary; determine whether Minecraft Bedrock is actually launched, target world created, addon loaded, and runtime probes executed.
EXPECTED: CI must contain target-runtime execution or it cannot provide L6.
ACTUAL: prior CI #122 executed Node/npm/static/package checks on Ubuntu and did not launch Minecraft Bedrock.
EVIDENCE LEVEL: L5-or-below.
GAP: no live engine execution.
VERDICT: FAIL for live-runtime claim / NOT VERIFIED for Bedrock behavior.

### X10-02 — FALSE-PASS ATTACK: "API DOCUMENTED = API AVAILABLE IN EXACT 26.45 SESSION"
CLAIM-ID: X10-API-002
TARGET CLAIM: @minecraft/server 2.9.0 documented means exact 26.45 execution is proven.
ATTACK: separate API existence, module version documentation, manifest declaration, product-version relationship, and real process loading.
EXPECTED: each stage must have its own evidence category.
ACTUAL: documentation and manifest pinning are proven; exact live 26.45 process/module execution is absent.
EVIDENCE LEVEL: L4 for semantics; no L6.
GAP: runtime artifact and loaded-module proof.
VERDICT: NOT VERIFIED.

### X10-03 — PRODUCTION-PATH ATTACK: "CRITICAL/COOLDOWN/KNOCKBACK ARE IMPLEMENTED BECAUSE RESOLVERS EXIST"
CLAIM-ID: X10-COMBAT-003
TARGET CLAIM: existence of CriticalResolver/cooldown/knockback logic proves production behavior.
ATTACK: trace actual field construction from event input to AttackRequest and compare with resolver consumption.
EXPECTED: production input must carry real eligibility/timing/strength data.
ACTUAL: buildObservedAttack() supplies hardcoded criticalEligible=false, cooldown=5, knockback=2.
EVIDENCE LEVEL: L2.
GAP: runtime-derived values and production fidelity.
VERDICT: FAIL.

### X10-04 — SILENT-FALLBACK ATTACK: "ERROR HANDLING IS SAFE BECAUSE IT PREVENTS A CRASH"
CLAIM-ID: X10-ERROR-004
TARGET CLAIM: caught errors with fallback values preserve behavior.
ATTACK: inject/observe missing or invalid weapon type, weapon id, component and target capability conditions; inspect resulting semantics.
EXPECTED: unknown state must be explicit and observable, never silently converted to a different gameplay object.
ACTUAL: SPECIAL/unarmed fallback paths are present after caught errors.
EVIDENCE LEVEL: L2 source proof.
GAP: explicit failure contract and runtime observability.
VERDICT: FAIL.

### X10-05 — DOUBLE-DAMAGE ATTACK: "AFTER/DEFERRED PROCESSING IS JUST EXTRA EFFECTS"
CLAIM-ID: X10-DAMAGE-005
TARGET CLAIM: after-hurt/deferred processing cannot duplicate canonical damage.
ATTACK: trace every call site that can mutate health/damage from before event, after event, projectile path, deferred callbacks, and scripted applyDamage.
EXPECTED: exactly one canonical damage origin per native hit, with explicit transaction identity for deferred work.
ACTUAL: before-event event.damage mutation is statically identified as canonical; full downstream once-only transaction proof is absent.
EVIDENCE LEVEL: L2.
GAP: runtime duplicate-damage proof and complete transaction identity/finalization.
VERDICT: NOT VERIFIED.

### X10-06 — CONTEXT-BOUNDARY ATTACK: "DEFERRED SIDE EFFECTS HAPPEN IN THE SAME TICK AS IF SYNCHRONOUS"
CLAIM-ID: X10-TIMING-006
TARGET CLAIM: system.run makes knockback/durability/effects deterministic and equivalent to same-call mutation.
ATTACK: compare documented scheduling semantics, restricted execution constraints, load-dependent timing, and observed transaction ordering.
EXPECTED: only exact runtime evidence can establish same-tick/ordering semantics required by gameplay parity.
ACTUAL: system.run is documented as future scheduling; timing under load is not guaranteed; no L6 ordering test exists.
EVIDENCE LEVEL: L4 boundary only.
GAP: runtime ordering and gameplay-equivalent timing.
VERDICT: NOT VERIFIED.

### X10-07 — CAPABILITY-BOUNDARY ATTACK: "EVERY TARGET HAS EQUIPPABLE/ARMOR"
CLAIM-ID: X10-ARMOR-007
TARGET CLAIM: armor resolution works for all damageable entities.
ATTACK: enumerate player and non-player targets, inspect component availability and exception behavior.
EXPECTED: explicit capability detection and spec-defined unsupported behavior.
ACTUAL: EntityEquippableComponent is documented on player entities; universal target coverage is not established.
EVIDENCE LEVEL: L4 API boundary + L2 implementation.
GAP: universal capability contract and runtime matrix.
VERDICT: NOT VERIFIED.

### X10-08 — PROJECTILE ATTACK: "DEDUP MAP = PROJECTILE SYSTEM PROVEN"
CLAIM-ID: X10-PROJ-008
TARGET CLAIM: existing projectile deduplication proves projectile gameplay.
ATTACK: trace source → identity → dedup → target selection → damage calculation → canonical commit → after observation → cleanup, then repeat under burst/concurrency.
EXPECTED: end-to-end single-result behavior under normal and burst conditions.
ACTUAL: dedup mechanism exists; complete result path and runtime proof are absent.
EVIDENCE LEVEL: L2.
GAP: complete path and L6 stress/runtime evidence.
VERDICT: NOT VERIFIED.

### X10-09 — FAR-VIEW CLAIM ATTACK: "100 OFFSETS = 100 RENDERED CHUNKS"
CLAIM-ID: X10-FAR-009
TARGET CLAIM: generateSpatialFarOffsets(100) proves 100-chunk rendering.
ATTACK: distinguish logical work generation from Bedrock engine-loaded chunks and actual client rendering; require independent measurements.
EXPECTED: three claims must be separately measured.
ACTUAL: current evidence proves only logical bounded target generation.
EVIDENCE LEVEL: L2/L3.
GAP: engine/client runtime measurements.
VERDICT: NOT VERIFIED.

### X10-10 — PERFORMANCE/PARITY ATTACK: "ARCHITECTURE GUARANTEES JAVA-LIKE PERFORMANCE AND GAMEPLAY"
CLAIM-ID: X10-PERF-010
TARGET CLAIM: bounded scheduler/governor architecture proves mobile performance and Java parity.
ATTACK: compare implementation policy with real device telemetry, long-run load, multiplayer concurrency, and a controlled Java parity dataset.
EXPECTED: measured baseline-vs-feature evidence plus parity cases and runtime results.
ACTUAL: no real FPS/TPS/CPU/RAM/thermal dataset, no multiplayer runtime proof, and no complete Java parity dataset/runtime evidence.
EVIDENCE LEVEL: L2/L3.
GAP: empirical performance and parity evidence.
VERDICT: NOT VERIFIED.

## /x10 AGGREGATE RESULT

X10-01: FAIL live-runtime equivalence.
X10-02: NOT VERIFIED exact-runtime API availability.
X10-03: FAIL production combat-field fidelity.
X10-04: FAIL no-silent-fallback contract.
X10-05: NOT VERIFIED duplicate-damage exclusion / full transaction.
X10-06: NOT VERIFIED deferred ordering/timing parity.
X10-07: NOT VERIFIED universal armor capability.
X10-08: NOT VERIFIED projectile end-to-end behavior.
X10-09: NOT VERIFIED 100-chunk loaded/rendered claim.
X10-10: NOT VERIFIED performance/multiplayer/Java parity claims.

X10 conclusion: the current repository evidence does not survive an adversarial claim-destruction exercise for the runtime-critical requirements. Static architectural evidence remains useful, but critical runtime claims must remain frozen.

## RE-VERIFICATION STATUS

This revision changes documentation only and adds the MASTER BLOCKER REGISTER, repair/verification order, and /x10 adversarial audit. Production source was not repaired in this round. The new report therefore does not upgrade any runtime claim and does not clear any production defect.

## FINAL GATE

Scope: PASS
Current-head provenance: PASS for this documentation revision
Authoritative specification: PASS
Production paths traced: PASS static
Official API semantics: PASS at L4 documented boundary
Exact live Bedrock 26.45 runtime: NOT VERIFIED
Critical runtime eligibility: FAIL
Downstream combat transaction: NOT VERIFIED
Silent fallback contract: FAIL
Armor capability contract: NOT VERIFIED
Projectile end-to-end: NOT VERIFIED
Performance runtime: NOT VERIFIED
100 real rendered chunks: NOT VERIFIED
Multiplayer: NOT VERIFIED
Java parity: NOT VERIFIED
Critical unknowns: PRESENT
X10 adversarial gate: BLOCKED

## FINAL VERDICT

BLOCKED

Reason: the repository has a defensible documented API implementation boundary and a verified @minecraft/server 2.9.0 dependency declaration, but it still lacks L6 proof on the exact Bedrock 26.45 runtime and still contains production-path defects in critical/cooldown/knockback mapping and silent fallback behavior, while the downstream combat transaction, projectile path, armor capability boundary, performance, multiplayer, Java parity, and 100-chunk engine/client claims remain unverified. Under the project master law, these gaps prohibit PASS.

## AUTHORITATIVE MICROSOFT SOURCES

- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhurtbeforeevent?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhurtbeforeeventsignal?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/execution-privilege?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhurtafterevent?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entitydamagesource?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityequippablecomponent?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/equipmentslot?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemdurabilitycomponent?view=minecraft-bedrock-experimental
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/system?view=minecraft-bedrock-experimental
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/changelog?view=minecraft-bedrock-experimental
- https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.26.40?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/versioning?view=minecraft-bedrock-stable

## REPORT INTEGRITY RULE

This report is evidence, not runtime proof. Never promote NOT VERIFIED to PASS without new direct evidence. Any subsequent source/config/CI/runtime change requires current-HEAD revalidation. The /x10 section is adversarial verification, not an excuse to weaken the evidence gate.
