# NEXY_FARVIEW_100 — FOUNDATION REQUIREMENT MATRIX

Authority order:
1. Phase 0 Specification Lock
2. Authoritative Master Design Specification
3. Verified Bedrock 26.45/API capabilities
4. Current GitHub source
5. Current tests
6. Current build/CI
7. Runtime evidence
8. AI/old reports

Evidence rule: code existence, test names, commit messages, and reports are claims until revalidated against current evidence.

| FOUNDATION-ID | REQUIREMENT | SPEC LOCATION | CURRENT CODE | TARGET / CONTRACT | DEPENDENCIES | API DEPENDENCY | FAILURE MODE | TEST | EVIDENCE | VERDICT |
|---|---|---|---|---|---|---|---|---|---|---|
| FV-01 | Five distance zones exist as design targets | Master design §2 | `src/core/far-view.ts` | `0-8`, `8-16`, `16-32`, `32-64`, `64-100` | FarViewCore | None for classification | invalid distance -> out of range | `tests/core.test.ts` | CI #84 | PASS |
| FV-02 | No claim that logical work equals client rendering | Master design §2 | `FarViewCore.renderCapability()` | Explicitly distinguish engine-supported/limited/not-implementable | FarViewCore | Engine/client | unknown engine behavior -> not verified | render capability test | CI #84 + source | PASS |
| FV-03 | Bounded far-view state/history | Master design §2/3 | `src/core/far-view.ts` | bounded state, history and stale reclamation | FarViewCore | None | capacity/stale pressure | lifecycle/stale/history tests | CI #84 | PASS |
| PF-01 | Central priority ordering | Master design §3.4 | `src/core/performance.ts` | `CRITICAL > NEAR > IMPORTANT > MID > FAR > DECORATIVE` | Scheduler | None | lower work evicted/rejected under pressure | priority mapping/eviction tests | CI #84 | PASS |
| PF-02 | Bounded queue/work age/per-window work | Master design §3.6/3.10 | `BoundedPriorityScheduler` | explicit queue/work/window bounds | Scheduler | None | bounded rejection/stale removal | 10k stress + stale tests | CI #84 | PASS |
| PF-03 | Dedup/coalescing and priority replacement | Master design §3.8 | scheduler key map | duplicate request suppressed; higher priority may replace | Scheduler | None | duplicate rejected/replaced | dedup/replacement test | CI #84 | PASS |
| PF-04 | Failure metrics and exception containment | Master design §3/Validation | scheduler drain path | failed work must not create false success | Scheduler | None | handler exception recorded | exception containment test | CI #84 | PASS for covered scheduler contract |
| PG-01 | Gameplay classes protected from degradation | Master design §4 | `src/core/playability.ts` | movement/input/camera/combat/etc. protected | Governor + shield | Runtime events for actual sensing | live gameplay behavior unknown | protection test | CI #84 | PASS static / runtime NOT VERIFIED |
| PG-02 | Adaptive safe throttling | Master design §3.10/3.11 | `src/core/governor.ts` | CRITICAL -> SAFE -> BALANCED -> HIGH -> EXTREME | Scheduler + shield | Runtime measurements optional/limited | pressure -> bounded lower workload | governor test | CI #84 | PASS static |
| PG-03 | No synthetic memory claim | Project requirement | governor pressure inputs | only bounded queue/work + measured elapsed time when supplied | Governor | Actual memory unavailable | memory metric absent -> not claimed | governor test | CI #84 | PASS for no-fake-memory contract |
| CM-01 | One central weapon pipeline | Master design §6/7/20 | `src/core/combat.ts` | adapters -> UniversalAttackAPI | Combat resolvers | Runtime capabilities for final commit | invalid input -> reject | adapter/type coverage | CI #84 | PASS static |
| CM-02 | Central cooldown | Master design §10 | `CooldownResolver` | one resolver, bounded map | UniversalAttackAPI | None | blocked attack rejected | cooldown test | CI #84 | PASS |
| CM-03 | Critical eligibility must not be invented | Master design §10 | `CriticalResolver` + runtime observer | unresolved engine conditions => NOT VERIFIED | Runtime adapter | Bedrock capability needed | unsupported condition -> not verified/block | Core tests only cover supplied eligibility | CI #84 + source | NOT VERIFIED |
| CM-04 | Damage order: base -> armor/protection -> resistance -> modifiers -> final | Master design §9 | `UniversalAttackAPI.execute` | authoritative ordering | DamageResolver + mitigation ports | Runtime mitigation capability | stage failure -> reject | `tests/foundation-order.test.ts` + updated regression | CI #84 | PASS static |
| CM-05 | Base/modified/final remain distinct | Master design §9 | `CombatResult` | three values not conflated | Combat pipeline | None for core math | invalid numeric stage -> reject | full combat regression | CI #84 | PASS |
| TX-01 | Atomic commit boundary | User foundation contract / Master design §8 | `CombatExecutionPort.commit()` | state-changing stages behind commit boundary | Combat pipeline | Runtime world mutation | reject if commit unavailable/rejected | atomic rejection test | CI #84 | PASS static contract |
| TX-02 | No success with unverified mandatory stages | User foundation contract | `UniversalAttackAPI.execute` | mandatory stage statuses must be verified or N/A | CombatCommitResult | Runtime | contract violation throws/rejects | unverified-stage test | CI #84 | PASS static contract |
| RT-01 | Bedrock target pinned to 26.45 | Phase 0 + Master design | `addon/manifest.json`, package dependency | min engine 1.26.45; server 2.9.0 | Manifest/package | Bedrock 26.45 | wrong version = blocked | static/package CI | CI #84 + manifest | PASS configuration; live binding NOT VERIFIED |
| RT-02 | API capability claims require direct proof | Phase 0 / evidence gate | `src/bedrock/runtime.ts` | target binding remains false until live proof | runtime harness | Bedrock runtime | no live proof -> NOT VERIFIED | runtime harness exists | no live run | NOT VERIFIED |
| RT-03 | Runtime combat completion | User contract / Master design §8 | `BedrockCombatPort.commit()` | no false acceptance; full completion only with proof | Runtime + engine | Bedrock events/effects | currently rejected | runtime path | no live runtime | BLOCKED |
| RT-04 | Runtime installer/state lifecycle must avoid duplicate registration | User state-management contract | `installRuntimeEventWiring`, `installRuntimeHeartbeat`, `installRuntimeHarness` | lifecycle/idempotency contract required | runtime | Bedrock runtime | duplicate registration possible | no dedicated idempotency test | source only | NOT VERIFIED |
| PV-01 | No global entity/block scans every tick | Master design §2/5/11 | current far/runtime paths | bounded tracked entities + local view target resolution | Runtime + scheduler | Bedrock entity APIs | workload pressure -> bounded | static blocker check; code inspection | CI #84 + source | PASS static bounded path |
| PV-02 | 100-chunk semantics separated A/B/C/D | User foundation contract | far-view logical scheduling | A logical workload; B targets; C engine-loaded; D rendered | FarView + engine | Client/engine | missing proof -> NOT VERIFIED | logical stress only | CI #84 | A bounded logical stress PASS; B/C/D NOT VERIFIED |
| EV-01 | Evidence type separation | Master design §18 | docs + CI process | runtime/performance/parity evidence cannot be substituted | All | All runtime capabilities | missing evidence -> NOT VERIFIED | current CI and report review | run #84 + current report | PASS process |
| EV-02 | Current-head-only evidence | User foundation contract | current report and audit method | stale reports cannot override current source | Git history + CI | None | SHA mismatch -> stale | current HEAD/run cross-check | HEAD 29cf + run #84 | PASS process |
| EV-03 | Test command cannot omit foundation tests | User evidence contract | `package.json` | execute all compiled `dist/tests/*.test.js` | TypeScript build | None | omitted test suite -> CI gap | 25 tests executed in run #84 | CI #84 | PASS |
| DV-01 | No dead foundation | User contract | current architecture | every abstraction must have caller/path | All core | Runtime where applicable | dead/unwired abstraction -> incomplete | source/tree inspection | current tree + source | PASS for inspected foundation; not exhaustive proof |
| RM-01 | Red-team stale test expectation | User red-team contract | `tests/core.test.ts` | test must match authority | Combat pipeline | None | stale expectation -> fail | regression rerun | CI #83 then #84 | REPAIRED |
| RM-02 | Self-introduced compile regression | Change control | `src/core/combat.ts` | every change must return to green | TypeScript | None | typecheck fail -> repair | CI #82/#83/#84 sequence | current run #84 | REPAIRED |

## Evidence boundaries

The following are explicitly NOT proven by the current CI:

- live Bedrock 26.45 API binding;
- actual Minecraft runtime behavior;
- actual 100-chunk engine loading;
- actual 100-chunk client rendering;
- FPS/TPS/RAM/thermal improvement on real device;
- mobile behavior;
- multiplayer behavior;
- Java-like runtime parity;
- complete runtime projectile/death/loot/XP transaction path.

These must remain `NOT VERIFIED` or `BLOCKED` until the appropriate evidence exists.
