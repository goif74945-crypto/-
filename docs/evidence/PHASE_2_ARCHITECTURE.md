# NEXY_FARVIEW_100 — PHASE 2 ARCHITECTURE

Status: PARTIAL / ARCHITECTURE-ONLY
Phase: PHASE 2 — Architecture
Target: Minecraft Bedrock 26.45 ONLY
Repository: `goif74945-crypto/-`
Branch: `main`
Start HEAD: `27adebc8690a1ea1b8144570d513664911293a97`

> This document is an architecture contract, not an implementation report. No source, manifest, dependency, test, or release artifact is created by Phase 2. A documented API surface is not treated as proof of Bedrock 26.45 runtime compatibility. `PASS` is reserved for capability evidence that satisfies the applicable evidence gate.

## 1. Phase 2 Scope

### In scope
- Define the future component boundaries for FAR VIEW, PERFORMANCE, PLAYABILITY SHIELD, and JAVA-LIKE GAMEPLAY.
- Define data/control flow and ownership boundaries.
- Define bounded-work contracts for queues, caches, tasks, and scheduling.
- Define API capability gates without inventing APIs.
- Define the single Universal Attack API architecture.
- Define how unsupported or unverified behavior is isolated and frozen.
- Define Phase 3 entry conditions.

### Out of scope
- Any implementation source.
- `manifest.json`, `package.json`, `src/*`, `scripts/*`, runtime systems, tests, or release artifacts.
- A guarantee of 100 real rendered chunks.
- Full 100-chunk simulation.
- Java parity claims.
- Runtime, performance, visual, mobile, or parity PASS claims.

## 2. Repository Baseline

The controlled baseline was verified at `27adebc8690a1ea1b8144570d513664911293a97` on `main`. The baseline contained documentation only and no addon implementation, manifest, dependency declaration, or test suite. The preceding Phase 0/1 audit is evidence context, not implementation proof.

Authoritative design source: `ข้อมูลการออกแบบ+%20การโจมตีแบบจ้าว้าเปิดAPI%20ให้อาวุธอื่นๆเป็นเหมื่อนกัน.txt`.

Authority order:
1. Authoritative specification.
2. Current repository evidence.
3. Build command.
4. Architecture decisions that do not weaken the above.

## 3. Architecture Tree

```text
NEXY_FARVIEW_100
|
+-- FAR VIEW CORE
|   +-- Distance Manager
|   +-- Visibility Manager
|   +-- Far Range Policy
|   +-- LOD / Detail Policy
|   +-- Chunk Work Queue
|   +-- Range Priority
|
+-- PERFORMANCE CORE
|   +-- Work Scheduler
|   +-- Work Budget
|   +-- Duplicate Work Eliminator
|   +-- Tick Work Eliminator
|   +-- Distance-Based Scaling
|   +-- Entity Load Balancer
|   +-- Effect Suppression
|   +-- Event-Driven Processing
|   +-- Work Deduplication / Coalescing
|   +-- Burst Protection
|   +-- Memory / Queue Protection
|   +-- Adaptive Performance Governor
|   +-- Mobile Load / Thermal Protection
|
+-- PLAYABILITY SHIELD
|   +-- Local Gameplay Priority
|   +-- Protected Work Classes
|   +-- Degradation Gate
|   +-- Recovery Gate
|
+-- JAVA-LIKE GAMEPLAY CORE
    +-- Universal Attack API
    +-- Weapon Adapter Layer
    +-- Combat Resolver
    +-- Damage Resolver
    +-- Critical Resolver
    +-- Knockback Resolver
    +-- Cooldown Resolver
    +-- Projectile Resolver
    +-- Entity Behavior
    +-- Movement
    +-- Item Behavior
    +-- Block Behavior
    +-- Interaction
    +-- AI
    +-- Loot
    +-- Experience
    +-- Status Effects
    +-- Physics-like Rules
    +-- World Mechanics
    +-- Event Rules
    +-- Redstone Compatibility

BEDROCK 26.45 ENGINE/API
        ^
        | capability-gated boundary
```

UI remains outside the Java-like gameplay core.

## 4. Component Responsibilities

### 4.1 FAR VIEW CORE

**Distance Manager**
- Converts player-relative positions into distance zones.
- Owns the logical range classification only; it does not claim control of engine render distance.
- Zones: `0–8`, `8–16`, `16–32`, `32–64`, `64–100` chunks as design targets.
- Output is a logical work/detail class, not a guarantee of visible engine chunks.

**Visibility Manager**
- Determines whether work is relevant to the current view/work context.
- Must use supported local/spatial operations when implemented.
- Does not manufacture fake chunks or proxy entities and label them as real engine rendering.

**Far Range Policy**
- Maps distance zone to permitted work classes.
- Far work is minimal-overhead and disposable before protected local gameplay work.

**LOD / Detail Policy**
- Selects detail level independently from simulation state.
- Must never turn a cosmetic LOD decision into a claim that simulation/rendering is occurring at that distance.

**Chunk Work Queue**
- Receives finite work items only.
- Lifecycle: `UNKNOWN -> DISCOVERED -> VISIBLE -> FAR -> RELEASED`.
- Queue admission is priority-aware and deduplicated.
- Released chunks remove queued/cached nonessential state.

**Range Priority**
- `CRITICAL > NEAR > IMPORTANT > MID > FAR > DECORATIVE`.

### 4.2 PERFORMANCE CORE

**Work Scheduler**
- Owns scheduling of bounded work.
- Uses event-driven execution where an event exists; interval/queued execution only where justified.
- Scheduler registration must be centralized so the same work source cannot silently register duplicate loops.

**Work Budget**
- Each scheduling window has a finite work budget.
- Budget exhaustion defers lower-priority work rather than overrunning the protected window.

**Duplicate Work Eliminator**
- Shares computed results when inputs and validity windows permit.
- No duplicate computation solely because multiple consumers request the same result.

**Tick Work Eliminator**
- Every-tick work requires an explicit requirement and capability basis.
- Stable state is not reprocessed without a state/event transition.

**Distance-Based Scaling**
- Full local work; progressively reduced mid/far work; minimal farthest work.
- Scaling may reduce cosmetic/far work but cannot remove correctness-critical local work.

**Entity Load Balancer**
- Processes only relevant entities using local/spatial filtering.
- Near/critical entities receive protected priority.
- No global entity scan every tick.

**Effect Suppression**
- Degradation order: far ambient -> decorative animation -> cosmetic effects -> normal particles -> noncritical far entities.
- Gameplay-critical effects are protected.

**Event-Driven Processing**
- Event source -> normalized work request -> priority -> bounded scheduler.
- Polling is a fallback only when a required state cannot be represented through a supported event and the capability is verified.

**Work Deduplication / Coalescing**
- Equivalent requests within the same coalescing window become one work item with merged consumers.
- Work identity must be deterministic enough to prevent duplicate admission.

**Burst Protection**
- Detects high arrival rate of work requests.
- Applies admission/backpressure and spreads lower-priority work across later safe windows.

**Memory / Queue Protection**
- All persistent collections have finite ceilings.
- When a ceiling is reached, lower-priority/disposable work is rejected or coalesced first.
- Protected local gameplay work must not be evicted by decorative work.

**Adaptive Performance Governor**
- Owns policy state only; it does not directly redefine gameplay correctness.
- State model is defined in Section 12.

**Mobile Load / Thermal Protection**
- Architecture supports a conservative degradation mode for device pressure.
- Mobile PASS is impossible in Phase 2; device measurement is required later.

## 5. Data Flow

### Far-view work
```text
PLAYER / WORLD CHANGE
    -> DISTANCE CLASSIFICATION
    -> VISIBILITY / RELEVANCE CHECK
    -> RANGE PRIORITY
    -> DEDUP / COALESCE
    -> QUEUE ADMISSION
    -> WORK BUDGET
    -> SCHEDULER
    -> CAPABILITY-GATED ENGINE/API ACTION
    -> RESULT / STATE UPDATE
    -> CACHE OR RELEASE
```

### Local gameplay protection
```text
LOCAL GAMEPLAY EVENT
    -> PLAYABILITY SHIELD
    -> CRITICAL / NEAR PRIORITY
    -> RESERVE WORK BUDGET
    -> LOCAL ACTION
    -> RESULT
    -> RELEASE / RECOVER FAR WORK
```

### Java-like behavior
```text
JAVA BEHAVIOR CONTRACT
    -> BEHAVIOR SPECIFICATION
    -> API CAPABILITY GATE
    -> BEDROCK IMPLEMENTATION (PHASE 3+ ONLY)
    -> PARITY TEST (PHASE 6+)
    -> RESULT
```

An API capability gate may terminate the flow with `NOT VERIFIED`, `UNKNOWN`, or `FAIL`; it must not substitute a fabricated API.

## 6. Control Flow

1. A supported event or explicitly justified state change creates a work request.
2. The request receives a distance class and priority.
3. Deduplication/coalescing checks whether equivalent work already exists.
4. Admission checks finite queue/task/cache limits.
5. Playability Shield can elevate protected local work and prevent far/cosmetic work from consuming its protected budget.
6. Scheduler executes only within the current finite work budget.
7. Unsupported/unverified API paths stop at the capability gate.
8. Completed work updates state/cache or releases transient state.
9. Governor evaluates measured signals in later phases and changes only degradation policy, never correctness contracts.

## 7. Dependency Boundaries

### Allowed direction
```text
Domain requirements
      |
      +--> Far View Policy
      +--> Performance Policy
      +--> Playability Policy
      +--> Gameplay Contracts
                |
                v
        API Capability Gate
                |
                v
        Bedrock Engine/API
```

### Forbidden coupling
- Weapon adapters must not own damage/cooldown/knockback pipelines.
- Far-view code must not bypass Playability Shield for local gameplay.
- Performance governor must not mutate combat correctness rules.
- Java-like contracts must not directly depend on Java source code.
- API assumptions must not be encoded as facts without capability evidence.
- UI must not become a dependency of the Java-like gameplay core.

## 8. API Capability Matrix

Evidence rule for every row: `INPUT / EXPECTED / ACTUAL / EVIDENCE / STATUS`.

| Component / API-dependent capability | INPUT | EXPECTED | ACTUAL | EVIDENCE | STATUS |
|---|---|---|---|---|---|
| Scheduler: `system.run`, `runInterval`, `runTimeout` | Official Script API surface | Scheduling primitives exist | Documented | Microsoft Learn System API, recorded in Phase 0/1 audit | PASS at API-surface level; 26.45 runtime not verified |
| Generator scheduling: `system.runJob` | Official Script API surface | Bounded generator scheduling exists | Documented | Microsoft Learn System API, recorded in Phase 0/1 audit | PASS at API-surface level; workload/runtime not verified |
| Scheduler cancellation/current tick | Official Script API surface | `clearJob`, `clearRun`, `currentTick` exist | Documented | Microsoft Learn System API, recorded in Phase 0/1 audit | PASS at API-surface level; 26.45 runtime not verified |
| Entity view-direction query | Official Entity API surface | Local view-direction query exists | Documented | Microsoft Learn Entity API, recorded in Phase 0/1 audit | PASS at API-surface level; 26.45 runtime not verified |
| Dimension entity queries / ray queries | Official Dimension API surface | Spatial/local entity and ray queries exist | Documented | Microsoft Learn Dimension API, recorded in Phase 0/1 audit | PASS at API-surface level; 26.45 runtime not verified |
| Damage primitive | Official Entity API surface | Entity damage operation exists | Documented | Microsoft Learn Entity API, recorded in Phase 0/1 audit | PASS at API-surface level; 26.45 runtime not verified |
| Knockback / impulse primitives | Official Entity API surface | Knockback/impulse operations exist | Documented | Microsoft Learn Entity API, recorded in Phase 0/1 audit | PASS at API-surface level; 26.45 runtime not verified |
| Entity/item/block event hooks | Official World event API surface | Event-driven hooks exist for relevant actions | Documented | Microsoft Learn World/Event APIs, recorded in Phase 0/1 audit | PASS at API-surface level; 26.45 runtime not verified |
| Projectile component | Official projectile API surface | Projectile ownership/shoot capability exists | Documented | Microsoft Learn EntityProjectileComponent, recorded in Phase 0/1 audit | PARTIAL; parity/runtime not verified |
| Exact `@minecraft/server` version for Bedrock 26.45 | Bedrock 26.45 + official versioning docs | Direct exact product-to-module binding | Not established | Official versioning documentation separates module versioning from product version; no direct 26.45 binding found | NOT VERIFIED |
| 100 real rendered chunks through Add-on API | Bedrock engine/API capability | Direct engine-level control/guarantee | Not established | Reviewed official API evidence does not establish this capability | NOT VERIFIED |
| Java critical-hit parity | Java behavior contract + Bedrock capability | Exact rule equivalence | Not established | No parity/runtime evidence | NOT VERIFIED |
| Java cooldown parity | Java behavior contract + Bedrock capability | Exact rule equivalence | Not established | No parity/runtime evidence | NOT VERIFIED |
| Java armor/protection/resistance parity | Java behavior contract + Bedrock capability | Exact rule equivalence | Not established | No parity/runtime evidence | NOT VERIFIED |
| Java knockback parity | Java behavior contract + Bedrock capability | Exact rule equivalence | Not established | No parity/runtime evidence | NOT VERIFIED |
| Java loot/XP parity | Java behavior contract + Bedrock capability | Exact rule equivalence | Not established | No parity/runtime evidence | NOT VERIFIED |
| Complete AI/behavior parity | Java behavior contract + Bedrock capability | Exact rule equivalence | Not established | No parity/runtime evidence | NOT VERIFIED |
| Complete world/redstone parity | Java behavior contract + Bedrock capability | Exact rule equivalence | Not established | No parity/runtime evidence | NOT VERIFIED |
| Mobile performance/thermal behavior | Target device + runtime measurement | Stable acceptable behavior under defined workload | Not measured | No mobile runtime evidence in repository | NOT VERIFIED |
| Visual far-view behavior | Bedrock runtime | Measured visual behavior across zones | Not measured | No visual runtime evidence | NOT VERIFIED |

**Gate rule:** The architecture may wrap a documented API surface, but Phase 3 cannot use an exact module/version or behavior as verified until its required evidence exists.

## 9. Performance Boundaries

The architecture uses finite ceilings at every persistent work boundary. Numeric tuning is deliberately deferred to measured implementation/testing; no arbitrary numeric value is presented as a proven Bedrock/mobile limit.

| Resource | Required bound | Admission | Deduplication | Backpressure / drop | Priority | Recovery |
|---|---|---|---|---|---|---|
| Chunk work queue | Finite configured ceiling `CHUNK_QUEUE_MAX` | Reject lowest-priority admission when full | Chunk identity + requested work class | Drop/coalesce FAR then DECORATIVE first | CRITICAL > NEAR > IMPORTANT > MID > FAR > DECORATIVE | Re-admit after capacity returns |
| General work queue | Finite `WORK_QUEUE_MAX` | Priority + budget gate | Deterministic work key | Coalesce duplicates; defer lower priority | Same priority order | Resume deferred work |
| Task backlog | Finite `TASK_BACKLOG_MAX` | Scheduler admission gate | Task identity | Cancel/defer disposable work | Protected local tasks first | Rebuild only from valid state |
| Result/cache store | Finite `CACHE_MAX` | Insert only required/reusable data | Key + validity window | Evict stale/lowest-value data first | Gameplay-relevant > cosmetic | Recompute on demand when capability permits |
| Active projectile work | Finite `PROJECTILE_WORK_MAX` | Active/relevant projectiles only | Projectile identity + collision window | Defer/drop noncritical far collision work | Local/projectile combat protected | Re-evaluate on next valid window |
| Entity processing set | Finite per-window work budget | Spatial relevance + priority | Entity id + state version | Defer far unchanged state | Near/critical first | Reassess after state/event change |
| Event burst intake | Finite `BURST_WINDOW_MAX` | Burst admission policy | Event key/coalescing | Spread lower priority work | Gameplay events protected | Return to normal after stable windows |

**Hard rule:** a bound may never be represented by an implicit/unbounded container. The exact numeric constants are Phase 3/4 tuning parameters and require performance evidence before any PASS.

## 10. Queue / Cache / Task Contracts

Every bounded work unit must expose these conceptual fields before implementation:
- stable work identity;
- priority;
- creation tick/time context;
- source/event type;
- estimated work class;
- expiration/staleness condition where applicable;
- cancellation/release rule;
- capability gate reference;
- deduplication key;
- retry count or explicit no-retry rule.

No infinite retry. An unsupported capability is not retried blindly. A stale far/cosmetic request may expire without affecting local gameplay.

## 11. Priority Model

```text
CRITICAL
  > NEAR
  > IMPORTANT
  > MID
  > FAR
  > DECORATIVE
```

Priority is policy, not permission to violate correctness. If a conflict exists, the local gameplay contract wins and the conflicting optimization is frozen.

Priority examples:
- CRITICAL: active combat resolution, player input/camera protection, immediate boss/PVP/local gameplay events.
- NEAR: nearby entities, nearby interaction, local projectiles.
- IMPORTANT: gameplay-relevant events outside the immediate local window.
- MID: medium-distance state/detail work.
- FAR: far-view noncritical work.
- DECORATIVE: ambient/cosmetic work.

## 12. Adaptive Governor State Model

The specification defines the conceptual recovery states:
`CRITICAL -> SAFE -> BALANCED -> HIGH -> EXTREME`, with gradual recovery after stability.

Architecture interpretation:

```text
                 pressure increases
                        |
                        v
EXTREME -> HIGH -> BALANCED -> SAFE -> CRITICAL
   ^                                  |
   |                                  v
   +--------- gradual recovery <-------+
```

The displayed direction is a control severity model: higher pressure moves toward more conservative states. State transitions must be driven by measured signals in later phases, not guessed thresholds in Phase 2.

Protected in every state:
- player input/movement/camera;
- combat timing and correctness;
- inventory/item use;
- block interaction/break/place;
- nearby entities/projectiles;
- boss/PVP/local gameplay;
- required gameplay-critical events/mechanics.

Degraded first:
1. far ambient work;
2. decorative animation;
3. cosmetic effects/particles;
4. noncritical far entity work;
5. other lower-priority work only when safe.

No governor state may rewrite gameplay results merely to improve FPS.

## 13. Playability Shield Model

```text
INPUT / MOVEMENT / CAMERA / COMBAT / INTERACTION
                    |
                    v
             PLAYABILITY SHIELD
                    |
          +---------+---------+
          |                   |
      PROTECTED           DEGRADABLE
          |                   |
          v                   v
 LOCAL GAMEPLAY          FAR / COSMETIC
          |                   |
          +---------+---------+
                    |
                    v
             WORK SCHEDULER
```

Rules:
- Protected work receives admission/budget precedence.
- Local gameplay can trigger temporary far-work throttling.
- Far work cannot consume capacity reserved for active local gameplay.
- Shield release occurs only after the local event is complete and the system is stable.
- The shield does not invent engine behavior or override native correctness.

## 14. Universal Attack API Architecture

### Central convergence

```text
SwordAdapter ---------+
AxeAdapter -----------+
SpearAdapter ---------+
BowAdapter -----------+--> ATTACK REQUEST
CustomWeaponAdapter ---+        |
                               v
                    UNIVERSAL ATTACK API
                               |
                               v
                         VALIDATION
                               |
                     +---------+---------+
                     |                   |
                     v                   v
               COMBAT RESOLVER     PROJECTILE RESOLVER
                     |
                     v
               DAMAGE RESOLVER
                     |
          +----------+----------+
          |          |          |
       CRITICAL   KNOCKBACK   EFFECT
          |          |          |
          +----------+----------+
                     |
                 DURABILITY
                     |
                DEATH CHECK
                 /         \
              LOOT          XP
                 \         /
                   RESULT
```

### Attack contract
The architecture uses a conceptual `AttackRequest` containing the specification-defined information: attacker, weapon, target, attack type, direction/range, damage inputs, cooldown inputs, critical eligibility, knockback inputs, damage source, effects, durability cost, optional projectile context, tick/time context, and contextual data.

These are **domain-contract fields**, not claims that identical field names exist in a Bedrock API. Concrete implementation field names must be selected only after Phase 3 capability/type inspection.

### Required attack types
- `MELEE`
- `HEAVY_MELEE`
- `THRUST`
- `SWEEP`
- `RANGED`
- `PROJECTILE`
- `SPECIAL`

### Required adapters
- `SwordAdapter`
- `AxeAdapter`
- `SpearAdapter`
- `BowAdapter`
- `CustomWeaponAdapter`

### Centralization rule
Every participating weapon enters through an adapter and converges on the same validation/resolver chain. Weapon-specific overrides may provide only validated differences; they cannot fork the full combat pipeline.

## 15. Projectile Architecture

```text
PROJECTILE SPAWN
    -> ACTIVE REGISTRY
    -> TRAJECTORY CONTEXT
    -> SPATIAL FILTER
    -> COLLISION CANDIDATES
    -> HIT VALIDATION
    -> DAMAGE / KNOCKBACK / EFFECT
    -> LIFETIME / PICKUP
    -> RESULT / RELEASE
```

Boundaries:
- Only active/relevant projectile work is admitted.
- Spatial filtering precedes candidate processing.
- No global entity scan every tick.
- Collision work is finite per scheduling window.
- Duplicate collision requests are coalesced.
- Exact collision/lifetime/pickup parity remains unverified until runtime/parity testing.

The documented projectile component supports an architectural adapter boundary, but it does not establish full Java projectile parity.

## 16. Entity / AI Architecture

State machine:

```text
IDLE
  -> TARGET_FOUND
  -> CHASE
  -> ATTACK
  -> COOLDOWN
  -> REASSESS
  -> IDLE / TARGET_FOUND
```

Data flow:
`Entity -> State -> Goal -> Target -> Navigation -> Action`.

Rules:
- State changes/events are preferred over unchanged-state polling.
- Local entities receive higher priority.
- Far unchanged entities may have reduced reassessment frequency only when behavior correctness is protected and capability evidence permits it.
- No global entity scan every tick.
- Exact AI parity remains `NOT VERIFIED`.

## 17. Item Architecture

```text
ITEM DEFINITION
    -> STATE
    -> USE ACTION
    -> COOLDOWN
    -> DURABILITY
    -> ENCHANTMENT / MODIFIER
    -> EFFECT
    -> STACK RULES
    -> DROP / PICKUP
```

Native Bedrock item behavior is authoritative where sufficient. Script involvement requires a capability gate. Unchanged items/states are not needlessly polled.

## 18. Block Architecture

```text
INPUT
 -> VALIDATION
 -> GAME RULE
 -> ACTION
 -> STATE UPDATE
 -> EVENT
```

Covers interaction, breaking, placing, tool behavior, item interaction, containers, and entity interaction as specified. Native engine behavior is preferred. Global block scans every tick are forbidden.

## 19. Status / Loot / XP Architecture

### Status effects
`ACTIVE EFFECT -> DURATION/AMPLIFIER STATE -> EXPIRATION SCHEDULE -> REMOVE/UPDATE`.

Only active effects require processing. Empty-effect polling is forbidden.

### Loot
`DEATH -> LOOT RESOLUTION -> DROP`.

### XP
`DEATH -> XP RESOLUTION -> SPAWN`.

Exact parity remains unverified.

## 20. World Mechanics Boundary

In scope as contracts:
- time;
- weather;
- difficulty;
- spawning;
- drops;
- dimensions;
- environment rules;
- game rules;
- gameplay events;
- redstone-related compatibility.

Boundary rule: the Bedrock engine is the authority for native behavior. Script/API intervention is permitted only where necessary and capability-gated. Exact Java-like parity for these systems is not established.

## 21. Unsupported / Unknown Capabilities

The following remain frozen as `NOT VERIFIED` until direct evidence exists:
1. Exact `@minecraft/server` version binding for Bedrock 26.45.
2. Runtime behavior of selected Script APIs on Bedrock 26.45.
3. Add-on ability to guarantee 100 real rendered chunks.
4. Exact Java critical-hit semantics.
5. Exact Java cooldown semantics.
6. Exact Java armor/protection/resistance modifier equivalence.
7. Exact Java knockback equivalence.
8. Exact Java loot/XP parity.
9. Complete AI/behavior parity.
10. Complete world-mechanics/redstone parity.
11. Runtime visual far-view behavior.
12. Mobile performance and thermal behavior.

No architecture section converts these to implementation permission.

## 22. Explicit Blockers

- Phase 1 is PARTIAL.
- Exact 26.45-to-Script-API version binding is not established.
- 100 real rendered chunks is not established as an Add-on capability.
- Runtime behavior is not established for the target product/runtime combination.
- Full Java parity is not established.
- Mobile/performance/visual/parity evidence does not exist.
- The repository has no implementation to execute or test at Phase 2.

Therefore Phase 2 cannot authorize final implementation of blocked capabilities. Where Phase 3 requires one, the capability must first be resolved by evidence or the feature must remain frozen/redesigned.

## 23. Phase 3 Entry Conditions

Phase 3 may begin only when all of the following are true:

1. Repository remains `goif74945-crypto/-`, branch `main`, with the controlled head verified immediately before work.
2. This Phase 2 architecture is present and has not weakened the authoritative specification.
3. Exact API/module versions required by the planned implementation are established with direct evidence appropriate to Bedrock 26.45, or the implementation uses only a capability set explicitly verified for the target.
4. Every planned API-dependent component has an `INPUT / EXPECTED / ACTUAL / EVIDENCE / STATUS` record.
5. Any `NOT VERIFIED` capability has either been excluded from implementation or has an evidence-based redesign.
6. 100 chunks remains a design target unless separate engine-level evidence proves a stronger claim.
7. Concrete source paths are selected only after architecture and capability review; no invented placeholder implementation is accepted.
8. Queue/task/cache finite ceilings are concretely selected for implementation and later measured; no unbounded structure is allowed.
9. Universal Attack API remains the single combat convergence point.
10. A Phase 3 implementation plan can map every implementation unit to a requirement and architecture component.
11. No implementation is claimed to have runtime/performance/mobile/parity PASS before the corresponding later phase evidence exists.
12. If any requirement conflicts with actual capability, FREEZE is mandatory rather than speculative implementation.

## 24. Evidence Matrix

| Requirement ID | Expected | Actual at Phase 2 | File | Section | Evidence | Status |
|---|---|---|---|---|---|---|
| P2-01 | Phase 2 architecture follows authoritative system structure | Architecture tree and boundaries defined | `docs/evidence/PHASE_2_ARCHITECTURE.md` | 3–7 | Authoritative design + repository baseline | PASS |
| P2-02 | Far-view zones are defined without claiming engine rendering | Five logical zones defined; 100 remains design target | same | 4, 21 | Authoritative design; no engine-level 100-chunk proof | PASS |
| P2-03 | Visual distance separated from simulation distance | Explicit separation in component/data-flow rules | same | 4–6 | Authoritative design | PASS |
| P2-04 | No 100-chunk every-tick scan | Architecture forbids it | same | 4, 15, 16, 18 | Authoritative hard locks | PASS |
| P2-05 | Performance work is bounded | Finite queue/cache/task contracts defined | same | 9–10 | Architecture contract | PASS |
| P2-06 | Priority protects gameplay correctness | Priority model + shield defined | same | 11–13 | Authoritative design | PASS |
| P2-07 | Adaptive governor exists as policy architecture | Five-state model + protected/degraded classes defined | same | 12 | Authoritative design | PASS |
| P2-08 | Playability Shield protects local gameplay | Protected/degradable model defined | same | 13 | Authoritative design | PASS |
| P2-09 | Universal Attack API is centralized | All required adapters converge on one pipeline | same | 14 | Authoritative design | PASS |
| P2-10 | Required attack types/adapters are preserved | All required types and adapters listed | same | 14 | Authoritative design | PASS |
| P2-11 | Projectile architecture avoids global scans | Active registry + spatial filtering + bounded work | same | 15 | Authoritative design + documented API surface | PASS at architecture level |
| P2-12 | Entity/AI architecture is state-driven | State machine and priority model defined | same | 16 | Authoritative design | PASS |
| P2-13 | Item architecture is lazy/event-oriented | Pipeline and no-unnecessary-polling rule defined | same | 17 | Authoritative design | PASS |
| P2-14 | Block architecture preserves correctness | Validation/action/state/event boundary defined | same | 18 | Authoritative design | PASS |
| P2-15 | Status/Loot/XP architecture defined | Active-effect and death-resolution flows defined | same | 19 | Authoritative design | PASS |
| P2-16 | World mechanics boundary defined | Native-first, capability-gated boundary defined | same | 20 | Authoritative design | PASS |
| P2-17 | API claims are evidence-gated | Capability matrix records input/expected/actual/evidence/status | same | 8 | Phase 0/1 evidence + official documentation recorded there | PARTIAL |
| P2-18 | Exact 26.45 API binding is verified before implementation | Not established | same | 8, 21–23 | Official versioning evidence does not establish exact binding | NOT VERIFIED |
| P2-19 | 100 real rendered chunks are proven | Not established | same | 8, 21–23 | No engine-level evidence | NOT VERIFIED |
| P2-20 | Full Java parity is proven | Not established | same | 8, 21–23 | No parity evidence | NOT VERIFIED |
| P2-21 | Mobile/performance/visual behavior is proven | Not measured | same | 8, 21–23 | No runtime/device evidence | NOT VERIFIED |
| P2-22 | No implementation source is created in Phase 2 | No implementation files created | repository | Phase 2 file-creation scope | GitHub tree/commit inspection required after write | PASS |

## Phase 2 Conclusion

**PHASE 2 STATUS: PARTIAL / CONTROLLED.**

The architecture contract is defined without converting unsupported capabilities into implementation facts. The project remains unimplemented. The next phase is blocked for any capability lacking the required evidence. No 100-real-chunk rendering guarantee, Java parity guarantee, runtime PASS, performance PASS, visual PASS, or mobile PASS is authorized by this document.
