# NEXY_FARVIEW_100 — CURRENT HEAD REPAIR / EVIDENCE MATRIX

## Current identity

- Repository: `goif74945-crypto/-`
- Branch: `main`
- Current HEAD: `496bc2dccd2585aad0c1615896504b6b0e84f118`
- Target: Minecraft Bedrock 26.45 ONLY
- Evidence rule: this file is valid only for the exact HEAD above.
- Historical reports are not inherited as current proof.

## Repair performed in this pass

### `src/core/combat.ts`

- Adapter requests are validated before any registry mutation.
- A conflicting adapter definition cannot overwrite an existing weapon definition.
- A newly registered adapter is removed when the execution is rejected.
- Registry rollback is deterministic for target rejection and commit rejection.
- Equality checks for weapon definitions are type-safe under strict TypeScript checking.

### `tests/transaction-boundary.test.ts`

Added executable regression coverage for:

- invalid adapter request before registry mutation;
- target rejection rollback;
- commit rejection rollback;
- conflicting definition protection.

## Evidence matrix

| ID | TYPE | REQUIREMENT | CODE LOCATION | TEST / EVIDENCE | VERDICT |
|---|---|---|---|---|---|
| REP-01 | STATIC | Adapter validation precedes registry mutation | `src/core/combat.ts` `UniversalAttackAPI.executeAdapter` | Current HEAD source inspection | PASS |
| REP-02 | UNIT | Rejected target leaves no newly registered adapter | `src/core/combat.ts` | `tests/transaction-boundary.test.ts` test 31 | PASS |
| REP-03 | UNIT | Rejected commit leaves no newly registered adapter | `src/core/combat.ts` | `tests/transaction-boundary.test.ts` test 32 | PASS |
| REP-04 | UNIT | Existing weapon definition cannot be overwritten by conflicting adapter | `src/core/combat.ts` | `tests/transaction-boundary.test.ts` test 33 | PASS |
| REP-05 | BUILD / TYPECHECK | Current production source compiles | repository build | CI run #97, `tsc -p tsconfig.json` | PASS |
| REP-06 | STATIC | No static blocker detected | `tools/static-blocker-check.mjs` | CI run #97: 12 source files scanned | PASS |
| REP-07 | UNIT | Full compiled test suite passes | `tests/*.test.ts` | CI run #97: 33/33 passed, 0 failed, 0 skipped | PASS |
| REP-08 | BUILD / PACKAGE | Add-on packages and archive integrity pass | `tools/package-addon.mjs` | CI run #97: package + `unzip -t` PASS | PASS |
| REP-09 | CI | Evidence is tied to exact current HEAD | GitHub Actions | CI run #97 head `496bc2dccd2585aad0c1615896504b6b0e84f118` | PASS |
| REP-10 | API | `@minecraft/server` dependency is pinned to stable 2.9.0 | `package.json`, `addon/manifest.json` | Source inspection + official Microsoft documentation | PASS |
| REP-11 | API RUNTIME | Exact live Bedrock 26.45 binding/behavior | `src/bedrock/runtime.ts` | No live Bedrock 26.45 environment available | NOT VERIFIED |
| REP-12 | RUNTIME | Actual add-on execution in Bedrock 26.45 | `addon/` | No real Bedrock runtime execution evidence | NOT VERIFIED |
| REP-13 | FAR VIEW | 100 logical target generation | `src/core/far-view.ts` | CI run #97: spatial generator tests pass | PASS |
| REP-14 | FAR VIEW ENGINE | 100 engine-loaded chunks | Bedrock engine | No engine runtime evidence | NOT VERIFIED |
| REP-15 | FAR VIEW CLIENT | 100 client-rendered chunks | Bedrock client | No client rendering evidence | NOT VERIFIED |
| REP-16 | PERFORMANCE | Actual FPS/TPS/RAM/thermal behavior | runtime/device | No measured runtime telemetry | NOT VERIFIED |
| REP-17 | MULTIPLAYER | Multiplayer behavior | Bedrock multiplayer runtime | No multiplayer runtime evidence | NOT VERIFIED |
| REP-18 | PARITY | Full Java-like combat parity | combat/runtime | No authoritative Java-vs-Bedrock runtime parity evidence | NOT VERIFIED |
| REP-19 | TRANSACTION | Full world-state rollback across multi-stage runtime mutation | `BedrockCombatPort.commit` | Runtime commit remains fail-safe/unverified | NOT VERIFIED |

## CI run

- Workflow: `core-check`
- Run: `#97`
- Run ID: `34552425087`
- HEAD: `496bc2dccd2585aad0c1615896504b6b0e84f118`
- `npm install --ignore-scripts`: PASS
- `npm run check`: PASS
- Static blocker check: PASS
- TypeScript build/typecheck: PASS
- Tests: 33/33 PASS
- `npm run check:addon`: PASS
- Add-on archive integrity: PASS
- Artifact upload: PASS

## External-proof boundary

The repository and CI environment do not provide proof of live Bedrock 26.45 execution, client rendering, measured device performance, multiplayer behavior, or full Java parity. These remain `NOT VERIFIED` and are not promoted from static/build/test evidence.

## Final current-head state

- Repairable registry transaction-safety defect: REPAIRED.
- Current CI/build/unit/package evidence: PASS.
- Full project contract: INCOMPLETE because mandatory external runtime/performance/rendering/multiplayer/parity evidence is unavailable.
