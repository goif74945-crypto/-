# NEXY_FARVIEW_100 — REPAIR / EVIDENCE MATRIX

## Evidence anchor

- Repository: `goif74945-crypto/-`
- Branch: `main`
- Production/test evidence anchor: `496bc2dccd2585aad0c1615896504b6b0e84f118`
- Target: Minecraft Bedrock 26.45 ONLY
- Commits after the production evidence anchor are documentation-only; therefore production evidence is anchored to the exact unchanged production tree rather than recursively to this evidence file's own commit.
- Historical reports are not inherited as current proof.

## Repair performed

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
| REP-01 | STATIC | Adapter validation precedes registry mutation | `src/core/combat.ts` `UniversalAttackAPI.executeAdapter` | Production evidence anchor | PASS |
| REP-02 | UNIT | Rejected target leaves no newly registered adapter | `src/core/combat.ts` | CI #97 test 31 | PASS |
| REP-03 | UNIT | Rejected commit leaves no newly registered adapter | `src/core/combat.ts` | CI #97 test 32 | PASS |
| REP-04 | UNIT | Conflicting definition cannot overwrite existing weapon | `src/core/combat.ts` | CI #97 test 33 | PASS |
| REP-05 | BUILD / TYPECHECK | Production source compiles | repository build | CI #97: `tsc -p tsconfig.json` PASS | PASS |
| REP-06 | STATIC | No static blocker detected | `tools/static-blocker-check.mjs` | CI #97: 12 source files scanned | PASS |
| REP-07 | UNIT | Full compiled test suite passes | `tests/*.test.ts` | CI #97: 33/33 passed, 0 failed, 0 skipped | PASS |
| REP-08 | BUILD / PACKAGE | Add-on packaging and archive integrity | `tools/package-addon.mjs` | CI #97 PASS | PASS |
| REP-09 | API | `@minecraft/server` pinned to stable 2.9.0 | `package.json`, `addon/manifest.json` | Source inspection + official Microsoft documentation | PASS |
| REP-10 | API RUNTIME | Exact live Bedrock 26.45 binding/behavior | `src/bedrock/runtime.ts` | No live Bedrock 26.45 environment | NOT VERIFIED |
| REP-11 | RUNTIME | Actual add-on execution in Bedrock 26.45 | `addon/` | No real Bedrock runtime execution evidence | NOT VERIFIED |
| REP-12 | FAR VIEW | 100 logical target generation | `src/core/far-view.ts` | CI #97 spatial generator tests pass | PASS |
| REP-13 | FAR VIEW ENGINE | 100 engine-loaded chunks | Bedrock engine | No engine runtime evidence | NOT VERIFIED |
| REP-14 | FAR VIEW CLIENT | 100 client-rendered chunks | Bedrock client | No client rendering evidence | NOT VERIFIED |
| REP-15 | PERFORMANCE | Actual FPS/TPS/RAM/thermal behavior | runtime/device | No measured runtime telemetry | NOT VERIFIED |
| REP-16 | MULTIPLAYER | Multiplayer behavior | Bedrock multiplayer runtime | No multiplayer runtime evidence | NOT VERIFIED |
| REP-17 | PARITY | Full Java-like combat parity | combat/runtime | No authoritative Java-vs-Bedrock runtime parity evidence | NOT VERIFIED |
| REP-18 | TRANSACTION | Full world-state rollback across multi-stage runtime mutation | `BedrockCombatPort.commit` | Runtime commit remains fail-safe/unverified | NOT VERIFIED |

## CI evidence

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

## External-proof boundary

The repository and CI environment do not provide proof of live Bedrock 26.45 execution, client rendering, measured device performance, multiplayer behavior, or full Java parity. These remain `NOT VERIFIED` and are not promoted from static/build/test evidence.

## Final state

- Repairable adapter registry transaction-safety defect: REPAIRED.
- Production/build/unit/package evidence: PASS at the production evidence anchor.
- Full project contract: INCOMPLETE because mandatory external runtime/performance/rendering/multiplayer/parity evidence is unavailable.
