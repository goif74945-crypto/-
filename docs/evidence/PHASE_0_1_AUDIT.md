# NEXY_FARVIEW_100 — PHASE 0 + PHASE 1 EVIDENCE REPORT

Date: 2026-09-10
Target repository: `goif74945-crypto/-`
Target branch: `main`
Target platform: Minecraft Bedrock 26.45 ONLY

## PHASE 0 — Specification Lock

**STATUS: PASS**

### Authoritative source

Source inspected:
`NEXY_FARVIEW_100 — ข้อมูลการออกแบบฉบับรวม`

The source defines:
- Minecraft Bedrock 26.45 ONLY.
- FAR VIEW + maximum performance + Java-like gameplay/combat.
- Visual distance is not simulation distance.
- 100 chunks is a design target, not proof of 100 real rendered chunks.
- Native Bedrock behavior first.
- No fake API and no fake PASS.
- Unknown/unconfirmed API capability remains UNKNOWN / NOT VERIFIED.
- Conflict or unclear capability requires FREEZE.
- Universal Attack API is the common combat center; weapons enter through adapters.
- Final implementation must not begin before the Phase 1 capability audit.

Source evidence: repository-independent design file supplied in the project library, lines 10-30, 36-91, 97-112, 212-243, 245-295, 298-355, 577-631, 634-685.

### Scope lock

IN SCOPE:
- Far View architecture and bounded work scheduling.
- Performance control and playability protection.
- Java-like gameplay/combat only where Bedrock 26.45 capabilities can be demonstrated.
- Universal Attack API and Weapon Adapter architecture.
- Evidence-first validation.

OUT OF SCOPE:
- UI as part of the Java-like gameplay core.
- Any guarantee of 100 real rendered chunks without engine-level evidence.
- Full 100-chunk simulation.
- Global entity/block scans every tick.
- Fake or speculative APIs.

### Phase-order lock

Required order confirmed:
0 Specification Lock
1 Bedrock 26.45 API Capability Audit
2 Architecture
3 Core Implementation
4 Performance Implementation
5 Far View Tests
6 Combat/Weapon Parity Tests
7 Stress Tests
8 Mobile Tests
9 Long Runtime
10 Final Validation

No later implementation phase is authorized by this report.

## PHASE 1 — Bedrock 26.45 API Capability Audit

**STATUS: PARTIAL — IMPLEMENTATION MUST REMAIN FROZEN FOR UNSUPPORTED/UNVERIFIED CAPABILITIES**

### 1. Bedrock 26.45 existence

**STATUS: PASS**

Microsoft's official Bedrock 26.44/45 Hotfix Changelog confirms the 26.45 hotfix and lists technical fixes for the 26.45 release, including a dimension JSON fix.

Evidence:
https://feedback.minecraft.net/hc/en-us/articles/48149564061965-Minecraft-Bedrock-Edition-26-44-45-Hotfix-Changelog

### 2. Script scheduler / bounded work

**STATUS: SUPPORTED at API-surface level; runtime limits NOT VERIFIED**

Official `@minecraft/server` documentation exposes:
- `system.run`
- `system.runInterval`
- `system.runTimeout`
- `system.runJob`
- `system.clearJob`
- `system.clearRun`
- `system.currentTick`

`runJob` explicitly schedules a generator with a time slice each tick, which is suitable for bounded queue-style work. This does NOT prove a chosen workload is performant on 26.45/mobile.

Evidence:
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/system?view=minecraft-bedrock-stable

### 3. Entity queries / raycasting / damage / knockback

**STATUS: SUPPORTED at current documented API surface; exact 26.45 runtime compatibility must still be tested**

Documented entity capabilities include:
- `Entity.getEntitiesFromViewDirection`
- `Dimension.getEntities`
- `Dimension.getEntitiesAtBlockLocation`
- `Dimension.getEntitiesFromRay`
- `Entity.applyDamage`
- `Entity.applyImpulse`
- `Entity.applyKnockback`
- `Entity.getEffects`

This is sufficient to design a centralized combat pipeline around real API calls. It does not prove Java combat parity.

Evidence:
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entity?view=minecraft-bedrock-stable
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/dimension?view=minecraft-bedrock-stable

### 4. World/entity/item/block event model

**STATUS: SUPPORTED at API-surface level; exact 26.45 runtime event behavior NOT VERIFIED**

Official documentation exposes event-driven hooks including:
- `world.afterEvents.entityHitEntity`
- `world.afterEvents.entityHitBlock`
- `world.afterEvents.entityHurt`
- `world.afterEvents.itemUse`
- `world.beforeEvents.playerInteractWithBlock`
- `world.beforeEvents.playerInteractWithEntity`
- `world.beforeEvents.playerPlaceBlock`
- `world.afterEvents.playerStartBreakingBlock`
- `world.afterEvents.playerCancelBreakingBlock`

This supports the specification's event-driven model and avoids requiring global polling for these event types.

Evidence:
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/worldafterevents?view=minecraft-bedrock-stable
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/worldbeforeevents?view=minecraft-bedrock-stable
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityhitentityaftereventsignal?view=minecraft-bedrock-stable

### 5. Projectile capability

**STATUS: SUPPORTED for projectile-component behavior; full parity NOT VERIFIED**

Documented `EntityProjectileComponent` provides projectile ownership and `shoot(velocity, options)`. This supports a projectile adapter/resolver architecture. Full collision, pickup, lifetime, and Java parity still require runtime tests.

Evidence:
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entityprojectilecomponent?view=minecraft-bedrock-experimental

### 6. Far View / 100 real rendered chunks

**STATUS: NOT VERIFIED — DO NOT IMPLEMENT AS A CLAIMED 100-CHUNK RENDERING GUARANTEE**

The public Script API documents world/entity/block operations and scheduling, but the reviewed official API evidence does not establish a supported Add-on API that directly raises the engine's real rendered-chunk distance to 100 chunks.

Therefore:
- 100 chunks remains a design target only.
- No code may claim 100 real rendered chunks.
- No full 100-chunk simulation may be introduced as a workaround.
- Visual distance and simulation distance must remain separate.

### 7. Java-like combat parity

**STATUS: PARTIAL / NOT VERIFIED**

The API exposes generic damage and knockback operations, but the reviewed evidence does not prove that every Java combat rule in the design contract can be reproduced exactly through Bedrock 26.45 APIs.

In particular, the following must remain individually audited before implementation claims PASS:
- Java critical-hit semantics.
- Java armor/protection/resistance modifier equivalence.
- Exact cooldown semantics.
- Exact knockback equivalence.
- Exact loot/XP parity.
- Complete behavior/AI parity.
- Complete redstone/gameplay parity.

### 8. API version binding

**STATUS: NOT VERIFIED**

Microsoft's current API documentation lists stable `@minecraft/server` versions including `2.8.0` and `2.9.0`, but the reviewed official material does not provide a direct explicit mapping proving which module version is the exact required manifest dependency for Bedrock 26.45.

Therefore this project MUST NOT silently claim `@minecraft/server` 2.9.0 or any other module version as the exact 26.45 binding without direct version-specific evidence.

Evidence:
https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/minecraft-server?view=minecraft-bedrock-stable
https://learn.microsoft.com/en-us/minecraft/creator/documents/scripting/versioning?view=minecraft-bedrock-stable

## Capability Decision Table

| Capability | Status | Implementation decision |
|---|---|---|
| Bedrock 26.45 target | PASS | Locked |
| Scheduler / runJob | SUPPORTED | May be used with bounded work |
| Event-driven world/entity hooks | SUPPORTED | Preferred over unnecessary polling |
| Entity queries / raycasts | SUPPORTED | Use only spatial/local queries |
| Damage / knockback primitives | SUPPORTED | Central resolver may wrap them |
| Projectile component | SUPPORTED | Adapter/resolver allowed; parity pending |
| 100 real rendered chunks | NOT VERIFIED | No guarantee; no fake implementation |
| Full Java combat parity | NOT VERIFIED | Freeze unsupported rules until evidence exists |
| Exact 26.45 API-version binding | NOT VERIFIED | Do not guess manifest version |
| Mobile performance | NOT VERIFIED | Requires device runtime evidence |

## Phase 1 Stop Conditions

Implementation remains FROZEN for any feature whose required capability is UNKNOWN, UNSUPPORTED, or NOT VERIFIED.

The next authorized phase is **PHASE 2 — Architecture**, but only for capabilities that have a verified implementation basis. No feature may be marked PASS from static documentation alone when the specification requires runtime, performance, visual, mobile, or parity evidence.

## Evidence Standard

No evidence = NOT VERIFIED.
Runtime PASS requires runtime evidence.
Performance PASS requires measurable evidence.
Visual PASS requires visual evidence.
Mobile PASS requires mobile evidence.
Parity PASS requires parity-test evidence.

## Repository Audit

Repository: `goif74945-crypto/-`
Branch: `main`

Observed:
- Repository exists and is writable by the connected GitHub account.
- Default branch is `main`.
- Exactly one existing file was observed at repository root: `README.md`.
- Existing commit history contains one commit: `Initial commit` (`4f8dbcab84cc1fd9dc330b214ab0a0aba38af230`).
- No package configuration, dependencies, tests, or implementation files were present in the inspected root tree.
- `README.md` content is `# -`.

Evidence:
- Repository metadata obtained from GitHub connector.
- Root tree read from `main`.
- Initial commit and file diff inspected.

## WRITE RECORD

Created:
- `docs/evidence/PHASE_0_1_AUDIT.md`

Updated:
- none

Deleted:
- none

Unrelated files overwritten:
- none

This report is the only project file added in Phase 0/1. No implementation code was written.
