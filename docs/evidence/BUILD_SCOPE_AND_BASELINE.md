# NEXY_FARVIEW_100 — BUILD SCOPE AND BASELINE

Status: BASELINE LOCKED
Target repository: `goif74945-crypto/-`
Target branch: `main`
Baseline commit before this file: `5b3304a633ae12e8e380275c17c6718bbdc31064`
Target platform: Minecraft Bedrock 26.45 ONLY

## 1. Repository Baseline

Repository identity and default branch were verified directly against GitHub.
Write permission is available for this repository.

Current tree before this baseline write:
- `README.md`
- `docs/evidence/PHASE_0_1_AUDIT.md`

No source implementation, manifest, package configuration, dependency file, test suite, or addon runtime implementation was observed in the repository tree at baseline.

Existing evidence is treated as a claim set and was independently inspected; it is not accepted as proof merely because it exists.

## 2. Authoritative Specification

Authoritative design source:
`NEXY_FARVIEW_100 — ข้อมูลการออกแบบฉบับรวม`

Library source file:
`ข้อมูลการออกแบบ+%20การโจมตีแบบจ้าว้าเปิดAPI%20ให้อาวุธอื่นๆเป็นเหมื่อนกัน.txt`

The source explicitly locks Bedrock 26.45, the FAR VIEW / PERFORMANCE / PLAYABILITY / JAVA-LIKE architecture, the universal combat pipeline, the evidence gate, and the hard locks. See source lines 10-30, 33-91, 97-112, 115-179, 182-242, 245-355, 357-429, 432-495, 497-595, and 598-685.

The implementation command supplied for this build is subordinate to that specification and may further constrain execution but may not remove requirements.

## 3. Locked Requirements

### Far View
- 0–8 chunks: full gameplay/full detail.
- 8–16: high detail.
- 16–32: medium detail.
- 32–64: low detail.
- 64–100: far/minimal overhead.
- 100 chunks is a design target only.
- Visual distance is not simulation distance.
- No fake 100-real-chunk rendering claim.
- No full 100-chunk simulation.
- No 100-chunk every-tick scan.
- Chunk lifecycle: UNKNOWN -> DISCOVERED -> VISIBLE -> FAR -> RELEASED.

### Performance
- Duplicate work elimination.
- Tick work elimination.
- Distance-based work scaling.
- Scheduler and bounded work budget.
- Entity load balancing.
- Effect suppression.
- Event-driven processing.
- Work deduplication/coalescing.
- Burst protection.
- Bounded queue/cache/task state.
- Adaptive performance governor.
- Gameplay-critical work has higher priority than far/cosmetic work.

### Playability Shield
Protect movement, input, camera, combat timing, inventory, item use, block interaction, breaking/placing, nearby entities, projectiles, bosses, PVP, important events, gameplay-critical mechanics, and required redstone compatibility.

Gameplay correctness outranks cosmetic optimization.

### Java-like Gameplay
Native Bedrock behavior first.
Required conceptual flow:
JAVA BEHAVIOR -> BEHAVIOR SPECIFICATION -> BEDROCK API CAPABILITY AUDIT -> BEDROCK IMPLEMENTATION -> PARITY TEST -> RESULT.

No direct Java source port, whole-game scripted physics simulation, global entity scan every tick, global block scan every tick, or unnecessary tick loop.

### Universal Attack API
ONE COMBAT PIPELINE, MANY WEAPONS.

Weapon -> Adapter -> Attack Request -> Universal Attack API -> Validation -> Combat/Damage -> Critical/Knockback/Effect -> Durability -> Death/Loot/XP -> Result.

Required attack types: MELEE, HEAVY_MELEE, THRUST, SWEEP, RANGED, PROJECTILE, SPECIAL.

Required adapters: SwordAdapter, AxeAdapter, SpearAdapter, BowAdapter, CustomWeaponAdapter.

Weapon-specific code must not duplicate the combat pipeline.

### Evidence
Every claim requires INPUT, EXPECTED, ACTUAL, EVIDENCE, STATUS.
Statuses are PASS, FAIL, PARTIAL, NOT VERIFIED, UNKNOWN.

Runtime PASS requires runtime evidence.
Performance PASS requires measurable evidence.
Visual PASS requires visual evidence.
Mobile PASS requires mobile evidence.
Parity PASS requires parity evidence.
API PASS requires capability evidence.

NO EVIDENCE = NOT VERIFIED.

## 4. Excluded Scope

- UI as part of the Java-like gameplay core.
- Any unsupported or speculative engine/API capability.
- Guaranteed 100 real rendered chunks unless engine-level evidence proves it.
- Full 100-chunk simulation.
- Global entity/block scans every tick.
- Fake API or fake PASS.
- Any repository other than `goif74945-crypto/-`.
- Any branch other than `main`.

## 5. API Assumptions Requiring Verification

The following are NOT treated as verified merely from documentation or previous reports:

1. Exact `@minecraft/server` module version required for Bedrock 26.45.
2. Runtime behavior of every selected Script API on Bedrock 26.45.
3. Ability to produce 100 real rendered chunks through supported Add-on APIs.
4. Exact Java combat parity for critical hits, cooldown, armor/protection/resistance, knockback, loot, XP, AI, world mechanics, and redstone-related behavior.
5. Mobile performance and thermal behavior.
6. Runtime visual far-view behavior.

Current decision: these remain NOT VERIFIED until direct evidence exists.

## 6. Known Unknowns / Blockers

- No addon implementation exists in the repository at baseline.
- No manifest exists at baseline.
- No dependency declaration exists at baseline.
- No automated or runtime test suite exists at baseline.
- Exact 26.45-to-Script-API version binding is not directly established.
- 100 real rendered chunks is not established as a supported Add-on capability.
- Full Java parity is not established.
- Runtime, performance, visual, mobile, and parity evidence does not yet exist.

These are not silently converted to PASS.

## 7. Exact Files Expected To Be Created/Modified

At this controlled-build baseline, no implementation files are authorized yet.

Expected implementation paths are UNAUTHORIZED until Phase 2 architecture and capability decisions establish exact paths. This prevents invented file structure from becoming an implicit requirement.

Authorized evidence paths:
- `docs/evidence/BUILD_SCOPE_AND_BASELINE.md`
- existing `docs/evidence/PHASE_0_1_AUDIT.md` may be read but is not treated as implementation proof.
- later phases may create `docs/evidence/IMPLEMENTATION_REPORT.md` and `docs/evidence/FINAL_BUILD_REPORT.md` only when their required phase gates are reached.

## 8. Authorized Phase

Current authorized phase: PHASE 2 — Architecture, restricted to capabilities that have a verified implementation basis.

PHASE 0 and PHASE 1 are already documented in the repository, but Phase 1 is PARTIAL. Therefore Phase 2 must not implement or claim unsupported/unverified capabilities.

Phase order is immutable:
0 Specification Lock
1 API Capability Audit
2 Architecture
3 Core Implementation
4 Performance Implementation
5 Far View Tests
6 Combat/Weapon Parity Tests
7 Stress Tests
8 Mobile Tests
9 Long Runtime
10 Final Validation

No final completion claim is authorized before Phase 10.

## 9. Acceptance Criteria

A phase or feature is accepted only when its required evidence exists and the status is supported by actual repository/runtime evidence.

Minimum acceptance rules:
- repository and branch remain exactly locked;
- no unrelated files are modified;
- no requirement is removed or silently weakened;
- API-dependent code uses only verified API surfaces;
- unsupported/unknown capabilities remain FREEZE / NOT VERIFIED;
- all bounded work limits are explicit and inspectable;
- gameplay priority is preserved;
- universal combat logic is centralized;
- every implementation claim is traceable to an actual file and symbol;
- every PASS has evidence appropriate to its category.

## 10. Baseline Integrity

This baseline describes the actual repository state observed immediately before this file was created. It does not claim that the project is implemented or tested.

Baseline reference commit: `5b3304a633ae12e8e380275c17c6718bbdc31064`

The commit created by this baseline write must be used as the new baseline head for subsequent controlled changes.
