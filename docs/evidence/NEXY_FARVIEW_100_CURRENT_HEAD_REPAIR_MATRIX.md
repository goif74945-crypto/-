# NEXY_FARVIEW_100 — REPAIR / EVIDENCE MATRIX

## Identity

- Repository: `goif74945-crypto/-`
- Branch: `main`
- Evidence anchor: this exact HEAD after the latest verification-classification repair
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
- Reclassified as static source-wiring verification, not live production-path verification.
- Verifies observer installation, registered-weapon guard, canonical resolver call, observer API, and fail-safe commit shape.
- The test itself cannot prove a live Bedrock 26.45 execution path.

### `docs/evidence/NEXY_FARVIEW_100_EXTERNAL_RUNTIME_TEST.md`
- Exact reproducible Bedrock 26.45 runtime, performance, multiplayer, and parity test procedure.

## Evidence matrix

| ID | TYPE | REQUIREMENT | CODE LOCATION | TEST / EVIDENCE | VERDICT |
|---|---|---|---|---|---|
| REP-01 | STATIC | Adapter validation precedes registry mutation | `src/core/combat.ts` `UniversalAttackAPI.executeAdapter` | Current source inspection | PASS |
| REP-02 | UNIT | Invalid adapter cannot mutate registry | `tests/transaction-boundary.test.ts` | CI current HEAD | PASS |
| REP-03 | UNIT | Target rejection rolls back newly registered definition | `tests/transaction-boundary.test.ts` | CI current HEAD | PASS |
| REP-04 | UNIT | Commit rejection rolls back newly registered definition | `tests/transaction-boundary.test.ts` | CI current HEAD | PASS |
| REP-05 | UNIT | Conflicting definition cannot overwrite existing weapon | `tests/transaction-boundary.test.ts` | CI current HEAD | PASS |
| REP-06 | STATIC SOURCE WIRING | Runtime observer is wired in source and guarded by registered weapon state | `src/main.ts`, `src/bedrock/runtime.ts` | `tests/production-path-wiring.test.ts` | PASS (STATIC ONLY) |
| REP-07 | STATIC | No static blocker detected | `tools/static-blocker-check.mjs` | CI exact current HEAD | PASS |
| REP-08 | BUILD / TYPECHECK | Production source compiles | repository build | CI exact current HEAD `tsc -p tsconfig.json` | PASS |
| REP-09 | UNIT | Full compiled test suite passes | `tests/*.test.ts` | CI exact current HEAD | PASS |
| REP-10 | BUILD / PACKAGE | Add-on packaging and archive integrity | `tools/package-addon.mjs` | CI exact current HEAD | PASS |
| REP-11 | API CONFIGURATION | `@minecraft/server` dependency pinned to 2.9.0 and manifest target is 26.45 | `package.json`, `addon/manifest.json` | Repository inspection + Microsoft documentation | PASS (CONFIG ONLY) |
| REP-12 | API RUNTIME | Exact live Bedrock 26.45 binding/behavior | `src/bedrock/runtime.ts` | No live target runtime in CI | NOT VERIFIED |
| REP-13 | RUNTIME | Actual add-on execution in Bedrock 26.45 | `addon/` | No real Bedrock execution | NOT VERIFIED |
| REP-14 | FAR VIEW | 100 unique logical target generation | `src/core/far-view.ts` | Spatial generator tests | PASS (LOGICAL ONLY) |
| REP-15 | FAR VIEW ENGINE | 100 engine-loaded chunks | Bedrock engine | No engine runtime evidence | NOT VERIFIED |
| REP-16 | FAR VIEW CLIENT | 100 client-rendered chunks | Bedrock client | No client-render evidence | NOT VERIFIED |
| REP-17 | PERFORMANCE | FPS/TPS/RAM/CPU/thermal behavior | runtime/device | No measured target-device telemetry | NOT VERIFIED |
| REP-18 | MULTIPLAYER | Multiplayer synchronization and gameplay integrity | Bedrock multiplayer runtime | No multiplayer execution evidence | NOT VERIFIED |
| REP-19 | PARITY | Full Java-like combat parity | combat/runtime | No authoritative Java-vs-Bedrock runtime parity evidence | NOT VERIFIED |
| REP-20 | TRANSACTION | Full multi-stage Bedrock world-state rollback | runtime commit | `BedrockCombatPort.commit()` remains fail-safe and unimplemented for full side effects | NOT VERIFIED / BLOCKED FOR RUNTIME |

## Runtime safety boundary

The runtime observer consumes after-event observations only. Microsoft documents `EntityHurtAfterEvent` as an event describing damage that has already occurred; therefore it is not a valid substitute for authoritative pre-damage control. The current implementation intentionally does not synthesize weapon definitions from those observations and does not apply a second damage mutation. citeturn161409search2turn161409search1

Microsoft also documents `Entity.applyDamage()` as unavailable in restricted-execution mode, while the before-hurt callback runs with restricted-execution privilege. Therefore a direct `beforeEvents.entityHurt -> applyDamage()` implementation would require a different execution design; it must not be fabricated into the current path. citeturn161409search3turn161409search5

The current source therefore stops the full runtime combat transaction at the fail-safe commit boundary rather than claiming completed runtime damage/effects/durability/death/loot/XP behavior.

## Current CI evidence

- Current HEAD: `1da8dc4c603913acf709d1861aba3fd879148195`
- Workflow: `core-check`
- Run: `#107` (`34553076158`) — `success`
- Exact run HEAD: `1da8dc4c603913acf709d1861aba3fd879148195`
- CI job completed: checkout, Node 22 setup, `npm install --ignore-scripts`, `npm run check`, `npm run check:addon`, artifact upload.
- Add-on artifact SHA-256: `cbc618f67d20a3cb84c7f888e78fe89675b19905b297181ce0deb2835b245f50`

## External-proof boundary

The CI environment cannot launch Minecraft Bedrock 26.45 or measure client rendering, device performance, multiplayer synchronization, or runtime Java parity. These remain `NOT VERIFIED` and are not promoted from source/build/unit/CI evidence.

## Final state

- Local repairable transaction defect: REPAIRED.
- Runtime observer source wiring: STATICALLY VERIFIED and guarded against synthesized weapon definitions.
- Static/build/unit/package evidence: PASS at exact CI-verified HEAD.
- Live Bedrock API binding: NOT VERIFIED.
- Full runtime combat transaction: BLOCKED / NOT VERIFIED because authoritative external runtime evidence is unavailable.
- Far-view engine/client rendering: NOT VERIFIED.
- Performance telemetry: NOT VERIFIED.
- Multiplayer: NOT VERIFIED.
- Java-like runtime parity: NOT VERIFIED.
- Full project contract: INCOMPLETE.
