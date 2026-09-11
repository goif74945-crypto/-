# NEXY_FARVIEW_100 — C-06 FORENSIC REPORT

## 1. VERDICT

**C-06 FINAL VERDICT: NOT VERIFIED**

Reason: the repository now contains a real authoritative `beforeEvents.entityHurt` production path that reaches the canonical combat API and mutates `EntityHurtBeforeEvent.damage` through `BedrockCombatPort.commit()`. Static/build/typecheck/unit/CI evidence is present. However, mandatory live Bedrock 26.45 execution evidence is not present, so the runtime gate cannot be promoted to PASS.

No C-07 or C-08 work was performed.

## 2. CURRENT-HEAD BINDING

- Repository: `goif74945-crypto/-`
- Branch: `main`
- Audited production-code HEAD: `fff6cc813098974af19d60ee991e182f2eab9398`
- Target: Minecraft Bedrock 26.45 ONLY
- Declared module: `@minecraft/server` 2.9.0

This report commit is documentation-only. The audited production code is unchanged by the report itself.

## 3. SPECIFICATION EVIDENCE

Repository-resident specification control:
`docs/spec/NEXY_FARVIEW_100_PHASE_0_SPEC_LOCK.md`

Relevant locked requirements:

- Bedrock 26.45 ONLY.
- Universal Attack API is central.
- Attack pipeline must include validation, target/range, cooldown, critical, damage, armor/resistance/modifiers, final damage, knockback/effects/durability/projectile/death/loot/XP/result.
- Evidence classes remain separate.
- Runtime PASS requires runtime evidence.
- API ambiguity or missing mandatory evidence is NOT VERIFIED / FREEZE.

The named master design contract `NEXY_FARVIEW_100 — ข้อมูลการออกแบบฉบับรวม` is still not present as a repository file; no missing text was invented.

## 4. API EVIDENCE

Microsoft's official documentation confirms that `EntityHurtBeforeEvent` exposes mutable `damage` and `cancel`, and that `world.beforeEvents.entityHurt` callbacks run with restricted-execution privilege. Microsoft also documents that before-event execution restricts gameplay-state-modifying APIs. Therefore the production path uses the before event only to validate/resolve/modify the pending damage field; it does not call `Entity.applyDamage()` from the before callback or from the after callback. citeturn0search0turn0search11turn0search13

The repository declares `@minecraft/server` 2.9.0 and Bedrock 26.45 in configuration, but configuration is not live runtime proof. fileciteturn9file0

## 5. FILES CHANGED FOR C-06

Production:
- `src/main.ts`

Tests:
- `tests/production-path-wiring.test.ts`

The previous C-06 gap was a production guard that returned when the observed weapon was not already registered. The repaired composition root now registers an unregistered observed weapon from the exact `AttackRequest` values already constructed by the runtime event mapper, then routes that same request through `UniversalAttackAPI.execute(request, combatPort)`. fileciteturn34file0

## 6. EXACT SYMBOLS CHANGED

### `src/main.ts`
- `ensureObservedWeaponRegistered(request: AttackRequest)` — added.
- `installRuntimeCombatObserver(...)` production callback — changed to ensure registration, call canonical `combat.execute`, and record rejection/error without fabricating success.

### `tests/production-path-wiring.test.ts`
- canonical observer test strengthened to forbid the old silent unregistered-weapon return;
- authoritative before-hurt commit ordering test added;
- after-hurt duplicate-damage guard strengthened;
- projectile after-event duplicate-damage guard strengthened.

## 7. PRODUCTION ENTRY POINT

`world.beforeEvents.entityHurt.subscribe(event => dispatchBeforeHurtCombat(event))` is the authoritative production event subscription. The callback extracts `damageSource.damagingEntity`, `hurtEntity`, and the pending `event.damage`, then invokes the installed combat observer. fileciteturn7file0

## 8. COMPLETE STATIC CALL GRAPH

`world.beforeEvents.entityHurt`
→ `dispatchBeforeHurtCombat(event)`
→ `combatObserver(buildObservedAttack(..., event.damage))`
→ `ensureObservedWeaponRegistered(request)`
→ `UniversalAttackAPI.execute(request, combatPort)`
→ `validateRequest`
→ registered-weapon validation
→ `BedrockCombatPort.resolveTarget(request)`
→ range validation
→ cooldown validation
→ critical resolution
→ armor mitigation
→ resistance mitigation
→ modifier damage resolution
→ knockback resolution
→ `BedrockCombatPort.commit(request, target, plan)`
→ `activeBeforeHurtEvent.damage = plan.finalDamage`
→ engine applies the resulting pending hurt
→ `world.afterEvents.entityHurt` observation-only callback.

The production observer no longer silently drops a valid runtime request merely because its weapon ID was absent from the registry. fileciteturn34file0

## 9. REQUEST DATA FLOW

The runtime constructs:

- attacker ID
- weapon ID from main-hand equipment
- target ID
- attack type inferred from the weapon ID
- view direction
- range
- base damage from the pending Bedrock hurt event
- cooldown
- critical eligibility
- knockback
- durability cost
- modifiers
- effects
- current tick.

The exact request fields are implementation details; the Phase-0 specification locks the conceptual attack-request contents rather than these exact names. fileciteturn27file0

## 10. DAMAGE DATA FLOW

`event.damage`
→ request `baseDamage`
→ critical resolver
→ armor mitigation
→ resistance mitigation
→ modifier resolver
→ `finalDamage`
→ before-event `damage` mutation.

No second `applyDamage()` operation is present in the authoritative commit path.

## 11. COMMIT DATA FLOW

`UniversalAttackAPI.execute()` rejects invalid requests before commit. It calls the port commit inside a try/catch. A false commit is rejected; an exception becomes `COMMIT_EXCEPTION`; a successful commit must satisfy the mandatory-stage contract. The Bedrock port's successful pre-damage branch writes the final damage into the active `EntityHurtBeforeEvent`. Its non-before branch remains `committed:false` with unresolved stages, preventing a fake success outside the authoritative pre-damage boundary. fileciteturn8file0turn7file0

## 12. AUTHORITATIVE BEDROCK SIDE EFFECT

The only C-06 damage side effect performed by the production commit is:

`activeBeforeHurtEvent.damage = plan.finalDamage`

This is the correct type of pre-damage control exposed by `EntityHurtBeforeEvent`; the official API documents `damage` as the amount of damage that will be caused. citeturn0search0

## 13. ERROR PATH

- weapon registration failure → runtime error recorded;
- canonical execute rejection → `COMBAT_PRE_DAMAGE_REJECTED:*` recorded;
- runtime observer exception → runtime error recorded;
- invalid final damage → commit throws `INVALID_PRE_DAMAGE_COMMIT`;
- commit exception → canonical execute rejects;
- `committed:false` → canonical execute rejects;
- unverified mandatory commit stage → canonical execute raises contract violation.

No error path changes `committed:false` into success.

## 14. DUPLICATE-DAMAGE ANALYSIS

`world.afterEvents.entityHurt` is observation-only. The production callback only remembers the hurt entity and marks combat pressure; it does not call the combat observer or `applyDamage()`. The projectile after-event similarly does not route damage through the combat observer. Static tests now explicitly assert these constraints. fileciteturn31file0

Microsoft documents `EntityHurtAfterEvent.damage` as read-only, reinforcing that the after event is not the correct mutation point for the authoritative damage control. citeturn0search16

## 15. TEST MATRIX

| Gate | Static source | Test source | Result |
|---|---|---|---|
| before-event wiring | YES | production-path-wiring | PASS |
| production observer installation | YES | production-path-wiring | PASS |
| request construction | YES | source inspection | PASS (static) |
| canonical `combat.execute()` | YES | production-path-wiring | PASS (static) |
| damage resolution | YES | core tests + source | PASS (static/unit) |
| commit path | YES | production-path-wiring + transaction tests | PASS (static/unit) |
| committed:false failure | YES | core/transaction tests | PASS |
| exception/error path | YES | core/transaction tests + source | PASS (static/unit) |
| duplicate-damage protection | YES | production-path-wiring | PASS (static) |
| after-event no second damage | YES | production-path-wiring | PASS (static) |
| before-event no `applyDamage()` | YES | production-path-wiring + source | PASS (static) |
| event timing | YES | source/API docs | PASS (static/API); runtime NOT VERIFIED |
| current production caller | YES | source inspection | PASS (static) |

The repository explicitly classifies the production-path test as static wiring evidence rather than live Bedrock proof. fileciteturn14file0

## 16. BUILD / TYPECHECK / CI

GitHub Actions `core-check` run #118 executed against exact audited production-code HEAD `fff6cc813098974af19d60ee991e182f2eab9398` and completed successfully. Its job completed `npm run check` successfully and also completed `npm run check:addon` successfully, including addon packaging/upload steps. citeturn39file0

Therefore:

- TYPECHECK: PASS
- UNIT: PASS
- BUILD: PASS
- STATIC CHECK: PASS
- ADDON PACKAGE CHECK: PASS
- CI: PASS

These results remain code-level evidence and do not prove Bedrock runtime behavior.

## 17. RUNTIME RESULT

**RUNTIME = NOT VERIFIED**

No live Bedrock 26.45 execution session is available in repository CI. The repository's own runtime capability table keeps target bindings unverified, consistent with the evidence policy. fileciteturn6file0

## 18. RED-TEAM RESULT

Performed against the current production source:

- after-event duplicate damage: blocked statically;
- projectile after-event duplicate path: blocked statically;
- missing production weapon registration: repaired;
- fake `committed:true`: not introduced;
- `committed:false` masking: not introduced;
- forbidden before-event `applyDamage()`: absent from the production commit path;
- stale C-06 matrix: identified as stale because it targeted an older HEAD;
- stale CI: not used as current evidence; current HEAD run #118 used instead;
- wrong target version: repository still declares Bedrock 26.45 / server 2.9.0;
- test-only wiring: tests are explicitly classified as static and are not promoted to runtime evidence.

## 19. CONTRADICTIONS / REMAINING BLOCKERS

### Blocker 1 — live runtime evidence

**Missing:** real Bedrock 26.45 execution evidence showing an actual hurt event entering the installed handler, reaching `UniversalAttackAPI.execute`, reaching `commit`, changing the pending damage, and producing the expected post-hurt result.

**Why required:** C-06 is an authoritative production-runtime gate, and static source/build/CI evidence cannot be promoted to runtime proof.

**Required test:** install the exact addon produced from this audited code, run it in Bedrock 26.45, create a controlled attacker/target case, capture the runtime evidence/log, record the exact addon/package fingerprint and HEAD, and verify the observed post-hurt damage against the before-event committed final damage.

**Result that changes verdict:** reproducible live evidence showing the exact production call path and correct damage side effect at Bedrock 26.45 can change C-06 from NOT VERIFIED to PASS, provided no contradiction is found.

### Blocker 2 — authoritative master design file

The repository still does not contain the named master design contract. No conflicting requirement was invented or silently resolved. The repository Phase-0 lock remains the controlling repository-resident specification source for this audit.

## 20. CLAIM → CODE → SPEC → EVIDENCE MATRIX

| Claim | Code | Spec anchor | Evidence | Verdict |
|---|---|---|---|---|
| Hurt enters authoritative pre-damage gate | `runtime.ts::installRuntimeEventWiring` | Universal Attack / authoritative damage path | source + official API | PASS static/API |
| Request reaches canonical combat | `main.ts::installRuntimeCombatObserver` | Universal Attack API centrality | source + CI | PASS static |
| Unregistered production request is not silently discarded | `main.ts::ensureObservedWeaponRegistered` | central production path | source + CI | PASS static |
| Final damage mutates pending hurt | `runtime.ts::BedrockCombatPort.commit` | attack pipeline final damage/commit | source + official API | PASS static/API |
| After event does not apply second damage | `runtime.ts` after-hurt subscription | no duplicate damage | source + test + CI | PASS static |
| Build/typecheck/tests pass | repository build/test scripts | evidence separation | CI run #118 | PASS |
| Bedrock 26.45 live execution works | runtime addon | runtime gate | no live session | NOT VERIFIED |

## 21. FINAL VERDICT

**C-06 = NOT VERIFIED**

The repairable static defect found on the audited code path was repaired: production hurt events no longer terminate at the old unregistered-weapon guard, and the request now reaches the canonical combat API and pre-damage commit path. CI confirms the repaired repository builds and its configured checks pass.

The verdict is intentionally **NOT VERIFIED**, not PASS, because live Bedrock 26.45 execution evidence is still missing.

No C-07.
No C-08.
No Far View feature work.
No unrelated performance work.

**STOP CONDITION REACHED: all currently repairable C-06 repository-side gates are satisfied; the remaining gate is external live Bedrock 26.45 runtime evidence.**
