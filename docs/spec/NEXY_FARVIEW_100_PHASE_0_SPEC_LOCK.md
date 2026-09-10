# NEXY_FARVIEW_100 — PHASE 0 SPECIFICATION LOCK

**Status:** PHASE 0 specification lock only
**Repository:** `goif74945-crypto/-`
**Branch:** `main`
**Baseline HEAD at start of Phase 0:** `2a63cba9235a63bfd1d425c4d85056bb32e6bf95`
**Baseline tree:** `7b4c6adcbab0b62aa5fd93baf1ced26ef59f5108`
**Target:** Minecraft Bedrock **26.45 ONLY**

> This document locks the specification and evidence rules. It does not approve, repair, or prove feature implementation.

## 1. PROJECT IDENTITY

- Project ID: `NEXY_FARVIEW_100`
- Repository: `goif74945-crypto/-`
- Branch under evaluation: `main`
- Phase: `0 — Specification Lock`

## 2. TARGET PLATFORM

- Minecraft Bedrock 26.45 ONLY.
- No other Bedrock release is a target for this project specification.
- Exact Script API/module compatibility is **not locked by Phase 0**; it belongs to Phase 1 capability audit.

## 3. AUTHORITATIVE SPECIFICATION

**Authoritative specification name:** `NEXY_FARVIEW_100 — ข้อมูลการออกแบบฉบับรวม`

**Spec source:** authoritative design contract supplied for this Phase 0 task. No repository file with this exact title was found in the baseline `main` tree; therefore repository implementation and reports are not treated as substitutes for the authoritative spec.

**Authority order:**
1. Authoritative design specification / locked contract.
2. Explicit Phase 0 scope and hard locks in this document.
3. Later-phase evidence produced from the current repository and target Bedrock 26.45 environment.
4. Current implementation, tests, CI, and package metadata as evidence only — never as specification.
5. Historical reports and commit messages — claims only; never proof without matching current evidence.

## 4. SCOPE

### IN SCOPE

- Far View architecture concept.
- Bounded scheduling concept.
- Performance protection requirements.
- Playability protection.
- Java-like gameplay/combat specification.
- Universal Attack API contract.
- Weapon Adapter contract.
- Evidence-first validation.
- Bedrock 26.45 target constraint.

### OUT OF SCOPE FOR PHASE 0

- UI implementation.
- Guaranteed 100 real rendered chunks.
- 100-chunk full simulation.
- Global entity scan every tick.
- Global block scan every tick.
- Speculative API claims.
- Fake engine capability.
- Java source-code direct port.
- Implementation approval based on documentation alone.
- Any Phase 1+ implementation, repair, optimization, or runtime feature work.

## 5. NON-GOALS

Phase 0 does **not**:

- prove Far View works in Bedrock;
- prove 100 chunks render on a client;
- prove 100 chunks load in the engine;
- prove runtime API bindings work in Bedrock 26.45;
- prove Java parity;
- prove FPS/TPS/memory/thermal improvement;
- certify mobile or multiplayer behavior;
- mark any later phase complete.

## 6. FAR VIEW CONTRACT

1. The project aims to reach the greatest practical view distance permitted by Bedrock 26.45 and the Add-on/API capability actually proven.
2. **100 chunks is a DESIGN TARGET only.**
3. Never claim `100 REAL RENDERED CHUNKS` without independent client-rendering evidence.
4. Preserve gameplay/playability while reducing unnecessary work.
5. Capability claims must distinguish logical bookkeeping from engine/client rendering.

### Required semantic separation

- **A = logical workload entries**
- **B = chunk targets**
- **C = engine-loaded chunks**
- **D = client-rendered chunks**

No A/B/C result may be promoted to D without independent evidence.

Required rule:

`logical workload → loaded chunks → rendered chunks` is **not** a valid proof chain by itself.

## 7. PERFORMANCE CONTRACT

Required principles:

- event-driven processing where possible;
- no unnecessary permanent polling;
- deduplication;
- coalescing;
- burst protection;
- bounded queue;
- bounded backlog;
- bounded cache;
- bounded task count;
- bounded work per tick/window;
- protection from entity/task explosion;
- safe mode/throttling when abnormal;
- no unbounded loop;
- no global entity scan every tick;
- no global block scan every tick;
- no 100-chunk scan every tick.

**Optimization priority:** optimize what the player does not notice before touching what the player plays.

## 8. PLAYABILITY CONTRACT

The following must be protected:

`MOVEMENT`, `CAMERA`, `INPUT`, `COMBAT`, `INVENTORY`, `ITEM_USE`, `BLOCK_INTERACTION`, `BLOCK_BREAK`, `BLOCK_PLACE`, `NEAR_ENTITY`, `PROJECTILE`, `BOSS`, `PVP`, `IMPORTANT_EVENTS`, `REDSTONE/GAMEPLAY MECHANICS`.

Gameplay correctness has priority over cosmetic optimization.

Never claim an FPS/performance win when it introduces or risks:

- input latency;
- combat timing corruption;
- missing interaction;
- broken entity behavior;
- incorrect damage;
- incorrect projectile behavior;
- incorrect gameplay state.

## 9. JAVA-LIKE GAMEPLAY CONTRACT

Required conceptual pipeline:

`JAVA BEHAVIOR`
→ `BEHAVIOR SPECIFICATION`
→ `BEDROCK API CAPABILITY AUDIT`
→ `BEDROCK IMPLEMENTATION`
→ `PARITY TEST`
→ `RESULT`

Allowed evidence states:

- `PASS`
- `FAIL`
- `PARTIAL`
- `NOT VERIFIED`

Forbidden claim without actual parity evidence:

`100% Java parity`

### Native-first rule

1. Native Bedrock behavior first.
2. Script/API only where required.
3. Optimization after correctness.

Forbidden:

- direct Java source port;
- simulating a whole physics engine with script;
- whole-world scan every tick;
- duplicating engine behavior without reason;
- using Java parity as justification for excessive tick loops.

## 10. UNIVERSAL ATTACK API CONTRACT

Central conceptual pipeline:

`WEAPON`
→ `WEAPON ADAPTER`
→ `ATTACK REQUEST`
→ `ATTACK RESOLVER`
→ `DAMAGE RESOLVER`
→ `KNOCKBACK / CRITICAL / EFFECT`
→ `COMBAT EVENT`
→ `RESULT`

AttackRequest must conceptually carry:

- attacker
- weapon
- target
- attackType
- attackDirection
- attackRange
- baseDamage
- attackCooldown
- criticalEligible
- knockback
- damageSource
- effects
- durabilityCost
- projectileData when applicable
- timestamp/tick
- context

**Exact field names are not locked by Phase 0.** Actual Bedrock-compatible field names and runtime mapping are a later verification problem.

Required weapon examples:

- Sword
- Axe
- Spear
- Bow
- Custom Weapon

Weapon-specific overrides are allowed only when necessary and must be validated later.

## 11. ATTACK PIPELINE LOCK

Required conceptual sequence:

`ATTACK INPUT`
→ `WEAPON VALIDATION`
→ `TARGET VALIDATION`
→ `RANGE/HIT VALIDATION`
→ `COOLDOWN VALIDATION`
→ `ATTACK TYPE`
→ `CRITICAL`
→ `BASE DAMAGE`
→ `ARMOR/RESISTANCE/MODIFIERS`
→ `FINAL DAMAGE`
→ `KNOCKBACK`
→ `EFFECT`
→ `DURABILITY`
→ `PROJECTILE RESULT`
→ `DEATH CHECK`
→ `LOOT`
→ `XP`
→ `COMBAT RESULT`

Phase 0 does not approve an implementation of this pipeline.

## 12. EVIDENCE CONTRACT

Later validation must keep these evidence classes separate:

`STATIC`, `BUILD`, `TYPECHECK`, `LINT`, `UNIT`, `INTEGRATION`, `CI`, `RUNTIME`, `VISUAL`, `PERFORMANCE`, `MULTIPLAYER`, `API`, `PARITY`.

Evidence laws:

- BUILD PASS != RUNTIME PASS
- UNIT PASS != PRODUCTION PASS
- STATIC PASS != VISUAL PASS
- API EXISTS != FEATURE WORKS
- CI PASS != CURRENT HEAD PASS
- DOCUMENTATION != RUNTIME PROOF
- No evidence = `NOT VERIFIED`

## 13. PHASE ORDER

1. PHASE 0 — Specification Lock
2. PHASE 1 — Bedrock 26.45 API Capability Audit
3. PHASE 2 — Architecture
4. PHASE 3 — Core Implementation
5. PHASE 4 — Performance Implementation
6. PHASE 5 — Far View Tests
7. PHASE 6 — Combat/Weapon Parity Tests
8. PHASE 7 — Stress Tests
9. PHASE 8 — Mobile Tests
10. PHASE 9 — Long Runtime
11. PHASE 10 — Final Validation

**Current task: PHASE 0 ONLY.**

## 14. HARD LOCKS

| Lock | Requirement |
|---|---|
| LOCK-01 | Target = Bedrock 26.45 ONLY |
| LOCK-02 | UI excluded from Java-like gameplay core |
| LOCK-03 | Never claim 100 real rendered chunks without proof |
| LOCK-04 | No 100-chunk scan every tick |
| LOCK-05 | No whole-world entity scan every tick |
| LOCK-06 | No whole-world block scan every tick |
| LOCK-07 | No unbounded work |
| LOCK-08 | No fake PASS |
| LOCK-09 | Unverified API = UNKNOWN / NOT VERIFIED |
| LOCK-10 | Runtime PASS requires runtime evidence |
| LOCK-11 | Gameplay correctness > cosmetic optimization |
| LOCK-12 | Native Bedrock first |
| LOCK-13 | Universal Attack API is central |
| LOCK-14 | New weapons use adapters |
| LOCK-15 | Overrides require validation |
| LOCK-16 | Never trade gameplay correctness for FPS |
| LOCK-17 | Contradiction/API ambiguity = FREEZE |

## 15. FREEZE CONDITIONS

Freeze immediately when any of the following occurs:

- authoritative information conflicts;
- API behavior is unclear or not proven;
- evidence refers to a different HEAD than the current state;
- a report claims PASS without matching evidence;
- an implementation detail is treated as specification;
- an A/B/C result is promoted to rendered client result D without proof;
- runtime proof is substituted with compilation/documentation;
- a requested action would enter a later phase;
- evidence is missing for a mandatory claim;
- any attempt is made to create a false PASS.

## 16. CURRENT REPOSITORY HEAD

Baseline current `main` HEAD was directly resolved from GitHub before documentation changes:

- **Commit SHA:** `2a63cba9235a63bfd1d425c4d85056bb32e6bf95`
- **Commit message:** `fix: classify projectile runtime attacks explicitly`
- **Tree SHA:** `7b4c6adcbab0b62aa5fd93baf1ced26ef59f5108`

The commit modifies `src/bedrock/runtime.ts`; therefore the current repository contains implementation work that is later than the original specification-lock task. Phase 0 neither removes nor repairs that work.

## 17. CURRENT REPOSITORY INSPECTION

### Repository/tree evidence inspected

- root tree and recursive tree at baseline HEAD;
- `docs/` and `docs/evidence/`;
- `docs/evidence/PROJECT_EVIDENCE_REPORT.md`;
- `package.json`;
- `addon/manifest.json`;
- `src/core/types.ts`;
- `src/core/far-view.ts`;
- `src/core/performance.ts`;
- `src/core/playability.ts`;
- `src/core/combat.ts`;
- `src/bedrock/runtime.ts`;
- `src/main.ts`;
- `tests/core.test.ts`;
- `.github/workflows/core-check.yml`;
- recent commit history.

### Current implementation observations — NOT specification approval

The current code contains Far View, bounded scheduling, playability protection, a Universal Attack API, adapters, and runtime event wiring. These are implementation observations only and are not treated as Phase 0 proof of feature success.

Current code also contains exact implementation field names such as `direction`, `range`, `cooldownTicks`, and `tick` in `AttackRequest`. The authoritative Phase 0 contract intentionally does not approve or lock those names; compatibility belongs to later capability and parity verification.

The current `src/bedrock/runtime.ts` explicitly marks its listed API capabilities as documented but `targetBindingVerified: false`. This is consistent with the Phase 0 rule that exact Bedrock runtime compatibility remains unresolved until Phase 1.

## 18. STALE REPORTS IDENTIFIED

### `docs/evidence/PROJECT_EVIDENCE_REPORT.md`

This report is **STALE for current-state claims** because it references older implementation/documentation heads rather than the actual Phase 0 baseline HEAD:

- Report-update source HEAD: `2a60d827c73d91c5f09369e8e59a1ec5477847ad`
- Implementation HEAD validated by its cited completion CI: `cff52a08a868708e87f4e6e3f849980286f8fbb0`
- Current baseline HEAD: `2a63cba9235a63bfd1d425c4d85056bb32e6bf95`

The current HEAD is **8 commits ahead** of `cff52a08a868708e87f4e6e3f849980286f8fbb0` and includes changes to the evidence report plus production/test files. Therefore the historical report cannot be inherited as proof of the current implementation state.

The report itself correctly states that it is not a substitute for Bedrock runtime, visual, mobile, multiplayer, or client-rendering proof; that limitation remains valid but the report is still stale as a current-H​​EAD record.

## 19. CONTRADICTIONS

### C-01 — Historical report HEAD vs current HEAD

**Observed:** report evidence cites `cff52a08...` / `2a60d827...`; current baseline is `2a63cba...`.

**Disposition:** historical current-state claims are invalidated; do not inherit PASS/COMPLETE claims from the report.

### C-02 — Repository dependency pins `@minecraft/server` 2.9.0 while Phase 0 does not lock a Script API version

**Observed:** `package.json` and `addon/manifest.json` currently declare `@minecraft/server` `2.9.0`.

**Disposition:** this is an implementation/configuration fact, not a Phase 0 authoritative lock. Exact compatibility remains `NOT VERIFIED` pending Phase 1 API capability audit.

### C-03 — Current implementation already contains later-phase features

**Observed:** current tree contains Far View, performance, playability, combat, runtime, tests, and packaging code.

**Disposition:** not a Phase 0 specification conflict by itself. Do not delete/revert it; do not approve it as proven by Phase 0.

### C-04 — Conceptual AttackRequest fields vs current code field names

**Observed:** the specification uses conceptual names such as `attackDirection` / `attackRange`, while current implementation uses `direction` / `range`.

**Disposition:** not auto-resolved. Exact implementation/API mapping is a later-phase verification item; Phase 0 does not normalize or approve either representation.

## 20. UNRESOLVED ITEMS

The following remain explicitly unresolved and must not be upgraded to PASS in Phase 0:

1. Exact live Bedrock 26.45 Script API capability/binding compatibility.
2. Actual engine-supported chunk loading at the target range.
3. Actual client-rendered distance, including 100 chunks.
4. Real runtime installation/loading of the addon in Bedrock 26.45.
5. Runtime performance: FPS/TPS/memory/thermal behavior.
6. Mobile behavior.
7. Multiplayer behavior.
8. Full Java-like combat parity.
9. End-to-end projectile/death/loot/XP runtime completion.
10. Any later-phase architecture or implementation acceptance.

## 21. PHASE 0 EVIDENCE MATRIX

| Phase 0 requirement | Evidence source | State | Phase 0 disposition |
|---|---|---|---|
| Target locked to Bedrock 26.45 | Authoritative task contract + current manifest inspection | PROVEN AS SPEC | Locked |
| Authoritative spec identified | Supplied authoritative specification; exact title absent from baseline repo tree | PROVEN AS SPEC SOURCE | Locked; repo copy not found |
| Authority order explicit | This document | PROVEN | Locked |
| Scope / non-goals explicit | This document | PROVEN | Locked |
| 100-chunk semantics split A/B/C/D | This document | PROVEN | Locked |
| Performance constraints explicit | This document | PROVEN | Locked |
| Playability constraints explicit | This document | PROVEN | Locked |
| Java-like pipeline explicit | This document | PROVEN | Locked |
| Universal Attack API contract explicit | This document | PROVEN | Locked |
| Evidence classes and promotion rules explicit | This document | PROVEN | Locked |
| Phase order explicit | This document | PROVEN | Locked |
| Hard locks explicit | This document | PROVEN | Locked |
| Freeze conditions explicit | This document | PROVEN | Locked |
| Current HEAD directly verified | GitHub `refs/heads/main` at baseline | PROVEN | Recorded |
| Current tree inspected | GitHub recursive tree at baseline | PROVEN | Recorded |
| Historical report checked against current HEAD | Current HEAD vs cited historical SHAs | PROVEN | Report classified stale |
| API ambiguity preserved as unresolved | Current runtime marks `targetBindingVerified: false` | PROVEN | Phase 1 required |
| Implementation approved by Phase 0 | None | NOT APPLICABLE | Forbidden |
| Production code modified by Phase 0 | This Phase 0 change touches only `docs/spec/...` | PROVEN | MUST remain NO |
| Tests modified by Phase 0 | This Phase 0 change touches only `docs/spec/...` | PROVEN | MUST remain NO |

## 22. DEFINITION OF DONE

Phase 0 is complete only when all are satisfied:

- [x] target explicitly locked;
- [x] authoritative specification identified;
- [x] authority order explicit;
- [x] scope explicit;
- [x] non-goals explicit;
- [x] 100-chunk semantics explicit;
- [x] performance constraints explicit;
- [x] playability constraints explicit;
- [x] Java-like pipeline explicit;
- [x] Universal Attack API contract explicit;
- [x] evidence rules explicit;
- [x] phase order explicit;
- [x] hard locks explicit;
- [x] freeze conditions explicit;
- [x] current HEAD recorded;
- [x] stale reports identified;
- [x] contradictions identified;
- [x] unresolved capability questions not falsely resolved;
- [x] no production code modified by this Phase 0 change;
- [x] no test modified by this Phase 0 change;
- [x] no implementation approved merely because code exists.

## 23. PHASE 0 VERDICT

**VERDICT: PASS — SPECIFICATION LOCK COMPLETE**

Reason: all mandatory Phase 0 specification, scope, authority, evidence, freeze, phase-order, hard-lock, current-HEAD, stale-report, contradiction, and unresolved-item controls are explicitly locked in this document.

**Important:** `PASS` here applies only to completion of the **Phase 0 specification lock**. It does **not** mean that Far View, 100-chunk rendering, runtime API compatibility, Java-like combat parity, performance, mobile, multiplayer, installation, or any later-phase implementation is verified.

**Current feature verification status remains separate and unresolved wherever evidence is absent.**

## 24. PHASE 0 CHANGE BOUNDARY

Allowed change for this task:

- create/update Phase 0 specification documentation;
- create/update Phase 0 evidence matrix.

Forbidden change for this task:

- `src/` production implementation;
- `addon/` implementation;
- `tests/` changes to achieve PASS;
- `package.json` changes to achieve PASS;
- runtime API implementation;
- Far View implementation;
- Combat implementation;
- performance implementation;
- repair/revert/delete of existing later-phase implementation.

**Phase 0 is a specification lock, not an implementation task.**
