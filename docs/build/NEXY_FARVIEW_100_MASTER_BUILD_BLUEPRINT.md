# NEXY_FARVIEW_100
# MASTER BUILD BLUEPRINT

Status: PLAN-ONLY
Repository: `goif74945-crypto/-`
Branch at reconstruction: `main`
Source reconstruction HEAD: `cff2dfdf910c466926a2465a38901154aeb340e4`
Target: Minecraft Bedrock 26.45 ONLY
Exact declared Script API dependency: `@minecraft/server` 2.9.0

> This document is an engineering construction map, not an implementation approval. It was generated from the repository's real specification/source/test/configuration state. No production code is changed by this blueprint.

---

## 00. Document Control

Purpose: provide a deterministic build/navigation map from specification lock through implementation, integration, test, runtime verification, performance, multiplayer, parity, transaction completion, and release.

Construction boundary:
- This report may describe required future code changes, tests, evidence, and runtime activities.
- This report must not itself alter production implementation, acceptance criteria, or specification.
- Historical reports are supporting claims only.
- The source-state baseline for this plan is `cff2dfdf910c466926a2465a38901154aeb340e4`.
- Creation of this document is documentation-only; the commit that stores it is not a production-state change.

Evidence labels used in this report:
`FACT`, `TARGET`, `UNVERIFIED`, `BLOCKED`, `UNKNOWN`, `CONFLICT`.

Authoritative rule:
The repository's Phase-0 lock identifies an authoritative design contract named `NEXY_FARVIEW_100 — ข้อมูลการออกแบบฉบับรวม`, but explicitly records that the exact file was not found in the repository baseline. Therefore this blueprint uses the Phase-0 lock as the repository-resident specification control and records the missing master-design file as a source gap rather than inventing its contents.

---

## 01. Current HEAD Identity

FACT at reconstruction:
- Repository: `goif74945-crypto/-`
- Branch: `main`
- HEAD: `cff2dfdf910c466926a2465a38901154aeb340e4`
- Immediately preceding forensic matrix source state was `2c3a4da290434999d138576763102819c82c7698`; the blueprint baseline is the newer documentation-only forensic bind commit.

Current production tree observed:
- `src/main.ts`
- `src/core/types.ts`
- `src/core/far-view.ts`
- `src/core/performance.ts`
- `src/core/governor.ts`
- `src/core/playability.ts`
- `src/core/combat.ts`
- `src/bedrock/runtime.ts`
- `tests/core.test.ts`
- `tests/foundation-order.test.ts`
- `tests/production-path-wiring.test.ts`
- `tests/spatial-targets.test.ts`
- `tests/transaction-boundary.test.ts`
- `tools/static-blocker-check.mjs`
- `tools/package-addon.mjs`
- `package.json`
- `tsconfig.json`
- `addon/manifest.json`
- `.github/workflows/core-check.yml`

No `package-lock.json` was found in the inspected tree. This is a FACT about the inspected tree, not a claim that no other lock mechanism can ever exist outside it.

Current build entry: `npm run build` -> `tsc -p tsconfig.json`.
Current test entry: `npm test` -> `node --test dist/tests/*.test.js`.
Current package entry: `npm run package:addon` -> build then `tools/package-addon.mjs`.
Current addon entry declared by manifest: `scripts/main.js`.

---

## 02. Specification Source Inventory

### Authoritative / specification-control source

| SPEC ID | FILE PATH | SECTION / HEADING | EXACT REQUIREMENT | TYPE | MANDATORY | DEPENDENCIES | C-GATE | TEST / EVIDENCE |
|---|---|---|---|---|---|---|---|---|
| SPEC-01 | `docs/spec/NEXY_FARVIEW_100_PHASE_0_SPEC_LOCK.md` | Target Platform | Minecraft Bedrock 26.45 ONLY | platform lock | YES | Bedrock runtime | C-07/C-08/C-09 | manifest + live runtime |
| SPEC-02 | same | Authoritative Specification / Authority Order | named master design contract is highest authority; missing repo copy must not be invented | source-control | YES | authoritative external contract | all | source inventory |
| SPEC-03 | same | Far View Contract | 100 chunks is a design target; never claim 100 real rendered chunks without independent client evidence | semantic | YES | engine/client | C-10/C-11/C-12 | logical/engine/client evidence |
| SPEC-04 | same | A/B/C/D separation | A logical workload, B chunk targets, C engine-loaded, D client-rendered | semantic | YES | all far-view work | C-10/C-11/C-12 | independent counters/evidence |
| SPEC-05 | same | Performance Contract | event-driven where possible; bounded queue/backlog/cache/task/work; no global scans each tick; protection/throttling | performance | YES | scheduler/governor | C-13 | unit + telemetry |
| SPEC-06 | same | Playability Contract | protect movement, camera, input, combat, inventory, item use, block interactions, nearby entities, projectile, boss, PvP, important events, redstone/gameplay | gameplay safety | YES | shield/runtime sensing | C-13/C-14 | runtime gameplay tests |
| SPEC-07 | same | Java-like Gameplay Contract | Java behavior -> behavior spec -> API audit -> Bedrock implementation -> parity test | parity | YES | external Java reference + API | C-15 | parity dataset |
| SPEC-08 | same | Universal Attack API Contract | weapon -> adapter -> request -> resolver -> damage -> knockback/critical/effects -> result | architecture | YES | core types/combat | C-06/C-15/C-16 | unit + runtime |
| SPEC-09 | same | Attack Pipeline Lock | input -> validation -> target/range -> cooldown -> attack type -> critical -> base -> armor/resistance/modifiers -> final -> knockback/effects/durability/projectile/death/loot/XP | transaction/gameplay | YES | combat/runtime | C-06/C-15/C-16 | staged tests + live cases |
| SPEC-10 | same | Evidence Contract | static/build/typecheck/unit/integration/CI/runtime/visual/performance/multiplayer/API/parity are separate | evidence | YES | all | all | evidence matrix |
| SPEC-11 | same | Hard Locks | native-first, no fake PASS, no unbounded work, no logical-to-render promotion, runtime PASS needs runtime evidence | governance | YES | all | all | red-team |
| SPEC-12 | same | Freeze Conditions | conflict/API ambiguity/stale evidence/missing mandatory evidence/false PASS -> freeze affected scope | governance | YES | all | all | audit |

### Supporting repository evidence sources

| SUPPORT ID | FILE | ROLE | AUTHORITY |
|---|---|---|---|
| SUP-01 | `docs/evidence/NEXY_FARVIEW_100_FOUNDATION_REQUIREMENT_MATRIX.md` | detailed foundation requirements and historical evidence map | supporting |
| SUP-02 | `docs/evidence/NEXY_FARVIEW_100_API_PROOF.md` | API/evidence boundary and runtime limitations | supporting |
| SUP-03 | `docs/evidence/NEXY_FARVIEW_100_EXTERNAL_RUNTIME_TEST.md` | external runtime/performance/multiplayer/parity procedure | supporting |
| SUP-04 | `docs/evidence/NEXY_FARVIEW_100_CURRENT_HEAD_REPAIR_MATRIX.md` | prior current-head forensic classification | supporting; stale for current HEAD after later documentation commit |
| SUP-05 | `docs/evidence/NEXY_FARVIEW_100_FOUNDATION_EVIDENCE_REPORT.md` | historical foundation inspection/evidence | supporting; historical |
| SUP-06 | `docs/evidence/PROJECT_EVIDENCE_REPORT.md` | project evidence history | supporting; stale for current-state claims |

### Missing specification source

`NEXY_FARVIEW_100 — ข้อมูลการออกแบบฉบับรวม` is named as the authoritative master design, but no repository file with that exact title was found by the Phase-0 specification lock. This is a source gap. The blueprint does not fabricate missing text. Future implementation must reconcile the external authoritative contract against this repository-resident lock before any conflicting requirement is built.

### SPEC CROSS-REFERENCE

The repository-resident Phase-0 lock and supporting matrices agree on these anchors: 26.45-only target; logical/engine/client separation; bounded work; protected gameplay; Universal Attack API; evidence separation; runtime evidence required. Exact field names in `AttackRequest` remain implementation details and are not treated as locked specification names.

---

## 03. Specification Authority Order

1. Authoritative master design / locked contract: `NEXY_FARVIEW_100 — ข้อมูลการออกแบบฉบับรวม`.
2. Repository Phase-0 lock and explicit hard locks.
3. Verified Bedrock 26.45/API capability evidence.
4. Current implementation as evidence only.
5. Current tests as evidence only.
6. Current build/CI/package metadata as evidence only.
7. Live runtime evidence.
8. Historical reports / AI statements as claims only.

Conflict policy: do not resolve by preference. Record both sources, freeze affected construction branch, obtain authoritative resolution, then update the traceability map.

---

## 04. Complete Requirement Traceability Matrix

| REQ-ID | SPEC SOURCE | REQUIREMENT | CURRENT STATE | TARGET STATE | IMPLEMENTATION PATH | TEST | RUNTIME PROOF | STATUS |
|---|---|---|---|---|---|---|---|---|
| REQ-01 | SPEC-01 | Bedrock 26.45 only | manifest declares min engine 26.45 | real 26.45 runtime | preserve exact manifest + prove runtime | manifest/package | client/server version capture | UNVERIFIED |
| REQ-02 | SPEC-02 | authoritative master design must govern | named file absent in repo | authoritative text available/resolved | import/attach authoritative source before affected implementation | source audit | N/A | BLOCKED BY SOURCE GAP for conflicting details |
| REQ-03 | SPEC-03/04 | 100 is design target with A/B/C/D separation | A/logical implemented; B/C/D not proven | independent A/B/C/D evidence | separate logical target, engine-load, client-render layers | spatial tests + runtime probes | live engine/client | PARTIALLY_IMPLEMENTED |
| REQ-04 | SPEC-05 | bounded work | scheduler/governor bounded in source | bounds remain enforced under runtime load | retain scheduler limits; instrument runtime | stress tests | telemetry | IMPLEMENTED for covered static contract |
| REQ-05 | SPEC-06 | protected gameplay | shield protects required classes in source | live gameplay never degraded by far work | preserve protected priorities, verify runtime behavior | playability tests | gameplay session | PARTIALLY_IMPLEMENTED |
| REQ-06 | SPEC-07 | native-first Java-like parity | architecture exists; parity unverified | behavior-level parity | external reference cases -> adapter/runtime -> comparison | parity suite | live controlled cases | UNVERIFIED |
| REQ-07 | SPEC-08 | central attack API | `UniversalAttackAPI` exists | all legitimate combat paths converge | route supported inputs through central resolver | adapter/core tests | runtime event-to-core trace | PARTIALLY_IMPLEMENTED |
| REQ-08 | SPEC-09 | locked attack sequence | core math/order implemented; runtime commit absent | complete runtime transaction | staged resolver + runtime commit | order/boundary tests | health/effects/durability/death/loot/XP | PARTIALLY_IMPLEMENTED |
| REQ-09 | SPEC-10/11 | no false PASS | current docs explicitly separate evidence | all verdicts remain evidence-bound | evidence schema + gate checks | audit | live artifacts | IMPLEMENTED as process; must persist |
| REQ-10 | SPEC-12 | freeze on ambiguity | API bindings marked unverified | affected branch frozen until proof | explicit blocker register | red-team | exact failure evidence | IMPLEMENTED as policy |
| REQ-11 | foundation matrix FV-01..FV-03 | five zones and bounded state | implemented | stable under regression | FarViewCore | core tests | runtime semantics | IMPLEMENTED static |
| REQ-12 | foundation matrix PF-01..PF-04 | central priority/bounds/dedup/failure metrics | implemented | stable under stress | scheduler | 10k stress/dedup tests | runtime telemetry | IMPLEMENTED static |
| REQ-13 | foundation matrix PG-01..PG-03 | protected classes/governor/no synthetic memory | implemented statically | live pressure behavior measured | shield/governor instrumentation | core tests | device/runtime | PARTIALLY_IMPLEMENTED |
| REQ-14 | foundation matrix CM-01..CM-05 | adapters/cooldown/damage order/result separation | implemented in core | behavior matches authoritative runtime | combat core + adapter integration | full core suite | runtime parity | PARTIALLY_IMPLEMENTED |
| REQ-15 | foundation matrix TX-01..TX-02 | commit boundary and no success with unverified stages | explicit fail-safe | real atomic or defensible engine transaction | transaction layer | negative + failure-injection tests | live failure/recovery | BLOCKED UNTIL RUNTIME DESIGN/PROOF |
| REQ-16 | foundation matrix RT-01..RT-04 | version/API/runtime binding/lifecycle | declared and probed, targetBindingVerified false | live 26.45 proof and idempotent lifecycle | API capability audit + runtime harness | binding/lifecycle tests | live session | UNVERIFIED |
| REQ-17 | foundation matrix PV-01..PV-02 | bounded spatial work and A/B/C/D separation | statically bounded | runtime bounded and correctly classified | producer/scheduler/engine adapter | stress tests | live chunk state | PARTIALLY_IMPLEMENTED |
| REQ-18 | foundation matrix EV-01..EV-03 | evidence/current-head/test coverage | process exists | every build release remains bindable to HEAD | evidence records + CI | audit | artifact fingerprint | IMPLEMENTED as process |

---

## 05. Current Repository Reconstruction

### Core contracts and data
`src/core/types.ts`: defines Priority, DistanceZone, ChunkState, AttackType, Vec3, CombatModifier, CombatEffect, AttackRequest, CombatResult, WorkItem.

### Far View
`src/core/far-view.ts`: five distance zones, deterministic 100-offset generator, bounded chunk state/history, stale reclamation, client-max capability check that does not claim engine/client rendering.

### Scheduling
`src/core/performance.ts`: bounded map-backed priority scheduler, duplicate-key suppression, higher-priority replacement, low-priority eviction, stale rejection, deterministic drain ordering, timing/failure stats.

### Playability
`src/core/playability.ts`: gameplay class protection and degradation policy.

### Governor
`src/core/governor.ts`: adaptive states `EXTREME/HIGH/BALANCED/SAFE/CRITICAL`; execution budgets 32/24/16/8/2; disables lower-value far/decorative work at high pressure.

### Combat
`src/core/combat.ts`: adapters, registry, cooldown, critical, damage, knockback, target contract, commit result contract, central UniversalAttackAPI.

### Runtime
`src/bedrock/runtime.ts`: event subscriptions, bounded entity/projectile/error state, target resolution, armor/resistance adapters, effect/durability methods, runtime probe, heartbeat/harness. All listed API capabilities remain `targetBindingVerified:false`. `BedrockCombatPort.commit()` is an intentional fail-safe returning `committed:false` with unresolved mandatory side effects.

### Composition root
`src/main.ts`: instantiates all core systems; installs runtime wiring/harness/observer; generates 100 logical offsets per producer player; schedules bounded work; drains scheduler every 5 ticks using governor budget.

### Tests
- `tests/core.test.ts`: broad core regressions.
- `tests/foundation-order.test.ts`: locked combat ordering.
- `tests/production-path-wiring.test.ts`: explicitly STATIC wiring only.
- `tests/spatial-targets.test.ts`: 100 logical unique/deterministic targets.
- `tests/transaction-boundary.test.ts`: pre-mutation validation, rollback on target/commit rejection, conflict protection.

### Build/package
`package.json`, `tsconfig.json`, `addon/manifest.json`, `tools/package-addon.mjs`, `.github/workflows/core-check.yml` form the build/package/CI chain.

---

## 06. Existing Architecture Reality

Actual current composition:

`@minecraft/server`
→ `src/bedrock/runtime.ts`
→ runtime event wiring / capability probe / BedrockCombatPort
→ `src/main.ts` composition root
→ `src/core/*`
→ `tests/*`
→ TypeScript build/package
→ CI

Far-view actual path:

`world.getAllPlayers()`
→ bounded producer count (max 8 players per production tick)
→ player location + client capability snapshot
→ center chunk calculation using `Math.floor`
→ 100 deterministic offsets
→ per-player/dimension/chunk key
→ FarViewCore state observation
→ priority mapping
→ bounded scheduler admission
→ runtime callback currently checks client capability only

This path currently creates logical workload only. It does not call an engine chunk-loading primitive, and it does not control client rendering.

Combat actual path:

`afterEvents.entityHurt` / projectile after-events
→ `observeCombat`
→ `buildObservedAttack`
→ registered-weapon guard in `src/main.ts`
→ `UniversalAttackAPI.execute`
→ target/range/cooldown/critical/armor/resistance/modifier/knockback
→ `BedrockCombatPort.commit()`
→ currently rejected fail-safe.

Therefore C-06 is not a complete authoritative pre-damage path and C-16 is not a completed transaction.

---

## 07. Gap Analysis

GAP-01: authoritative master design text absent from repository; conflicting details must freeze.
GAP-02: runtime API binding is not proven in Bedrock 26.45.
GAP-03: current combat source observes `afterEvents.entityHurt`; post-hurt observation cannot itself be pre-damage authority.
GAP-04: `BedrockCombatPort.commit()` does not execute a complete world-state transaction.
GAP-05: C-10 logical 100 does not establish C-11 engine-loaded or C-12 client-rendered 100.
GAP-06: client max render distance is read, not render authority.
GAP-07: performance instrumentation has handler wall time, not FPS/TPS/device telemetry.
GAP-08: no real multiplayer evidence.
GAP-09: no full Java-vs-Bedrock runtime parity evidence.
GAP-10: runtime registration idempotency is not dedicatedly proven.
GAP-11: current report/evidence documents contain historical HEAD claims and require exact-head binding for future acceptance.

---

## 08. C-06 Construction Blueprint

Purpose: create a production event-to-combat path that respects pre-damage authority, canonical resolution, and evidence semantics.

Preconditions: authoritative design contract reconciled; API 2.9.0 capability audit complete enough to choose supported path.

Required construction:
1. Enumerate actual attack input/event sources and mark timing (`before` vs `after`).
2. Keep `afterEvents.entityHurt` as observation only; never use it as a substitute for pre-damage control.
3. Add/repair a before-hurt gate only if live API audit proves required fields/capabilities.
4. Separate request construction from observation reconstruction.
5. Route accepted requests into `UniversalAttackAPI`.
6. Ensure validation and target resolution precede state mutation.
7. Choose an execution model compatible with Bedrock execution privilege rules: before-event may cancel/modify the engine's damage value; state-changing APIs requiring non-restricted execution must be scheduled/deferred where permitted.
8. Define exactly one authoritative damage mutation path; prevent duplicate damage from after-event observers.
9. Emit structured runtime evidence containing event stage, request identity, target, decision, and final observed health delta.

Key files: `src/bedrock/runtime.ts`, `src/main.ts`, potentially `src/core/types.ts`, `src/core/combat.ts`.

Definition of done: controlled live 26.45 tests demonstrate pre-damage decision, exactly one damage application, correct target/obstruction/cooldown/critical semantics, and no duplicate side effect.

Hard failure: inability to establish a supported pre-damage authority path; affected combat branch remains frozen, not marked PASS.

---

## 09. C-07 Construction Blueprint

Target: exact Bedrock 26.45.

Construction units:
- preserve manifest `min_engine_version: [1,26,45]`.
- preserve addon script entry `scripts/main.js`.
- preserve declared dependency `@minecraft/server` 2.9.0.
- create package fingerprinting tied to source HEAD.
- run addon load in exact Bedrock 26.45.
- capture client/server version from runtime UI/log/environment, not configuration alone.

Validation: build/package + live import/load + startup/runtime harness.

Evidence: exact HEAD, exact package SHA-256, exact game version, raw startup/script output.

Do not call manifest correctness runtime proof.

---

## 10. C-08 Construction Blueprint

Target: exact `@minecraft/server` 2.9.0.

For each production symbol in `src/bedrock/runtime.ts`, build an API matrix:
`symbol | declared version | official signature | production call site | execution context | event timing | server/client authority | live result | fallback/stop rule`.

Current symbols include: `system.run`, `system.runInterval`, `system.clearRun`, multiple world events, `Entity.getEntitiesFromViewDirection`, `Entity.getViewDirection`, `Entity.applyDamage` capability listing, `Entity.applyImpulse`, `EntityComponentTypes.Equippable`, `EntityComponentTypes.Inventory`, `ItemComponentTypes.Durability`, `Entity.addEffect/getEffect`, `Player.clientSystemInfo.maxRenderDistance`, `Player.camera`.

Validation sequence:
1. official documentation check;
2. installed typings check;
3. manifest/dependency check;
4. compile check;
5. real 2.9.0 binding test in Bedrock 26.45;
6. controlled semantic test.

If a symbol compiles but fails live, classify runtime failure and redesign; do not change version to evade it.

---

## 11. C-09 Construction Blueprint

Execution chain:
`src/*.ts`
→ TypeScript build
→ `dist/src/main.js`
→ `tools/package-addon.mjs`
→ `addon/manifest.json + addon/scripts/main.js`
→ `NEXY_FARVIEW_100.mcaddon`
→ Bedrock import
→ behavior-pack activation
→ `scripts/main.js`
→ initialization/event subscriptions
→ heartbeat/harness
→ runtime behavior.

Every transition must record input/output and validation. Package integrity uses the repository's existing ZIP validation path. Runtime startup must collect the existing `NEXY_RUNTIME_EVIDENCE` output and raw script errors.

Definition of done: clean startup and stable initialization over the defined runtime window without script error, with required capability probes passing.

---

## 12. C-10 Construction Blueprint

Current implementation already has `generateSpatialFarOffsets(100)` and tests for count, uniqueness, signed coordinates, determinism, and distance bound.

Future hardening:
- formalize target identity key as `(player, dimension, chunkX, chunkZ)`.
- test exact 100 repeated generations across many invocations.
- test negative/world-boundary coordinates.
- test multiple players and same target offset producing different scoped keys.
- test re-entry after release.
- test no duplicate scheduling per key.

Proof object: A/B separation record that explicitly calls these logical targets only.

Definition of done: 100 unique deterministic logical targets are reproducibly generated for each scoped invocation, and no test calls them engine-loaded/rendered.

Current static evidence: PASS for logical generation only.

---

## 13. C-11 Construction Blueprint

Goal: prove 100 engine-loaded chunks, independently from C-10/C-12.

Capability path already identified by supporting API evidence: Bedrock provides `TickingAreaManager` concepts such as chunk count/capacity and a `createTickingArea` operation whose completion is associated with chunks loaded and ticking. This is an API avenue, not current implementation approval.

Build units:
1. API audit exact availability on target 2.9.0/26.45.
2. Determine whether a bounded per-player/per-session loading abstraction is permitted by the authoritative design and engine limits.
3. Define chunk-set identity and lifecycle.
4. Create/load the required set using only legitimate supported engine facilities.
5. Capture engine-state evidence: requested IDs, reported loaded/ticking state, count, failures, capacity.
6. release/reclaim safely.

Non-goal: calling a queue or array “loaded”.

Definition of done: live engine evidence independently verifies the required number of engine-loaded target chunks at the exact package/HEAD.

Blocker: engine cannot support the required quantity/lifecycle within authoritative constraints -> BLOCKED for C-11, with exact capacity/error evidence.

---

## 14. C-12 Construction Blueprint

Goal: prove 100 client-rendered chunks independently.

Current runtime only reads `Player.clientSystemInfo.maxRenderDistance` and reports `cameraAccessible`; it does not possess proven client render authority.

Build units:
- identify actual client-side render-distance controls available to the target platform.
- determine whether an add-on can legitimately influence render distance or only work around it.
- define an independent visual/render-count measurement method.
- fix camera/test geometry and known markers at selected target distances.
- capture screenshots/video or equivalent direct visual evidence at required radii.
- correlate visual evidence with exact target coordinates; never infer visual count from engine count.

Definition of done: independently repeatable client evidence demonstrates the required render result. Otherwise classify NOT VERIFIED/BLOCKED.

---

## 15. C-13 Construction Blueprint

Metrics must remain separate:
`FPS`, `TPS/tick timing`, `script execution time`, `CPU`, `RAM`, `thermal`, `GC/memory pressure`, `queue depth`, `work/tick`, `player count`, `target count`.

Current source instrumentation:
- scheduler queue and per-window bounds;
- execution timing via `Date.now()` around handler work;
- governor queue/work pressure;
- bounded entity/projectile/runtime-error maps.

Important: handler wall time is not FPS.

Construction:
1. Define a measurement schema with timestamp, HEAD, package fingerprint, device, scenario, sample interval, metric, unit.
2. Add only metrics supported by the environment.
3. Use external/device telemetry for FPS/CPU/RAM/thermal.
4. Measure baseline before addon and controlled addon scenarios.
5. Run idle, movement, combat, 100 logical targets, burst camera movement, sustained 10-minute, and two-player cases per existing runtime procedure.
6. Analyze median/p95/p99 where sufficient samples exist; preserve raw samples.
7. Red-team for memory growth, starvation, queue buildup, gameplay degradation.

Complexity targets:
- target generation: O(T) where T=100.
- per producer tick: O(P*T) with P bounded by current producer cap; this must be measured and reviewed because global workload scales with player count.
- scheduler drain: O(Q log Q) in current implementation due per-drain sorting, with Q bounded at 256.
- target resolution: local view-result filtering/sorting; avoid global entity scans.
- hot-path requirement remains bounded and must not become O(P×E) over global entities.

Definition of done: measured device/runtime results plus algorithmic review demonstrate no unacceptable gameplay regression and satisfy the authoritative performance gates.

---

## 16. C-14 Construction Blueprint

Static preparation exists via per-player scoped keys and bounded producer count.

Real test matrix:
1. one player baseline;
2. two players independent movement;
3. two players same target/combat interaction;
4. concurrent projectile events;
5. simultaneous far-view workload;
6. repeated rapid actions;
7. disconnect/reconnect;
8. cross-player state contamination checks;
9. fairness/starvation measurement;
10. long-running synchronized state.

Evidence must contain exact player identities within the test session, event ordering, state snapshots, damage/event counts, queue/workload metrics, and any divergence.

Definition of done: same-world 2-player session shows isolation, synchronization, no duplicated side effects, no starvation attributable to far-view work.

---

## 17. C-15 Construction Blueprint

Parity matrix per behavior:
`attack`, `targeting`, `range`, `obstruction`, `cooldown`, `critical`, `armor`, `resistance`, `damage`, `knockback`, `effects`, `durability`, `projectile`, `death`, `loot`, `XP`.

For each case:
`JAVA REFERENCE CASE`
→ `EXPECTED RESULT`
→ `NEXY REQUEST/STATE`
→ `BEDROCK OBSERVED RESULT`
→ `DIFF`
→ `JUSTIFICATION`
→ `VERDICT`.

Architecture split:
- Core math/rules in `src/core/combat.ts`.
- Bedrock capability mapping in `src/bedrock/runtime.ts`.
- Real engine behavior validated externally.

Definition of done: no claimed Java-like behavior remains without a corresponding behavior-level comparison. Full parity claim requires full required case evidence.

---

## 18. C-16 Construction Blueprint

Goal: complete canonical transaction without partial state leakage.

Conceptual stages:
`PREPARE`
→ `VALIDATE`
→ `REGISTRY`
→ `COOLDOWN`
→ `CRITICAL`
→ `ARMOR`
→ `RESISTANCE`
→ `MODIFIERS`
→ `FINAL`
→ `COMMIT`
→ `EFFECT`
→ `DURABILITY`
→ `PROJECTILE`
→ `DEATH`
→ `LOOT`
→ `XP`
→ `VERIFY`
→ `RESULT`.

Current state: `BedrockCombatPort.commit()` is permanently non-successful and returns unresolved stages. Treat this as an explicit construction blocker, not a feature.

Required design work before implementation:
1. Decide which engine operation is authoritative for damage and which stages are native side effects.
2. Define transaction boundary that minimizes irreversible work.
3. Separate PREPARE/VALIDATE from mutations.
4. Record pre-state needed for recovery where rollback is technically possible.
5. Apply only supported state mutations.
6. Verify each mutation before reporting success.
7. On failure, execute supported rollback/recovery; if full rollback is not technically possible, narrow the transaction so irreversible actions occur last and define the precise failure semantics.
8. Prevent double commit and re-entrant duplicate execution with transaction identity.
9. Never return `committed:true` with unresolved mandatory stages.

Failure-injection tests must cover invalid request, target rejection, execution rejection, commit rejection, effect failure, durability failure, projectile failure, death failure, loot failure, XP failure, repeated execution, and re-entrant/concurrent conditions where supported.

Definition of done: live controlled transactions prove exactly-once or explicitly authoritative engine semantics, all mandatory stages verified/N-A as allowed, and failure cases leave an accepted final state consistent with the locked contract.

---

## 19. File-Level Construction Map

| FILE | MODULE | PRIMARY RESPONSIBILITY | INPUT | OUTPUT | DEPENDENCY | CALLER | CALLEE / STATE | ERROR PATH | TEST / EVIDENCE |
|---|---|---|---|---|---|---|---|---|---|
| `src/core/types.ts` | contracts | shared types | domain values | typed contracts | none | all core | type system | compile failure | build/typecheck |
| `src/core/far-view.ts` | FarViewCore | zones, state, logical target generation | distance/key/tick | decisions/state/history | types | `src/main.ts` | scheduler decision | invalid input/release | `core.test.ts`, `spatial-targets.test.ts` |
| `src/core/performance.ts` | scheduler | bounded priority work | WorkItem | queue/drain/stats | types | `src/main.ts` | callbacks | reject/stale/handler failure | `core.test.ts` |
| `src/core/governor.ts` | governor | pressure policy | queue/work/memory sample | state/policy | none | `src/main.ts` | scheduler/shield | invalid/nonfinite pressure handling | `core.test.ts` |
| `src/core/playability.ts` | shield | protected gameplay policy | gameplay class/tick | priority/degrade decision | types | `src/main.ts`, runtime | governor | protected work never degraded | `core.test.ts` |
| `src/core/combat.ts` | UniversalAttackAPI | canonical combat logic | AttackRequest/adapter | CombatResult | types | `src/main.ts` future runtime gates | resolvers/port | validation/commit rejection | core/foundation/transaction tests |
| `src/bedrock/runtime.ts` | Bedrock adapter | events, target resolution, capability/runtime state | Bedrock entities/events | requests, probes, commit result | `@minecraft/server`, core types | `src/main.ts` | world/player/entity APIs | recordRuntimeError, fail-safe rejection | static + live runtime |
| `src/main.ts` | composition root | wire all systems and producers | runtime events/core objects | scheduled work/runtime actions | all core + runtime | addon entry | heartbeat/observers | bounded catches/logging | production-path static + live |
| `tests/core.test.ts` | core regression | broad unit coverage | fixtures | assertions | core modules | CI | none | test failure | CI |
| `tests/foundation-order.test.ts` | ordering regression | lock damage sequence | fixture port | order/result assertions | combat | CI | none | fail on ordering regression | CI |
| `tests/production-path-wiring.test.ts` | static wiring | source-path guard | source files | regex/source assertions | fs | CI | none | fail on source mismatch | STATIC ONLY |
| `tests/spatial-targets.test.ts` | logical far-view | 100-target proof | generator | count/determinism assertions | far-view | CI | none | fail | UNIT/CI |
| `tests/transaction-boundary.test.ts` | transaction guard | pre-mutation/rollback | fixtures | registry/result assertions | combat | CI | none | reject/rollback | UNIT/CI |
| `tools/package-addon.mjs` | package tool | construct addon archive | dist + manifest | mcaddon | Node fs/zip | CI/manual | generated files | missing file/archive failure | package CI |
| `tools/static-blocker-check.mjs` | static gate | forbidden-pattern guard | source tree | pass/fail | Node fs | CI | none | failure | STATIC/CI |
| `addon/manifest.json` | manifest | engine/dependency/entry declaration | static config | Bedrock package metadata | none | Bedrock | n/a | invalid load | package + runtime |
| `.github/workflows/core-check.yml` | CI | static/build/test/package | repo | CI run/artifact | GitHub Actions | push/main | npm commands | CI failure | CI |

---

## 20. Symbol-Level Construction Map

### `src/main.ts`
`installRuntimeEventWiring` (runtime registration) -> must have idempotent one-time lifecycle and live proof.
`installRuntimeHarness` (runtime probe) -> produces `NEXY_RUNTIME_EVIDENCE` at player spawn.
`installRuntimeCombatObserver` (combat bridge) -> must remain observation-only unless authoritative path is separately established.
`scheduleGameplayWork` -> central gameplay work admission.
`scheduleFarViewWork` -> FarView state + scheduler.
`releaseFarViewWork` -> cancellation + far-view release.
`produceFarViewWork` -> player/offset producer; current bound is 8 players per production tick and 100 offsets/player.

### `src/core/far-view.ts`
`generateSpatialFarOffsets` -> exact logical 100 generator.
`FarViewCore.classifyChunkDistance` -> five zones/out-of-range.
`FarViewCore.renderCapability` -> client-limit gate only.
`FarViewCore.observeDistance` -> state transition and target state.
`FarViewCore.transition` -> transition invariant.
`FarViewCore.release` / `reclaimStale` / `clearReleased` -> lifecycle cleanup.

### `src/core/performance.ts`
`BoundedPriorityScheduler.enqueue` -> bounded admission/dedup/replacement/eviction.
`drain` -> deterministic priority execution with per-window bound.
`rejectStale` -> stale cleanup.
`stats` -> evidence counters.

### `src/core/governor.ts`
`AdaptivePerformanceGovernor.evaluate` -> pressure-to-policy state machine.
`workloadPolicy` -> actual scheduler budget/degradation output.

### `src/core/playability.ts`
`GameplayPressureTracker.mark/snapshot/isActive` -> activity memory.
`PlayabilityShield.isProtected/priorityFor/shouldDegrade` -> protection policy.

### `src/core/combat.ts`
`WeaponRegistry.register/get/unregister` -> authoritative definition registry.
`CooldownResolver.validate/commit` -> cooldown state.
`CriticalResolver.resolve` -> critical multiplier from supplied eligibility.
`DamageResolver.resolve` -> modifier math.
`KnockbackResolver.resolve` -> impulse vector.
`UniversalAttackAPI.executeAdapter` -> adapter validation/temporary registration/rollback.
`UniversalAttackAPI.execute` -> canonical staged computation + commit contract.

### `src/bedrock/runtime.ts`
`readClientCapabilities` -> runtime client capability observation.
`samplePlayerPressure` -> bounded camera/gameplay sensing.
`installRuntimeEventWiring` -> Bedrock subscriptions.
`BedrockCombatPort.resolveTarget` -> view-ray target selection + block obstruction check.
`mitigateArmorDamage` / `mitigateResistanceDamage` -> runtime defensive state translation.
`commit` -> CURRENT CONSTRUCTION BLOCKER: fail-safe false.
`applyEffect` / `applyDurability` -> existing mutation helpers not yet part of a proven atomic commit.
`probeRuntime` -> direct binding smoke probe.
`installRuntimeHeartbeat` -> bounded periodic callback.
`installRuntimeHarness` -> runtime evidence output.

---

## 21. Component Dependency Graph

`SPEC LOCK`
→ `Shared Contracts (types.ts)`
→ `FarViewCore`
→ `Scheduler`
→ `Governor + Playability`
→ `UniversalAttackAPI`
→ `Bedrock Adapter`
→ `Composition Root`
→ `Package`
→ `CI`
→ `Live Runtime`
→ `Engine/Client Evidence`
→ `Performance/Multiplayer/Parity`
→ `Release Gate`.

Critical edges:
- `types.ts` precedes all core modules.
- `combat.ts` must be stable before runtime commit integration.
- API capability proof precedes any design that relies on unverified runtime symbols.
- Runtime integration precedes live tests.
- Live test harness precedes runtime PASS.
- Engine proof precedes C-11 PASS; client visual proof independently precedes C-12 PASS.

---

## 22. File Dependency Graph

```text
package.json / tsconfig.json
        |
        v
src/core/types.ts
  |--- far-view.ts
  |--- performance.ts
  |--- playability.ts
  |--- combat.ts
  |--- governor.ts
             \ 
              v
        src/bedrock/runtime.ts
              ^
              |
         src/main.ts
              |
      +-------+---------+
      |       |         |
    tests   package   addon/manifest.json
      |       |         |
      +-------+---------+
              |
          CI workflow
              |
          live addon
```

---

## 23. Data Flow Map

### Far View
`Player state`
→ `(dimension, location)`
→ `(centerChunkX, centerChunkZ)`
→ `100 logical offsets`
→ `(chunkX, chunkZ)`
→ scoped work key
→ distance zone
→ priority
→ scheduler
→ bounded callback
→ client-limit observation only.

### Combat
`Bedrock event/input`
→ event-normalized request
→ validation
→ weapon registry
→ target/range
→ cooldown
→ critical
→ armor
→ resistance
→ modifiers
→ final damage
→ commit plan
→ runtime side effects
→ independent result observations.

No data flow may merge logical far-view count with loaded/rendered count.

---

## 24. Control Flow Map

```text
BOOT
 |
 +--> manifest/dependency load
 |
 +--> runtime wiring
 |      +--> event subscriptions
 |      +--> runtime harness
 |
 +--> core composition
 |
 +--> heartbeat
        |
        +--> sample protected gameplay pressure
        +--> produce bounded far work
        +--> reclaim stale FarView state
        +--> reject stale queued work
        +--> drain <= governor budget
        +--> evaluate pressure
```

Combat current control flow:
`after-event observation -> observer -> canonical execute -> commit rejection`.

Target future control flow, after capability proof:
`authoritative attack stage -> canonical execute -> verified commit -> independent after-event observation`.

---

## 25. Runtime Call Path

Current real path:

`Bedrock world.afterEvents`
→ `installRuntimeEventWiring` callback
→ `rememberEntity/mark`
→ combat observation (`observeCombat`) when applicable
→ `installRuntimeCombatObserver` callback in `main.ts`
→ registered weapon guard
→ `combat.execute`
→ `BedrockCombatPort.resolveTarget`
→ armor/resistance
→ core math
→ `BedrockCombatPort.commit`
→ `committed:false`.

Current far-view path:
`installRuntimeHeartbeat`
→ `produceFarViewWork`
→ `generateSpatialFarOffsets(100)` output
→ scheduler
→ callback
→ `renderCapability`.

Required verified runtime path for final build:
`exact Bedrock event`
→ correct timing authority
→ normalization
→ canonical core
→ supported engine operation
→ state verification
→ result observation.

Every edge needs either source-trace evidence or live runtime evidence appropriate to the claim.

---

## 26. Test Dependency Graph

`typecheck`
→ `unit core`
→ `ordering`
→ `transaction boundary`
→ `static wiring`
→ `logical far-view`
→ `integration/package`
→ `addon load`
→ `live runtime`
→ `performance`
→ `multiplayer`
→ `parity`
→ `release regression`.

A test cannot prove a higher evidence class merely because it passes.

---

## 27. Evidence Graph

```text
CLAIM
 |
 v
SPEC REQUIREMENT
 |
 v
IMPLEMENTATION SYMBOL
 |
 v
TEST / STATIC CHECK
 |
 +--> BUILD / TYPECHECK
 |
 +--> PACKAGE
 |
 v
LIVE RUNTIME (when required)
 |
 +--> VISUAL
 +--> PERFORMANCE
 +--> MULTIPLAYER
 +--> PARITY
 |
 v
VERDICT
```

Promotion law: no edge may be skipped when the downstream claim requires that evidence class.

---

## 28. Master Navigation Map

| NODE | WHERE | WHAT | WHY | DEPENDS ON | BUILDS INTO | VERIFIED BY | BLOCKED BY | NEXT |
|---|---|---|---|---|---|---|---|---|
| N00 | `docs/spec` | lock source authority | controls all work | source inventory | requirements | spec audit | missing/conflicting authority | N10 |
| N10 | `src/core/types.ts` | stabilize contracts | prevents interface drift | N00 | core components | typecheck | spec conflict | N20 |
| N20 | `src/core/far-view.ts` + scheduler/governor/shield | stabilize static foundation | bounded workload | N10 | runtime producer | unit/stress | API-independent defects | N30 |
| N30 | `src/core/combat.ts` | stabilize canonical combat | single truth | N10 | runtime adapter | core/order/transaction tests | missing runtime semantics | N40 |
| N40 | `src/bedrock/runtime.ts` | API capability/runtime adapter | maps Bedrock reality | N30 + API audit | production runtime | live probe | unavailable live engine | N50 |
| N50 | `src/main.ts` | integrate production path | connects all components | N20/N30/N40 | executable addon | static + live path | authority timing/API | N60 |
| N60 | package/manifest/CI | reproducible artifact | exact deployable input | N50 | mcaddon | package/CI | build/package failure | N70 |
| N70 | Bedrock 26.45 | addon execution | runtime proof | N60 | runtime evidence | startup/event tests | no exact runtime | N80 |
| N80 | engine/chunk layer | C-11 | real loaded chunks | N70 + API proof | engine evidence | engine state | engine capacity/API | N90 |
| N90 | client | C-12 | visual render proof | N70 | client evidence | visual capture | client authority/limit | N100 |
| N100 | device/runtime | C-13 | performance proof | N70/N80 | telemetry | measured metrics | device/tooling | N110 |
| N110 | multiplayer runtime | C-14 | synchronization/isolation | N70/N100 | multi-user evidence | 2-client test | no multiplayer env | N120 |
| N120 | parity harness | C-15 | behavior-level parity | N70 + external reference | parity evidence | case matrix | missing reference/runtime | N130 |
| N130 | transaction runtime | C-16 | complete state change | N30/N40/N70 | release candidate | failure-injection + live | atomic capability | N140 |
| N140 | release | final validation | ship only proven artifact | all prior | release package | complete evidence matrix | any mandatory gap | STOP |

---

## 29. Construction Order

| BUILD-ID | PHASE | TASK | FILE | SYMBOL | DEPENDENCY | INPUT | OUTPUT | VALIDATION | EVIDENCE | BLOCKER | NEXT |
|---|---|---|---|---|---|---|---|---|---|---|---|
| B001 | P0 | reconcile authoritative spec source and lock conflicts | `docs/spec/...` | source map | none | real spec sources | locked traceability | source cross-reference | spec inventory | missing master-design file | B002 |
| B002 | P1 | verify exact 26.45 + 2.9.0 API capability set | `src/bedrock/runtime.ts` | `SCRIPT_API_CAPABILITIES`, `probeRuntime` | B001 | official docs + typings + target runtime | capability matrix | API audit + live probe | API/runtime evidence | no exact runtime | B003 |
| B003 | P2 | harden shared contracts | `src/core/types.ts` | AttackRequest/Result/WorkItem | B001 | reconciled requirements | stable contracts | typecheck/unit | build | spec conflict | B004 |
| B004 | P2 | harden far-view state/generator | `src/core/far-view.ts` | generator/state methods | B003 | distance/target requirements | deterministic bounded logical model | unit/stress | A/B evidence | none known | B005 |
| B005 | P2 | harden scheduler/governor/shield | performance/governor/playability | relevant classes | B003/B004 | bounded-work requirements | bounded scheduler policy | stress/unit | static evidence | runtime pressure unknown | B006 |
| B006 | P3 | finalize canonical combat core | `src/core/combat.ts` | `UniversalAttackAPI` | B003/B002 | API-independent behavior contract | deterministic core pipeline | ordering/negative tests | unit evidence | authoritative behavior conflict | B007 |
| B007 | P3 | integrate authoritative runtime combat timing | `src/bedrock/runtime.ts`, `src/main.ts` | event bridge | B002/B006 | live API capability | one authoritative path | production-path + runtime | runtime evidence | event privilege/design | B008 |
| B008 | P3 | implement verified transaction layer | `src/bedrock/runtime.ts`/needed adapter files | `BedrockCombatPort.commit` and support symbols | B007 | supported engine operations | commit + failure recovery | failure-injection + live | transaction evidence | atomic limitation | B009 |
| B009 | P4 | integrate engine chunk-load mechanism | far-view/runtime files as required | new verified loading abstraction | B002/B004 | 100 logical targets | engine-loaded set | runtime engine checks | C-11 | API/engine capacity | B010 |
| B010 | P4 | integrate client/render measurement only where supported | runtime/test harness | render proof helpers | B002/B009 | client capability | independent visual evidence | visual tests | C-12 | client authority/limit | B011 |
| B011 | P4 | add performance telemetry pipeline | runtime/test evidence tooling | measurement symbols | B005/B007/B009 | scenarios | raw/aggregated metrics | measured benchmark | C-13 | device tooling | B012 |
| B012 | P4 | multiplayer verification harness/procedure | external runtime test assets | scenario IDs | B007/B009/B011 | 2 players | synchronized evidence | real 2-client run | C-14 | access/env | B013 |
| B013 | P4 | parity case matrix | test/evidence assets | case runners | B008/B012 | Java reference cases | comparison records | parity suite | C-15 | reference/runtime | B014 |
| B014 | P5 | full regression and release assembly | package/CI/docs | release gates | B003-B013 | final candidate | exact addon/evidence set | all required checks | release matrix | any failed mandatory gate | STOP |

Classification:
- B001/B002 = MUST BUILD FIRST.
- B003-B005 = CAN BUILD IN PARALLEL after authority baseline, provided no conflict.
- B006 must wait for contract/API decisions affecting combat semantics.
- B007/B008 must wait for API proof where runtime authority is involved.
- B009/B010 are blocked until C-11/C-12 capability routes are established.
- B011/B012/B013 can be developed in parallel only after runtime instrumentation shape is stable.
- B014 MUST WAIT for all mandatory gates.

---

## 30. Parallelizable Work

Safe parallel groups after B001/B002:

Group A: core/static hardening — B003, B004, B005.
Group B: test expansion for already-defined behavior — ordering, logical targets, transaction negative cases.
Group C: evidence schema/navigation/report tooling.

Must not run in parallel:
- conflicting spec interpretation and implementation;
- runtime implementation dependent on unverified API assumptions;
- C-12 PASS evaluation before independent render evidence;
- release assembly before exact-head/package fingerprint is frozen.

---

## 31. Critical Path

`B001 spec reconciliation`
→ `B002 exact API/engine capability audit`
→ `B006 canonical combat stabilization`
→ `B007 authoritative runtime integration`
→ `B008 transaction completion`
→ `B009 engine-loaded chunk proof`
→ `B010 client-render proof`
→ `B011 real performance`
→ `B012 multiplayer`
→ `B013 parity`
→ `B014 final release validation`.

Critical external dependencies:
- exact Minecraft Bedrock 26.45 runtime;
- exact `@minecraft/server` 2.9.0 environment;
- client visual capture capability;
- performance telemetry access;
- two-client multiplayer environment;
- authoritative parity reference cases;
- sufficient engine chunk capability.

Main bottlenecks are runtime access/evidence, not TypeScript build mechanics.

---

## 32. Bottleneck Analysis

| BLOCKER-ID | AREA | EXACT CAUSE | EVIDENCE | ALTERNATIVES CHECKED | UNBLOCK CONDITION | STATUS |
|---|---|---|---|---|---|---|
| BLK-01 | SPEC | authoritative master-design file named by Phase-0 is absent from repository | Phase-0 lock explicitly records file absent | repository spec tree/search; supporting reports; no substitute accepted | provide/resolve exact authoritative source text for conflicting requirements | BLOCKED FOR AFFECTED CONFLICTS |
| BLK-02 | API/RUNTIME | no live Bedrock 26.45 execution environment in repository CI | runtime reports targetBindingVerified false; CI workflow runs Node only | official docs, typings/build, runtime harness design | exact Bedrock 26.45 session available | NOT VERIFIED |
| BLK-03 | C-11 | current production path has no integrated engine-loaded chunk mechanism | source inspection of FarView path; no engine-load call | API avenue identified: TickingAreaManager concepts; must be audited on exact target | supported engine loader + live engine evidence | NOT IMPLEMENTED |
| BLK-04 | C-12 | no proven add-on authority to force client rendering | runtime only reads client max render distance | client capability/read-only path; independent visual test plan | exact client control/evidence route or acceptable contract interpretation | NOT VERIFIED |
| BLK-05 | C-13 | CI has no FPS/CPU/RAM/thermal instrumentation | existing runtime evidence docs | wall-time signal is explicitly not FPS; external device telemetry planned | real target-device telemetry | NOT VERIFIED |
| BLK-06 | C-14 | no 2-client runtime environment in repository CI | external procedure requires two clients | static per-player isolation analysis | real multiplayer session | NOT VERIFIED |
| BLK-07 | C-15 | no authoritative Java-vs-Bedrock runtime dataset | evidence docs classify parity unverified | core unit coverage only; insufficient for parity | controlled reference-vs-live cases | NOT VERIFIED |
| BLK-08 | C-16 | `BedrockCombatPort.commit()` always returns `committed:false` | direct source inspection | safe fail-closed boundary; partial mutation rejected | complete runtime transaction design + live proof | CONSTRUCTION BLOCKER |

No item is labeled external HARD BLOCKER unless the alternatives column has been investigated and the required external condition is genuinely unavailable. `BLK-01` is a specification-source gap; it is not permission to guess. `BLK-08` is an implementation blocker, not an excuse to skip future runtime work.

---

## 33. Blocker Register

### BLK-01
Area: specification authority.
Exact cause: named authoritative master-design file absent from repository.
What was checked: Phase-0 lock, spec tree, evidence matrices, current implementation.
Rejected alternative: treating evidence reports/current code as authoritative.
Unblock: authoritative source supplied or exact conflict resolved.

### BLK-02
Area: live runtime.
Exact cause: GitHub CI is Node-based and does not launch Bedrock 26.45.
What was checked: package scripts and workflow; runtime harness exists but has not been executed in Bedrock.
Rejected alternative: treating build/typecheck as runtime proof.
Unblock: exact Bedrock session and raw runtime evidence.

### BLK-08
Area: transaction implementation.
Exact cause: commit boundary is fail-safe false and cannot complete C-16.
What was checked: `BedrockCombatPort.commit`, transaction tests, core API mandatory-status guard.
Rejected alternative: implementing partial side effects while reporting success.
Unblock: supported transaction implementation plus failure/recovery proof.

---

## 34. API Capability Matrix

| API | Declared/official source | Current production use | Execution-context concern | Required proof |
|---|---|---|---|---|
| `system.run` | `@minecraft/server` 2.9.0 declaration / official docs | runtime probe | normal deferred execution | live probe |
| `system.runInterval` | same | heartbeat | scheduler timing | live startup + stability |
| `system.clearRun` | same | probe | normal deferred execution | live probe |
| `world.afterEvents.entityHurt` | official after-event | combat observation | post-action, not authority for pre-damage | live event timing |
| `world.beforeEvents.entityHurt` | official before-event | probe only | restricted execution; mutate only supported fields | live pre-damage test |
| `Entity.getEntitiesFromViewDirection` | official Entity API | target resolution | runtime ray behavior | controlled first-hit cases |
| `Entity.getBlockFromViewDirection` | official Entity API | obstruction check | runtime block intersection semantics | controlled obstruction |
| `Entity.applyDamage` | official Entity API | capability listed, not blind post-hurt | unavailable in restricted execution | live allowed-context test |
| `Entity.applyImpulse` | official Entity API | capability listed via commit boundary | execution-context restrictions | live effect test |
| `Entity.addEffect/getEffect` | official Entity API | resistance/effect | runtime entity state | live effect cases |
| `ItemComponentTypes.Durability` | official item API | durability helper | item state availability | live durability |
| `Player.clientSystemInfo.maxRenderDistance` | official client-system info | client capability readout | read-only observation | live client snapshot |
| `Player.camera` | official Player API | capability probe | client/runtime behavior | live camera access |

Rule: official documentation proves documented API behavior/capability description, not this project's live binding or feature behavior.

---

## 35. Runtime Verification Matrix

| RUNTIME-ID | AREA | SETUP | ACTION | EXPECTED | EVIDENCE | VERDICT GATE |
|---|---|---|---|---|---|---|
| RV-01 | startup | exact 26.45 world | activate pack/join | no script error; evidence message | raw log/chat | C-09 |
| RV-02 | API | player session | execute runtime probe | required symbols PASS | raw `NEXY_RUNTIME_EVIDENCE` | C-08 |
| RV-03 | event wiring | fresh world | controlled gameplay events | correct class marks | runtime output | C-09 |
| RV-04 | target | three-entity arrangement | attack | nearest/obstructed target behavior exact | result + geometry | C-06/C-15 |
| RV-05 | damage | isolated target | normal/critical/armor/resistance | expected health delta/order | health before/after | C-06/C-15 |
| RV-06 | cooldown | same attacker | rapid repeat | second request rejected until ready | ticks + result | C-15/C-16 |
| RV-07 | effects/durability | disposable target/item | successful attack | expected effects/durability | entity/item state | C-16 |
| RV-08 | projectile | controlled projectile | entity/block/double delivery | no duplicate side effect | metrics + state | C-15/C-16 |
| RV-09 | death/loot/XP | disposable mob | lethal case | independent death/loot/XP evidence | entity/drops/XP | C-15/C-16 |
| RV-10 | far-view A/B/C/D | fixed test world | activate 100-target workload | independent A/B/C/D measurements | logs + visual | C-10/C-11/C-12 |
| RV-11 | performance | device baseline | scenario suite | raw telemetry captured | telemetry file | C-13 |
| RV-12 | multiplayer | two clients | concurrent operations | isolation/sync/fairness | two-client logs/video | C-14 |
| RV-13 | parity | reference cases | same cases in Bedrock | match or justified delta | comparison table | C-15 |
| RV-14 | transaction failure | failure injection | force each supported failure mode | safe rejection/recovery | pre/post state | C-16 |

---

## 36. Performance Verification Plan

Scenario matrix, per existing external procedure:
- idle 60s;
- normal movement 60s;
- combat 60s;
- 100 logical targets active 60s;
- burst movement/camera 60s;
- sustained 10-minute;
- two-player session.

Capture:
- FPS from actual client/profiler;
- TPS or equivalent tick timing;
- script handler duration;
- CPU;
- RAM;
- thermal;
- queue size;
- executed tasks;
- tracked chunk count;
- projectile dedup counters.

Baseline control: same device/world/graphics/render-distance settings, pre-addon and addon conditions, same scenario script.

Failure conditions: gameplay timing corruption, starvation, unexpected memory growth, queue explosion, sustained thermal instability, unacceptable measured regression against the authoritative performance gate. No threshold may be invented in this blueprint; thresholds must come from the authoritative specification or be marked unresolved.

---

## 37. Multiplayer Verification Plan

Environment:
- exact Bedrock 26.45;
- same world/session;
- two independently controlled clients.

Test dimensions:
- identity isolation;
- far-view key isolation;
- combat target isolation;
- simultaneous same-target events;
- projectile dedup per projectile/target;
- disconnect/reconnect cleanup;
- scheduler fairness;
- state leakage;
- long-run behavior.

Evidence must be per-player and session-bound. A two-player unit mock is never multiplayer proof.

---

## 38. Java/Bedrock Parity Verification Plan

Build a controlled dataset for each required case.

Case record fields:
- `PARITY-ID`
- Java reference version/context
- setup
- input/action
- target state
- expected outcome
- Bedrock setup
- observed outcome
- numeric delta
- behavioral delta
- explanation
- evidence links
- verdict.

Required cases: attack, targeting, range, obstruction, cooldown, critical, armor/protection, resistance, modifiers, damage, knockback, effects, durability, projectile, death, loot, XP.

No source similarity, method names, or unit mocks count as parity proof.

---

## 39. Transaction / Rollback Verification Plan

### Prepare
Collect identities and relevant pre-state.

### Validate
Check request, weapon, target, range, cooldown, numeric validity, supported capability.

### Apply
Perform only supported state mutations under the correct execution context.

### Verify
Check actual engine state after each mutation and record exact result.

### Commit
Only report success when mandatory stages are verified or explicitly N/A by specification.

### Failure path
`FAIL`
→ stop further side effects
→ invoke supported recovery/rollback
→ verify restored state
→ emit failed transaction record.

Test cases:
- invalid request;
- missing weapon;
- target mismatch;
- range failure;
- cooldown failure;
- armor/resistance failure;
- commit exception/rejection;
- effect failure;
- durability failure;
- projectile failure;
- death/loot/XP divergence;
- repeat/double execution;
- re-entrant call.

Permanent `committed:false` is a construction stop condition for C-16, not a PASS state. Permanent `NOT_VERIFIED` mandatory stages similarly cannot coexist with successful transaction acceptance.

---

## 40. Definition of Done

A construction unit is done only when:
1. source is implemented at the exact required path/symbol;
2. dependency inputs are proven;
3. unit/component tests pass;
4. production call path is traced;
5. build/typecheck/package pass;
6. required runtime evidence exists where runtime is part of the claim;
7. failure paths are tested;
8. no stale evidence is being inherited;
9. exact HEAD/package fingerprint is recorded;
10. red-team review finds no unclassified contradiction.

C-gate PASS rules:
- C-06: authoritative event timing + exactly one correct combat path + runtime evidence.
- C-07: exact Bedrock 26.45 live evidence.
- C-08: exact API 2.9.0 live capability/semantic evidence.
- C-09: real addon startup/event execution.
- C-10: exactly 100 unique deterministic logical targets.
- C-11: independently verified 100 engine-loaded chunks.
- C-12: independently verified 100 client-rendered chunks.
- C-13: real measured performance evidence.
- C-14: real 2-player evidence.
- C-15: complete required parity cases with evidence.
- C-16: complete transaction semantics with supported failure/recovery proof.

---

## 41. FINAL BUILD SEQUENCE

```text
START
 |
 v
00 SPECIFICATION INVENTORY
 |
 v
01 CURRENT-HEAD RECONSTRUCTION
 |
 v
02 AUTHORITY / CONFLICT FREEZE
 |
 v
03 EXACT BEDROCK 26.45 + SERVER 2.9.0 CAPABILITY AUDIT
 |
 +-------------------------+
 |                         |
 v                         v
04 CORE CONTRACTS       05 STATIC FOUNDATION
 |                         |
 +-----------+-------------+
             v
06 CANONICAL COMBAT CORE
             |
             v
07 AUTHORITATIVE RUNTIME EVENT PATH
             |
             v
08 VERIFIED TRANSACTION / SIDE EFFECT LAYER
             |
             +------------------+
             |                  |
             v                  v
09 C-10 LOGICAL           10 C-11 ENGINE LOAD
             |                  |
             +--------+---------+
                      v
11 C-12 CLIENT RENDER
                      |
                      v
12 C-13 PERFORMANCE
                      |
                      v
13 C-14 MULTIPLAYER
                      |
                      v
14 C-15 PARITY
                      |
                      v
15 C-16 TRANSACTION REGRESSION
                      |
                      v
16 FULL REGRESSION / RED-TEAM
                      |
                      v
17 PACKAGE / RELEASE FINGERPRINT
                      |
                      v
18 FINAL EVIDENCE MATRIX
                      |
                      v
STOP ONLY ON COMPLETE PASS OR REAL HARD BLOCKER
```

---

## 42. FINAL NAVIGATION TREE

```text
ROOT — NEXY_FARVIEW_100
|
+-- 00_SPEC_LOCK
|   +-- SPEC-01 Target = Bedrock 26.45 ONLY
|   +-- SPEC-02 Authority order / missing master-design source
|   +-- SPEC-03 Far View 100 = design target
|   +-- SPEC-04 A/B/C/D semantic separation
|   +-- SPEC-05 Performance bounds
|   +-- SPEC-06 Playability protection
|   +-- SPEC-07 Java-like behavior contract
|   +-- SPEC-08 Universal Attack API
|   +-- SPEC-09 Attack pipeline
|   +-- SPEC-10 Evidence classes
|   +-- SPEC-11 Hard locks
|   `-- SPEC-12 Freeze conditions
|
+-- 10_FOUNDATION
|   +-- src/core/types.ts
|   +-- src/core/far-view.ts
|   +-- src/core/performance.ts
|   +-- src/core/governor.ts
|   `-- src/core/playability.ts
|
+-- 20_CORE_COMBAT
|   +-- WeaponRegistry
|   +-- CooldownResolver
|   +-- CriticalResolver
|   +-- DamageResolver
|   +-- KnockbackResolver
|   +-- UniversalAttackAPI
|   `-- validation / commit contract
|
+-- 30_RUNTIME
|   +-- src/bedrock/runtime.ts
|   |   +-- capability inventory
|   |   +-- event wiring
|   |   +-- target resolution
|   |   +-- armor/resistance
|   |   +-- effect/durability helpers
|   |   +-- runtime probe
|   |   `-- transaction commit blocker
|   `-- src/main.ts
|       +-- composition root
|       +-- combat observer
|       +-- far-view producer
|       `-- heartbeat/governor loop
|
+-- 40_FARVIEW
|   +-- C-10 logical targets
|   +-- C-11 engine-loaded chunks
|   `-- C-12 client-rendered chunks
|
+-- 50_TEST
|   +-- tests/core.test.ts
|   +-- tests/foundation-order.test.ts
|   +-- tests/production-path-wiring.test.ts
|   +-- tests/spatial-targets.test.ts
|   `-- tests/transaction-boundary.test.ts
|
+-- 60_RUNTIME_PROOF
|   +-- addon startup
|   +-- API binding
|   +-- event timing
|   +-- combat targeting
|   +-- damage/effects/durability
|   +-- projectile
|   `-- death/loot/XP
|
+-- 70_PERFORMANCE
|   +-- queue/work metrics
|   +-- FPS
|   +-- TPS/tick timing
|   +-- CPU
|   +-- RAM/GC
|   +-- thermal
|   `-- long-run stability
|
+-- 80_MULTIPLAYER
|   +-- 1 player baseline
|   +-- 2 player concurrency
|   +-- isolation
|   +-- fairness
|   `-- disconnect/reconnect
|
+-- 90_PARITY
|   +-- attack
|   +-- targeting/range/obstruction
|   +-- cooldown/critical
|   +-- armor/resistance/modifiers
|   +-- damage/knockback/effects
|   +-- durability/projectile
|   `-- death/loot/XP
|
+-- 95_TRANSACTION
|   +-- prepare
|   +-- validate
|   +-- apply
|   +-- verify
|   +-- commit
|   `-- failure/rollback/recovery
|
+-- 100_RELEASE
|   +-- exact HEAD fingerprint
|   +-- exact package fingerprint
|   +-- build/typecheck/test/static
|   +-- runtime evidence
|   +-- performance evidence
|   +-- multiplayer evidence
|   +-- parity evidence
|   +-- red-team regression
|   `-- final verdict
|
`-- STOP
    +-- COMPLETE PASS: all mandatory C-gates proven
    `-- REAL HARD BLOCKER: exact external limitation + attempted alternatives + evidence
```

---

## Self-Audit: ARCHITECT / IMPLEMENTER / RED-TEAM

### Architect audit
- Current HEAD was directly resolved from GitHub before report creation.
- Repository-resident Phase-0 specification was inspected.
- Supporting requirement/API/runtime evidence was inspected.
- Current source, tests, manifest, package scripts, TypeScript config, packaging tool and CI workflow were inspected.
- C-06 through C-16 have construction blueprints.
- Dependency, data, control, runtime, test and evidence graphs are present.
- Critical path and bottleneck register are present.

### Implementer audit
- Every major implementation area has a real file path.
- Major symbols are named from the current source.
- Construction units state dependencies, inputs, outputs, validation and evidence.
- Runtime-only gates explicitly wait for exact Bedrock 26.45.
- C-10/C-11/C-12 are not conflated.
- Performance metrics are not inferred from wall time.
- C-16 remains a construction blocker until commit is real.

### Red-team audit
- Missing authoritative master-design file is explicitly surfaced.
- Historical report heads are not inherited as current proof.
- `afterEvents.entityHurt` is not treated as pre-damage authority.
- static regex tests are not treated as runtime proof.
- manifest/dependency declarations are not treated as live runtime proof.
- logical targets are not treated as engine chunks.
- engine chunks are not treated as rendered chunks.
- current `committed:false` is not relabeled as PASS.
- no fabricated device/multiplayer/parity measurements are used.
- no production code is changed by this document.

## Final Blueprint Status

`INCOMPLETE` as a build plan state, by design: the plan itself is complete enough to navigate construction, but mandatory runtime facts remain unverified and one authoritative source file is absent from the repository. This is not a feature completion verdict.
