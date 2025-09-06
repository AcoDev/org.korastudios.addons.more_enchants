import {
    world,
    system
} from "@minecraft/server";
import {
    listOfEnchants
} from './exports';

// A map to track which player is shooting, to identify arrow owners for 'True Shot'
const shootingPlayers = new Map();

// Listen for when an item is being used (bow drawing)
world.beforeEvents.itemUse.subscribe(event => {
    const {
        source: player,
        itemStack
    } = event;
    if (itemStack.typeId.endsWith('bow')) { // Works for both bow and crossbow
        const lores = itemStack.getLore();
        const hasQuickDraw = lores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[3].displayName));

        if (hasQuickDraw) {
            player.addEffect('haste', 20, {
                amplifier: 4,
                showParticles: false
            }); // Haste V for 1 second
        }

        // Tag the player with the current tick for owner detection of the spawned arrow
        shootingPlayers.set(player.id, system.currentTick);
    }
});

// Listen for after an item has been used (bow/crossbow fired)
world.afterEvents.itemUse.subscribe(event => {
    const {
        source: player,
        itemStack
    } = event;

    if (itemStack.typeId.endsWith('bow')) {
        const lores = itemStack.getLore();
        const viewDirection = player.getViewDirection();
        const headLocation = player.getHeadLocation();

        // Use a 1-tick delay to ensure the original arrow has spawned before we try to remove it
        system.run(() => {
            // Ghast Charge Logic
            const hasGhastCharge = lores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[1].displayName));
            if (hasGhastCharge) {
                const fireball = player.dimension.spawnEntity('minecraft:fireball', headLocation);
                fireball.applyImpulse({
                    x: viewDirection.x,
                    y: viewDirection.y,
                    z: viewDirection.z
                });
                player.runCommandAsync('kill @e[type=arrow,r=2,c=1]');
                return; // Stop processing other enchantments that replace projectiles
            }

            // TNT Shot Logic
            const hasTntShot = lores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[3].displayName));
            if (hasTntShot) {
                const tnt = player.dimension.spawnEntity('minecraft:tnt', headLocation);
                tnt.applyImpulse({
                    x: viewDirection.x * 0.8,
                    y: viewDirection.y * 0.8,
                    z: viewDirection.z * 0.8
                });
                player.runCommandAsync('kill @e[type=arrow,r=2,c=1]');
                return;
            }

            // God Beam Logic
            const hasGodBeam = lores.some(lore => lore.includes(listOfEnchants.is_bow.lvl1[1].displayName));
            if (hasGodBeam) {
                player.runCommandAsync('kill @e[type=arrow,r=2,c=1]');

                // Genera un rayo de partículas
                for (let i = 1; i < 64; i += 2) {
                    const pos = {
                        x: headLocation.x + viewDirection.x * i,
                        y: headLocation.y + viewDirection.y * i,
                        z: headLocation.z + viewDirection.z * i
                    };
                    player.dimension.spawnParticle("minecraft:guardian_attack_particle", pos);
                }

                const raycastResult = player.dimension.getEntitiesFromRay(headLocation, viewDirection, {
                    maxDistance: 64
                });
                for (const hit of raycastResult) {
                    hit.entity.applyDamage(10, {
                        damagingEntity: player,
                        cause: 'magic'
                    });
                }
                return;
            }
        });
    }
});

/**
 * Handles the logic for any projectile hit event (block or entity).
 * @param {import('@minecraft/server').ProjectileHitBlockAfterEvent | import('@minecraft/server').ProjectileHitEntityAfterEvent} event
 */
function handleProjectileHit(event) {
    const {
        projectile,
        source
    } = event;

    if (source && source.typeId === 'minecraft:player' && projectile.typeId === 'minecraft:arrow') {
        const player = source;
        const mainhandItem = player.getComponent('minecraft:equippable').getEquipment('Mainhand');

        if (mainhandItem && (mainhandItem.typeId.endsWith('bow'))) {
            const lores = mainhandItem.getLore();
            const hitBlock = event.getBlockHit ? event.getBlockHit()?.block : undefined;
            const hitEntity = event.getEntityHit ? event.getEntityHit()?.entity : undefined;

            // Freeze Shot Logic
            const hasFreezeShot1 = lores.some(lore => lore.includes(listOfEnchants.is_bow.lvl1[0].displayName));
            const hasFreezeShot2 = lores.some(lore => lore.includes(listOfEnchants.is_bow.lvl2[0].displayName));
            const hasFreezeShot3 = lores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[0].displayName));
            if ((hasFreezeShot1 || hasFreezeShot2 || hasFreezeShot3) && hitEntity) {

                if (!hitEntity.isValid()) {
                    return;
                }

                const level = hasFreezeShot3 ? 3 : hasFreezeShot2 ? 2 : 1;
                const durationTicks = 40 * level; // 2 seconds per level

                hitEntity.addEffect('slowness', durationTicks, {
                    amplifier: 255,
                    showParticles: false
                });

                // Create a particle effect that lasts for the duration of the freeze
                let ticksElapsed = 0;
                const particleInterval = system.runInterval(() => {
                    if (ticksElapsed >= durationTicks || !hitEntity.isValid()) {
                        system.clearRun(particleInterval);
                        return;
                    }
                    const {
                        x,
                        y,
                        z
                    } = hitEntity.location;
                    // Use a more visible particle with the /particle command for better control
                    hitEntity.runCommandAsync(`particle minecraft:ice_evaporation_emitter ${x} ${y + 1} ${z}`);
                    ticksElapsed += 5;
                }, 5); // Run every 5 ticks
            }

            // Grapple Shot Logic
            const hasGrappleShot = lores.some(lore => lore.includes(listOfEnchants.is_bow.lvl1[2].displayName));
            if (hasGrappleShot && (hitBlock || hitEntity)) {
                const targetLocation = projectile.location;
                const playerLocation = player.location;

                player.dimension.spawnParticle("minecraft:endrod", playerLocation);
                player.dimension.spawnParticle("minecraft:endrod", targetLocation);

                player.teleport(targetLocation, {
                    dimension: player.dimension
                });
                player.addEffect('slow_falling', 100, {
                    amplifier: 1,
                    showParticles: false
                });
            }
        }
    }
}

// Subscribe our unified handler to both specific projectile hit events
world.afterEvents.projectileHitBlock.subscribe(handleProjectileHit);
world.afterEvents.projectileHitEntity.subscribe(handleProjectileHit);

// Handle True Shot by modifying arrow velocity upon spawn
world.afterEvents.entitySpawn.subscribe(event => {
    const { entity } = event;

    if (entity.typeId === 'minecraft:arrow') {
        const projectileComp = entity.getComponent('minecraft:projectile');
        if (!projectileComp) return;

        const owner = projectileComp.owner;
        if (!owner) return;

        const mainhandItem = owner.getComponent('minecraft:equippable')?.getEquipment('Mainhand');
        if (!mainhandItem || !mainhandItem.typeId.endsWith('bow')) return;

        const lores = mainhandItem.getLore();
        const hasTrueShot = lores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[4].displayName));

        if (hasTrueShot) {
            // Tag the arrow for extra damage
            entity.nameTag = 'TrueShot';
        }
    }
});

world.afterEvents.entityHurt.subscribe(event => {
    const { damagingEntity, hurtEntity } = event;

    if (damagingEntity?.typeId === 'minecraft:arrow' && damagingEntity.nameTag === 'TrueShot') {
        const pos = hurtEntity.location;
        hurtEntity.runCommand(
            `effect give @e[x=${pos.x},y=${pos.y},z=${pos.z},r=0] instant_damage 1 1 true`
        );
    }
});