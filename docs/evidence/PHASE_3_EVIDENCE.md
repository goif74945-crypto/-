# NEXY_FARVIEW_100 — PHASE 3 EVIDENCE

Status: PARTIAL — CORE IMPLEMENTATION EXISTS; BUILD/RUNTIME TARGET VERIFICATION NOT ESTABLISHED
Phase: PHASE 3 — Core Implementation
Target: Minecraft Bedrock 26.45 ONLY
Repository: `goif74945-crypto/-`
Branch: `main`

## 1. PHASE / SCOPE

This phase implements only concrete core logic that can be traced to source code without claiming unsupported engine capabilities.

In scope:
- bounded priority work scheduler;
- far-view distance classification and chunk lifecycle state;
- playability priority/degradation policy;
- adaptive performance governor;
- centralized Universal Attack API and weapon adapters;
- capability-gated Bedrock runtime port using documented Script API surfaces;
- TypeScript build/test harness.

Out of scope / not claimed:
- 100 real rendered chunks;
- full 100-chunk simulation;
- complete Java parity;
- exact Bedrock 26.45 to Script API module-version binding;
- runtime PASS;
- performance PASS;
- visual PASS;
- mobile PASS;
- parity PASS;
- final release artifact.

## 2. REPOSITORY / BRANCH / START HEAD

Repository: `goif74945-crypto/-`
Branch: `main`
Phase start HEAD: `75f062df0ce62c9616cb2740906a352204002a06`

The starting HEAD was independently read from the Git ref before implementation. The repository at that HEAD contained documentation only and no implementation source. The authoritative design source locks Bedrock 26.45, the far-view zones, bounded performance, playability shield, native-first gameplay, and centralized combat. Those requirements are recorded in the authoritative specification and prior repository evidence.

## 3. AUTHORITATIVE REQUIREMENTS

Authoritative specification:
`ข้อมูลการออกแบบ+%20การโจมตีแบบจ้าว้าเปิดAPI%20ให้อาวุธอื่นๆเป็นเหมื่อนกัน.txt`

Key locked requirements used for Phase 3:
- 0–8, 8–16, 16–32, 32–64, 64–100 logical far-view zones.
- Visual distance must remain separate from simulation distance.
- 100 chunks is a design target, not a guaranteed rendered-chunk claim.
- No global entity/block scan every tick.
- No unbounded queue/cache/task state.
- Gameplay-critical work outranks far/decorative work.
- One Universal Attack API is the convergence point for participating weapons.
- Required adapters: SwordAdapter, AxeAdapter, SpearAdapter, BowAdapter, CustomWeaponAdapter.
- Unsupported/uncertain API capability must remain NOT VERIFIED/FREEZE.

## 4. ACTUAL GITHUB TREE

Implementation tree added in this phase:

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
```

Existing documentation remains outside the implementation set. No addon manifest or release artifact was created.

## 5. IMPLEMENTATION FILE INVENTORY

Implementation source files: 8

1. `src/core/types.ts` — domain contracts, priority/distance/attack types.
2. `src/core/performance.ts` — bounded priority queue, deduplication, admission and eviction.
3. `src/core/far-view.ts` — distance zones, visual/detail policy, simulation separation, bounded chunk state.
4. `src/core/playability.ts` — protected gameplay classes and degradation policy.
5. `src/core/governor.ts` — adaptive performance pressure state machine.
6. `src/core/combat.ts` — weapon adapters, cooldown, critical, damage, knockback and the single UniversalAttackAPI convergence point.
7. `src/bedrock/runtime.ts` — capability inventory and Bedrock runtime execution port.
8. `src/main.ts` — runtime wiring and one bounded 5-tick heartbeat.

Test source:
- `tests/core.test.ts`

Build/config files:
- `package.json`
- `tsconfig.json`
- `.github/workflows/core-check.yml`

Approximate added implementation source size from the GitHub compare at phase completion: 502 source LOC across the 8 implementation files; 79 test LOC. This is source size, not proof of runtime correctness.

## 6. REQUIREMENT → FILE → SYMBOL MAPPING

### FVR-01 — Far-view logical zones
EXPECTED:
0–8 / 8–16 / 16–32 / 32–64 / 64–100 logical zones.
ACTUAL:
Implemented as `FarViewCore.classifyChunkDistance`.
FILE:
`src/core/far-view.ts`
SYMBOL:
`FarViewCore.classifyChunkDistance`
CODE PATH:
Distance input -> zone -> detail level -> `simulationAllowed` flag.
TEST:
`tests/core.test.ts` checks representative zones and that 80 chunks are not marked simulated.
EVIDENCE:
GitHub source tree and test source exist; no executed test output is available from this environment.
STATUS:
PARTIAL

### FVR-02 — Visual distance separated from simulation distance
EXPECTED:
Logical far-view detail must not imply full simulation at 100 chunks.
ACTUAL:
`64-100` returns `detail: MINIMAL` and `simulationAllowed: false`; `32-64` is also non-simulated.
FILE:
`src/core/far-view.ts`
SYMBOL:
`FarViewCore.classifyChunkDistance`
CODE PATH:
Distance -> logical detail policy -> independent simulation flag.
TEST:
Unit test source contains assertion for 80 chunks.
EVIDENCE:
Actual code.
STATUS:
PARTIAL

### FVR-03 — Chunk lifecycle and bounded state
EXPECTED:
UNKNOWN -> DISCOVERED -> VISIBLE -> FAR -> RELEASED with bounded persistent state.
ACTUAL:
Lifecycle state is represented by `ChunkState`; transitions reject resurrection from RELEASED and the tracked map has a constructor ceiling.
FILE:
`src/core/types.ts`, `src/core/far-view.ts`
SYMBOL:
`ChunkState`, `FarViewCore.transition`, `FarViewCore.release`, `FarViewCore.clearReleased`
CODE PATH:
Transition request -> released-state validation -> bounded map admission.
TEST:
No executed test output.
EVIDENCE:
Actual code; bound is `maxTrackedChunks` with default 256.
STATUS:
PARTIAL

### PERF-01 — Bounded priority work queue
EXPECTED:
Finite queue, admission, deduplication, backpressure/eviction, priority and recovery via later drain.
ACTUAL:
`BoundedPriorityScheduler` uses a `Map`, rejects low-priority admission when full, replaces lower priority when a higher priority arrives, deduplicates by key and drains only up to `maxPerWindow`.
FILE:
`src/core/performance.ts`
SYMBOL:
`BoundedPriorityScheduler.enqueue`, `BoundedPriorityScheduler.drain`
CODE PATH:
Request -> key dedup -> capacity/admission -> priority eviction -> bounded drain.
TEST:
`tests/core.test.ts` exercises a max queue of 2 and max window of 1.
EVIDENCE:
Actual source; test not executed by available environment.
STATUS:
PARTIAL

### PERF-02 — Adaptive governor
EXPECTED:
Pressure drives degradation while local gameplay protection remains higher priority.
ACTUAL:
`AdaptivePerformanceGovernor.evaluate` maps pressure to EXTREME/HIGH/BALANCED/SAFE/CRITICAL states and immediately prefers BALANCED when protected local gameplay is active under noncritical pressure.
FILE:
`src/core/governor.ts`
SYMBOL:
`AdaptivePerformanceGovernor.evaluate`
CODE PATH:
Pressure sample -> highest pressure -> governor state -> degradation policy.
TEST:
Unit test source checks CRITICAL saturation.
EVIDENCE:
Actual source; no executed test output.
STATUS:
PARTIAL

### PLAY-01 — Playability Shield
EXPECTED:
Movement/input/camera/combat/inventory/item use/block/entity/projectile/boss/PVP/important events/redstone remain protected from degradation.
ACTUAL:
The protected set explicitly includes these gameplay classes; `shouldDegrade` returns false for protected classes and true only for nonprotected work when local gameplay is active.
FILE:
`src/core/playability.ts`
SYMBOL:
`PlayabilityShield.isProtected`, `PlayabilityShield.priorityFor`, `PlayabilityShield.shouldDegrade`
CODE PATH:
Gameplay class -> protected classification -> priority/degradation decision.
TEST:
Unit test source checks COMBAT, DECORATIVE and BOSS behavior.
EVIDENCE:
Actual source; no executed test output.
STATUS:
PARTIAL

### COMBAT-01 — Single Universal Attack API convergence
EXPECTED:
Weapon -> Adapter -> Attack Request -> Universal Attack API -> validation -> damage/critical/knockback -> result.
ACTUAL:
All five required adapters extend one `BaseAdapter`; all requests converge on `UniversalAttackAPI.execute`, which owns the common resolver path.
FILE:
`src/core/combat.ts`
SYMBOL:
`UniversalAttackAPI.execute`, `BaseAdapter`, required adapter classes.
CODE PATH:
Adapter `toAttackRequest` -> `UniversalAttackAPI.execute` -> target validation -> cooldown -> critical -> damage -> knockback -> result.
TEST:
Unit test source checks all five adapter classes and one execution path.
EVIDENCE:
Actual source.
STATUS:
PARTIAL

### COMBAT-02 — Required weapon adapters
EXPECTED:
SwordAdapter, AxeAdapter, SpearAdapter, BowAdapter, CustomWeaponAdapter.
ACTUAL:
All five classes exist and inherit the same adapter implementation.
FILE:
`src/core/combat.ts`
SYMBOL:
`SwordAdapter`, `AxeAdapter`, `SpearAdapter`, `BowAdapter`, `CustomWeaponAdapter`
CODE PATH:
WeaponDefinition -> BaseAdapter.toAttackRequest -> AttackRequest.
TEST:
Unit test source instantiates all five.
EVIDENCE:
Actual source.
STATUS:
PASS at source-existence level; runtime behavior NOT VERIFIED

### COMBAT-03 — Central cooldown/damage/critical/knockback
EXPECTED:
Shared resolver pipeline with bounded cooldown state.
ACTUAL:
`CooldownResolver`, `CriticalResolver`, `DamageResolver`, `KnockbackResolver` are shared dependencies of `UniversalAttackAPI`; cooldown state is bounded by `maxEntries` and pruned.
FILE:
`src/core/combat.ts`
SYMBOL:
Resolver classes and `UniversalAttackAPI.execute`
CODE PATH:
Validation -> shared resolvers -> execution port -> result.
TEST:
Unit test source checks critical damage, knockback and cooldown rejection.
EVIDENCE:
Actual source.
STATUS:
PARTIAL

### API-01 — Capability-gated Bedrock primitives
EXPECTED:
Implementation uses only selected documented Script API surfaces and does not claim exact 26.45 binding without proof.
ACTUAL:
`src/bedrock/runtime.ts` explicitly records selected capabilities with `targetBindingVerified: false` and uses `system.runInterval`, `Dimension.getEntities`, `Entity.applyDamage`, and `Entity.applyImpulse`.
FILE:
`src/bedrock/runtime.ts`
SYMBOL:
`SCRIPT_API_CAPABILITIES`, `BedrockCombatPort`, `installRuntimeHeartbeat`
CODE PATH:
Runtime entry -> documented API call -> caught runtime rejection -> no synthetic success.
TEST:
No Bedrock runtime test executed.
EVIDENCE:
Actual code plus prior official API-surface audit; exact Bedrock 26.45 binding remains unverified.
STATUS:
NOT VERIFIED

### API-02 — Exact @minecraft/server version binding to Bedrock 26.45
EXPECTED:
Direct product-to-module evidence.
ACTUAL:
`package.json` declares `@minecraft/server` `2.9.0`, but the repository evidence does not establish that 2.9.0 is the exact binding for Bedrock 26.45.
FILE:
`package.json`
SYMBOL:
dependency declaration
CODE PATH:
npm dependency resolution -> Script API package.
TEST:
No target-runtime test executed.
EVIDENCE:
Prior API audit explicitly marked the exact binding NOT VERIFIED.
STATUS:
NOT VERIFIED

### FAR-100 — 100 real rendered chunks
EXPECTED:
Only claim with direct engine-level proof.
ACTUAL:
No implementation attempts to force or fake 100 engine-rendered chunks.
FILE:
`src/core/far-view.ts`
SYMBOL:
`classifyChunkDistance`
CODE PATH:
Logical zone classification only; no render-distance API claim.
TEST:
No engine-level visual test.
EVIDENCE:
No direct engine capability evidence.
STATUS:
NOT VERIFIED

### PARITY-01 — Java gameplay/combat parity
EXPECTED:
Exact parity only after category-specific parity tests.
ACTUAL:
No claim of complete parity. Resolver behavior is explicit domain logic but armor/protection/resistance, exact Java critical conditions, native item durability, loot/XP and many world mechanics are not established as equivalent.
FILE:
`src/core/combat.ts`
SYMBOL:
Resolvers in `UniversalAttackAPI`
CODE PATH:
Attack request -> explicit domain modifiers -> result.
TEST:
No parity test executed.
EVIDENCE:
No parity evidence.
STATUS:
NOT VERIFIED

### RUNTIME-01 — Runtime verification
EXPECTED:
A Minecraft Bedrock 26.45 run must provide actual runtime output.
ACTUAL:
No runtime execution was available from the connected environment.
FILE:
`src/main.ts`, `src/bedrock/runtime.ts`
SYMBOL:
`installRuntimeHeartbeat`, runtime wiring
CODE PATH:
Bedrock entry -> heartbeat -> bounded scheduler/governor.
TEST:
No Bedrock runtime.
EVIDENCE:
GitHub Actions reported zero workflow runs for `main` during this phase; no runtime output exists to cite.
STATUS:
NOT VERIFIED

## 7. API CAPABILITY EVIDENCE

The implementation deliberately records target binding separately from API-surface existence.

| API surface used | Actual code | Documented surface | Bedrock 26.45 binding | Status |
|---|---|---|---|---|
| `system.runInterval` | `src/bedrock/runtime.ts` | Yes | Not established | NOT VERIFIED |
| `Dimension.getEntities` | `src/bedrock/runtime.ts` | Yes | Not established | NOT VERIFIED |
| `Entity.applyDamage` | `src/bedrock/runtime.ts` | Yes | Not established | NOT VERIFIED |
| `Entity.applyImpulse` | `src/bedrock/runtime.ts` | Yes | Not established | NOT VERIFIED |
| `@minecraft/server` `2.9.0` | `package.json` | Package version exists | Exact 26.45 binding not established | NOT VERIFIED |

## 8. ACTUAL CODE PATHS

### Work path
`request -> BoundedPriorityScheduler.enqueue -> capacity/dedup -> BoundedPriorityScheduler.drain -> handler`

### Far-view path
`distance -> FarViewCore.classifyChunkDistance -> detail + independent simulationAllowed flag`

### Playability path
`gameplay class -> PlayabilityShield.isProtected -> priorityFor/shouldDegrade`

### Combat path
`WeaponDefinition -> BaseAdapter.toAttackRequest -> UniversalAttackAPI.execute -> target validation -> cooldown validation -> CriticalResolver -> DamageResolver -> KnockbackResolver -> CombatExecutionPort -> CombatResult`

### Runtime path
`src/main.ts -> installRuntimeHeartbeat -> governor pressure sample -> bounded scheduler drain`

## 9. BUILD / TEST COMMANDS

Configured commands:

```text
npm run build
npm test
npm run check
```

CI workflow command sequence:

```text
npm install --ignore-scripts
npm run check
```

Actual command output available from this environment:
- GitHub repository network clone/build: FAILED before execution because outbound DNS/network access is unavailable in the container.
- GitHub Actions workflow runs: `0` for `main` at inspection time.

Therefore:
BUILD STATUS: NOT VERIFIED
TEST STATUS: NOT VERIFIED

No invented compiler/test output is recorded here.

## 10. ACTUAL TEST OUTPUT

No actual `npm run build`, `npm test`, or `npm run check` output was produced by the connected environment.

Result:
`NOT VERIFIED`

A local container attempt to clone the public repository failed at network resolution (`Could not resolve host: github.com`) before any source build or test command could run. This is an environment limitation, not a code-pass claim.

## 11. RUNTIME EVIDENCE

No Minecraft Bedrock 26.45 runtime session, world log, Script API console output, or captured execution evidence is present.

RUNTIME STATUS: `NOT VERIFIED`

## 12. PERFORMANCE EVIDENCE

Implemented deterministic bounds exist in source:
- work queue max: 256;
- per-window execution max: 32;
- far-view tracked-chunk max: 256 by default;
- cooldown state max: 4096 entries by default.

These are implementation ceilings, not measured performance results.

No FPS, tick-time, memory, thermal, entity-load, or queue-latency measurement was executed.

PERFORMANCE STATUS: `NOT VERIFIED`

## 13. VISUAL / MOBILE EVIDENCE

Visual 100-chunk rendering was not demonstrated.
Mobile device/runtime testing was not performed.

VISUAL STATUS: `NOT VERIFIED`
MOBILE STATUS: `NOT VERIFIED`

## 14. KNOWN LIMITATIONS

1. No `manifest.json` was created, so this phase does not constitute a distributable `.mcaddon`.
2. Exact `@minecraft/server` 2.9.0 compatibility with Bedrock 26.45 is not proven.
3. Runtime APIs are capability-gated but not runtime-verified.
4. `BedrockCombatPort.resolveEntity` uses `Dimension.getEntities()` during a combat lookup; this is not a global every-tick loop, but it is not yet an optimized spatial lookup and therefore cannot receive a performance PASS.
5. The universal combat pipeline performs explicit domain critical/damage/knockback logic, but it does not establish exact Java semantics for all armor, resistance, cooldown, movement-state, durability, loot, XP, status-effect, AI, or world-mechanic cases.
6. No event subscriptions for the full requested gameplay event surface are claimed.
7. No 100-real-chunk renderer is implemented or claimed.

## 15. NOT IMPLEMENTED

The following specification areas are not fully implemented in Phase 3 and must not be inferred from the architecture document:

- complete Java-like gameplay core (movement, item, block, interaction, AI, loot, XP, status, physics-like rules, world mechanics, redstone compatibility);
- complete projectile pipeline and collision implementation;
- full event-driven integration for all gameplay events;
- true 100-chunk engine rendering;
- full performance implementation/tuning phase;
- far-view runtime tests;
- combat/weapon parity tests;
- stress tests;
- mobile tests;
- long-runtime tests;
- final validation/release packaging.

## 16. NOT VERIFIED

- exact Bedrock 26.45 <-> `@minecraft/server` 2.9.0 binding;
- Minecraft Bedrock 26.45 runtime behavior;
- build/test execution in a connected CI runner;
- runtime combat behavior;
- measured performance;
- visual range behavior;
- mobile stability/thermal behavior;
- Java parity;
- 100 real rendered chunks.

## 17. BLOCKERS

### BLOCKER-01 — Target runtime evidence
No Bedrock 26.45 runtime environment is connected, so runtime PASS is impossible.

### BLOCKER-02 — Exact API binding
The dependency declaration is explicit but the exact Bedrock 26.45 product binding is not independently established.

### BLOCKER-03 — Distributable addon packaging
No manifest is created because the target runtime/version contract has not been established strongly enough to avoid guessing a product-version manifest requirement.

### BLOCKER-04 — Full parity
Full Java-like parity requires category-specific parity evidence and cannot be inferred from shared resolver structure.

## 18. FINAL STATUS

Implementation state: `PARTIAL`

Reason:
- real source implementation exists in GitHub;
- the Universal Attack API has a real single convergence point;
- bounded scheduling, far-view classification, playability policy and governor logic exist as executable source;
- however, build/test/runtime/performance/visual/mobile/parity evidence is absent and several required systems are explicitly not implemented.

Final verdict:
`PARTIAL / NOT VERIFIED`

This file is the single authoritative Phase 3 evidence package. It is not itself proof of runtime behavior; the GitHub source tree and executed test/runtime evidence remain the proof.
