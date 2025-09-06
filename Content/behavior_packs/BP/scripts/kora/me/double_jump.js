import {
    world,
    system,
    EquipmentSlot
} from "@minecraft/server";
import {
    listOfEnchants,
    onJumpAfterEvent
} from './exports';

// Use dynamic properties to track player states
const DOUBLE_JUMP_USED = "kora_me:double_jump_used";
const WALL_KICK_COOLDOWN = "kora_me:wall_kick_cooldown";
const WIND_LEAP_COOLDOWN = "kora_me:wind_leap_cooldown";

// Initialize properties for new players
world.afterEvents.playerSpawn.subscribe(event => {
    const {
        player,
        initialSpawn
    } = event;
    if (initialSpawn) {
        player.setDynamicProperty(DOUBLE_JUMP_USED, false);
        player.setDynamicProperty(WALL_KICK_COOLDOWN, 0);
        player.setDynamicProperty(WIND_LEAP_COOLDOWN, 0);
    }
});

// Reset jump state when the player lands on the ground and handle cooldowns
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        if (player.isOnGround) {
            player.setDynamicProperty(DOUBLE_JUMP_USED, false);
        }
        const wallKickCooldown = player.getDynamicProperty(WALL_KICK_COOLDOWN);
        if (typeof wallKickCooldown === 'number' && wallKickCooldown > 0) {
            player.setDynamicProperty(WALL_KICK_COOLDOWN, wallKickCooldown - 1);
        }
        const windLeapCooldown = player.getDynamicProperty(WIND_LEAP_COOLDOWN);
        if (typeof windLeapCooldown === 'number' && windLeapCooldown > 0) {
            player.setDynamicProperty(WIND_LEAP_COOLDOWN, windLeapCooldown - 1);
        }
    }
});

// Use the custom onJumpAfterEvent for perfect jump detection
new onJumpAfterEvent((event) => {
    const {
        player
    } = event;

    try {
        const leggings = player.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Legs);
        const boots = player.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Feet);

        if (leggings) {
            const lores = leggings.getLore();

            // --- Double Jump Logic ---
            const hasDoubleJump = lores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl3[2].displayName));
            const hasUsedDoubleJump = player.getDynamicProperty(DOUBLE_JUMP_USED);

            if (hasDoubleJump && !hasUsedDoubleJump && !player.isOnGround) {
                player.addEffect("jump_boost", 10, {
                    amplifier: 8,
                    showParticles: false
                });
                player.dimension.spawnParticle("minecraft:cloud", player.location);
                player.playSound("mob.ghast.shoot", {
                    volume: 0.5,
                    pitch: 1.5
                });
                player.setDynamicProperty(DOUBLE_JUMP_USED, true);
                return; // Prioritize Double Jump
            }

            // --- Wall Kick Logic ---
            const hasWallKick = lores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl3[3].displayName));
            const onCooldown = player.getDynamicProperty(WALL_KICK_COOLDOWN) > 0;

            if (hasWallKick && !onCooldown && !player.isOnGround) {
                const headLocation = player.getHeadLocation();

                const directions = [{
                        x: 1,
                        y: 0,
                        z: 0
                    }, {
                        x: -1,
                        y: 0,
                        z: 0
                    },
                    {
                        x: 0,
                        y: 0,
                        z: 1
                    }, {
                        x: 0,
                        y: 0,
                        z: -1
                    }
                ];

                for (const dir of directions) {
                    const blockHit = player.dimension.getBlockFromRay(headLocation, dir, {
                        maxDistance: 1.5
                    });
                    if (blockHit) {
                        player.applyKnockback(-dir.x, -dir.z, 3.5, 0.45);
                        player.dimension.spawnParticle("minecraft:crit", blockHit.block.location);
                        player.playSound("mob.irongolem.hit", {
                            volume: 0.6,
                            pitch: 1.2
                        });
                        player.setDynamicProperty(WALL_KICK_COOLDOWN, 20); // 1-second cooldown
                        break;
                    }
                }
            }
        }

        if (boots) {
            const bootLores = boots.getLore();
            const hasWindLeaperI = bootLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[2].displayName));
            const hasWindLeaperII = bootLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[2].displayName));
            const onCooldown = player.getDynamicProperty(WIND_LEAP_COOLDOWN) > 0;

            if ((hasWindLeaperI || hasWindLeaperII) && !onCooldown && player.isJumping) {
                const view = player.getViewDirection();
                const leapStrength = hasWindLeaperII ? 1.5 : 1;
                player.applyImpulse({
                    x: view.x * leapStrength,
                    y: 0.2,
                    z: view.z * leapStrength
                });
                player.dimension.spawnParticle("minecraft:poof", player.location);
                player.setDynamicProperty(WIND_LEAP_COOLDOWN, 40); // 2-second cooldown
            }
        }
    } catch (e) {
        console.error(`Error in jump event for ${player.name}: ${e}`);
    }
});