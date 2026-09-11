# NEXY_FARVIEW_100 — REPAIR / EVIDENCE MATRIX

## Identity

- Repository: `goif74945-crypto/-`
- Branch: `main`
- Final evidence anchor: this exact HEAD after the last documentation commit
- Target: Minecraft Bedrock 26.45 ONLY
- Historical reports are claims unless independently revalidated.

## Repairs

### `src/core/combat.ts`
- Request validation occurs before registry mutation.
- Invalid adapter requests cannot enter registry state.
- Conflicting definitions cannot overwrite existing definitions.
- Newly registered adapter definitions are rolled back when execution rejects.
- Weapon-definition equality is strict and type-safe.

### `src/main.ts`
- Installed the runtime combat observer on the canonical `UniversalAttackAPI` path.
- Guarded observer execution so an `afterEvents` observation cannot synthesize and authorize a new weapon definition.
- No after-event path directly applies a second damage action.

### `tests/transaction-boundary.test.ts`
- Invalid request before mutation.
- Target rejection rollback.
- Commit rejection rollback.
- Conflicting definition protection.

### `tests/production-path-wiring.test.ts`
- Verifies the runtime observer is installed by `src/main.ts`.
- Verifies the runtime observer reaches the canonical resolver call.
- Verifies the runtime module exposes the observer installation hook.

### `docs/evidence/NEXY_FARVIEW_100_EXTERNAL_RUNTIME_TEST.md`
- Exact reproducible Bedrock 26.45 runtime, performance, multiplayer, and parity test procedure.

## Evidence matrix

| ID | TYPE | REQUIREMENT | CODE LOCATION | TEST / EVIDENCE | VERDICT |
|---|---|---|---|---|---|
| REP-01 | STATIC | Adapter validation precedes registry mutation | `src/core/combat.ts` `UniversalAttackAPI.executeAdapter` | Current source inspection | PASS |
| REP-02 | UNIT | Invalid adapter cannot mutate registry | `tests/transaction-boundary.test.ts` | CI test 32 | PASS |
| REP-03 | UNIT | Target rejection rolls back newly registered definition | `tests/transaction-boundary.test.ts` | CI test 33 | PASS |
| REP-04 | UNIT | Commit rejection rolls back newly registered definition | `tests/transaction-boundary.test.ts` | CI test 34 | PASS |
| REP-05 | UNIT | Conflicting definition cannot overwrite existing weapon | `tests/transaction-boundary.test.ts` | CI test 35 | PASS |
| REP-06 | PRODUCTION PATH | Runtime installs canonical combat observer | `src/main.ts`, `src/bedrock/runtime.ts` | `tests/production-path-wiring.test.ts` | PASS |
| REP-07 | STATIC | No static blocker detected | `tools/static-blocker-check.mjs` | CI current HEAD | PASS |
| REP-08 | BUILD / TYPECHECK | Production source compiles | repository build | CI current HEAD `tsc -p tsconfig.json` | PASS |
| REP-09 | UNIT | Full compiled test suite passes | `tests/*.test.ts` | CI current HEAD | PASS |
| REP-10 | BUILD / PACKAGE | Add-on packaging and archive integrity | `tools/package-addon.mjs` | CI current HEAD | PASS |
| REP-11 | API | `@minecraft/server` dependency pinned to 2.9.0 | `package.json`, `addon/manifest.json` | Repository inspection + Microsoft documentation | PASS |
| REP-12 | API RUNTIME | Exact live Bedrock 26.45 binding/behavior | `src/bedrock/runtime.ts` | No live target runtime in CI | NOT VERIFIED |
| REP-13 | RUNTIME | Actual add-on execution in Bedrock 26.45 | `addon/` | No real Bedrock execution | NOT VERIFIED |
| REP-14 | FAR VIEW | 100 unique logical target generation | `src/core/far-view.ts` | Spatial generator tests | PASS |
| REP-15 | FAR VIEW ENGINE | 100 engine-loaded chunks | Bedrock engine | No engine runtime evidence | NOT VERIFIED |
| REP-16 | FAR VIEW CLIENT | 100 client-rendered chunks | Bedrock client | No client-render evidence | NOT VERIFIED |
| REP-17 | PERFORMANCE | FPS/TPS/RAM/CPU/thermal behavior | runtime/device | No measured target-device telemetry | NOT VERIFIED |
| REP-18 | MULTIPLAYER | Multiplayer synchronization and gameplay integrity | Bedrock multiplayer runtime | No multiplayer execution evidence | NOT VERIFIED |
| REP-19 | PARITY | Full Java-like combat parity | combat/runtime | No authoritative Java-vs-Bedrock runtime parity evidence | NOT VERIFIED |
| REP-20 | TRANSACTION | Full multi-stage Bedrock world-state rollback | runtime commit | `BedrockCombatPort.commit()` remains fail-safe and unimplemented for full side effects | NOT VERIFIED |

## Runtime safety boundary

The runtime observer consumes after-event observations only. Those events occur after the hurt action, so this path cannot safely become the authoritative pre-damage controller. `BedrockCombatPort.commit()` therefore remains fail-safe instead of applying a second damage mutation.

The current source does not synthesize canonical weapon definitions from observations. A full authoritative runtime damage path requires target-version before-event control plus an authoritative weapon catalogue and validated stage semantics; those inputs are not present in the locked repository specification.

## Current CI evidence

- Latest verified production/test source tree before evidence-only changes: `a82134e8f55d7a55765d7829fd3bbbff368caa70`
- CI workflow: `core-check`
- Earlier exact source verification: run #104, `4fa6560d6a1c80900f8e2ec7c8d29b86afa78d7f`, PASS.
- The current evidence-only commit is expected to receive its own CI run; PASS requires an exact current-head completion.

## External-proof boundary

The CI environment cannot launch Minecraft Bedrock 26.45 or measure client rendering, device performance, multiplayer synchronization, or runtime Java parity. These remain `NOT VERIFIED` and are not promoted from source/build/unit/CI evidence.

## Final state

- Local repairable transaction defect: REPAIRED.
- Runtime observer production wiring: REPAIRED and guarded against synthesized weapon definitions.
- Static/build/unit/package evidence: PASS when tied to the exact CI-verified source tree.
- Full project contract: INCOMPLETE until the required live Bedrock runtime, engine/client rendering, performance, multiplayer, and parity evidence exists.
