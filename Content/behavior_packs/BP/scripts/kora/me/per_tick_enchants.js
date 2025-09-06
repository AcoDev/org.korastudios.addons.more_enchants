import {
    world,
    system,
    EquipmentSlot,
    BlockPermutation
} from "@minecraft/server";
import {
    listOfEnchants
} from './exports';

const highlightLastLocation = new Map();
const magmaWalkerBlocks = new Map(); // Tracks blocks created by Magma Walker

// Initialize dynamic properties for players
world.afterEvents.playerSpawn.subscribe(event => {
    const {
        player,
        initialSpawn
    } = event;
    if (initialSpawn) {
        player.setDynamicProperty("kora_me:lastFallDistance", 0.0);
        player.setDynamicProperty("kora_me:fallStartY", 0.0);
    }
});

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        // --- MAGMA WALKER ---
        if (magmaWalkerBlocks.has(player.id)) {
            const blocks = magmaWalkerBlocks.get(player.id);
            const remainingBlocks = [];
            const revertTick = system.currentTick - 60; // Revert blocks older than 3 seconds (60 ticks)

            for (const blockData of blocks) {
                if (blockData.tick < revertTick) {
                    try {
                        const block = player.dimension.getBlock(blockData.location);
                        // Only revert if it's still basalt
                        if (block && block.typeId === 'minecraft:basalt') {
                            block.setPermutation(BlockPermutation.resolve("minecraft:lava"));
                        }
                    } catch (e) {
                        /* Location might be unloaded, ignore */
                    }
                } else {
                    remainingBlocks.push(blockData);
                }
            }
            magmaWalkerBlocks.set(player.id, remainingBlocks);
        }

        const playerEquippableComponent = player.getComponent("minecraft:equippable");
        const mainhandItem = playerEquippableComponent.getEquipment(EquipmentSlot.Mainhand);
        const Helmet = playerEquippableComponent.getEquipment(EquipmentSlot.Head);
        const Chestplate = playerEquippableComponent.getEquipment(EquipmentSlot.Chest);
        const Leggings = playerEquippableComponent.getEquipment(EquipmentSlot.Legs);
        const Boots = playerEquippableComponent.getEquipment(EquipmentSlot.Feet);
        const playerLavaMovement = player.getComponent("minecraft:lava_movement");

        // --- Mace Passive Logic ---
        const knockbackResistance = player.getComponent("minecraft:knockback_resistance");
        const hasUnstoppableMace = mainhandItem && mainhandItem.typeId === 'minecraft:mace' && mainhandItem.getLore().some(lore => lore.includes(listOfEnchants.is_mace.lvl1[0].displayName));

        if (hasUnstoppableMace) {
            if (!player.hasTag('unstoppable_force_active')) {
                player.addTag('unstoppable_force_active');
                knockbackResistance.setCurrentValue(1.0);
            }
        } else {
            if (player.hasTag('unstoppable_force_active')) {
                player.removeTag('unstoppable_force_active');
                knockbackResistance.resetToDefaultValue();
            }
        }

        if (Chestplate) {
            const ChestplateLores = Chestplate.getLore();
            const hasMagnetismI = ChestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[2].displayName));
            const hasLifeBonusI = ChestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[1].displayName));
            const hasMagnetismII = ChestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[2].displayName));
            const hasLifeBonusII = ChestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[1].displayName));
            const hasMagnetismIII = ChestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[2].displayName));
            const hasLifeBonusIII = ChestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[1].displayName));
            const hasStoneform = ChestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[6].displayName));
            const hasWeightless = ChestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[8].displayName));
            const hasBerserkersCore = ChestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[10].displayName));

            if (hasMagnetismI) {
                player.runCommandAsync('tp @e[type=item,r=5] @s');
            }
            if (hasMagnetismII) {
                player.runCommandAsync('tp @e[type=item,r=10] @s');
            }
            if (hasMagnetismIII) {
                player.runCommandAsync('tp @e[type=item,r=15] @s');
            }

            if (hasLifeBonusI) {
                player.addEffect('absorption', 22, {
                    amplifier: 1,
                    showParticles: false
                });
            }
            if (hasLifeBonusII) {
                player.addEffect('absorption', 22, {
                    amplifier: 2,
                    showParticles: false
                });
            }
            if (hasLifeBonusIII) {
                player.addEffect('absorption', 22, {
                    amplifier: 3,
                    showParticles: false
                });
            }

            if (hasStoneform && player.isSneaking) {
                player.addEffect('resistance', 5, {
                    amplifier: 1,
                    showParticles: false
                });
            }

            if (hasWeightless) {
                if (player.hasEffect('slowness')) player.removeEffect('slowness');
            }

            if (hasBerserkersCore) {
                const health = player.getComponent("minecraft:health");
                const damageBonus = Math.floor((health.defaultValue - health.currentValue) / 4);
                if (damageBonus > 0) {
                    player.addEffect('strength', 5, {
                        amplifier: damageBonus - 1,
                        showParticles: false
                    });
                }
            }
        }

        if (Leggings) {
            const LeggingsLores = Leggings.getLore();
            const hasSpeedI = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[0].displayName));
            const hasSpeedII = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[0].displayName));
            const hasSwiftSneak = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[6].displayName));
            const hasClimber = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[8].displayName));
            const hasWindRunner = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[9].displayName));

            if (hasSpeedI) player.addEffect('speed', 22, {
                amplifier: 0,
                showParticles: false
            });
            if (hasSpeedII) player.addEffect('speed', 22, {
                amplifier: 1,
                showParticles: false
            });

            if (hasSwiftSneak && player.isSneaking) player.addEffect('speed', 22, {
                amplifier: 2,
                showParticles: false
            });
            if (hasClimber && player.isClimbing) player.addEffect('speed', 22, {
                amplifier: 3,
                showParticles: false
            });

            if (hasWindRunner && player.isSprinting) {
                const nearbyEntities = player.dimension.getEntities({
                    location: player.location,
                    maxDistance: 3,
                    families: ["mob"]
                });
                for (const entity of nearbyEntities) {
                    const direction = {
                        x: entity.location.x - player.location.x,
                        y: 0,
                        z: entity.location.z - player.location.z
                    };
                    entity.applyKnockback(direction.x, direction.z, 0.5, 0.1);
                }
            }
            if (system.currentTick % 60 === 0) {
                const endurance3 = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl3[0].displayName));
                const endurance2 = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[2].displayName));
                const endurance1 = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[2].displayName));
                if (endurance3) player.addEffect('saturation', 5, {
                    amplifier: 2,
                    showParticles: false
                });
                else if (endurance2) player.addEffect('saturation', 5, {
                    amplifier: 1,
                    showParticles: false
                });
                else if (endurance1) player.addEffect('saturation', 5, {
                    amplifier: 0,
                    showParticles: false
                });
            }

            if (player.isSprinting && system.currentTick % 40 === 0) {
                const stamina2 = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[1].displayName));
                const stamina1 = LeggingsLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[1].displayName));
                if (stamina2) player.addEffect('saturation', 5, {
                    amplifier: 3,
                    showParticles: false
                });
                else if (stamina1) player.addEffect('saturation', 5, {
                    amplifier: 1,
                    showParticles: false
                });
            }
        }

        if (Boots) {
            const BootsLores = Boots.getLore();
            const hasJumpBoostI = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[1].displayName));
            const hasJumpBoostII = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[1].displayName));
            const hasSlowFalling = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[4].displayName));
            const hasDepthStriderI = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[0].displayName));
            const hasDepthStriderII = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[0].displayName));
            const hasDepthStriderIII = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl3[0].displayName));
            const hasMagmaWalker = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl3[1].displayName));
            const hasShadowstep = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl3[2].displayName));
            const hasTrailblazer = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[4].displayName));
            const hasEarthGrip = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[5].displayName));
            const hasHuntersPaceI = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[3].displayName));
            const hasHuntersPaceII = BootsLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[3].displayName));

            if (hasJumpBoostI) player.addEffect('jump_boost', 22, {
                amplifier: 0,
                showParticles: false
            });
            if (hasJumpBoostII) player.addEffect('jump_boost', 22, {
                amplifier: 1,
                showParticles: false
            });

            let fallStartY = player.getDynamicProperty("kora_me:fallStartY") ?? 0.0;
            const vy = player.getVelocity().y;

            // Start tracking fall
            if (!player.isOnGround && vy < -0.5 && fallStartY === 0.0) {
                player.setDynamicProperty("kora_me:fallStartY", player.location.y);
                fallStartY = player.location.y;
            }

            // Apply slow falling while falling
            if (!player.isOnGround) {
                // Mark start of fall
                if (fallStartY === 0.0 && vy < -0.3) {
                    fallStartY = player.location.y;
                    player.setDynamicProperty("kora_me:fallStartY", fallStartY);

                    if (hasSlowFalling && !player.getEffect("slow_falling")) {
                        player.addEffect("slow_falling", 22, {
                            amplifier: 0,
                            showParticles: false
                        });
                    }
                }

                const fallDistance = fallStartY - player.location.y;
            }

            // Landing logic
            if (player.isOnGround && fallStartY !== 0.0) {
                const fallDistance = fallStartY - player.location.y;
                player.setDynamicProperty("kora_me:fallStartY", 0.0);

                // Remove slow falling when landed
                if (player.getEffect("slow_falling")) {
                    player.removeEffect("slow_falling");
                }
            }

            if (hasDepthStriderI) player.addEffect('water_breathing', 22, {
                amplifier: 0,
                showParticles: false
            });
            if (hasDepthStriderII) player.addEffect('water_breathing', 22, {
                amplifier: 1,
                showParticles: false
            });
            if (hasDepthStriderIII) player.addEffect('water_breathing', 22, {
                amplifier: 2,
                showParticles: false
            });

            if (hasMagmaWalker) {
                const playerY = Math.floor(player.location.y);
                if (playerY > player.dimension.heightRange.min) {
                    const platformCenter = {
                        x: Math.floor(player.location.x),
                        y: playerY - 1,
                        z: Math.floor(player.location.z)
                    };
                    for (let dx = -1; dx <= 1; dx++) {
                        for (let dz = -1; dz <= 1; dz++) {
                            const checkLoc = {
                                x: platformCenter.x + dx,
                                y: platformCenter.y,
                                z: platformCenter.z + dz
                            };
                            try {
                                const block = player.dimension.getBlock(checkLoc);
                                if (block && block.typeId === 'minecraft:lava') {
                                    block.setPermutation(BlockPermutation.resolve("minecraft:basalt"));
                                    if (!magmaWalkerBlocks.has(player.id)) {
                                        magmaWalkerBlocks.set(player.id, []);
                                    }
                                    magmaWalkerBlocks.get(player.id).push({
                                        location: checkLoc,
                                        tick: system.currentTick
                                    });
                                }
                            } catch (e) {
                                /* Location might be unloaded, ignore */
                            }
                        }
                    }
                }
            }

            if (hasShadowstep && player.isSneaking) {
                player.addEffect('invisibility', 22, {
                    amplifier: 0,
                    showParticles: false
                });
            }

            if (hasTrailblazer && player.isSprinting) {
                player.dimension.spawnParticle("minecraft:basic_flame_particle", player.location);
            }

            if (hasEarthGrip && (player.dimension.getBlock({
                    x: player.location.x,
                    y: player.location.y - 1,
                    z: player.location.z
                }).typeId.includes('ice'))) {
                player.addEffect('speed', 22, {
                    amplifier: 0,
                    showParticles: false
                });
            }

            if (hasHuntersPaceI || hasHuntersPaceII) {
                const nearbyEntities = player.dimension.getEntities({
                    location: player.location,
                    maxDistance: 16,
                    families: ["monster"]
                });
                if (nearbyEntities.length > 0) {
                    const speedAmp = hasHuntersPaceII ? 1 : 0;
                    player.addEffect('speed', 22, {
                        amplifier: speedAmp,
                        showParticles: false
                    });
                }
            }
        };

        // --- SHOCKWAVE LOGIC ---
        if (Boots) {
            const bootLores = Boots.getLore();
            const hasShockwave = bootLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[5].displayName));

            if (hasShockwave) {
                if (!world.__shockwaveSubscribed) {
                    world.__shockwaveSubscribed = true;

                    world.afterEvents.entityHurt.subscribe(ev => {
                        const {
                            hurtEntity,
                            damageSource,
                            damage
                        } = ev;
                        if (hurtEntity.typeId !== "minecraft:player") return;
                        const player = hurtEntity;

                        // Trigger shockwave only when the player takes fall damage
                        if (damageSource.cause === "fall" && damage > 0) {
                            const Boots = player.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Feet);
                            if (!Boots) return;

                            const bootLores = Boots.getLore();
                            const hasShockwave = bootLores.some(lore =>
                                lore.includes(listOfEnchants.is_boots.lvl2[5].displayName)
                            );
                            if (!hasShockwave) return;

                            const radius = 3;
                            const entities = player.dimension.getEntities({
                                location: player.location,
                                maxDistance: radius,
                                excludeFamilies: ["inanimate"],
                            });

                            for (const target of entities) {
                                if (target.id === player.id) continue;

                                // Knockback
                                const dx = target.location.x - player.location.x;
                                const dz = target.location.z - player.location.z;
                                const len = Math.max(Math.sqrt(dx * dx + dz * dz), 0.01);
                                target.applyKnockback(dx / len, dz / len, 1, 0.5);

                                // Deal damage (1 heart)
                                target.applyDamage(2, {
                                    cause: "entityAttack",
                                    damagingEntity: player,
                                });
                            }

                            // Visual effect
                            player.dimension.spawnParticle(
                                "minecraft:knockback_roar_particle",
                                player.location
                            );
                        }
                    });
                }
            } else {
                player.setDynamicProperty("kora_me:lastFallDistance", 0.0);
            }
        } else {
            player.setDynamicProperty("kora_me:lastFallDistance", 0.0);
        }

        // --- Start of Helmet Logic ---
        const hasHighlightEnchant = Helmet && Helmet.getLore().some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[3].displayName));
        const lastPos = highlightLastLocation.get(player.id);

        if (hasHighlightEnchant) {
            const headLocation = player.getHeadLocation();
            const currentPos = {
                x: Math.floor(headLocation.x),
                y: Math.floor(headLocation.y),
                z: Math.floor(headLocation.z)
            };

            if (!lastPos || lastPos.x !== currentPos.x || lastPos.y !== currentPos.y || lastPos.z !== currentPos.z) {
                if (lastPos) {
                    try {
                        player.dimension.runCommandAsync(`fill ${lastPos.x} ${lastPos.y} ${lastPos.z} ${lastPos.x} ${lastPos.y} ${lastPos.z} air replace light_block`);
                    } catch (e) {}
                }

                try {
                    player.dimension.runCommandAsync(`fill ${currentPos.x} ${currentPos.y} ${currentPos.z} ${currentPos.x} ${currentPos.y} ${currentPos.z} light_block ["block_light_level" = 15] replace air`);
                } catch (e) {}
                highlightLastLocation.set(player.id, currentPos);
            }
        } else if (lastPos) {
            try {
                player.dimension.runCommandAsync(`fill ${lastPos.x} ${lastPos.y} ${lastPos.z} ${lastPos.x} ${lastPos.y} ${lastPos.z} air replace light_block`);
            } catch (e) {}
            highlightLastLocation.delete(player.id);
        }

        if (Helmet) {
            const HelmetLores = Helmet.getLore();
            const hasLavaSwimmerI = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[0].displayName));
            const hasLavaSwimmerII = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[0].displayName));
            const hasLavaSwimmerIII = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[0].displayName));
            const hasClarity = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[4].displayName));
            const hasNightVision = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[4].displayName));
            const hasPhotosynthesis = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[5].displayName));
            const hasAquaBreather1 = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[1].displayName));
            const hasAquaBreather2 = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[1].displayName));
            const hasAquaBreather3 = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[1].displayName));
            const hasMindShield = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[5].displayName));
            const hasMoonsGrace = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[7].displayName));
            const hasBeastSense = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[6].displayName));
            const hasEchoLocator = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[4].displayName));
            const hasSolarShield = HelmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[6].displayName));

            if (hasLavaSwimmerI || hasLavaSwimmerII || hasLavaSwimmerIII) {
                player.addEffect('fire_resistance', 22, {
                    amplifier: 0,
                    showParticles: false
                });
                if (hasLavaSwimmerI) playerLavaMovement.setCurrentValue(0.07);
                else if (hasLavaSwimmerII) playerLavaMovement.setCurrentValue(0.12);
                else if (hasLavaSwimmerIII) playerLavaMovement.setCurrentValue(0.2);
            } else {
                player.removeEffect('fire_resistance');
                playerLavaMovement.resetToDefaultValue();
            }

            if (hasClarity) {
                player.removeEffect('blindness');
                player.removeEffect('nausea');
            }

            if (hasNightVision) player.addEffect('night_vision', 400, {
                showParticles: false
            });

            if (hasPhotosynthesis && world.getTimeOfDay() < 12000 && !player.isInsideBlock) {
                player.addEffect('saturation', 20, {
                    amplifier: 0,
                    showParticles: false
                });
            }

            if (hasAquaBreather1) player.addEffect('water_breathing', 20, {
                amplifier: 0,
                showParticles: false
            });
            if (hasAquaBreather2) player.addEffect('water_breathing', 20, {
                amplifier: 1,
                showParticles: false
            });
            if (hasAquaBreather3) player.addEffect('water_breathing', 20, {
                amplifier: 2,
                showParticles: false
            });

            if (hasMindShield) {
                player.removeEffect('weakness');
                player.removeEffect('mining_fatigue');
            }

            if (hasMoonsGrace && world.getTimeOfDay() > 12000) { // Night time
                player.addEffect('regeneration', 40, {
                    amplifier: 0,
                    showParticles: false
                });
            }

            if (hasBeastSense) {
                const nearbyEntities = player.dimension.getEntities({
                    location: player.location,
                    maxDistance: 20,
                    families: ["monster"]
                });
                for (const entity of nearbyEntities) {
                    entity.addEffect('glowing', 2, {
                        amplifier: 0,
                        showParticles: false
                    });
                }
            }

            if (hasEchoLocator && system.currentTick % 20 === 0) { // Run once per second to reduce particle spam
                const nearbyEntities = player.dimension.getEntities({
                    location: player.location,
                    maxDistance: 16,
                    families: ["mob"]
                });
                for (const entity of nearbyEntities) {
                    if (entity !== player) {
                        entity.dimension.spawnParticle("minecraft:sonic_explosion", entity.location);
                    }
                }
            }

            if (hasSolarShield && world.getTimeOfDay() > 12000) {
                const nearbyPhantoms = player.dimension.getEntities({
                    location: player.location,
                    maxDistance: 16,
                    type: "minecraft:phantom"
                });
                for (const phantom of nearbyPhantoms) {
                    const direction = {
                        x: phantom.location.x - player.location.x,
                        y: phantom.location.y - player.location.y,
                        z: phantom.location.z - player.location.z
                    };

                    const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2);
                    if (magnitude > 0) {
                        const pushStrength = 0.4;
                        const impulse = {
                            x: (direction.x / magnitude) * pushStrength,
                            y: (direction.y / magnitude) * pushStrength,
                            z: (direction.z / magnitude) * pushStrength
                        };
                        phantom.applyImpulse(impulse);
                    }
                }
            }

        } else {
            playerLavaMovement.resetToDefaultValue();
        };
    }
}, 1);