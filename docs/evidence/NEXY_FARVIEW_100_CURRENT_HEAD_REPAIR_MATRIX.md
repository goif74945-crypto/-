# NEXY_FARVIEW_100 — CURRENT HEAD REPAIR / EVIDENCE MATRIX

## Current identity

- Repository: `goif74945-crypto/-`
- Branch: `main`
- Current HEAD: `246e65f5b270361566411b1ac7df6667e9b762ea`
- Target: Minecraft Bedrock 26.45 ONLY
- This commit changes documentation only; production/test source blobs are unchanged from the parent `496bc2dccd2585aad0c1615896504b6b0e84f118`.
- Historical reports are not inherited as current proof.

## Repair performed in this repair pass

### `src/core/combat.ts`

- Adapter requests are validated before registry mutation.
- A conflicting adapter definition cannot overwrite an existing weapon definition.
- A newly registered adapter is removed when execution is rejected.
- Registry rollback is deterministic for target rejection and commit rejection.
- Weapon-definition equality is type-safe under strict TypeScript checking.

### `tests/transaction-boundary.test.ts`

Added executable regression coverage for invalid adapter requests, target rejection rollback, commit rejection rollback, and conflicting definition protection.

## Evidence matrix

| ID | TYPE | REQUIREMENT | CODE LOCATION | TEST / EVIDENCE | VERDICT |
|---|---|---|---|---|---|
| REP-01 | STATIC | Adapter validation precedes registry mutation | `src/core/combat.ts` `UniversalAttackAPI.executeAdapter` | Current production blob unchanged from CI-verified parent | PASS |
| REP-02 | UNIT | Rejected target leaves no newly registered adapter | `src/core/combat.ts` | CI #97 test 31 | PASS |
| REP-03 | UNIT | Rejected commit leaves no newly registered adapter | `src/core/combat.ts` | CI #97 test 32 | PASS |
| REP-04 | UNIT | Conflicting definition cannot overwrite existing weapon | `src/core/combat.ts` | CI #97 test 33 | PASS |
| REP-05 | BUILD / TYPECHECK | Production source compiles | repository build | CI #97 on parent production tree | PASS |
| REP-06 | STATIC | No static blocker detected | `tools/static-blocker-check.mjs` | CI #97: 12 source files scanned | PASS |
| REP-07 | UNIT | Full compiled test suite passes | `tests/*.test.ts` | CI #97: 33/33 passed, 0 failed, 0 skipped | PASS |
| REP-08 | BUILD / PACKAGE | Add-on packaging and archive integrity | `tools/package-addon.mjs` | CI #97 PASS | PASS |
| REP-09 | CI | Exact final HEAD CI proof | GitHub Actions | Current final HEAD is documentation-only and no exact-final-head CI completion is yet available | NOT VERIFIED |
| REP-10 | API | `@minecraft/server` pinned to stable 2.9.0 | `package.json`, `addon/manifest.json` | Source inspection + official Microsoft documentation | PASS |
| REP-11 | API RUNTIME | Exact live Bedrock 26.45 binding/behavior | `src/bedrock/runtime.ts` | No live Bedrock 26.45 environment | NOT VERIFIED |
| REP-12 | RUNTIME | Actual add-on execution in Bedrock 26.45 | `addon/` | No real Bedrock runtime execution evidence | NOT VERIFIED |
| REP-13 | FAR VIEW | 100 logical target generation | `src/core/far-view.ts` | CI #97 spatial generator tests pass | PASS |
| REP-14 | FAR VIEW ENGINE | 100 engine-loaded chunks | Bedrock engine | No engine runtime evidence | NOT VERIFIED |
| REP-15 | FAR VIEW CLIENT | 100 client-rendered chunks | Bedrock client | No client rendering evidence | NOT VERIFIED |
| REP-16 | PERFORMANCE | Actual FPS/TPS/RAM/thermal behavior | runtime/device | No measured runtime telemetry | NOT VERIFIED |
| REP-17 | MULTIPLAYER | Multiplayer behavior | Bedrock multiplayer runtime | No multiplayer runtime evidence | NOT VERIFIED |
| REP-18 | PARITY | Full Java-like combat parity | combat/runtime | No authoritative Java-vs-Bedrock runtime parity evidence | NOT VERIFIED |
| REP-19 | TRANSACTION | Full world-state rollback across multi-stage runtime mutation | `BedrockCombatPort.commit` | Runtime commit remains fail-safe/unverified | NOT VERIFIED |

## CI evidence

Parent production-tree verification:

- Workflow: `core-check`
- Run: `#97`
- Run ID: `34552425087`
- Verified production/test HEAD: `496bc2dccd2585aad0c1615896504b6b0e84f118`
- Static blocker check: PASS
- TypeScript build/typecheck: PASS
- Tests: 33/33 PASS
- `npm run check:addon`: PASS
- Add-on archive integrity: PASS
- Artifact upload: PASS

Current final HEAD:

- `246e65f5b270361566411b1ac7df6667e9b762ea`
- Documentation-only delta from verified parent.
- Exact-final-head CI completion: NOT VERIFIED.

## External-proof boundary

The repository and CI environment do not provide proof of live Bedrock 26.45 execution, client rendering, measured device performance, multiplayer behavior, or full Java parity. These remain `NOT VERIFIED`.

## Final current-head state

- Repairable adapter registry transaction-safety defect: REPAIRED.
- Production/build/unit/package evidence on the unchanged production parent: PASS.
- Exact final-head CI: NOT VERIFIED.
- Full project contract: INCOMPLETE because mandatory external runtime/performance/rendering/multiplayer/parity evidence is unavailable.
