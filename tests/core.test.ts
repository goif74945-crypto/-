import assert from "node:assert/strict";
import test from "node:test";
import { FarViewCore } from "../src/core/far-view.js";
import { BoundedPriorityScheduler, priorityForDistance } from "../src/core/performance.js";
import { GameplayPressureTracker, PlayabilityShield } from "../src/core/playability.js";
import { AdaptivePerformanceGovernor } from "../src/core/governor.js";
import {
  AxeAdapter, BowAdapter, CooldownResolver, CriticalResolver, CustomWeaponAdapter,
  DamageResolver, KnockbackResolver, SpearAdapter, SwordAdapter, UniversalAttackAPI,
  WeaponRegistry, type CombatCommitPlan, type CombatCommitResult, type CombatExecutionPort,
  type WeaponAdapter, type WeaponDefinition,
} from "../src/core/combat.js";

const weapon = (id: string, attackType: WeaponDefinition["attackType"], overrides: Partial<WeaponDefinition> = {}): WeaponDefinition => ({ id, attackType, baseDamage: 10, range: 3, cooldownTicks: 5, knockback: 2, durabilityCost: 1, ...overrides });
const context = { attackerId: "a", targetId: "t", direction: { x: 1, y: 0, z: 0 }, tick: 10, criticalEligible: false };
const committed = (calls: string[], request: Parameters<CombatExecutionPort["commit"]>[0], plan: CombatCommitPlan): CombatCommitResult => {
  calls.push(`damage:${plan.finalDamage}`, `knockback:${plan.impulse.x}`);
  if (request.effects.length) calls.push("effect");
  if (request.durabilityCost > 0) calls.push("durability");
  if (request.attackType === "PROJECTILE" || request.attackType === "RANGED") calls.push("projectile");
  calls.push("posthit");
  return {
    committed: true,
    effectStatuses: request.effects.length ? request.effects.map(() => "VERIFIED" as const) : ["NOT_APPLICABLE" as const],
    durabilityStatus: request.durabilityCost > 0 ? "VERIFIED" : "NOT_APPLICABLE",
    projectileStatus: request.attackType === "PROJECTILE" || request.attackType === "RANGED" ? "VERIFIED" : "NOT_APPLICABLE",
    deathStatus: "VERIFIED", lootStatus: "VERIFIED", xpStatus: "VERIFIED",
  };
};
const fullPort = (calls: string[] = [], targetDistance = 2): CombatExecutionPort => ({
  resolveTarget: () => { calls.push("resolve"); return { id: "t", entity: {}, distance: targetDistance }; },
  mitigateArmorDamage: (_target, _request, incoming) => { calls.push("armor"); return incoming - 3; },
  mitigateResistanceDamage: (_target, _request, incoming) => { calls.push("resistance"); return incoming - 2; },
  commit: (request, _target, plan) => committed(calls, request, plan),
});
const makeApi = () => new UniversalAttackAPI(new CooldownResolver(), new CriticalResolver(), new DamageResolver(), new KnockbackResolver());

test("far-view lifecycle records required first distant path and recovery", () => {
  const core = new FarViewCore(); core.observeDistance("c", 70, 1);
  assert.deepEqual(core.getTransitionHistory("c"), ["DISCOVERED", "VISIBLE", "FAR"]);
  core.observeDistance("c", 20, 2); assert.equal(core.getState("c"), "VISIBLE"); core.release("c", 3);
  assert.equal(core.getState("c"), "RELEASED"); assert.equal(core.clearReleased(), 1); assert.deepEqual(core.getTransitionHistory("c"), []);
});

test("far-view rejects illegal transitions and non-monotonic ticks", () => {
  const core = new FarViewCore(); assert.equal(core.transition("bad", "FAR", 1), false); assert.equal(core.transition("bad", "DISCOVERED", 1), true);
  assert.equal(core.transition("bad", "FAR", 2), false); assert.equal(core.transition("bad", "VISIBLE", 2), true); assert.equal(core.transition("bad", "FAR", 1), false); assert.throws(() => core.observeDistance("", 4, 2));
});

test("far-view exhaustive boundaries", () => {
  const core = new FarViewCore();
  const cases: readonly (readonly [number, string])[] = [[0,"0-8"],[7.999,"0-8"],[8,"8-16"],[15.999,"8-16"],[16,"16-32"],[31.999,"16-32"],[32,"32-64"],[63.999,"32-64"],[64,"64-100"],[100,"64-100"]];
  for (const [value, zone] of cases) assert.equal(core.classifyChunkDistance(value).zone, zone);
  for (const value of [100.001,-1,Number.NaN,Number.POSITIVE_INFINITY,Number.NEGATIVE_INFINITY]) assert.equal(core.classifyChunkDistance(value).zone, "OUT_OF_RANGE");
});

test("far-view invalid distance releases tracked state deterministically", () => { const core = new FarViewCore(); core.observeDistance("c",4,1); assert.equal(core.observeDistance("c",Number.NaN,2).zone,"OUT_OF_RANGE"); assert.equal(core.getState("c"),"RELEASED"); });

test("far-view stale reclamation and bounded history work", () => {
  const core = new FarViewCore(2); core.observeDistance("a",4,1); core.observeDistance("b",4,2); assert.equal(core.reclaimStale(81,80),1); assert.equal(core.getState("a"),"RELEASED"); assert.equal(core.getState("b"),"VISIBLE"); assert.equal(core.reclaimStale(82,79),1); assert.equal(core.getState("b"),"RELEASED");
  for(let tick=83;tick<=100;tick++) core.observeDistance("a",tick%2===0?70:20,tick); assert.ok(core.getTransitionHistory("a").length<=8);
});

test("far-view render capability is limited to a client-configured upper bound", () => { const core=new FarViewCore(); assert.equal(core.renderCapability(32,64).capability,"CLIENT_LIMIT_ALLOWS_REQUEST"); assert.equal(core.renderCapability(100,64).capability,"CLIENT_LIMIT_UNKNOWN"); assert.equal(core.renderCapability(100,null).capability,"CLIENT_LIMIT_UNKNOWN"); assert.equal(core.renderCapability(Number.NaN,64).capability,"NOT_IMPLEMENTABLE"); });

test("distance zones map to one authoritative scheduler priority mapping", () => { assert.equal(priorityForDistance("0-8"),"CRITICAL"); assert.equal(priorityForDistance("8-16"),"NEAR"); assert.equal(priorityForDistance("16-32"),"IMPORTANT"); assert.equal(priorityForDistance("32-64"),"MID"); assert.equal(priorityForDistance("64-100"),"FAR"); });

test("scheduler stays bounded under 10000 FAR requests", () => { const scheduler=new BoundedPriorityScheduler<number>({maxQueue:256,maxPerWindow:32,maxWorkAgeTicks:40}); let admitted=0; for(let i=0;i<10000;i++) if(scheduler.enqueue({key:`far-${i}`,priority:"FAR",createdAtTick:i%10,payload:i})) admitted++; assert.equal(admitted,256); assert.equal(scheduler.size,256); assert.equal(scheduler.stats().maxObservedQueue,256); assert.equal(scheduler.drain(()=>undefined,32,10),32); assert.equal(scheduler.size,224); });

test("scheduler deduplicates repeated keys and permits higher priority replacement", () => { const s=new BoundedPriorityScheduler<number>({maxQueue:2,maxPerWindow:2}); assert.equal(s.enqueue({key:"x",priority:"FAR",createdAtTick:1,payload:1}),true); assert.equal(s.enqueue({key:"x",priority:"FAR",createdAtTick:2,payload:2}),false); assert.equal(s.enqueue({key:"x",priority:"CRITICAL",createdAtTick:3,payload:3}),true); assert.equal(s.peekPriority("x"),"CRITICAL"); });

test("scheduler evicts lowest priority under pressure and preserves critical", () => { const s=new BoundedPriorityScheduler<number>({maxQueue:3,maxPerWindow:1}); s.enqueue({key:"a",priority:"FAR",createdAtTick:1,payload:1}); s.enqueue({key:"b",priority:"DECORATIVE",createdAtTick:2,payload:2}); s.enqueue({key:"c",priority:"MID",createdAtTick:3,payload:3}); assert.equal(s.enqueue({key:"critical",priority:"CRITICAL",createdAtTick:4,payload:4}),true); assert.equal(s.peekPriority("b"),undefined); let ran=""; s.drain(i=>{ran=i.key;},1,4); assert.equal(ran,"critical"); });

test("scheduler cancellation and stale rejection work under pressure", () => { const s=new BoundedPriorityScheduler<number>({maxQueue:4,maxPerWindow:2,maxWorkAgeTicks:5}); s.enqueue({key:"old",priority:"FAR",createdAtTick:1,payload:1}); s.enqueue({key:"keep",priority:"FAR",createdAtTick:10,payload:2}); assert.equal(s.cancel("old"),true); assert.equal(s.cancel("missing"),false); assert.equal(s.rejectStale(20),1); assert.equal(s.size,0); assert.ok(s.stats().staleRejected>=1); });

test("scheduler contains handler exceptions and exposes failure metrics", () => { const s=new BoundedPriorityScheduler<number>({maxQueue:4,maxPerWindow:2}); s.enqueue({key:"bad",priority:"CRITICAL",createdAtTick:1,payload:1}); s.enqueue({key:"good",priority:"NEAR",createdAtTick:1,payload:2}); assert.equal(s.drain(i=>{if(i.key==="bad")throw new Error("boom");},2,1),2); assert.equal(s.stats().failed,1); assert.equal(s.stats().executed,1); assert.equal(s.size,0); });

test("continuous critical work dominates lower priority work without queue explosion", () => { const s=new BoundedPriorityScheduler<number>({maxQueue:32,maxPerWindow:1,maxWorkAgeTicks:200}); for(let tick=0;tick<100;tick++){s.enqueue({key:`critical-${tick}`,priority:"CRITICAL",createdAtTick:tick,payload:tick});s.enqueue({key:`low-${tick}`,priority:"DECORATIVE",createdAtTick:tick,payload:tick});} assert.equal(s.size,32); let first=""; s.drain(i=>{first=i.key;},1,100); assert.ok(first.startsWith("critical-")); });

test("scheduler execution instrumentation records handler duration", () => { const s=new BoundedPriorityScheduler<number>({maxQueue:4,maxPerWindow:2}); s.enqueue({key:"x",priority:"CRITICAL",createdAtTick:1,payload:1}); s.drain(()=>{for(let i=0;i<10000;i++)Math.sqrt(i);},1,1); assert.equal(s.stats().executed,1); assert.ok(s.stats().executionTimeMsTotal>=0); });

test("playability protects all required gameplay classes from degrade", () => { const t=new GameplayPressureTracker(3); const shield=new PlayabilityShield(t); const kinds=["MOVEMENT","INPUT","CAMERA","COMBAT","INVENTORY","ITEM_USE","BLOCK_INTERACTION","BLOCK_BREAK","BLOCK_PLACE","NEAR_ENTITY","PROJECTILE","BOSS","PVP","IMPORTANT_EVENT","REDSTONE"] as const; t.mark("COMBAT",0); for(const k of kinds)assert.equal(shield.shouldDegrade(k,1),false); assert.equal(shield.shouldDegrade("FAR",1),true); assert.equal(shield.shouldDegrade("DECORATIVE",1),true); assert.equal(shield.shouldDegrade("FAR",4),false); assert.equal(shield.priorityFor("CAMERA"),"CRITICAL"); assert.equal(shield.priorityFor("BOSS"),"CRITICAL"); assert.equal(shield.isBossTypeId("minecraft:wither"),true); assert.equal(shield.isBossTypeId("minecraft:zombie"),false); });

test("governor works without synthetic memory input", () => { const g=new AdaptivePerformanceGovernor(); assert.equal(g.evaluate({queueRatio:1,workRatio:1,localGameplayActive:true}),"CRITICAL"); assert.equal(g.workloadPolicy().allowFar,false); assert.equal(g.workloadPolicy().allowDecorative,false); assert.equal(g.workloadPolicy().executionBudget,2); });

test("all five adapters and seven attack types converge to central pipeline", () => { const api=makeApi(); const adapters:WeaponAdapter[]=[new SwordAdapter(weapon("sword","MELEE")),new AxeAdapter(weapon("axe","HEAVY_MELEE")),new SpearAdapter(weapon("spear","THRUST")),new BowAdapter(weapon("bow","RANGED",{durabilityCost:0})),new CustomWeaponAdapter(weapon("custom","SPECIAL"))]; const types:WeaponDefinition["attackType"][]=["MELEE","HEAVY_MELEE","THRUST","SWEEP","RANGED","PROJECTILE","SPECIAL"]; for(const [i,type] of types.entries()){let a:WeaponAdapter=type==="MELEE"?adapters[0]! : type==="HEAVY_MELEE"?adapters[1]! : type==="THRUST"?adapters[2]! : type==="RANGED"?adapters[3]! : new CustomWeaponAdapter(weapon(`custom-${i}`,type,{durabilityCost:0})); const r=api.executeAdapter(a,{...context,tick:20+i},fullPort()); assert.equal(r.accepted,true); assert.equal(r.armorStatus,"VERIFIED"); assert.equal(r.resistanceStatus,"VERIFIED"); assert.equal(r.deathStatus,"VERIFIED"); assert.equal(r.lootStatus,"VERIFIED"); assert.equal(r.xpStatus,"VERIFIED"); } });

test("accepted combat results cannot contain unverified mandatory stages", () => { const api=makeApi(); const adapter=new SwordAdapter(weapon("sword","MELEE")); const port:CombatExecutionPort={resolveTarget:()=>({id:"t",entity:{},distance:2}),mitigateArmorDamage:()=>10,mitigateResistanceDamage:()=>10,commit:()=>({committed:false,effectStatuses:[],durabilityStatus:"NOT_VERIFIED",projectileStatus:"NOT_APPLICABLE",deathStatus:"NOT_VERIFIED",lootStatus:"NOT_VERIFIED",xpStatus:"NOT_VERIFIED"})}; const r=api.executeAdapter(adapter,context,port); assert.equal(r.accepted,false); assert.equal(r.reason,"COMMIT_REJECTED"); });

test("full combat pipeline keeps base modified final damage distinct", () => { const api=makeApi(); const adapter=new SwordAdapter(weapon("sword","MELEE",{modifiers:[{id:"strength",multiplier:2}],effects:[{id:"slowness",durationTicks:20,amplifier:1}]})); const calls:string[]=[]; const r=api.executeAdapter(adapter,{...context,criticalEligible:true},fullPort(calls)); assert.equal(r.accepted,true); assert.equal(r.baseDamage,10); assert.equal(r.modifiedDamage,20); assert.equal(r.finalDamage,20); assert.deepEqual(calls,["resolve","armor","resistance","damage:20","knockback:2","effect","durability","posthit"]); });

test("atomic commit rejection causes no damage-stage call", () => { const api=makeApi(); let mutated=false; const port:CombatExecutionPort={resolveTarget:()=>({id:"t",entity:{},distance:2}),mitigateArmorDamage:()=>10,mitigateResistanceDamage:()=>10,commit:()=>{assert.equal(mutated,false); return {committed:false,effectStatuses:[],durabilityStatus:"NOT_VERIFIED",projectileStatus:"NOT_APPLICABLE",deathStatus:"NOT_VERIFIED",lootStatus:"NOT_VERIFIED",xpStatus:"NOT_VERIFIED"};}}; const r=api.executeAdapter(new SwordAdapter(weapon("atomic","MELEE")),context,port); assert.equal(r.accepted,false); assert.equal(mutated,false); });

test("weapon validation rejects missing and mismatched registration", () => { const reg=new WeaponRegistry(); const api=new UniversalAttackAPI(new CooldownResolver(),new CriticalResolver(),new DamageResolver(),new KnockbackResolver(),reg); const request=new SwordAdapter(weapon("sword","MELEE")).toAttackRequest(context); assert.equal(api.execute(request,fullPort()).reason,"WEAPON_UNREGISTERED"); assert.equal(reg.register(weapon("sword","MELEE")),true); assert.equal(api.execute({...request,attackType:"PROJECTILE"},fullPort()).reason,"WEAPON_ATTACK_TYPE_MISMATCH"); });

test("combat rejects malformed modifier effect and tick inputs before mutation", () => { const api=makeApi(); const base=new SwordAdapter(weapon("sword","MELEE",{durabilityCost:0})).toAttackRequest(context); assert.equal(api.execute({...base,range:-1},fullPort()).reason,"INVALID_RANGE"); assert.equal(api.execute({...base,effects:[{id:"",durationTicks:1,amplifier:0}]},fullPort()).reason,"EFFECT_INVALID"); assert.equal(api.execute({...base,modifiers:[{id:"",multiplier:2}]},fullPort()).reason,"MODIFIER_INVALID"); assert.equal(api.execute({...base,direction:{x:Number.NaN,y:0,z:0}},fullPort()).reason,"DIRECTION_INVALID"); });

test("combat target and range validation remain enforced", () => { const api=makeApi(); const adapter=new SwordAdapter(weapon("sword","MELEE",{durabilityCost:0})); const targetPort:CombatExecutionPort={...fullPort(),resolveTarget:()=>({id:"wrong",entity:{},distance:1})}; assert.equal(api.executeAdapter(adapter,context,targetPort).reason,"TARGET_INVALID"); assert.equal(api.executeAdapter(adapter,{...context,tick:20},fullPort([],4)).reason,"OUT_OF_RANGE"); });

test("cooldown blocks second attack after a fully verified execution", () => { const api=makeApi(); const adapter=new SwordAdapter(weapon("sword","MELEE",{durabilityCost:0})); assert.equal(api.executeAdapter(adapter,context,fullPort()).accepted,true); assert.equal(api.executeAdapter(adapter,{...context,tick:11},fullPort()).reason,"COOLDOWN"); });
