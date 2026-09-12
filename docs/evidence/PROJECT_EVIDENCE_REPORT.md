# NEXY_FARVIEW_100 — MASTER CURRENT-HEAD EVIDENCE REPORT

## SCOPE

PROJECT: NEXY_FARVIEW_100
REPOSITORY: goif74945-crypto/-
BRANCH: main
TARGET: Minecraft Bedrock EXACT 26.45
SCRIPT API TARGET: @minecraft/server EXACT 2.9.0

IN-SCOPE: Far View, bounded performance, Playability Shield, Java-like gameplay/combat, Universal Attack API, Weapon Adapter API, production paths, tests, package, CI, official API semantics, and required runtime gates.
OUT-OF-SCOPE: UI inside Java-like gameplay core, other target versions, unsupported API assumptions, fake runtime/performance/parity evidence.

AUTHORITATIVE DESIGN: attached NEXY_FARVIEW_100 MASTER DESIGN SPECIFICATION. Repository Phase-0 control: docs/spec/NEXY_FARVIEW_100_PHASE_0_SPEC_LOCK.md.

## CURRENT HEAD / GIT FORENSICS

Previous verified report commit: 27ae4d652a0e8f1de0d6668aeabef184f7df96b5.
Previous report blob SHA: 109226ce67393124014bcdbb3a2e9d1dc3978368.
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

The design requires one combat pipeline: WEAPON → ADAPTER → UNIVERSAL ATTACK API → validation → damage → critical → knockback → effects → durability → result. The attached specification explicitly requires API capability audit before final implementation. fileciteturn13file0L2-L6

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

## RE-VERIFICATION STATUS

This revision changes documentation only and expands the official API capability matrix. Production source was not repaired in this round. The new API evidence therefore changes implementation certainty but does not change the production defects or the L6 gate.

## FINAL GATE

Scope: PASS
Current-head provenance: PASS after this documentation commit
Authoritative specification: PASS
Production paths traced: PASS static
Official API semantics: PASS at L4 documented boundary
Exact live Bedrock 26.45 runtime: NOT VERIFIED
Critical runtime eligibility: FAIL
Downstream combat transaction: NOT VERIFIED
Silent fallback contract: FAIL
Performance runtime: NOT VERIFIED
100 real rendered chunks: NOT VERIFIED
Multiplayer: NOT VERIFIED
Java parity: NOT VERIFIED
Critical unknowns: PRESENT

## FINAL VERDICT

BLOCKED

Reason: the repository has a defensible documented API implementation boundary and a verified @minecraft/server 2.9.0 dependency, but the project still lacks L6 proof on the exact Bedrock 26.45 runtime and still contains production-path defects in critical/cooldown/knockback mapping, silent fallback behavior, and downstream combat transaction completion. Under the project master law, these gaps prohibit PASS.

## AUTHORITATIVE MICROSOFT SOURCES

- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhurtbeforeevent?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhurtbeforeeventsignal?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/execution-privilege?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhurtafterevent?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entitydamagesource?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityequippablecomponent?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/equipmentslot?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/itemdurabilitycomponent?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/system?view=minecraft-bedrock-experimental
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/changelog?view=minecraft-bedrock-experimental
- https://learn.microsoft.com/en-us/minecraft/creator/documents/update1.26.40?view=minecraft-bedrock-stable
- https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/versioning?view=minecraft-bedrock-stable

## REPORT INTEGRITY RULE

This report is evidence, not runtime proof. Never promote NOT VERIFIED to PASS without new direct evidence. Any subsequent source/config/CI/runtime change requires current-HEAD revalidation.
