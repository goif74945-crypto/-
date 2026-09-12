# NEXY_FARVIEW_100 — MASTER CURRENT-HEAD EVIDENCE REPORT

## SCOPE

IN-SCOPE: Far View, bounded performance, Playability Shield, Java-like gameplay/combat architecture, Universal Attack API, Weapon Adapter API, exact Minecraft Bedrock 26.45 target, `@minecraft/server` 2.9.0, production paths, tests, package, CI, API evidence and required runtime gates.

OUT-OF-SCOPE: UI inside the Java-like gameplay core, other Bedrock versions, unsupported API assumptions, and any fabricated runtime/performance/multiplayer/parity evidence.

Authoritative task specification: the attached `NEXY_FARVIEW_100 — MASTER DESIGN SPECIFICATION` supplied for this execution. Repository specification control: `docs/spec/NEXY_FARVIEW_100_PHASE_0_SPEC_LOCK.md`. The repository Phase-0 lock confirms the 26.45 target, Universal Attack API centrality, A/B/C/D Far View separation, bounded work and evidence gates.

## CURRENT HEAD / GIT FORENSICS

Previous report blob SHA: `bac07ad6fff296c1366392b22c65442e4ccd2eb0` at repository HEAD `e5ae5b4be582172550930f87050e356489cffc4f`.

This report update changes documentation only. No production source is intentionally changed by this update. The commit created by this update is the new current branch tip; its returned commit SHA is the authoritative final HEAD for this documentation revision.

Important provenance rule: because the report is itself the file being committed, the report cannot truthfully embed the SHA of its own commit before that commit exists. Therefore the final HEAD for this revision is the SHA returned by the repository mutation that wrote this exact report content. Any later mutation makes this report stale and requires another verification/update cycle.

## FILES / SYMBOLS INSPECTED

Production: `src/main.ts`, `src/bedrock/runtime.ts`, `src/core/types.ts`, `src/core/combat.ts`, `src/core/far-view.ts`, `src/core/performance.ts`, `src/core/governor.ts`, `src/core/playability.ts`.

Tests: `tests/core.test.ts`, `tests/foundation-order.test.ts`, `tests/production-path-wiring.test.ts`, `tests/spatial-targets.test.ts`, `tests/transaction-boundary.test.ts`.

Build/package/config: `package.json`, `addon/manifest.json`, `tsconfig.json`, `tools/package-addon.mjs`, `tools/static-blocker-check.mjs`, `.github/workflows/core-check.yml`.

Evidence: Phase-0 lock, external runtime procedure, C-06 forensic report, prior project evidence report, master build blueprint, and current official Microsoft Learn API documentation.

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

This creates logical workload only. `far-view.ts` explicitly distinguishes logical target generation from engine loading/client rendering.

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

After-hurt and projectile-after handlers do not invoke a second canonical damage path; this is explicitly protected by static production-path tests.

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

## RESOLVED API SEMANTICS — OFFICIAL MICROSOFT EVIDENCE

This section resolves what can be resolved from official documentation without pretending to have live 26.45 execution evidence.

### API-SEM-001 — `EntityHurtBeforeEvent.damage`

FACT: `EntityHurtBeforeEvent.damage` is writable and represents the amount of damage that will be caused. `cancel` is also writable. `damageSource` and `hurtEntity` are read-only.

IMPLEMENTATION CONSEQUENCE: the canonical pre-hurt combat path may calculate the final damage and assign that value to `EntityHurtBeforeEvent.damage`; it must not call a second damage application API merely to reproduce the same hit.

SOURCE: Microsoft Learn `EntityHurtBeforeEvent`.

### API-SEM-002 — Before-hurt execution privilege

FACT: callbacks subscribed through `world.beforeEvents.entityHurt` run with restricted-execution privilege. Restricted execution prevents world-state mutation except for APIs explicitly granted that privilege.

IMPLEMENTATION CONSEQUENCE: the before-hurt handler must remain a calculation/decision boundary plus the supported `event.damage`/`event.cancel` mutation. World-mutating side effects must not be placed directly in this restricted callback unless their documentation explicitly grants restricted execution.

SOURCE: Microsoft Learn `Scripting Execution Privilege`; `EntityHurtBeforeEventSignal`.

### API-SEM-003 — `Entity.applyDamage`

FACT: `Entity.applyDamage(amount, options?)` applies damage to an entity, can return whether damage was taken, can throw, and cannot be called in restricted-execution mode.

IMPLEMENTATION CONSEQUENCE: `applyDamage()` is not a valid replacement for the current before-hurt `event.damage` mutation inside `EntityHurtBeforeEvent`. Using both for the same canonical attack risks duplicate damage and violates the restricted-execution boundary. If a future architecture intentionally uses `applyDamage`, that must be a separate, non-before-event attack origin with its own deduplication and damage-source semantics.

SOURCE: Microsoft Learn `Entity.applyDamage`.

### API-SEM-004 — `Entity.applyImpulse` / knockback

FACT: `Entity.applyImpulse(vector)` mutates entity velocity and cannot be called in restricted-execution mode. The documented `Entity.applyKnockback(...)` API is also a world-state mutation API and therefore must not be assumed safe inside the before-hurt restricted callback.

IMPLEMENTATION CONSEQUENCE: knockback cannot be directly committed from the restricted `entityHurt` before callback. The correct implementation boundary is: calculate/store the knockback plan during the before event, then execute the actual impulse/knockback from an allowed later execution context, with an explicit once-only transaction key tied to the accepted attack.

IMPORTANT LIMIT: official documentation establishes the execution restriction, but does not by itself prove the exact timing/result of a particular deferred knockback transaction for this project. That remains L6 runtime verification.

### API-SEM-005 — After-hurt event

FACT: `EntityHurtAfterEvent.damage` and `damageSource` are read-only observations of the damage that occurred. The after-hurt callback is not a place to rewrite the already-applied damage.

IMPLEMENTATION CONSEQUENCE: after-hurt must be treated as observation/post-processing. It must not become a second canonical damage path. This supports the existing production-path rule that after-hurt must not reapply the same damage.

### API-SEM-006 — `EntityDamageSource`

FACT: damage source exposes `cause`, optional `damagingEntity`, and optional `damagingProjectile`.

IMPLEMENTATION CONSEQUENCE: runtime attack construction should derive attacker/projectile identity and damage cause from the actual event source where the specification requires source fidelity. A generic fabricated attacker or projectile identity is not justified by the API.

### API-SEM-007 — Equipment / armor capability

FACT: `EntityEquippableComponent` provides equipment access and exposes `totalArmor` and `totalToughness`. The official documentation explicitly states that this component exists on player entities; it does not establish universal armor-component availability on every entity type.

IMPLEMENTATION CONSEQUENCE: armor resolution must not silently assume `Equippable` exists on every combat target. The target capability contract must distinguish player-supported armor from unsupported/non-player targets and use an explicit specification-approved behavior for the latter.

### API-SEM-008 — Durability mutation

FACT: `ItemDurabilityComponent.damage` is mutable in normal execution but cannot be edited in restricted-execution mode. The component applies to data-driven items.

IMPLEMENTATION CONSEQUENCE: durability mutation cannot be performed directly inside the restricted before-hurt callback. It must be scheduled/committed from an allowed execution context and guarded against duplicate execution. The fact that a deferred mutation is technically possible does not constitute runtime proof that the resulting item state matches the project's intended attack transaction.

### API-SEM-009 — `system.run` as a deferred boundary

FACT: `system.run(callback)` schedules a callback for a future available execution point. When called from an event handler it generally runs at the end of the same tick; timing is not guaranteed under load.

IMPLEMENTATION CONSEQUENCE: `system.run` is suitable as a deferred side-effect boundary, not as proof of deterministic same-tick ordering. Any combat transaction depending on exact ordering must be runtime-tested under target load.

## EXACT 26.45 / API 2.9.0 COMPATIBILITY BOUNDARY

FACT: repository dependency configuration pins `@minecraft/server` 2.9.0 and the addon manifest targets engine 26.45.

FACT: official Microsoft Learn documentation currently exposes an `@minecraft/server` 2.9.0 module entry and documents the relevant event/API semantics above.

LIMITATION: the public documentation evidence retrieved here does not provide a direct machine-verifiable statement that a live Bedrock 26.45 session has loaded this exact addon and executed these paths. Therefore `API DOCUMENTED` and `API VERSIONED` are proven, but `API AVAILABLE IN THIS LIVE 26.45 SESSION` and `RUNTIME ACTUALLY EXECUTES` remain NOT VERIFIED until L6.

This distinction is mandatory. The new semantics section removes the previous uncertainty about the documented execution model, but it does not manufacture runtime evidence.

## IMPLEMENTATION DECISION BOUNDARY AFTER API RESEARCH

The exact safe architectural boundary is now established:

1. `beforeEvents.entityHurt` receives the native hit and is restricted.
2. Shared combat logic may calculate target/range/critical/armor/resistance/modifiers/final damage.
3. The canonical hit's final damage is committed through `EntityHurtBeforeEvent.damage` rather than a second `applyDamage()` call.
4. Knockback, durability, effects and other world mutations cannot be assumed safe in the restricted callback; they require an allowed deferred/post-event execution boundary.
5. Deferred side effects require once-only transaction identity to prevent duplicate mutation.
6. `afterEvents.entityHurt` is observational/post-processing and must not reapply the canonical damage.
7. Armor capability must be explicit rather than assuming every target has `Equippable`.
8. No implementation should convert these documented semantics into a PASS until exact target-runtime execution is captured.

This is an API/specification decision boundary, not an L6 runtime result.

## PERFORMANCE / PLAYABILITY

Scheduler is bounded by queue, per-window work and work age and includes key deduplication, priority replacement, eviction, stale rejection and failure metrics.

Playability protection covers movement, input, camera, combat, inventory, item use, block interaction/break/place, nearby entities, projectile, boss, PvP, important events and redstone.

Governor states and execution budgets are bounded. The runtime signal is queue/work pressure plus JavaScript handler wall time; this is not FPS.

No real-device FPS, TPS, CPU, RAM or thermal measurements were found. PERFORMANCE RUNTIME = NOT VERIFIED.

## API VERIFICATION

`package.json` declares `@minecraft/server` 2.9.0. `addon/manifest.json` declares minimum engine `[1,26,45]` and `@minecraft/server` 2.9.0.

Current runtime capability entries intentionally keep `targetBindingVerified:false`.

Official documentation now resolves the relevant semantics: before-hurt is restricted, `EntityHurtBeforeEvent.damage` is writable, `Entity.applyDamage` and `Entity.applyImpulse` are not permitted in restricted execution, after-hurt damage is read-only, equipment capability is not established as universal, and durability mutation is not permitted in restricted execution.

API verdict: **L4 substantially resolved for the documented API semantics; L6 target-runtime binding remains NOT VERIFIED.**

## TEST / CI VERIFICATION

GitHub Actions run #122 was bound to `e5ae5b4be582172550930f87050e356489cffc4f` and completed successfully. The workflow executes Node/npm on Ubuntu and does not launch Minecraft Bedrock.

CI therefore proves repository checks/package workflow only, not live Bedrock behavior.

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

CONTR-002: historical project reports reference older HEADs. They are stale for final-state claims and are not used as current proof.

CONTR-003: core critical resolver exists while production request mapping always supplies `criticalEligible:false`.

CONTR-004: prior report classified several API semantics as broadly unresolved. Official documentation now resolves the documented execution restrictions and mutation boundaries, but does not resolve live 26.45 execution. The correct final classification is L4 documented semantics / L6 runtime NOT VERIFIED, not a fabricated runtime PASS.

## RED-TEAM /x10

01 FALSE PASS — blocked by final verdict.
02 STALE SHA — older heads separated.
03 STALE REPORT — prior project report superseded.
04 UNREACHABLE PRODUCTION PATH — current before-hurt chain statically traced.
05 MOCK-ONLY BEHAVIOR — tests kept separate from runtime.
06 TEST/PRODUCTION MISMATCH — critical runtime mapping gap found.
07 WRONG API SEMANTICS — official documentation confirms restricted before-event boundary and mutable `damage`; live target binding remains unverified.
08 WRONG EXECUTION CONTEXT — `applyDamage`, `applyImpulse`, durability mutation and similar world mutations cannot be assumed safe inside restricted before execution.
09 DUPLICATE / DOUBLE MUTATION — canonical damage remains the before-event `damage` mutation; deferred side effects require once-only guards.
10 MISSING RUNTIME/PERFORMANCE PROOF — confirmed.

Additional findings remain: silent weapon/type fallback, armor-component target gap, incomplete downstream combat transaction, absent client render authority.

## REPAIRS / RE-VERIFICATION

Documentation repair performed: the existing single evidence report was updated with an official-API semantics section based on current Microsoft Learn documentation. No production source repair was performed by this report-only mutation.

The API uncertainty that could be resolved without runtime has now been resolved into explicit implementation boundaries. Remaining production defects are not relabeled PASS.

Because the report itself was mutated, all final-state claims must be interpreted against the new commit returned by this report update. Any subsequent source/report mutation requires another HEAD relock and report refresh.

## EVIDENCE LEVELS

L1: source/file/symbol — verified.
L2: static production call path — verified for inspected Far View/combat paths.
L3: specification alignment — verified where stated; mismatches recorded.
L4: official API/versioned semantics — substantially verified for the documented execution/mutation boundaries; exact live 26.45 binding remains absent.
L5: unit/production-equivalent CI/build/package — verified.
L6: real Bedrock 26.45 runtime — absent.

## FINAL GATE

| GATE | VERDICT |
|---|---|
| Scope | PASS |
| Current source/head provenance | PASS for the pre-update HEAD; new report-update HEAD is the final documentation tip returned by this mutation |
| Authoritative spec | PASS |
| Requirement checklist frozen | PASS |
| Production paths traced | PASS static |
| Expected/Actual/Gaps | PASS |
| Repairable production defects fully repaired | FAIL / BLOCKED |
| CI/build/tests/package | PASS for current verified production source |
| Official API semantics | PASS at L4 documented boundary |
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

The remaining blocker is no longer simply “unknown API semantics.” The documented API boundary is now established. The remaining hard boundary is **real target execution** and any exact behavior that documentation cannot prove: live Bedrock 26.45 addon loading, actual before-hurt invocation, critical eligibility source, accepted damage, deferred knockback/effect/durability behavior, transaction ordering, Far View engine/client rendering, device performance, multiplayer and Java parity.

After those observations, affected REQ-IDs must be reopened and any necessary production repair must be made, tested, API-checked, re-traced, globally rescanned and red-teamed again.

Until L6 and the other mandatory independent evidence exist, the project is **BLOCKED** and must not be called complete.

**FINAL VERDICT: BLOCKED**
