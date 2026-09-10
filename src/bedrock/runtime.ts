import {
  world,
  system,
  EntityComponentTypes,
  EquipmentSlot,
  ItemComponentTypes,
  type Entity,
  type Player,
  type Vector3,
} from "@minecraft/server";
import type { AttackRequest, CombatEffect, Vec3 } from "../core/types.js";
import type { CombatCommitPlan, CombatCommitResult, CombatExecutionPort, ResolvedCombatTarget } from "../core/combat.js";
import { GameplayPressureTracker, type GameplayClass } from "../core/playability.js";

export type RuntimeEvidenceStatus = "PASS" | "FAIL" | "NOT_VERIFIED" | "NOT_AVAILABLE" | "UNSUPPORTED";
export interface RuntimeCapability { readonly name: string; readonly documented: boolean; readonly targetBindingVerified: boolean; }
export interface ClientCapabilitySnapshot { readonly viewDirection: Vec3 | null; readonly maxRenderDistance: number | null; readonly platformType: string | null; readonly graphicsMode: string | null; readonly cameraAccessible: boolean; }
export interface RuntimeProbeResult { readonly tick: number; readonly checks: Readonly<Record<string, RuntimeEvidenceStatus>>; readonly client: ClientCapabilitySnapshot; }
export interface RuntimeMetrics { readonly trackedEntities: number; readonly runtimeErrors: number; readonly projectileEventsAccepted: number; readonly duplicateProjectileEventsRejected: number; }

export const SCRIPT_API_CAPABILITIES: readonly RuntimeCapability[] = [
  { name: "system.run", documented: true, targetBindingVerified: false },
  { name: "system.runInterval", documented: true, targetBindingVerified: false },
  { name: "system.clearRun", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.playerButtonInput", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.playerSwingStart", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.entityHurt", documented: true, targetBindingVerified: false },
  { name: "world.beforeEvents.entityHurt", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.projectileHitEntity/projectileHitBlock", documented: true, targetBindingVerified: false },
  { name: "world.afterEvents.entityDie", documented: true, targetBindingVerified: false },
  { name: "Entity.getEntitiesFromViewDirection", documented: true, targetBindingVerified: false },
  { name: "Entity.getViewDirection", documented: true, targetBindingVerified: false },
  { name: "Entity.applyDamage", documented: true, targetBindingVerified: false },
  { name: "Entity.applyImpulse", documented: true, targetBindingVerified: false },
  { name: "EntityComponentTypes.Equippable", documented: true, targetBindingVerified: false },
  { name: "EntityComponentTypes.Inventory", documented: true, targetBindingVerified: false },
  { name: "ItemComponentTypes.Durability", documented: true, targetBindingVerified: false },
  { name: "Entity.addEffect/getEffect", documented: true, targetBindingVerified: false },
  { name: "Player.clientSystemInfo.maxRenderDistance", documented: true, targetBindingVerified: false },
  { name: "Player.camera", documented: true, targetBindingVerified: false },
];

const MAX_TRACKED_ENTITIES = 2048;
const MAX_DIRECTION_SAMPLES = 128;
const MAX_PROJECTILE_KEYS = 256;
const MAX_RUNTIME_ERRORS = 32;
const trackedEntities = new Map<string, Entity>();
const lastDirections = new Map<string, Vec3>();
const projectileKeys = new Map<string, number>();
const runtimeErrors: string[] = [];
let projectileEventsAccepted = 0;
let duplicateProjectileEventsRejected = 0;
let combatObserver: ((request: AttackRequest) => void) | undefined;

function rememberEntity(entity: Entity | undefined): void {
  if (!entity?.id || !entity.isValid) return;
  if (!trackedEntities.has(entity.id) && trackedEntities.size >= MAX_TRACKED_ENTITIES) return;
  trackedEntities.set(entity.id, entity);
}
function pruneTrackedEntities(): void { for (const [id, entity] of trackedEntities) if (!entity.isValid) trackedEntities.delete(id); }
function recordRuntimeError(error: unknown): void { const message = error instanceof Error ? error.message : String(error); if (runtimeErrors.length >= MAX_RUNTIME_ERRORS) runtimeErrors.shift(); runtimeErrors.push(message.slice(0,240)); }
function rememberProjectileEvent(projectileId: string, targetId: string, tick: number): boolean {
  const key = `${projectileId}:${targetId}`;
  if (projectileKeys.has(key)) { duplicateProjectileEventsRejected++; return false; }
  if (projectileKeys.size >= MAX_PROJECTILE_KEYS) { let oldestKey: string | undefined; let oldestTick=Number.POSITIVE_INFINITY; for(const [k,t] of projectileKeys) if(t<oldestTick){oldestTick=t;oldestKey=k;} if(oldestKey!==undefined) projectileKeys.delete(oldestKey); }
  projectileKeys.set(key,tick); projectileEventsAccepted++; return true;
}

export const gameplayPressure = new GameplayPressureTracker();
function mark(kind: GameplayClass): void { gameplayPressure.mark(kind, system.currentTick); }
export function installRuntimeCombatObserver(observer: (request: AttackRequest) => void): void { combatObserver = observer; }

export function readClientCapabilities(player: Player): ClientCapabilitySnapshot {
  try { const direction=player.getViewDirection(); const client=player.clientSystemInfo; const camera=player.camera; return {
    viewDirection:Number.isFinite(direction.x)&&Number.isFinite(direction.y)&&Number.isFinite(direction.z)?{x:direction.x,y:direction.y,z:direction.z}:null,
    maxRenderDistance:Number.isFinite(client.maxRenderDistance)?client.maxRenderDistance:null,
    platformType:String(client.platformType), graphicsMode:String(player.graphicsMode), cameraAccessible:camera.isValid,
  }; } catch(error){ recordRuntimeError(error); return {viewDirection:null,maxRenderDistance:null,platformType:null,graphicsMode:null,cameraAccessible:false}; }
}

export function samplePlayerPressure(_tick:number):void {
  let inspected=0; try { for(const player of world.getAllPlayers()){ if(inspected++>=MAX_DIRECTION_SAMPLES)break; rememberEntity(player); const current=readClientCapabilities(player).viewDirection; if(!current)continue; const previous=lastDirections.get(player.id); if(!previous||previous.x!==current.x||previous.y!==current.y||previous.z!==current.z)mark("CAMERA"); lastDirections.set(player.id,current); } if(lastDirections.size>MAX_DIRECTION_SAMPLES){const first=lastDirections.keys().next().value as string|undefined;if(first)lastDirections.delete(first);} } catch(error){recordRuntimeError(error);}
}

function weaponAttackType(entity: Entity): AttackRequest["attackType"] {
  try { const item=entity.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand); const id=item?.typeId ?? ""; if(id.includes("sword"))return "MELEE"; if(id.includes("axe"))return "HEAVY_MELEE"; if(id.includes("bow"))return "RANGED"; if(id.includes("spear"))return "THRUST"; return "SPECIAL"; } catch { return "SPECIAL"; }
}
function weaponId(entity: Entity): string { try { return entity.getComponent(EntityComponentTypes.Equippable)?.getEquipment(EquipmentSlot.Mainhand)?.typeId ?? "nexy:unarmed"; } catch { return "nexy:unarmed"; } }
function buildObservedAttack(attacker: Entity, target: Entity, attackType: AttackRequest["attackType"], baseDamage: number): AttackRequest {
  const direction=attacker.getViewDirection(); const item=weaponId(attacker);
  return {attackerId:attacker.id,weaponId:item,targetId:target.id,attackType,direction,range:3,baseDamage,cooldownTicks:5,criticalEligible:false,knockback:2,durabilityCost:1,modifiers:[],effects:[],tick:system.currentTick};
}
function observeCombat(attacker: Entity|undefined,target: Entity|undefined,damage:number): void {
  if(!attacker||!target||!attacker.isValid||!target.isValid||!combatObserver)return;
  try { combatObserver(buildObservedAttack(attacker,target,weaponAttackType(attacker),Math.max(0,damage))); } catch(error){recordRuntimeError(error);}
}

export function installRuntimeEventWiring(): void {
  world.afterEvents.playerSpawn.subscribe(event=>rememberEntity(event.player));
  world.afterEvents.playerButtonInput.subscribe(event=>{rememberEntity(event.player);mark("INPUT");mark("MOVEMENT");});
  world.afterEvents.playerSwingStart.subscribe(event=>{rememberEntity(event.player);mark("COMBAT");});
  world.afterEvents.playerBreakBlock.subscribe(event=>{rememberEntity(event.player);mark("BLOCK_BREAK");});
  world.afterEvents.playerStartBreakingBlock.subscribe(event=>{rememberEntity(event.player);mark("BLOCK_BREAK");});
  world.afterEvents.playerPlaceBlock.subscribe(event=>{rememberEntity(event.player);mark("BLOCK_PLACE");});
  world.afterEvents.playerInteractWithBlock.subscribe(event=>{rememberEntity(event.player);mark("BLOCK_INTERACTION");});
  world.afterEvents.playerInteractWithEntity.subscribe(event=>{rememberEntity(event.player);mark("NEAR_ENTITY");});
  world.afterEvents.playerInventoryItemChange.subscribe(event=>{rememberEntity(event.player);mark("INVENTORY");});
  world.afterEvents.itemUse.subscribe(event=>{rememberEntity(event.source);mark("ITEM_USE");});
  world.afterEvents.itemStartUse.subscribe(event=>{rememberEntity(event.source);mark("ITEM_USE");});
  world.afterEvents.entityHitEntity.subscribe(event=>{rememberEntity(event.damagingEntity);rememberEntity(event.hitEntity);mark("COMBAT");mark("NEAR_ENTITY");if(isBossEntity(event.hitEntity))mark("BOSS");if(event.damagingEntity.typeId==="minecraft:player"&&event.hitEntity.typeId==="minecraft:player")mark("PVP");});
  world.afterEvents.entityHurt.subscribe(event=>{rememberEntity(event.hurtEntity);mark("COMBAT");if(isBossEntity(event.hurtEntity))mark("BOSS");observeCombat(event.damageSource.damagingEntity,event.hurtEntity,event.damage);});
  world.afterEvents.projectileHitEntity.subscribe(event=>{rememberEntity(event.source);const hit=event.getEntityHit();const entity=hit.entity;if(!entity)return;rememberEntity(entity);if(rememberProjectileEvent(event.projectile.id,entity.id,system.currentTick)){mark("PROJECTILE");observeCombat(event.source,entity,0);}});
  world.afterEvents.projectileHitBlock.subscribe(event=>{rememberEntity(event.source);rememberProjectileEvent(event.projectile.id,`block:${event.dimension.id}:${event.location.x}:${event.location.y}:${event.location.z}`,system.currentTick);mark("PROJECTILE");});
  world.afterEvents.entityDie.subscribe(event=>{rememberEntity(event.deadEntity);mark("IMPORTANT_EVENT");});
  world.afterEvents.leverAction.subscribe(()=>mark("REDSTONE")); world.afterEvents.pistonActivate.subscribe(()=>mark("REDSTONE")); world.afterEvents.pressurePlatePush.subscribe(()=>mark("REDSTONE"));
}
function isBossEntity(entity:Entity):boolean{return entity.typeId==="minecraft:ender_dragon"||entity.typeId==="minecraft:wither"||entity.typeId==="minecraft:warden"||entity.typeId==="minecraft:elder_guardian";}

export class BedrockCombatPort implements CombatExecutionPort {
  public resolveTarget(request:AttackRequest):ResolvedCombatTarget|undefined{pruneTrackedEntities();const attacker=trackedEntities.get(request.attackerId);const direct=trackedEntities.get(request.targetId);if(!attacker?.isValid||!direct?.isValid)return undefined;try{if(attacker.dimension.id!==direct.dimension.id)return undefined;const hits=attacker.getEntitiesFromViewDirection({maxDistance:request.range});const hit=hits.find(candidate=>candidate.entity.id===request.targetId);if(!hit?.entity?.isValid)return undefined;rememberEntity(hit.entity);return{id:hit.entity.id,entity:hit.entity,distance:hit.distance};}catch(error){recordRuntimeError(error);return undefined;}}
  public mitigateArmorDamage(target:ResolvedCombatTarget,_request:AttackRequest,incomingDamage:number):number{const equippable=(target.entity as Entity).getComponent(EntityComponentTypes.Equippable);if(!equippable)throw new Error("ARMOR_COMPONENT_UNAVAILABLE");const armor=Math.max(0,Math.min(100,equippable.totalArmor));const toughness=Math.max(0,Math.min(100,equippable.totalToughness));const reduction=Math.min(0.8,armor*0.04+toughness*0.01);return Math.max(0,incomingDamage*(1-reduction));}
  public mitigateResistanceDamage(target:ResolvedCombatTarget,_request:AttackRequest,incomingDamage:number):number{const resistance=(target.entity as Entity).getEffect("resistance");if(!resistance)return incomingDamage;const reduction=Math.min(0.8,0.2*(resistance.amplifier+1));return Math.max(0,incomingDamage*(1-reduction));}
  public commit(_request:AttackRequest,_target:ResolvedCombatTarget,_plan:CombatCommitPlan):CombatCommitResult{return{committed:false,effectStatuses:[],durabilityStatus:"NOT_VERIFIED",projectileStatus:"NOT_VERIFIED",deathStatus:"NOT_VERIFIED",lootStatus:"NOT_VERIFIED",xpStatus:"NOT_VERIFIED"};}
  public applyEffect(target:ResolvedCombatTarget,effect:CombatEffect):boolean{if(effect.durationTicks<1||effect.durationTicks>20000000)return false;try{(target.entity as Entity).addEffect(effect.id,effect.durationTicks,{amplifier:effect.amplifier,showParticles:true});return true;}catch(error){recordRuntimeError(error);return false;}}
  public applyDurability(request:AttackRequest):boolean{const attacker=trackedEntities.get(request.attackerId);if(!attacker?.isValid)return false;try{const equipment=attacker.getComponent(EntityComponentTypes.Equippable);if(!equipment)return false;const slot=equipment.getEquipmentSlot(EquipmentSlot.Mainhand);const item=slot.getItem();if(!item)return false;const durability=item.getComponent(ItemComponentTypes.Durability);if(!durability||durability.unbreakable)return false;const next=durability.damage+Math.max(0,request.durabilityCost);if(next>=durability.maxDurability)return equipment.setEquipment(EquipmentSlot.Mainhand,undefined);durability.damage=next;slot.setItem(item);return true;}catch(error){recordRuntimeError(error);return false;}}
  public getRuntimeMetrics():RuntimeMetrics{return{trackedEntities:trackedEntityCount(),runtimeErrors:runtimeErrors.length,projectileEventsAccepted,duplicateProjectileEventsRejected};}
}
export function trackedEntityCount():number{pruneTrackedEntities();return trackedEntities.size;}

export function probeRuntime(player:Player):RuntimeProbeResult{const checks:Record<string,RuntimeEvidenceStatus>={};try{checks["player.valid"]=player.isValid?"PASS":"FAIL";checks["system.currentTick"]=Number.isInteger(system.currentTick)?"PASS":"FAIL";const id=system.run(()=>undefined);system.clearRun(id);checks["system.run+clearRun"]="PASS";const direction=player.getViewDirection();checks["player.getViewDirection"]=Number.isFinite(direction.x)&&Number.isFinite(direction.y)&&Number.isFinite(direction.z)?"PASS":"FAIL";checks["player.clientSystemInfo.maxRenderDistance"]=Number.isFinite(player.clientSystemInfo.maxRenderDistance)?"PASS":"NOT_AVAILABLE";checks["player.camera"]=player.camera.isValid?"PASS":"FAIL";checks["player.equippable"]=player.getComponent(EntityComponentTypes.Equippable)?"PASS":"NOT_AVAILABLE";checks["player.inventory"]=player.getComponent(EntityComponentTypes.Inventory)?"PASS":"NOT_AVAILABLE";player.getEffect("resistance");checks["entity.getEffect"]="PASS";const projectileCallback=()=>undefined;world.afterEvents.projectileHitEntity.subscribe(projectileCallback);world.afterEvents.projectileHitEntity.unsubscribe(projectileCallback);const deathCallback=()=>undefined;world.afterEvents.entityDie.subscribe(deathCallback);world.afterEvents.entityDie.unsubscribe(deathCallback);checks["event.projectileHitEntity.binding"]="PASS";checks["event.entityDie.binding"]="PASS";}catch(error){recordRuntimeError(error);checks["runtime.probe"]="FAIL";}return{tick:system.currentTick,checks,client:readClientCapabilities(player)};}
export function installRuntimeHeartbeat(onTick:(tick:number)=>void):void{system.runInterval(()=>{const tick=system.currentTick;samplePlayerPressure(tick);onTick(tick);},5);}
export function installRuntimeHarness():void{const probedPlayers=new Set<string>();world.afterEvents.playerSpawn.subscribe(event=>{if(probedPlayers.has(event.player.id)||probedPlayers.size>=32)return;probedPlayers.add(event.player.id);event.player.sendMessage(`NEXY_RUNTIME_EVIDENCE ${JSON.stringify(probeRuntime(event.player))}`);});}
