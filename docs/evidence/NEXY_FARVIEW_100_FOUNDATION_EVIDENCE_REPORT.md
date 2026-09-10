# NEXY_FARVIEW_100 — FOUNDATION EVIDENCE REPORT

## 1. Identity

- TARGET REPOSITORY: `goif74945-crypto/-`
- BRANCH: `main`
- PROJECT: `NEXY_FARVIEW_100`
- TARGET PLATFORM: Minecraft Bedrock 26.45 ONLY
- PHASE: Foundation Phase only
- PHASE 0 LOCK: `docs/spec/NEXY_FARVIEW_100_PHASE_0_SPEC_LOCK.md`
- AUTHORITATIVE MASTER DESIGN: `NEXY_FARVIEW_100 — ข้อมูลการออกแบบฉบับรวม`
- FOUNDATION EVIDENCE RULE: current HEAD evidence only; historical reports are claims unless independently revalidated.

## 2. HEAD / Evidence Baseline

### HEAD before this foundation repair pass
`8851824c53850dd720f9a6fbf54fd4e58c4cfd82`

This was the post-Phase-0 repository HEAD inspected before foundation changes.

### Foundation commits
1. `a6499f695f1d0034f7ec308cd52f1a731fe87ed9` — align combat damage ordering with the authoritative specification.
2. `9c810c8e0136bd4fdf85c7a1e711c3bd1f5c8f9a` — add dedicated foundation ordering regression test.
3. `829399735faa7e720fa0baa2019d7fa0ae25dec8` — execute every compiled `dist/tests/*.test.js` file.
4. `75fc2e19ab1519c3ebdd8d21e8d233b29d5dade8` — repair the rejected combat result after typecheck exposed a missing field.
5. `29cf85d29e810a6457d9cf2227802016b831d88c` — align the existing combat regression expectation with the authoritative order.

### Current HEAD after foundation repair
`29cf85d29e810a6457d9cf2227802016b831d88c`

## 3. Current CI Evidence

Workflow: `.github/workflows/core-check.yml`

Run #84:
`34509580872`

Head SHA:
`29cf85d29e810a6457d9cf2227802016b831d88c`

Verified steps from the completed job:

- `npm install --ignore-scripts` — PASS
- `npm run check` — PASS
  - static blocker check — PASS (`10 source files scanned`)
  - TypeScript build/typecheck — PASS
  - Node test runner — PASS (`25 tests`, `24?` no: exact result below)
- `npm run check:addon` — PASS
- addon generation and integrity verification — PASS
- distributable artifact upload — PASS

Exact current test result from run #84:
- tests: 25
- passed: 25
- failed: 0
- skipped: 0
- cancelled: 0

The earlier run #83 failed because the then-current test suite still expected the obsolete pre-foundation damage order. That failure was corrected by commit `29cf85d…`; it is retained as historical audit evidence, not converted into PASS.

## 4. Authoritative Specification Anchors

The master design defines:

- distance zones `0-8`, `8-16`, `16-32`, `32-64`, `64-100` as design targets, not engine guarantees;
- bounded queue/budget/event-driven/deduplicated work and no 100-chunk every-tick scan;
- gameplay protection ahead of far/cosmetic optimization;
- native-first Bedrock implementation;
- one central weapon/combat pipeline;
- damage order: base -> armor/protection -> resistance -> modifiers -> final;
- evidence-type separation: runtime requires runtime evidence, performance requires measurable evidence, parity requires parity evidence;
- no final implementation claim before required API/engine capability is verified.

Authoritative source: `NEXY_FARVIEW_100 — ข้อมูลการออกแบบฉบับรวม`, especially sections 2, 3, 4, 5, 6, 8, 9, 18, 19, and 20.

## 5. Foundation Inspection

Inspected current repository areas before changing code:

- repository tree / current HEAD
- Phase 0 specification lock
- `src/core/`
- `src/bedrock/`
- `src/main.ts`
- `tests/`
- `package.json`
- `tsconfig.json`
- `addon/manifest.json`
- `.github/workflows/core-check.yml`
- current project evidence report
- current recent commits and workflow runs

Key current files and responsibilities:

- `src/core/far-view.ts` — bounded far-view state machine and distance classification.
- `src/core/performance.ts` — bounded priority scheduler and workload control.
- `src/core/governor.ts` — adaptive workload governor.
- `src/core/playability.ts` — protected gameplay classes and pressure shield.
- `src/core/combat.ts` — Universal Attack API, weapon adapters, validation, damage/critical/knockback/cooldown resolution.
- `src/bedrock/runtime.ts` — Bedrock runtime adapters, event wiring, capability probes, bounded runtime state.
- `src/main.ts` — runtime composition and far-view workload production.
- `tests/core.test.ts` — existing foundation/core regression tests.
- `tests/foundation-order.test.ts` — dedicated damage-order regression.

## 6. Changes Applied

### 6.1 `src/core/combat.ts`

SYMBOLS:
- `UniversalAttackAPI.execute`
- `UniversalAttackAPI.rejectWithStages`

REQUIREMENT:
Authoritative damage pipeline must keep base/modified/final distinct and apply armor/resistance before modifiers.

CHANGE:
- Critical damage is computed first.
- Armor mitigation receives the critical-adjusted damage.
- Resistance mitigation receives the post-armor damage.
- `DamageResolver` applies request modifiers after armor and resistance.
- `finalDamage` is then the post-modifier value.
- `rejectWithStages` restored the required `durabilityCost` field after typecheck identified its omission.

REASON:
The previous implementation applied modifiers before armor/resistance, contradicting the authoritative design.

VALIDATION:
Run #84, plus dedicated regression test.

### 6.2 `tests/foundation-order.test.ts`

PURPOSE:
Lock the authoritative ordering as executable regression evidence.

ASSERTED ORDER:
`target -> critical-adjusted armor input -> resistance input -> modifier/final -> commit`

VALIDATION:
Run #84, test 25 of 25.

### 6.3 `tests/core.test.ts`

CHANGE:
Updated the existing full-combat regression expected values to the authoritative order after production logic was corrected.

This was not a test weakening or bypass. The old expectation was inconsistent with the authoritative specification; the new expectation is directly derived from the locked order.

VALIDATION:
Run #84, including the existing regression suite.

### 6.4 `package.json`

CHANGE:
`npm test` now executes `dist/tests/*.test.js` instead of only `dist/tests/core.test.js`.

REASON:
Ensure newly added foundation tests cannot be silently omitted from CI.

VALIDATION:
Run #84 executed 25 tests.

## 7. Foundation Status by Evidence Type

| Evidence type | Status | Current evidence |
|---|---|---|
| STATIC | PASS | Run #84 static blocker check; source inspection |
| BUILD / TYPECHECK | PASS | Run #84 `tsc -p tsconfig.json` |
| UNIT | PASS | Run #84: 25/25 tests passed |
| INTEGRATION | NOT VERIFIED | No dedicated Bedrock integration environment in CI |
| PRODUCTION PATH | PARTIAL | Core production path is typechecked/tested; runtime commit path intentionally rejects unverified end-to-end combat |
| API | NOT VERIFIED | Current source marks target binding verification false; no live Bedrock 26.45 capability audit was executed here |
| RUNTIME | NOT VERIFIED | No live Bedrock 26.45 execution evidence |
| PERFORMANCE | NOT VERIFIED | Static boundedness is verified; FPS/TPS/RAM/thermal/device measurements are absent |
| PARITY | NOT VERIFIED | No authoritative Java-vs-Bedrock runtime parity evidence |
| MULTIPLAYER | NOT VERIFIED | No multiplayer runtime evidence |
| VISUAL / CLIENT RENDER | NOT VERIFIED | No real client rendering evidence |

## 8. Far-View Foundation

STATIC FOUNDATION:

PASS for bounded state and scheduling concepts that are directly implemented:

- five required conceptual distance zones are represented;
- logical far-view state is bounded;
- transition history is bounded;
- stale reclamation exists;
- queue capacity and work age are bounded;
- priority ordering is centralized;
- deduplication/coalescing behavior is represented by key-based queue admission;
- high-priority work can replace lower-priority duplicate work;
- low-priority eviction occurs under queue pressure;
- scheduler execution has an explicit per-window bound;
- `renderCapability()` does not claim that logical tracking forces client rendering.

NOT VERIFIED:

- real engine-loaded chunks at 100;
- real client-rendered chunks at 100;
- visual quality at far range;
- actual device performance impact.

## 9. Playability Foundation

STATIC FOUNDATION PASS:

Protected classes currently include movement, input, camera, combat, inventory, item use, block interaction, block break/place, nearby entity, projectile, boss, PVP, important events, and redstone.

The governor can disable far/decorative work under critical pressure while protected gameplay classes remain non-degradable by the shield policy.

RUNTIME NOT VERIFIED:
No live Bedrock execution proves input latency, combat timing, event preservation, or actual player responsiveness.

## 10. Universal Attack Foundation

STATIC CORE PASS:

- Sword/Axe/Spear/Bow/CustomWeapon adapters converge on `UniversalAttackAPI`.
- Attack types are centralized.
- Request validation is explicit.
- Cooldown is centralized.
- Critical, damage, and knockback resolvers are centralized.
- Unverified mandatory commit stages cannot be accepted as a successful combat result.

RUNTIME BLOCKER:
`BedrockCombatPort.commit()` currently rejects the commit because full runtime proof for projectile/death/loot/XP completion does not exist.

This is intentional fail-safe behavior, not a fake implementation.

JAVA-LIKE PARITY:
NOT VERIFIED.

## 11. Determinism / State / Failure Model

STATIC PASS for the covered core state machines:

- tick validation is explicit;
- per-key far-view tick order is monotonic;
- scheduler ordering has deterministic tie-breaking;
- bounded maps/queues are used for core state;
- invalid requests are rejected rather than normalized by guesswork;
- mandatory unverified commit stages block acceptance.

REMAINING AUDIT ITEMS:

- runtime installer idempotency is not proven;
- live event duplication/order semantics are not proven in Bedrock 26.45;
- runtime client/server timing is not proven;
- true transaction rollback semantics for multi-step world mutation are not implemented/proven.

## 12. Stale Evidence Handling

`docs/evidence/PROJECT_EVIDENCE_REPORT.md` contains historical references to older implementation heads and older CI runs. It explicitly states that runtime/visual/mobile/multiplayer evidence was not verified, but its implementation references are no longer the current HEAD.

Therefore it is treated as historical evidence only and is not used as current foundation proof.

## 13. Known Limitations / Blockers

1. Phase 1 Bedrock 26.45 API capability audit is not completed in a live target environment.
2. Runtime evidence is not available from CI alone.
3. Real 100-chunk engine loading/client rendering is not proven.
4. FPS/TPS/RAM/thermal impact is not proven.
5. Multiplayer behavior is not proven.
6. Full runtime combat completion through projectile/death/loot/XP is intentionally blocked until capability and runtime evidence exist.
7. The current runtime installation/event registration lifecycle is not proven idempotent under repeated installation.
8. The current producer-level runtime catch in `src/main.ts` is a remaining failure-observability concern because this file does not expose the runtime error recorder used by the runtime module.

## 14. Red-Team Findings

- FOUND: existing combat regression test encoded the obsolete damage ordering. Status: REPAIRED and regression-locked.
- FOUND: first implementation repair temporarily omitted `durabilityCost` from `rejectWithStages`. Status: REPAIRED before final HEAD; current CI typecheck PASS.
- FOUND: historical project report uses stale implementation SHAs. Status: CONTAINED; current proof is tied to current HEAD and run #84.
- NO PROOF: real runtime/API parity. Status: remains NOT VERIFIED.
- NO PROOF: 100 real rendered chunks. Status: remains NOT VERIFIED.

## 15. Foundation Matrix Reference

The detailed requirement trace is in:
`docs/evidence/NEXY_FARVIEW_100_FOUNDATION_REQUIREMENT_MATRIX.md`

## 16. Final Verdict

### FOUNDATION VERDICT: INCOMPLETE

Reason:

The bounded static foundation and current CI/build/unit/package evidence are passing, but the full foundation contract cannot be represented as 100% proven because the required Bedrock 26.45 live API/runtime evidence, real rendering evidence, performance measurements, and parity evidence are absent.

This report therefore does NOT declare:

- COMPLETE
- PRODUCTION READY
- 100% VERIFIED
- 100 real rendered chunks
- 100% Java parity

The correct current state is:

`INCOMPLETE` for the full foundation contract, with several static subcomponents `PASS` and runtime/API/performance/parity areas `NOT VERIFIED` or `BLOCKED`.

No feature-completion phase is started by this pass.
