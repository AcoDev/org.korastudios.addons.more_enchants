import {
    world,
    system,
    EquipmentSlot,
    ItemStack,
    MolangVariableMap
} from '@minecraft/server';
import {
    listOfEnchants
} from './exports';

system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        let cooldown = player.getDynamicProperty("kora_me:teleport_cooldown");

        if (cooldown && cooldown > 0) {
            // Use floor so it hits 0 in the last second
            const secondsLeft = Math.floor(cooldown / 20);

            if (secondsLeft > 0) {
                player.onScreenDisplay.setActionBar(
                    `§cTeleport Cooldown: §e${secondsLeft}s`
                );
            } else {
                player.onScreenDisplay.setActionBar('');
            }
            player.setDynamicProperty("kora_me:teleport_cooldown", cooldown - 1);
        } else if (cooldown === 0) {
            player.setDynamicProperty("kora_me:teleport_cooldown", undefined);
        }
    }
}, 1);

world.afterEvents.entityHurt.subscribe((event) => {
    let {
        hurtEntity,
        damageSource,
        damage
    } = event;
    const attacker = damageSource.damagingEntity;

    // This is the most common source of errors. If the entity died from the initial hit,
    // it becomes invalid, and trying to access its properties will throw an error.
    if (!hurtEntity?.isValid()) {
        return;
    }

    // Prevent recursive damage from any enchantment in this file.
    // If an entity is already being damaged by an enchant, ignore this event.
    if (hurtEntity.getDynamicProperty("kora_me:is_enchant_damage")) {
        return;
    }

    // --- Effects activated by the player when attacking ---
    if (attacker?.typeId === 'minecraft:player') {
        const playerEquippableComponent = attacker.getComponent("minecraft:equippable");
        const mainhandItem = playerEquippableComponent.getEquipment(EquipmentSlot.Mainhand);

        if (!mainhandItem) return;
        const itemLores = mainhandItem.getLore();

        // --- Sword Logic ---
        if (mainhandItem.getTags().some(tag => tag === 'minecraft:is_sword')) {
            const enchants = {
                waveOfFireI: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[0].displayName)),
                venomousStrikeI: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[1].displayName)),
                momentumI: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[2].displayName)),
                disorientingStrikeI: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[3].displayName)),
                disarmI: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[4].displayName)),
                leechingStrike: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[5].displayName)),
                guardBreak: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[6].displayName)),
                cursedEdge: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[7].displayName)),
                gravityWellI: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[8].displayName)),
                waveOfFireII: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[0].displayName)),
                lifesteal: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[1].displayName)),
                venomousStrikeII: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[2].displayName)),
                momentumII: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[3].displayName)),
                disorientingStrikeII: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[4].displayName)),
                disarmII: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[5].displayName)),
                arcaneBurst: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[6].displayName)),
                waveOfFireIII: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[0].displayName)),
                lifestealII: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[1].displayName)),
                witherTouch: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[2].displayName)),
                sweepingEdge: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[3].displayName)),
                momentumIII: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[4].displayName)),
                gravityWellII: itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[5].displayName)),
            };

            // Apply Effects
            if (enchants.waveOfFireI) hurtEntity.dimension.getEntities({
                families: ['mob'],
                location: attacker.location,
                maxDistance: 4
            }).forEach(e => e.setOnFire(1, true));
            if (enchants.waveOfFireII) hurtEntity.dimension.getEntities({
                families: ['mob'],
                location: attacker.location,
                maxDistance: 5
            }).forEach(e => e.setOnFire(2, true));
            if (enchants.waveOfFireIII) hurtEntity.dimension.getEntities({
                families: ['mob'],
                location: attacker.location,
                maxDistance: 6
            }).forEach(e => e.setOnFire(3, true));
            if (enchants.witherTouch) hurtEntity.addEffect('wither', 60, {
                amplifier: 1
            });
            if (enchants.lifesteal || enchants.lifestealII) {
                const h = attacker.getComponent('minecraft:health');
                if (h.currentValue < h.defaultValue) {
                    const healAmount = enchants.lifestealII ? 2 : 1;
                    h.setCurrentValue(Math.min(h.defaultValue, h.currentValue + healAmount));
                    attacker.dimension.spawnParticle("minecraft:heart_particle", attacker.location);
                }
            }
            if (enchants.venomousStrikeI) {
                hurtEntity.addEffect('poison', 100, {
                    amplifier: 5
                });
                const molangMap = new MolangVariableMap();
                molangMap.setColorRGBA("color", { red: 0.3, green: 1.0, blue: 0.3, alpha: 1.0 });
                hurtEntity.dimension.spawnParticle("minecraft:mobspell_emitter", hurtEntity.location, molangMap);
            }
            if (enchants.venomousStrikeII) {
                hurtEntity.addEffect('poison', 100, {
                    amplifier: 8
                });
                const molangMap = new MolangVariableMap();
                molangMap.setColorRGBA("color", { red: 0.1, green: 0.8, blue: 0.1, alpha: 1.0 });
                hurtEntity.dimension.spawnParticle("minecraft:mobspell_emitter", hurtEntity.location, molangMap);
            }
            if (enchants.sweepingEdge) {
                hurtEntity.dimension.getEntities({
                    location: hurtEntity.location,
                    maxDistance: 4,
                    excludeTags: [attacker.id]
                }).forEach(e => {
                    if (e !== hurtEntity && e.typeId !== 'minecraft:player') {
                        e.setDynamicProperty("kora_me:is_enchant_damage", true);
                        e.applyDamage(Math.floor(damage * 0.5), {
                            damagingEntity: attacker,
                            cause: 'entityAttack'
                        });
                        system.run(() => {
                            if (e.isValid()) {
                                e.setDynamicProperty("kora_me:is_enchant_damage", undefined);
                            }
                        });
                    }
                });
            }
            if (enchants.momentumI) {
                attacker.addEffect('speed', 30, {
                    amplifier: 0,
                    showParticles: false
                });
                attacker.addEffect('haste', 30, {
                    amplifier: 0,
                    showParticles: false
                });
            }
            if (enchants.momentumII) {
                attacker.addEffect('speed', 50, {
                    amplifier: 0,
                    showParticles: false
                });
                attacker.addEffect('haste', 50, {
                    amplifier: 0,
                    showParticles: false
                });
            }
            if (enchants.momentumIII) {
                attacker.addEffect('speed', 80, {
                    amplifier: 0,
                    showParticles: false
                });
                attacker.addEffect('haste', 80, {
                    amplifier: 0,
                    showParticles: false
                });
            }
            if (enchants.disorientingStrikeI && Math.random() < 0.2) hurtEntity.addEffect('slowness', 60, {
                amplifier: 0
            });
            if (enchants.disorientingStrikeII && Math.random() < 0.25) {
                hurtEntity.addEffect('slowness', 60, {
                    amplifier: 0
                });
                hurtEntity.addEffect('nausea', 60, {
                    amplifier: 0
                });
            }
            if (enchants.disarmI && Math.random() < 0.05) hurtEntity.runCommandAsync('replaceitem entity @s slot.weapon.mainhand 0 air');
            if (enchants.disarmII && Math.random() < 0.1) hurtEntity.runCommandAsync('replaceitem entity @s slot.weapon.mainhand 0 air');
            if (enchants.arcaneBurst && Math.random() < 0.15) {
                const {
                    x,
                    y,
                    z
                } = hurtEntity.location;
                attacker.runCommandAsync(`summon evocation_fang ${x} ${y} ${z}`);
            }
            if (enchants.leechingStrike && Math.random() < 0.2) attacker.runCommandAsync('experience add @s 1 points');
            if (enchants.guardBreak && Math.random() < 0.25) hurtEntity.addEffect('weakness', 20, {
                amplifier: 2
            });
            if (enchants.cursedEdge) {
                hurtEntity.setDynamicProperty("kora_me:is_enchant_damage", true);
                hurtEntity.applyDamage(damage + 5, {
                    damagingEntity: attacker,
                    cause: 'entityAttack'
                });
                system.run(() => {
                    if (hurtEntity.isValid()) {
                        hurtEntity.setDynamicProperty("kora_me:is_enchant_damage", undefined);
                    }
                });
                if (Math.random() < 0.1) attacker.addEffect('wither', 40, {
                    amplifier: 0
                });
            }
            if ((enchants.gravityWellI || enchants.gravityWellII) && !attacker.isOnGround) {
                const radius = enchants.gravityWellII ? 5 : 3;
                hurtEntity.dimension.getEntities({
                    location: hurtEntity.location,
                    maxDistance: radius,
                    families: ['mob']
                }).forEach(e => {
                    if (e !== hurtEntity) {
                        const pullVectorRaw = {
                            x: hurtEntity.location.x - e.location.x,
                            y: 0,
                            z: hurtEntity.location.z - e.location.z
                        };
                        const magnitude = Math.sqrt(pullVectorRaw.x ** 2 + pullVectorRaw.z ** 2);
                        if (magnitude === 0) return;
                        const pullVectorNormalized = {
                            x: pullVectorRaw.x / magnitude,
                            z: pullVectorRaw.z / magnitude
                        };
                        e.applyKnockback(pullVectorNormalized.x, pullVectorNormalized.z, 1, 0.5);
                    }
                });
            }
        }

        // --- Axe Logic ---
        if (mainhandItem.getTags().some(tag => tag === 'minecraft:is_axe')) {
            const enchants = {
                cripplingBlowI: itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[0].displayName)),
                cripplingBlowII: itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[0].displayName)),
                echoStrikeI: itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[7].displayName)),
                echoStrikeII: itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[6].displayName)),
                thunderChop: itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[2].displayName)),
                berserkerI: itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[4].displayName)),
                berserkerII: itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[7].displayName)),
                berserkerIII: itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[3].displayName)),
            };

            if (enchants.cripplingBlowI) hurtEntity.addEffect('slowness', 60, {
                amplifier: 0
            });
            if (enchants.cripplingBlowII) hurtEntity.addEffect('slowness', 100, {
                amplifier: 1
            });

            if (enchants.echoStrikeI || enchants.echoStrikeII) {
                const delay = enchants.echoStrikeII ? 10 : 20; // 0.25s for Lvl 2, 0.5s for Lvl 1
                system.runTimeout(() => {
                    if (hurtEntity.isValid()) {
                        // Set a property to prevent this damage from re-triggering the enchant
                        hurtEntity.setDynamicProperty("kora_me:is_enchant_damage", true);
                        hurtEntity.applyDamage(damage * 0.5, {
                            damagingEntity: attacker,
                            cause: 'entityAttack'
                        });
                        // On the next tick, remove the property so the enchant can trigger again on a new, separate hit
                        system.run(() => {
                            if (hurtEntity.isValid()) {
                                hurtEntity.setDynamicProperty("kora_me:is_enchant_damage", undefined);
                            }
                        });
                    }
                }, delay);
            }

            if (enchants.thunderChop && attacker.dimension.getWeather().lightning) {
                if (Math.random() < 0.1) {
                }
            }
            // Thunder Chop: 15% chance to strike the target with lightning, regardless of weather.
            if (enchants.thunderChop) {
                if (Math.random() < 0.15) {
                    attacker.dimension.spawnEntity("minecraft:lightning_bolt", hurtEntity.location);
                }
            }

            if (enchants.berserkerI) attacker.addEffect('speed', 60, {
                amplifier: 0
            });
            if (enchants.berserkerII) attacker.addEffect('speed', 80, {
                amplifier: 1
            });
            if (enchants.berserkerIII) attacker.addEffect('speed', 100, {
                amplifier: 2
            });
        }

        // --- Mace Logic ---
        if (mainhandItem && mainhandItem.typeId === 'minecraft:mace') {
            const enchants = {
                lightningSmashI: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl1[1].displayName)),
                earthquakeI: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl1[2].displayName)),
                crushingWaveI: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl1[3].displayName)),
                concussiveBlowI: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl1[4].displayName)),
                lightningSmashII: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl2[0].displayName)),
                earthquakeII: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl2[1].displayName)),
                crushingWaveII: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl2[2].displayName)),
                concussiveBlowII: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl2[3].displayName)),
                lightningSmashIII: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl3[0].displayName)),
                earthquakeIII: itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl3[1].displayName)),
            };

            // Effects on hit
            if ((enchants.lightningSmashI && Math.random() < 0.1) || (enchants.lightningSmashII && Math.random() < 0.2) || (enchants.lightningSmashIII && Math.random() < 0.3)) {
                hurtEntity.dimension.spawnEntity('minecraft:lightning_bolt', hurtEntity.location);
            }
            if (enchants.concussiveBlowI && Math.random() < 0.15) {
                hurtEntity.addEffect('slowness', 60, {
                    amplifier: 1
                });
            }
            if (enchants.concussiveBlowII && Math.random() < 0.25) {
                hurtEntity.addEffect('slowness', 80, {
                    amplifier: 1
                });
                hurtEntity.addEffect('nausea', 80, {
                    amplifier: 0
                });
            }

            // Falling attack effects
            if (attacker.fallDistance > 1.5) {
                const radius = enchants.earthquakeIII ? 6 : (enchants.earthquakeII ? 5 : (enchants.earthquakeI ? 4 : 0));
                if (radius > 0) {
                    attacker.runCommandAsync(`particle minecraft:knockback_roar_particle ${hurtEntity.location.x} ${hurtEntity.location.y} ${hurtEntity.location.z}`);
                    const nearbyEntities = hurtEntity.dimension.getEntities({
                        location: hurtEntity.location,
                        maxDistance: radius,
                        excludeTags: [attacker.id]
                    });
                    for (const entity of nearbyEntities) {
                        if (entity !== hurtEntity) {
                            entity.setDynamicProperty("kora_me:is_enchant_damage", true);
                            entity.applyDamage(Math.floor(damage * 0.4), {
                                damagingEntity: attacker,
                                cause: 'entityAttack'
                            });
                            system.run(() => {
                                if (entity.isValid()) {
                                    entity.setDynamicProperty("kora_me:is_enchant_damage", undefined);
                                }
                            });
                            entity.addEffect('slowness', 100, {
                                amplifier: 1
                            });
                        }
                    }
                }

                const knockbackRadius = enchants.crushingWaveII ? 5 : (enchants.crushingWaveI ? 4 : 0);
                if (knockbackRadius > 0) {
                    const nearbyEntities = hurtEntity.dimension.getEntities({
                        location: hurtEntity.location,
                        maxDistance: knockbackRadius,
                        excludeTags: [attacker.id]
                    });
                    for (const entity of nearbyEntities) {
                        if (entity !== hurtEntity) {
                            const pullVectorRaw = {
                                x: entity.location.x - hurtEntity.location.x,
                                y: 0,
                                z: entity.location.z - hurtEntity.location.z
                            };
                            const magnitude = Math.sqrt(pullVectorRaw.x ** 2 + pullVectorRaw.z ** 2);
                            if (magnitude === 0) continue;
                            const pullVectorNormalized = {
                                x: pullVectorRaw.x / magnitude,
                                z: pullVectorRaw.z / magnitude
                            };
                            entity.applyKnockback(pullVectorNormalized.x, pullVectorNormalized.z, 2.5, 0.5);
                        }
                    }
                }
            }
        }
    }

    // --- Logic for when the player is hurt ---
    if (hurtEntity.typeId === 'minecraft:player') {
        const player = hurtEntity;
        const health = player.getComponent("minecraft:health");
        if (!health) return; // Failsafe

        const chestplate = player.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Chest);
        const helmet = player.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Head);
        const leggings = player.getComponent("minecraft:equippable").getEquipment(EquipmentSlot.Legs);

        let totalDamageToHeal = 0;

        if (chestplate) {
            const chestplateLores = chestplate.getLore();

            // *** NEW: TELEPORTATION ON-DAMAGE LOGIC ***
            const hasTeleportationI = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[8].displayName));
            const hasTeleportationII = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[8].displayName));
            const hasTeleportationIII = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[11].displayName));
            const onCooldown = player.getDynamicProperty("kora_me:teleport_cooldown") > 0;

            if ((hasTeleportationI || hasTeleportationII || hasTeleportationIII) && !onCooldown) {
                let distance = 0;
                let cooldownTime = 100; // 5 seconds
                let chance = 0;

                if (hasTeleportationIII) {
                    distance = 12;
                    cooldownTime = 60; // 3 seconds
                    chance = 0.5; // 50% chance
                } else if (hasTeleportationII) {
                    distance = 9;
                    cooldownTime = 100; // 5 seconds
                    chance = 0.35; // 35% chance
                } else if (hasTeleportationI) {
                    distance = 6;
                    cooldownTime = 140; // 7 seconds
                    chance = 0.20; // 20% chance
                }

                if (Math.random() < chance) {
                    for (let i = 0; i < 10; i++) { // Try 10 times to find a safe spot
                        const randomX = player.location.x + (Math.random() - 0.5) * distance * 2;
                        const randomZ = player.location.z + (Math.random() - 0.5) * distance * 2;
                        const targetY = Math.floor(player.location.y);

                        const targetBlock = player.dimension.getBlock({
                            x: randomX,
                            y: targetY,
                            z: randomZ
                        });
                        const headBlock = player.dimension.getBlock({
                            x: randomX,
                            y: targetY + 1,
                            z: randomZ
                        });

                        if (targetBlock && !targetBlock.isSolid && headBlock && !headBlock.isSolid) {
                            player.teleport({
                                x: randomX,
                                y: targetY,
                                z: randomZ
                            });
                            player.playSound("mob.endermen.portal");
                            player.dimension.spawnParticle("minecraft:end_chest", player.location);
                            player.setDynamicProperty("kora_me:teleport_cooldown", cooldownTime);
                            break; // Exit loop once a safe spot is found
                        }
                    }
                }
            }


            // Agility (Dodge)
            const agility3 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[0].displayName));
            const agility2 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[0].displayName));
            const agility1 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[0].displayName));
            let dodgeChance = 0;
            if (agility3) dodgeChance = 0.3;
            else if (agility2) dodgeChance = 0.2;
            else if (agility1) dodgeChance = 0.1;
            if (Math.random() < dodgeChance) {
                totalDamageToHeal += damage; // Heal the full amount, effectively negating the damage
                player.dimension.spawnParticle("minecraft:knockback_roar_particle", player.location);
            }

            // Rage (unchanged)
            if (chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[5].displayName))) {
                player.addEffect('strength', 100, {
                    amplifier: 0,
                    showParticles: false
                });
                player.addEffect('speed', 100, {
                    amplifier: 0,
                    showParticles: false
                });
                player.dimension.spawnParticle("minecraft:villager_angry", player.getHeadLocation());
            }

            // Blast Shield
            if (chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[4].displayName)) && damageSource.cause === 'explosion') {
                totalDamageToHeal += damage * 0.8; // Heal 80% of damage taken
            }

            // Spikes (unchanged)
            const spikes2 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[3].displayName));
            const spikes1 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[3].displayName));
            if (spikes1 || spikes2) {
                const effect = spikes2 ? 'weakness' : 'slowness';
                if (attacker) attacker.addEffect(effect, 100, {
                    amplifier: 0
                });
            }

            // Guardian’s Oath
            const oath2 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[4].displayName));
            const oath1 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[4].displayName));
            if ((oath1 || oath2) && health.currentValue / health.defaultValue <= 0.3) {
                const reduction = oath2 ? 0.5 : 0.25;
                totalDamageToHeal += damage * reduction;
            }

            // Flame Guard
            const flameGuard3 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[3].displayName));
            const flameGuard2 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[5].displayName));
            const flameGuard1 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[5].displayName));
            if ((flameGuard1 || flameGuard2 || flameGuard3) && (damageSource.cause === 'fire' || damageSource.cause === 'lava' || damageSource.cause === 'fireTick')) {
                let reduction = 0;
                if (flameGuard3) reduction = 0.75;
                else if (flameGuard2) reduction = 0.5;
                else if (flameGuard1) reduction = 0.25;
                totalDamageToHeal += damage * reduction;
            }

            // Wither Ward
            const witherWard2 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[6].displayName));
            const witherWard1 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[6].displayName));
            if ((witherWard1 || witherWard2) && damageSource.cause === 'wither') {
                const reduction = witherWard2 ? 0.6 : 0.3;
                totalDamageToHeal += damage * reduction;
            }

            // Stormcaller
            if (chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[9].displayName)) && attacker) {
                if (Math.random() < 0.15) {
                    player.dimension.spawnEntity("minecraft:lightning_bolt", attacker.location);
                }
            }

            // Iron Will
            const ironWill2 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[7].displayName));
            const ironWill1 = chestplateLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[7].displayName));
            let knockbackReduction = 0;
            if (ironWill2) knockbackReduction = 0.5;
            else if (ironWill1) knockbackReduction = 0.25;
            if (knockbackReduction > 0) {
                const currentKnockback = player.getComponent("minecraft:knockback_resistance").value;
                player.getComponent("minecraft:knockback_resistance").setCurrentValue(Math.min(1, currentKnockback + knockbackReduction));
                system.runTimeout(() => {
                    try {
                        if (player.isValid()) {
                            player.getComponent("minecraft:knockback_resistance").resetToDefaultValue();
                        }
                    } catch (e) {}
                }, 5);
            }
        }

        if (helmet) {
            const helmetLores = helmet.getLore();
            const ward1 = helmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[2].displayName));
            const ward2 = helmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[2].displayName));
            if ((ward1 || ward2) && (attacker?.typeId === 'minecraft:guardian' || attacker?.typeId === 'minecraft:drowned')) {
                const protection = ward2 ? 0.4 : 0.2;
                totalDamageToHeal += damage * protection;
            }

            if (helmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[6].displayName)) && attacker?.typeId === 'minecraft:phantom') {
                totalDamageToHeal += damage * 0.5; // Heal 50% of damage
            }

            const skull1 = helmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[3].displayName));
            const skull2 = helmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[3].displayName));
            const skull3 = helmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[2].displayName));
            let knockbackReduction = 0;
            if (skull3) knockbackReduction = 0.75;
            else if (skull2) knockbackReduction = 0.5;
            else if (skull1) knockbackReduction = 0.25;

            if (knockbackReduction > 0) {
                const currentKnockback = player.getComponent("minecraft:knockback_resistance").value;
                player.getComponent("minecraft:knockback_resistance").setCurrentValue(Math.min(1, currentKnockback + knockbackReduction));
                system.runTimeout(() => {
                    try {
                        if (player.isValid()) {
                            player.getComponent("minecraft:knockback_resistance").resetToDefaultValue();
                        }
                    } catch (e) {}
                }, 5);
            }

            if (helmetLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[6].displayName)) && attacker?.typeId === 'minecraft:phantom') {
                event.damage -= Math.floor(damage * 0.5); // 50% damage reduction
            }
        }

        if (leggings) {
            const leggingLores = leggings.getLore();
            const health = player.getComponent("minecraft:health");

            // Adrenaline Rush (Existing)
            if (leggingLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[7].displayName)) && health.currentValue / health.defaultValue <= 0.25) {
                player.addEffect("speed", 100, {
                    amplifier: 1,
                    showParticles: true
                });
            }

            // Lightweight (Existing)
            if (damageSource.cause === 'fall') {
                const lightweight2 = leggingLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[3].displayName));
                const lightweight1 = leggingLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[3].displayName));
                let reduction = 0;
                if (lightweight2) reduction = 0.5;
                else if (lightweight1) reduction = 0.25;
                totalDamageToHeal += damage * reduction;
            }

            // Iron Legs & Grounded
            const knockbackResistance = player.getComponent("minecraft:knockback_resistance");

            // ADDED CHECK: Ensure the component exists before using it.
            if (knockbackResistance) {
                const currentKnockback = knockbackResistance.value;
                let knockbackBoost = 0;

                // Iron Legs Logic
                const ironLegs3 = leggingLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl3[1].displayName));
                const ironLegs2 = leggingLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[4].displayName));
                const ironLegs1 = leggingLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[4].displayName));
                if (ironLegs3) knockbackBoost = Math.max(knockbackBoost, 0.75);
                else if (ironLegs2) knockbackBoost = Math.max(knockbackBoost, 0.5);
                else if (ironLegs1) knockbackBoost = Math.max(knockbackBoost, 0.25);

                // Grounded Logic (for explosion knockback)
                if (damageSource.cause === 'explosion') {
                    const grounded2 = leggingLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[5].displayName));
                    const grounded1 = leggingLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[5].displayName));
                    if (grounded2) knockbackBoost = Math.max(knockbackBoost, 0.6);
                    else if (grounded1) knockbackBoost = Math.max(knockbackBoost, 0.3);
                }

                if (knockbackBoost > 0) {
                    knockbackResistance.setCurrentValue(Math.min(1, currentKnockback + knockbackBoost));
                    system.runTimeout(() => {
                        try {
                            if (player.isValid()) { // Also check if player is still valid
                                knockbackResistance.resetToDefaultValue();
                            }
                        } catch (e) {}
                    }, 5); // Reset after 5 ticks
                }
            }

            // Apply the final calculated healing
            if (totalDamageToHeal > 0) {
                // Use system.run to apply health change just after the damage event concludes
                system.run(() => {
                    try { // Re-check validity inside the deferred run
                        if (player.isValid()) {
                            const currentHealth = player.getComponent("minecraft:health");
                            currentHealth.setCurrentValue(Math.min(currentHealth.defaultValue, currentHealth.currentValue + totalDamageToHeal));
                        }
                    } catch (e) {
                        // Failsafe in case entity is no longer valid
                    }
                });
            }
        }
    }
});

// Separate event for death to handle other enchants
world.afterEvents.entityDie.subscribe((event) => {
    const {
        deadEntity,
        damageSource
    } = event;
    const attacker = damageSource.damagingEntity;

    if (attacker?.typeId === 'minecraft:player') {
        const player = attacker;
        const playerEquippableComponent = player.getComponent("minecraft:equippable");
        const mainhandItem = playerEquippableComponent.getEquipment(EquipmentSlot.Mainhand);
        const chestplate = playerEquippableComponent.getEquipment(EquipmentSlot.Chest);

        if (mainhandItem && mainhandItem.getTags().some(tag => tag === 'minecraft:is_axe')) {
            const itemLores = mainhandItem.getLore();

            const decapitate1 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[6].displayName));
            const decapitate2 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[8].displayName));
            const decapitate3 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[6].displayName));

            let decapitateChance = 0;
            if (decapitate3) decapitateChance = 0.15;
            else if (decapitate2) decapitateChance = 0.10;
            else if (decapitate1) decapitateChance = 0.05;

            if (Math.random() < decapitateChance) {
                let headItem = null;
                switch (deadEntity.typeId) {
                    case "minecraft:zombie":
                        headItem = "minecraft:zombie_head";
                        break;
                    case "minecraft:skeleton":
                        headItem = "minecraft:skeleton_skull";
                        break;
                    case "minecraft:creeper":
                        headItem = "minecraft:creeper_head";
                        break;
                    case "minecraft:wither_skeleton":
                        headItem = "minecraft:wither_skeleton_skull";
                        break;
                    case "minecraft:player":
                        headItem = "minecraft:player_head";
                        break;
                }
                if (headItem) {
                    deadEntity.dimension.spawnItem(new ItemStack(headItem, 1), deadEntity.location);
                }
            }

            // Spirit Cleaver: 15% chance on kill to drop a soul-related item with a visual/sound effect.
            if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[5].displayName))) {
                if (Math.random() < 0.25) {
                    const soulDrops = [
                        new ItemStack("minecraft:soul_sand", 1),
                    ];
                    const drop = soulDrops[Math.floor(Math.random() * soulDrops.length)];
                    deadEntity.dimension.spawnItem(drop, deadEntity.location);
                    const molangMap = new MolangVariableMap();
                    const direction = {
                        x: player.location.x - deadEntity.location.x,
                        y: player.location.y - deadEntity.location.y,
                        z: player.location.z - deadEntity.location.z
                    };
                    molangMap.setVector3("direction", direction);
                    deadEntity.dimension.spawnParticle("minecraft:soul_particle", deadEntity.location, molangMap);
                    player.playSound("particle.soul.escape", { location: player.location });
                }
            }

            if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[5].displayName))) {
                if (Math.random() < 0.2) {
                    deadEntity.dimension.spawnEntity("minecraft:xp_orb", deadEntity.location);
                }
            }
        }

        if (chestplate && chestplate.getLore().some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[7].displayName))) {
            player.addEffect('regeneration', 20, {
                amplifier: 1,
                showParticles: false
            });
        }
    }
});