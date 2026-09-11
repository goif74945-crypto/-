# NEXY_FARVIEW_100 — C-06 → C-16 CURRENT-HEAD FORENSIC MATRIX

## Identity

- Repository: `goif74945-crypto/-`
- Branch: `main`
- Evaluated HEAD: `2c3a4da290434999d138576763102819c82c7698`
- Target: Minecraft Bedrock 26.45 ONLY
- Rule: historical reports are claims only and are never inherited as proof.

## Evidence policy

`STATIC`, `BUILD`, `TYPECHECK`, `UNIT`, `CI`, `API CONFIGURATION`, `RUNTIME`, `VISUAL`, `PERFORMANCE`, `MULTIPLAYER`, and `PARITY` are separate evidence classes.

Never promote:

- configuration to runtime;
- source inspection to behavior proof;
- unit/mock to Bedrock runtime;
- logical targets to engine-loaded chunks;
- engine-loaded chunks to client-rendered chunks;
- CI to device/runtime proof;
- documentation to live API proof.

## Current verified facts

- `package.json` pins `@minecraft/server` to `2.9.0`.
- `addon/manifest.json` declares `min_engine_version: [1,26,45]` and `@minecraft/server` `2.9.0`.
- `src/core/far-view.ts` generates exactly 100 unique deterministic logical chunk offsets for count `100`, bounded to a 100-chunk radius.
- `tests/spatial-targets.test.ts` checks count, uniqueness, determinism, signed coordinates, and distance bound.
- `src/main.ts` produces at most 100 logical far-view targets per produced player and uses bounded scheduler limits.
- `src/bedrock/runtime.ts` exposes a runtime probe and records API bindings as unverified until a live target session exists.
- `src/bedrock/runtime.ts::BedrockCombatPort.commit()` currently returns `committed:false` with all unresolved side-effect stages unverified.
- `tests/production-path-wiring.test.ts` intentionally classifies its production-wiring assertions as STATIC evidence only.
- GitHub Actions `core-check` for HEAD `2c3a4da290434999d138576763102819c82c7698` completed successfully (run `#109`).

## C-06 → C-16 matrix

| C-ID | STATUS | CODE / CALL PATH | STATIC | BUILD | TYPECHECK | UNIT | CI | RUNTIME | VISUAL | PERFORMANCE | MULTIPLAYER | PARITY | RED-TEAM | REMAINING GAP |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C-06 | INCOMPLETE | `world.afterEvents.entityHurt` → `observeCombat` → canonical API; no authoritative pre-damage gate | PASS (source wiring) | PASS | PASS | PASS | PASS | NOT VERIFIED | N/A | N/A | N/A | NOT VERIFIED | FAILS AUTHORITY GATE | After-event is post-damage; current path cannot prove authoritative pre-damage control or successful commit execution. |
| C-07 | NOT VERIFIED | `addon/manifest.json` + package metadata | PASS (configuration) | PASS | PASS | PASS | PASS | NOT VERIFIED | N/A | N/A | N/A | N/A | PASS (static guard only) | No live Bedrock 26.45 session exists in this environment; minimum engine declaration is not exact runtime proof. |
| C-08 | NOT VERIFIED | `package.json` dependency + production imports | PASS (configuration/source) | PASS | PASS | PASS | PASS | NOT VERIFIED | N/A | N/A | N/A | N/A | PASS (symbol inventory only) | Exact live 2.9.0 binding/behavior has not been executed in Bedrock 26.45. |
| C-09 | NOT VERIFIED | addon entry and runtime wiring exist | PASS (source/package) | PASS | PASS | PASS | PASS | NOT VERIFIED | N/A | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | No Bedrock engine execution environment is available here. |
| C-10 | PASS (LOGICAL ONLY) | `generateSpatialFarOffsets(100)` + bounded producer | PASS | PASS | PASS | PASS | PASS | NOT APPLICABLE | N/A | N/A | N/A | N/A | PASS | 100 logical targets are not 100 loaded/rendered chunks. |
| C-11 | NOT VERIFIED | No production implementation currently proves 100 engine-loaded target chunks | PASS (absence correctly detected) | PASS | PASS | PASS | PASS | NOT VERIFIED | N/A | NOT VERIFIED | NOT VERIFIED | N/A | FAILS PROOF GATE | Need an actual engine loading mechanism and live proof of loaded/ticking state for the required target set. |
| C-12 | NOT VERIFIED | Client capability readout exists, but no render-control authority is implemented | PASS (non-fabrication) | PASS | PASS | PASS | PASS | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | N/A | FAILS PROOF GATE | `maxRenderDistance` only reports a client limit; no evidence proves 100 client-rendered chunks. |
| C-13 | NOT VERIFIED | Bounded scheduler + workload governor + pressure tracking | PASS (bounded architecture) | PASS | PASS | PASS | PASS | NOT VERIFIED | N/A | NOT VERIFIED | N/A | N/A | PASS (static boundedness) | No real FPS/TPS/CPU/RAM/thermal/long-run device telemetry. |
| C-14 | NOT VERIFIED | Per-player keys and bounded player processing exist | PASS (isolation structure) | PASS | PASS | PASS | PASS | NOT VERIFIED | N/A | NOT VERIFIED | NOT VERIFIED | N/A | FAILS PROOF GATE | No real 2-player Bedrock session, disconnect/reconnect, or cross-player runtime evidence. |
| C-15 | NOT VERIFIED | Universal Attack API + adapters + Bedrock port | PASS (architecture only) | PASS | PASS | PASS | PASS | NOT VERIFIED | N/A | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | FAILS PARITY GATE | No authoritative Java-vs-Bedrock runtime parity dataset/session; current armor/critical behavior is not sufficient proof of parity. |
| C-16 | BLOCKED FOR CURRENT ENVIRONMENT | `UniversalAttackAPI.execute` reaches `port.commit`, but `BedrockCombatPort.commit()` is fail-safe/unimplemented for full transaction | PASS (boundary is explicit) | PASS | PASS | PASS | PASS | NOT VERIFIED | N/A | NOT VERIFIED | NOT VERIFIED | NOT VERIFIED | PASS (no fake commit) | Full atomic validate→commit across damage/effects/durability/death/loot/XP cannot be proven or executed without a live Bedrock transaction environment; the current port intentionally refuses the commit rather than partially mutating state. |

## C-06 forensic conclusion

The current production event source is `world.afterEvents.entityHurt`. Microsoft documents before-hurt events separately and provides `cancel`/`damage` on `EntityHurtBeforeEvent`; before-event callbacks run under restricted execution, while `Entity.applyDamage()` is not allowed in restricted execution. Therefore an authoritative implementation must be designed as a two-stage gate/commit flow rather than treating `afterEvents.entityHurt` as pre-damage authority.

Current code does not establish that proof, so C-06 is not promoted to PASS.

## C-11 / C-12 capability boundary

Bedrock exposes a `TickingAreaManager` with `chunkCount`, `maxChunkCount`, `hasCapacity`, and a `createTickingArea` operation whose Promise resolves after the area's chunks are loaded and ticking. This is a legitimate avenue for engine-loaded-chunk verification, but no such mechanism is currently integrated into the production far-view path on this HEAD, and no live session exists here to verify the resulting engine/client state.

A ticking-area result is still not equivalent to client rendering. Client rendering requires independent visual evidence.

## C-13 measurement boundary

The scheduler and governor are bounded in source. JavaScript handler wall time is recorded as a derived workload signal in `src/main.ts`; it is explicitly not FPS telemetry. No device-level FPS/TPS/RAM/CPU/thermal measurement is claimed.

## C-16 transaction boundary

`BedrockCombatPort.commit()` intentionally returns `committed:false` with `NOT_VERIFIED` side-effect statuses. This is a safety boundary, not a completed transaction. Replacing it with partial side effects while returning success would violate the no-false-pass rule and could create irreversible partial state. The repository therefore remains blocked at this transaction boundary pending a real Bedrock execution environment and an implementation that can satisfy the complete transaction contract.

## Current CI

HEAD `2c3a4da290434999d138576763102819c82c7698` was executed by GitHub Actions workflow `core-check` run `#109` and completed successfully. CI proves the configured static/build/test/package checks only; it does not prove live Bedrock runtime, rendering, performance, multiplayer, or parity.

## Final disposition

- C-06: `INCOMPLETE`
- C-07: `NOT VERIFIED`
- C-08: `NOT VERIFIED`
- C-09: `NOT VERIFIED`
- C-10: `PASS (LOGICAL ONLY)`
- C-11: `NOT VERIFIED`
- C-12: `NOT VERIFIED`
- C-13: `NOT VERIFIED`
- C-14: `NOT VERIFIED`
- C-15: `NOT VERIFIED`
- C-16: `BLOCKED FOR CURRENT ENVIRONMENT`

The repository is left in the safest verified state. No requirement was reduced and no false PASS was created.
