import {
    system,
    world
} from "@minecraft/server";

export class onJumpAfterEvent {
    constructor(callback, tickDelay) {
        let tick = 2;
        if (tickDelay)
            tick = tickDelay;
        system.runInterval(() => {
            for (const player of world.getAllPlayers()) {
                if (player.hasTag(onJumpAfterEvent.jumpTag)) {
                    player.removeTag(onJumpAfterEvent.jumpTag);
                } else if (player.isJumping) {
                    player.addTag(onJumpAfterEvent.jumpTag);
                    callback({
                        player: player,
                        location: player.location,
                        dimension: player.dimension,
                    });
                }
            }
        }, tick);
    }
}
onJumpAfterEvent.jumpTag = "kora_me.jumped";

export function returnLoreCost(itemLores) {
    let loreCost = 0;
    // --- SWORD ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[0].displayName))) loreCost += 1; // Wave of Fire I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[1].displayName))) loreCost += 2; // Venomous Strike I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[2].displayName))) loreCost += 1; // Momentum I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[3].displayName))) loreCost += 2; // Disorienting Strike I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[4].displayName))) loreCost += 3; // Disarm I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[5].displayName))) loreCost += 2; // Leeching Strike
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[6].displayName))) loreCost += 2; // Guard Break
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[7].displayName))) loreCost += 3; // Cursed Edge
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl1[8].displayName))) loreCost += 4; // Gravity Well I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[0].displayName))) loreCost += 2; // Wave of Fire II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[1].displayName))) loreCost += 2; // Lifesteal
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[2].displayName))) loreCost += 3; // Venomous Strike II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[3].displayName))) loreCost += 2; // Momentum II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[4].displayName))) loreCost += 3; // Disorienting Strike II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[5].displayName))) loreCost += 4; // Disarm II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl2[6].displayName))) loreCost += 4; // Arcane Burst
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[0].displayName))) loreCost += 3; // Wave of Fire III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[1].displayName))) loreCost += 2; // Lifesteal
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[2].displayName))) loreCost += 3; // Wither Touch
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[3].displayName))) loreCost += 3; // Sweeping Edge
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[4].displayName))) loreCost += 3; // Momentum III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_sword.lvl3[5].displayName))) loreCost += 5; // Gravity Well II

    // --- MACE ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl1[0].displayName))) loreCost += 3; // Unstoppable Force I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl1[1].displayName))) loreCost += 2; // Lightning Smash I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl1[2].displayName))) loreCost += 3; // Earthquake I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl1[3].displayName))) loreCost += 3; // Crushing Wave I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl1[4].displayName))) loreCost += 2; // Concussive Blow I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl2[0].displayName))) loreCost += 3; // Lightning Smash II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl2[1].displayName))) loreCost += 4; // Earthquake II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl2[2].displayName))) loreCost += 4; // Crushing Wave II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl2[3].displayName))) loreCost += 3; // Concussive Blow II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl3[0].displayName))) loreCost += 4; // Lightning Smash III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_mace.lvl3[1].displayName))) loreCost += 5; // Earthquake III

    // --- BOW & CROSSBOW ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_bow.lvl1[0].displayName))) loreCost += 2; // Freeze Shot
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_bow.lvl1[1].displayName))) loreCost += 5; // God Beam
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_bow.lvl1[2].displayName))) loreCost += 3; // Grapple Shot
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_bow.lvl2[0].displayName))) loreCost += 3; // Freeze Shot II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[0].displayName))) loreCost += 4; // Freeze Shot III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[1].displayName))) loreCost += 4; // Ghast Charge
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[2].displayName))) loreCost += 3; // Quick Draw
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[3].displayName))) loreCost += 4; // TNT Shot
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_bow.lvl3[4].displayName))) loreCost += 3; // True Shot

    if (itemLores.some(lore => lore.includes(listOfEnchants.is_crossbow.lvl1[0].displayName))) loreCost += 2; // Freeze Shot
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_crossbow.lvl1[1].displayName))) loreCost += 5; // God Beam
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_crossbow.lvl1[2].displayName))) loreCost += 3; // Grapple Shot
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_crossbow.lvl2[0].displayName))) loreCost += 3; // Freeze Shot II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_crossbow.lvl3[0].displayName))) loreCost += 4; // Freeze Shot III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_crossbow.lvl3[1].displayName))) loreCost += 4; // Ghast Charge
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_crossbow.lvl3[2].displayName))) loreCost += 3; // Quick Draw
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_crossbow.lvl3[3].displayName))) loreCost += 4; // TNT Shot
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_crossbow.lvl3[4].displayName))) loreCost += 3; // True Shot    

    // --- PICKAXE ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[0].displayName))) loreCost += 3; // Auto Smelter
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[1].displayName))) loreCost += 3; // Geologist's Luck I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[2].displayName))) loreCost += 4; // Mega Digger
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[3].displayName))) loreCost += 5; // Vein Miner
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[4].displayName))) loreCost += 2; // XP Bonus I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[5].displayName))) loreCost += 3; // Earthshaker I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[6].displayName))) loreCost += 3; // Crystal Fortune I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[7].displayName))) loreCost += 4; // Prospector's Instinct
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[8].displayName))) loreCost += 2; // Speed I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[0].displayName))) loreCost += 4; // Geologist's Luck II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[1].displayName))) loreCost += 3; // XP Bonus II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[2].displayName))) loreCost += 4; // Earthshaker II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[3].displayName))) loreCost += 4; // Crystal Fortune II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[4].displayName))) loreCost += 3; // Speed II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl3[0].displayName))) loreCost += 4; // XP Bonus III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl3[1].displayName))) loreCost += 5; // Crystal Fortune III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl3[2].displayName))) loreCost += 4; // Lucky Miner 
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl3[3].displayName))) loreCost += 4; // Speed III


    // --- AXE ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[0].displayName))) loreCost += 2; // Crippling Blow I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[1].displayName))) loreCost += 2; // Lumberjack's Fortune I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[2].displayName))) loreCost += 1; // Carver I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[3].displayName))) loreCost += 2; // Nature's Touch I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[4].displayName))) loreCost += 1; // Berserker I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[5].displayName))) loreCost += 2; // XP Bonus I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[6].displayName))) loreCost += 2; // Decapitate I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[7].displayName))) loreCost += 3; // Echo Strike I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[0].displayName))) loreCost += 3; // Crippling Blow II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[1].displayName))) loreCost += 3; // Lumberjack's Fortune II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[2].displayName))) loreCost += 3; // Replanting
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[3].displayName))) loreCost += 2; // Carver II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[4].displayName))) loreCost += 2; // Kindling
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[5].displayName))) loreCost += 3; // Nature's Touch II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[6].displayName))) loreCost += 4; // Echo Strike II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[7].displayName))) loreCost += 2; // Berserker II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[8].displayName))) loreCost += 3; // Decapitate II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[0].displayName))) loreCost += 4; // Lumberjack's Fortune III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[1].displayName))) loreCost += 3; // Carver III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[2].displayName))) loreCost += 5; // Thunder Chop
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[3].displayName))) loreCost += 4; // Berserker III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[4].displayName))) loreCost += 5; // Timber
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[5].displayName))) loreCost += 4; // Spirit Cleaver
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[6].displayName))) loreCost += 5; // Decapitate III

    // --- SHOVEL ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[0].displayName))) loreCost += 2; // Earthmover I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[1].displayName))) loreCost += 2; // Prospector's Eye
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[2].displayName))) loreCost += 2; // Treasure Hunter I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[3].displayName))) loreCost += 3; // Fossil Finder I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[4].displayName))) loreCost += 2; // XP Bonus I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl2[0].displayName))) loreCost += 3; // Earthmover II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl2[1].displayName))) loreCost += 3; // Tunnel Bore I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl2[2].displayName))) loreCost += 3; // Soil Rejuvenation
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl2[3].displayName))) loreCost += 4; // Fossil Finder II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl3[0].displayName))) loreCost += 4; // Earthmover III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl3[1].displayName))) loreCost += 4; // Excavator
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl3[2].displayName))) loreCost += 4; // Tunnel Bore II

    // --- HOE ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl1[0].displayName))) loreCost += 2; // Harvester's Bounty I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl1[1].displayName))) loreCost += 2; // XP Bonus I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl1[2].displayName))) loreCost += 3; // Fertilizer's Touch
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl1[3].displayName))) loreCost += 2; // Herbalist I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl2[0].displayName))) loreCost += 3; // Harvester's Bounty II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl2[1].displayName))) loreCost += 4; // Scythe's Reach I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl2[2].displayName))) loreCost += 3; // Herbalist II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl3[0].displayName))) loreCost += 4; // Harvester's Bounty III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl3[1].displayName))) loreCost += 5; // Scythe's Reach II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl3[2].displayName))) loreCost += 4; // Herbalist III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl3[3].displayName))) loreCost += 6; // Replanter

    // --- HELMET ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[0].displayName))) loreCost += 1; // Lava Swimmer I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[1].displayName))) loreCost += 2; // Aqua Breather I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[2].displayName))) loreCost += 2; // Guardian's Ward I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[3].displayName))) loreCost += 1; // Thick Skull I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl1[4].displayName))) loreCost += 3; // Night Vision
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[0].displayName))) loreCost += 2; // Lava Swimmer II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[1].displayName))) loreCost += 3; // Aqua Breather II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[2].displayName))) loreCost += 3; // Guardian's Ward II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[3].displayName))) loreCost += 2; // Thick Skull II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[4].displayName))) loreCost += 3; // Clarity
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[5].displayName))) loreCost += 4; // Photosynthesis
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl2[6].displayName))) loreCost += 3; // Beast Sense
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[0].displayName))) loreCost += 3; // Lava Swimmer III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[1].displayName))) loreCost += 4; // Aqua Breather III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[2].displayName))) loreCost += 3; // Thick Skull III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[3].displayName))) loreCost += 3; // Highlight
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[4].displayName))) loreCost += 4; // Echo Locator
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[5].displayName))) loreCost += 3; // Mind Shield
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[6].displayName))) loreCost += 2; // Solar Shield
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_helmet.lvl3[7].displayName))) loreCost += 4; // Moon's Grace

    // --- CHESTPLATE ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[0].displayName))) loreCost += 2; // Agility I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[1].displayName))) loreCost += 1; // Life Bonus I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[2].displayName))) loreCost += 1; // Magnetism I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[3].displayName))) loreCost += 2; // Spikes I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[4].displayName))) loreCost += 2; // Guardian's Oath I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[5].displayName))) loreCost += 1; // Flame Guard I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[6].displayName))) loreCost += 2; // Wither Ward I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[7].displayName))) loreCost += 1; // Iron Will I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[0].displayName))) loreCost += 3; // Agility II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[1].displayName))) loreCost += 2; // Life Bonus II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[2].displayName))) loreCost += 2; // Magnetism II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[3].displayName))) loreCost += 3; // Spikes II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[4].displayName))) loreCost += 3; // Guardian's Oath II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[5].displayName))) loreCost += 2; // Flame Guard II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[6].displayName))) loreCost += 3; // Wither Ward II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[7].displayName))) loreCost += 2; // Iron Will II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[0].displayName))) loreCost += 4; // Agility III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[1].displayName))) loreCost += 3; // Life Bonus III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[2].displayName))) loreCost += 3; // Magnetism III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[3].displayName))) loreCost += 3; // Flame Guard III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[4].displayName))) loreCost += 4; // Blast Shield
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[5].displayName))) loreCost += 4; // Rage
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[6].displayName))) loreCost += 3; // Stoneform
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[7].displayName))) loreCost += 4; // Vital Surge
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[8].displayName))) loreCost += 2; // Weightless
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[9].displayName))) loreCost += 5; // Stormcaller
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[10].displayName))) loreCost += 5; // Berserker's Core
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl1[8].displayName))) loreCost += 3; // Teleportation I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl2[8].displayName))) loreCost += 4; // Teleportation II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_chestplate.lvl3[11].displayName))) loreCost += 5; // Teleportation III

    // --- LEGGINGS ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[0].displayName))) loreCost += 1; // Speed I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[1].displayName))) loreCost += 1; // Sprinting Stamina I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[2].displayName))) loreCost += 2; // Endurance I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[3].displayName))) loreCost += 2; // Lightweight I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[4].displayName))) loreCost += 1; // Iron Legs I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl1[5].displayName))) loreCost += 2; // Grounded I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[0].displayName))) loreCost += 2; // Speed II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[1].displayName))) loreCost += 2; // Sprinting Stamina II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[2].displayName))) loreCost += 3; // Endurance II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[3].displayName))) loreCost += 3; // Lightweight II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[4].displayName))) loreCost += 2; // Iron Legs II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[5].displayName))) loreCost += 3; // Grounded II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[6].displayName))) loreCost += 3; // Swift Sneak
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[7].displayName))) loreCost += 3; // Adrenaline Rush
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[8].displayName))) loreCost += 2; // Climber
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl2[9].displayName))) loreCost += 3; // Wind Runner
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl3[0].displayName))) loreCost += 4; // Endurance III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl3[1].displayName))) loreCost += 3; // Iron Legs III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl3[2].displayName))) loreCost += 4; // Double Jump
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_leggings.lvl3[3].displayName))) loreCost += 4; // Wall Kick

    // --- BOOTS ---
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[0].displayName))) loreCost += 2; // Depth Strider I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[1].displayName))) loreCost += 1; // Jump Boost I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[2].displayName))) loreCost += 3; // Wind Leaper I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[3].displayName))) loreCost += 2; // Hunter's Pace I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[4].displayName))) loreCost += 1; // Trailblazer
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl1[5].displayName))) loreCost += 1; // Earth Grip
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[0].displayName))) loreCost += 3; // Depth Strider II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[1].displayName))) loreCost += 2; // Jump Boost II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[2].displayName))) loreCost += 4; // Wind Leaper II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[3].displayName))) loreCost += 3; // Hunter's Pace II
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[4].displayName))) loreCost += 2; // Slow Falling I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl2[5].displayName))) loreCost += 3; // Shockwave I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl3[0].displayName))) loreCost += 4; // Depth Strider III
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl3[1].displayName))) loreCost += 3; // Magma Walker I
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_boots.lvl3[2].displayName))) loreCost += 3; // Shadowstep I

    return loreCost;
};

export function mergeLores(lores1, lores2) {
    const levelMap = {
        "I": 1,
        "II": 2,
        "III": 3
    };
    const joinedLores = lores1.concat(lores2);

    function parseLore(lore) {
        const match = lore.match(/(.+?)\s*(I{1,3})?\s*(§h\[.*?\]§r)?$/);
        if (!match) return {
            base: lore,
            level: 0,
            original: lore
        }; // Fallback for lores that don't match
        const base = match[1].trim();
        const level = match[2] ? levelMap[match[2]] : 0;
        return {
            base,
            level,
            original: lore
        };
    }
    const loreMap = {};
    joinedLores.forEach(lore => {
        const {
            base,
            level,
            original
        } = parseLore(lore);
        if (!loreMap[base] || level > loreMap[base].level) {
            loreMap[base] = {
                level,
                original
            };
        }
    });
    return Object.values(loreMap).map(item => item.original);
};

export function returnGearType(item) {
    const itemID = item.typeId;
    const itemTags = item.getTags();
    const tagLookupTable = ['is_sword', 'is_axe', 'is_pickaxe', 'is_shovel', 'is_hoe', 'is_armor'];
    const tagsFiltered = itemTags.filter(tag => tagLookupTable.some(searchTag => tag.includes(searchTag)));
    if (tagsFiltered.some(tag => tag.includes('is_sword')) && itemID === 'minecraft:mace') {
        return 'is_mace';
    } else if (tagsFiltered.some(tag => tag.includes('is_armor'))) {
        if (itemID.includes('helmet')) return 'is_helmet';
        if (itemID.includes('chestplate')) return 'is_chestplate';
        if (itemID.includes('leggings')) return 'is_leggings';
        if (itemID.includes('boots')) return 'is_boots';
    } else if (tagsFiltered.length === 0) {
        if (itemID.includes('bow')) return 'is_bow';
        if (itemID.includes('crossbow')) return 'is_crossbow';
    } else {
        return tagsFiltered[0].replace(/^minecraft:/, '');
    }
};

export const listOfEnchants = {
    is_sword: {
        lvl1: [{
                displayName: "§r§cWave of Fire I §h[§dMore Enchants§h]§r",
                name: "Wave of Fire I",
                texture: "textures/items/blaze_powder",
                description: "kora_me.enchant.description.wave_of_fire"
            },
            {
                displayName: "§r§2Venomous Strike I §h[§dMore Enchants§h]§r",
                name: "Venomous Strike I",
                texture: "textures/items/spider_eye",
                description: "kora_me.enchant.description.venomous_strike"
            },
            {
                displayName: "§r§eMomentum I §h[§dMore Enchants§h]§r",
                name: "Momentum I",
                texture: "textures/items/sugar",
                description: "kora_me.enchant.description.momentum"
            },
            {
                displayName: "§r§7Disorienting Strike I §h[§dMore Enchants§h]§r",
                name: "Disorienting Strike I",
                texture: "textures/blocks/mushroom_brown",
                description: "kora_me.enchant.description.disorienting_strike"
            },
            {
                displayName: "§r§7Disarm I §h[§dMore Enchants§h]§r",
                name: "Disarm I",
                texture: "textures/items/iron_nugget",
                description: "kora_me.enchant.description.disarm"
            },
            {
                displayName: "§r§aLeeching Strike §h[§dMore Enchants§h]§r",
                name: "Leeching Strike",
                texture: "textures/items/experience_bottle",
                description: "kora_me.enchant.description.leeching_strike"
            },
            {
                displayName: "§r§fGuard Break §h[§dMore Enchants§h]§r",
                name: "Guard Break",
                texture: "textures/items/shield",
                description: "kora_me.enchant.description.guard_break"
            },
            {
                displayName: "§r§4Cursed Edge §h[§dMore Enchants§h]§r",
                name: "Cursed Edge",
                texture: "textures/items/skull_wither",
                description: "kora_me.enchant.description.cursed_edge"
            },
            {
                displayName: "§r§5Gravity Well I §h[§dMore Enchants§h]§r",
                name: "Gravity Well I",
                texture: "textures/blocks/end_portal_frame_eye",
                description: "kora_me.enchant.description.gravity_well"
            }
        ],
        lvl2: [{
                displayName: "§r§cWave of Fire II §h[§dMore Enchants§h]§r",
                name: "Wave of Fire II",
                texture: "textures/items/blaze_powder",
                description: "kora_me.enchant.description.wave_of_fire"
            },
            {
                displayName: "§r§2Lifesteal §h[§dMore Enchants§h]§r",
                name: "Lifesteal",
                texture: "textures/ui/heart_new",
                description: "kora_me.enchant.description.lifesteal"
            },
            {
                displayName: "§r§2Venomous Strike II §h[§dMore Enchants§h]§r",
                name: "Venomous Strike II",
                texture: "textures/items/spider_eye",
                description: "kora_me.enchant.description.venomous_strike"
            },
            {
                displayName: "§r§eMomentum II §h[§dMore Enchants§h]§r",
                name: "Momentum II",
                texture: "textures/items/sugar",
                description: "kora_me.enchant.description.momentum"
            },
            {
                displayName: "§r§7Disorienting Strike II §h[§dMore Enchants§h]§r",
                name: "Disorienting Strike II",
                texture: "textures/blocks/mushroom_brown",
                description: "kora_me.enchant.description.disorienting_strike"
            },
            {
                displayName: "§r§7Disarm II §h[§dMore Enchants§h]§r",
                name: "Disarm II",
                texture: "textures/items/iron_nugget",
                description: "kora_me.enchant.description.disarm"
            },
            {
                displayName: "§r§5Arcane Burst §h[§dMore Enchants§h]§r",
                name: "Arcane Burst",
                texture: "textures/items/amethyst_shard",
                description: "kora_me.enchant.description.arcane_burst"
            }
        ],
        lvl3: [{
                displayName: "§r§cWave of Fire III §h[§dMore Enchants§h]§r",
                name: "Wave of Fire III",
                texture: "textures/items/blaze_powder",
                description: "kora_me.enchant.description.wave_of_fire"
            },
            {
                displayName: "§r§2Lifesteal II §h[§dMore Enchants§h]§r",
                name: "Lifesteal",
                texture: "textures/ui/heart_new",
                description: "kora_me.enchant.description.lifesteal"
            },
            {
                displayName: "§r§9Wither Touch §h[§dMore Enchants§h]§r",
                name: "Wither Touch",
                texture: "textures/ui/wither_effect",
                description: "kora_me.enchant.description.wither_touch"
            },
            {
                displayName: "§r§fSweeping Edge §h[§dMore Enchants§h]§r",
                name: "Sweeping Edge",
                texture: "textures/items/iron_sword",
                description: "kora_me.enchant.description.sweeping_edge"
            },
            {
                displayName: "§r§eMomentum III §h[§dMore Enchants§h]§r",
                name: "Momentum III",
                texture: "textures/items/sugar",
                description: "kora_me.enchant.description.momentum"
            },
            {
                displayName: "§r§5Gravity Well II §h[§dMore Enchants§h]§r",
                name: "Gravity Well II",
                texture: "textures/blocks/end_portal_frame_eye",
                description: "kora_me.enchant.description.gravity_well"
            }
        ]
    },
    is_mace: {
        lvl1: [{
                displayName: "§r§fUnstoppable Force §h[§dMore Enchants§h]§r",
                name: "Unstoppable Force",
                texture: "textures/items/netherite_ingot",
                description: "kora_me.enchant.description.unstoppable_force"
            },
            {
                displayName: "§r§1Lightning Smash I §h[§dMore Enchants§h]§r",
                name: "Lightning Smash I",
                texture: "textures/blocks/copper_block",
                description: "kora_me.enchant.description.lightning_smash"
            },
            {
                displayName: "§r§dEarthquake I §h[§dMore Enchants§h]§r",
                name: "Earthquake I",
                texture: "textures/blocks/dirt",
                description: "kora_me.enchant.description.earthquake"
            },
            {
                displayName: "§r§qCrushing Wave I §h[§dMore Enchants§h]§r",
                name: "Crushing Wave I",
                texture: "textures/blocks/piston_top_normal",
                description: "kora_me.enchant.description.crushing_wave"
            },
            {
                displayName: "§r§8Concussive Blow I §h[§dMore Enchants§h]§r",
                name: "Concussive Blow I",
                texture: "textures/items/spider_eye",
                description: "kora_me.enchant.description.concussive_blow"
            }
        ],
        lvl2: [{
                displayName: "§r§1Lightning Smash II §h[§dMore Enchants§h]§r",
                name: "Lightning Smash II",
                texture: "textures/blocks/copper_block",
                description: "kora_me.enchant.description.lightning_smash"
            },
            {
                displayName: "§r§dEarthquake II §h[§dMore Enchants§h]§r",
                name: "Earthquake II",
                texture: "textures/blocks/dirt",
                description: "kora_me.enchant.description.earthquake"
            },
            {
                displayName: "§r§qCrushing Wave II §h[§dMore Enchants§h]§r",
                name: "Crushing Wave II",
                texture: "textures/blocks/piston_top_normal",
                description: "kora_me.enchant.description.crushing_wave"
            },
            {
                displayName: "§r§8Concussive Blow II §h[§dMore Enchants§h]§r",
                name: "Concussive Blow II",
                texture: "textures/items/spider_eye",
                description: "kora_me.enchant.description.concussive_blow"
            }
        ],
        lvl3: [{
                displayName: "§r§1Lightning Smash III §h[§dMore Enchants§h]§r",
                name: "Lightning Smash III",
                texture: "textures/blocks/copper_block",
                description: "kora_me.enchant.description.lightning_smash"
            },
            {
                displayName: "§r§dEarthquake III §h[§dMore Enchants§h]§r",
                name: "Earthquake III",
                texture: "textures/blocks/dirt",
                description: "kora_me.enchant.description.earthquake"
            }
        ]
    },
    is_bow: {
        lvl1: [{
                displayName: "§r§bFreeze Shot I §h[§dMore Enchants§h]§r",
                name: "Freeze Shot I",
                texture: "textures/items/snowball",
                description: "kora_me.enchant.description.freeze_shot"
            },
            {
                displayName: "§r§eGod Beam §h[§dMore Enchants§h]§r",
                name: "God Beam",
                texture: "textures/items/beacon",
                description: "kora_me.enchant.description.god_beam"
            },
            {
                displayName: "§r§fGrapple Shot §h[§dMore Enchants§h]§r",
                name: "Grapple Shot",
                texture: "textures/items/lead",
                description: "kora_me.enchant.description.grapple_shot"
            }
        ],
        lvl2: [{
            displayName: "§r§bFreeze Shot II §h[§dMore Enchants§h]§r",
            name: "Freeze Shot II",
            texture: "textures/items/snowball",
            description: "kora_me.enchant.description.freeze_shot"
        }],
        lvl3: [{
                displayName: "§r§bFreeze Shot III §h[§dMore Enchants§h]§r",
                name: "Freeze Shot III",
                texture: "textures/items/snowball",
                description: "kora_me.enchant.description.freeze_shot"
            },
            {
                displayName: "§r§cGhast Charge III §h[§dMore Enchants§h]§r",
                name: "Ghast Charge III",
                texture: "textures/items/fireball",
                description: "kora_me.enchant.description.ghast_charge"
            },
            {
                displayName: "§r§aQuick Draw III §h[§dMore Enchants§h]§r",
                name: "Quick Draw III",
                texture: "textures/items/feather",
                description: "kora_me.enchant.description.quick_draw"
            },
            {
                displayName: "§r§4TNT Shot §h[§dMore Enchants§h]§r",
                name: "TNT Shot",
                texture: "textures/blocks/tnt_side",
                description: "kora_me.enchant.description.tnt_shot"
            },
            {
                displayName: "§r§dTrue Shot §h[§dMore Enchants§h]§r",
                name: "True Shot",
                texture: "textures/items/arrow",
                description: "kora_me.enchant.description.true_shot"
            }
        ]
    },
    is_crossbow: {
        lvl1: [{
                displayName: "§r§bFreeze Shot I §h[§dMore Enchants§h]§r",
                name: "Freeze Shot I",
                texture: "textures/items/snowball",
                description: "kora_me.enchant.description.freeze_shot"
            },
            {
                displayName: "§r§eGod Beam §h[§dMore Enchants§h]§r",
                name: "God Beam",
                texture: "textures/items/beacon",
                description: "kora_me.enchant.description.god_beam"
            },
            {
                displayName: "§r§fGrapple Shot §h[§dMore Enchants§h]§r",
                name: "Grapple Shot",
                texture: "textures/items/lead",
                description: "kora_me.enchant.description.grapple_shot"
            }
        ],
        lvl2: [{
            displayName: "§r§bFreeze Shot II §h[§dMore Enchants§h]§r",
            name: "Freeze Shot II",
            texture: "textures/items/snowball",
            description: "kora_me.enchant.description.freeze_shot"
        }],
        lvl3: [{
                displayName: "§r§bFreeze Shot III §h[§dMore Enchants§h]§r",
                name: "Freeze Shot III",
                texture: "textures/items/snowball",
                description: "kora_me.enchant.description.freeze_shot"
            },
            {
                displayName: "§r§cGhast Charge III §h[§dMore Enchants§h]§r",
                name: "Ghast Charge III",
                texture: "textures/items/fireball",
                description: "kora_me.enchant.description.ghast_charge"
            },
            {
                displayName: "§r§aQuick Draw III §h[§dMore Enchants§h]§r",
                name: "Quick Draw III",
                texture: "textures/items/feather",
                description: "kora_me.enchant.description.quick_draw"
            },
            {
                displayName: "§r§4TNT Shot §h[§dMore Enchants§h]§r",
                name: "TNT Shot",
                texture: "textures/blocks/tnt_side",
                description: "kora_me.enchant.description.tnt_shot"
            },
            {
                displayName: "§r§dTrue Shot §h[§dMore Enchants§h]§r",
                name: "True Shot",
                texture: "textures/items/arrow",
                description: "kora_me.enchant.description.true_shot"
            }
        ]
    },
    is_pickaxe: {
        lvl1: [{
                displayName: "§r§cAuto Smelter §h[§dMore Enchants§h]§r",
                name: "Auto Smelter",
                texture: "textures/blocks/furnace_front_on",
                description: "kora_me.enchant.description.auto_smelter"
            },
            {
                displayName: "§r§aGeologist's Luck I §h[§dMore Enchants§h]§r",
                name: "Geologist's Luck I",
                texture: "textures/items/lapis_lazuli",
                description: "kora_me.enchant.description.geologists_luck"
            },
            {
                displayName: "§r§eMega Digger §h[§dMore Enchants§h]§r",
                name: "Mega Digger",
                texture: "textures/items/diamond_pickaxe",
                description: "kora_me.enchant.description.mega_digger"
            },
            {
                displayName: "§r§7Vein Miner §h[§dMore Enchants§h]§r",
                name: "Vein Miner",
                texture: "textures/blocks/gold_ore",
                description: "kora_me.enchant.description.vein_miner"
            },
            {
                displayName: "§r§aXP Bonus I §h[§dMore Enchants§h]§r",
                name: "XP Bonus I",
                texture: "textures/items/experience_bottle",
                description: "kora_me.enchant.description.xp_bonus"
            },
            {
                displayName: "§r§qEarthshaker I §h[§dMore Enchants§h]§r",
                name: "Earthshaker I",
                texture: "textures/blocks/gravel",
                description: "kora_me.enchant.description.earthshaker"
            },
            {
                displayName: "§r§dCrystal Fortune I §h[§dMore Enchants§h]§r",
                name: "Crystal Fortune I",
                texture: "textures/blocks/amethyst_block",
                description: "kora_me.enchant.description.crystal_fortune"
            },
            {
                displayName: "§r§bProspector's Instinct §h[§dMore Enchants§h]§r",
                name: "Prospector's Instinct",
                texture: "textures/items/spyglass",
                description: "kora_me.enchant.description.prospectors_instinct"
            },
            {
                displayName: "§r§eSpeed I §h[§dMore Enchants§h]§r",
                name: "Speed I",
                texture: "textures/items/sugar",
                description: "kora_me.enchant.description.speed"
            }
        ],
        lvl2: [{
                displayName: "§r§aGeologist's Luck II §h[§dMore Enchants§h]§r",
                name: "Geologist's Luck II",
                texture: "textures/items/amethyst_shard",
                description: "kora_me.enchant.description.geologists_luck"
            },
            {
                displayName: "§r§aXP Bonus II §h[§dMore Enchants§h]§r",
                name: "XP Bonus II",
                texture: "textures/items/experience_bottle",
                description: "kora_me.enchant.description.xp_bonus"
            },
            {
                displayName: "§r§qEarthshaker II §h[§dMore Enchants§h]§r",
                name: "Earthshaker II",
                texture: "textures/blocks/sand",
                description: "kora_me.enchant.description.earthshaker"
            },
            {
                displayName: "§r§dCrystal Fortune II §h[§dMore Enchants§h]§r",
                name: "Crystal Fortune II",
                texture: "textures/blocks/quartz_block_top",
                description: "kora_me.enchant.description.crystal_fortune"
            },
            {
                displayName: "§r§eSpeed II §h[§dMore Enchants§h]§r",
                name: "Speed II",
                texture: "textures/items/sugar",
                description: "kora_me.enchant.description.speed"
            },
        ],
        lvl3: [{
                displayName: "§r§aXP Bonus III §h[§dMore Enchants§h]§r",
                name: "XP Bonus III",
                texture: "textures/items/experience_bottle",
                description: "kora_me.enchant.description.xp_bonus"
            },
            {
                displayName: "§r§dCrystal Fortune III §h[§dMore Enchants§h]§r",
                name: "Crystal Fortune III",
                texture: "textures/items/diamond",
                description: "kora_me.enchant.description.crystal_fortune"
            },
            {
                displayName: "§r§aLucky Miner §h[§dMore Enchants§h]§r",
                name: "Lucky Miner",
                texture: "textures/items/emerald",
                description: "kora_me.enchant.description.lucky_miner"
            },
            {
                displayName: "§r§eSpeed III §h[§dMore Enchants§h]§r",
                name: "Speed III",
                texture: "textures/items/sugar",
                description: "kora_me.enchant.description.speed"
            }
        ]
    },
    is_axe: {
        lvl1: [{
                displayName: "§r§8Crippling Blow I §h[§dMore Enchants§h]§r",
                name: "Crippling Blow I",
                texture: "textures/items/spider_eye",
                description: "kora_me.enchant.description.crippling_blow"
            },
            {
                displayName: "§r§aLumberjack's Fortune I §h[§dMore Enchants§h]§r",
                name: "Lumberjack's Fortune I",
                texture: "textures/items/apple",
                description: "kora_me.enchant.description.lumberjacks_fortune"
            },
            {
                displayName: "§r§eCarver I §h[§dMore Enchants§h]§r",
                name: "Carver I",
                texture: "textures/blocks/planks_oak",
                description: "kora_me.enchant.description.carver"
            },
            {
                displayName: "§r§2Nature's Touch I §h[§dMore Enchants§h]§r",
                name: "Nature's Touch I",
                texture: "textures/blocks/mushroom_red",
                description: "kora_me.enchant.description.natures_touch"
            },
            {
                displayName: "§r§cBerserker I §h[§dMore Enchants§h]§r",
                name: "Berserker I",
                texture: "textures/items/potion_bottle_strength",
                description: "kora_me.enchant.description.berserker"
            },
            {
                displayName: "§r§aXP Bonus§h[§dMore Enchants§h]§r",
                name: "XP Bonus",
                texture: "textures/items/experience_bottle",
                description: "kora_me.enchant.description.xp_bonus"
            },
            {
                displayName: "§r§4Decapitate I §h[§dMore Enchants§h]§r",
                name: "Decapitate I",
                texture: "textures/items/skull_creeper",
                description: "kora_me.enchant.description.decapitate"
            },
            {
                displayName: "§r§5Echo Strike I §h[§dMore Enchants§h]§r",
                name: "Echo Strike I",
                texture: "textures/items/amethyst_shard",
                description: "kora_me.enchant.description.echo_strike"
            }
        ],
        lvl2: [{
                displayName: "§r§8Crippling Blow II §h[§dMore Enchants§h]§r",
                name: "Crippling Blow II",
                texture: "textures/items/spider_eye",
                description: "kora_me.enchant.description.crippling_blow"
            },
            {
                displayName: "§r§aLumberjack's Fortune II §h[§dMore Enchants§h]§r",
                name: "Lumberjack's Fortune II",
                texture: "textures/items/apple",
                description: "kora_me.enchant.description.lumberjacks_fortune"
            },
            {
                displayName: "§r§aReplanting §h[§dMore Enchants§h]§r",
                name: "Replanting",
                texture: "textures/items/sapling_oak",
                description: "kora_me.enchant.description.replanting"
            },
            {
                displayName: "§r§eCarver II §h[§dMore Enchants§h]§r",
                name: "Carver II",
                texture: "textures/blocks/planks_oak",
                description: "kora_me.enchant.description.carver"
            },
            {
                displayName: "§r§8Kindling §h[§dMore Enchants§h]§r",
                name: "Kindling",
                texture: "textures/items/charcoal",
                description: "kora_me.enchant.description.kindling"
            },
            {
                displayName: "§r§2Nature's Touch II §h[§dMore Enchants§h]§r",
                name: "Nature's Touch II",
                texture: "textures/blocks/mushroom_red",
                description: "kora_me.enchant.description.natures_touch"
            },
            {
                displayName: "§r§5Echo Strike II §h[§dMore Enchants§h]§r",
                name: "Echo Strike II",
                texture: "textures/items/amethyst_shard",
                description: "kora_me.enchant.description.echo_strike"
            },
            {
                displayName: "§r§cBerserker II §h[§dMore Enchants§h]§r",
                name: "Berserker II",
                texture: "textures/items/potion_bottle_strength",
                description: "kora_me.enchant.description.berserker"
            },
            {
                displayName: "§r§4Decapitate II §h[§dMore Enchants§h]§r",
                name: "Decapitate II",
                texture: "textures/items/skull_creeper",
                description: "kora_me.enchant.description.decapitate"
            }
        ],
        lvl3: [{
                displayName: "§r§aLumberjack's Fortune III §h[§dMore Enchants§h]§r",
                name: "Lumberjack's Fortune III",
                texture: "textures/items/apple",
                description: "kora_me.enchant.description.lumberjacks_fortune"
            },
            {
                displayName: "§r§eCarver III §h[§dMore Enchants§h]§r",
                name: "Carver III",
                texture: "textures/blocks/planks_oak",
                description: "kora_me.enchant.description.carver"
            },
            {
                displayName: "§r§bThunder Chop §h[§dMore Enchants§h]§r",
                name: "Thunder Chop",
                texture: "textures/items/trident",
                description: "kora_me.enchant.description.thunder_chop"
            },
            {
                displayName: "§r§cBerserker III §h[§dMore Enchants§h]§r",
                name: "Berserker III",
                texture: "textures/items/potion_bottle_strength",
                description: "kora_me.enchant.description.berserker"
            },
            {
                displayName: "§r§eTimber §h[§dMore Enchants§h]§r",
                name: "Timber",
                texture: "textures/items/iron_axe",
                description: "kora_me.enchant.description.timber"
            },
            {
                displayName: "§r§5Spirit Cleaver §h[§dMore Enchants§h]§r",
                name: "Spirit Cleaver",
                texture: "textures/blocks/soul_sand",
                description: "kora_me.enchant.description.spirit_cleaver"
            },
            {
                displayName: "§r§4Decapitate III §h[§dMore Enchants§h]§r",
                name: "Decapitate III",
                texture: "textures/items/skull_creeper",
                description: "kora_me.enchant.description.decapitate"
            }
        ]
    },
    is_shovel: {
        lvl1: [{
                displayName: "§r§eEarthmover I §h[§dMore Enchants§h]§r",
                name: "Earthmover I",
                texture: "textures/blocks/dirt",
                description: "kora_me.enchant.description.earthmover"
            },
            {
                displayName: "§r§bProspector's Eye §h[§dMore Enchants§h]§r",
                name: "Prospector's Eye",
                texture: "textures/items/flint",
                description: "kora_me.enchant.description.prospectors_eye"
            },
            {
                displayName: "§r§6Treasure Hunter §h[§dMore Enchants§h]§r",
                name: "Treasure Hunter",
                texture: "textures/items/gold_nugget",
                description: "kora_me.enchant.description.treasure_hunter"
            },
            {
                displayName: "§r§fFossil Finder I §h[§dMore Enchants§h]§r",
                name: "Fossil Finder I",
                texture: "textures/items/bone",
                description: "kora_me.enchant.description.fossil_finder"
            },
            {
                displayName: "§r§aXP Bonus§h[§dMore Enchants§h]§r",
                name: "XP Bonus",
                texture: "textures/items/experience_bottle",
                description: "kora_me.enchant.description.xp_bonus"
            }
        ],
        lvl2: [{
                displayName: "§r§eEarthmover II §h[§dMore Enchants§h]§r",
                name: "Earthmover II",
                texture: "textures/blocks/dirt",
                description: "kora_me.enchant.description.earthmover"
            },
            {
                displayName: "§r§7Tunnel Bore I §h[§dMore Enchants§h]§r",
                name: "Tunnel Bore I",
                texture: "textures/items/diamond_shovel",
                description: "kora_me.enchant.description.tunnel_bore"
            },
            {
                displayName: "§r§aSoil Rejuvenation §h[§dMore Enchants§h]§r",
                name: "Soil Rejuvenation",
                texture: "textures/blocks/grass_side",
                description: "kora_me.enchant.description.soil_rejuvenation"
            },
            {
                displayName: "§r§fFossil Finder II §h[§dMore Enchants§h]§r",
                name: "Fossil Finder II",
                texture: "textures/items/bone",
                description: "kora_me.enchant.description.fossil_finder"
            }
        ],
        lvl3: [{
                displayName: "§r§eEarthmover III §h[§dMore Enchants§h]§r",
                name: "Earthmover III",
                texture: "textures/blocks/dirt",
                description: "kora_me.enchant.description.earthmover"
            },
            {
                displayName: "§r§eExcavator §h[§dMore Enchants§h]§r",
                name: "Excavator",
                texture: "textures/items/iron_shovel",
                description: "kora_me.enchant.description.excavator"
            },
            {
                displayName: "§r§7Tunnel Bore II §h[§dMore Enchants§h]§r",
                name: "Tunnel Bore II",
                texture: "textures/items/diamond_shovel",
                description: "kora_me.enchant.description.tunnel_bore"
            }
        ]
    },
    is_hoe: {
        lvl1: [{
                displayName: "§r§aHarvester's Bounty I §h[§dMore Enchants§h]§r",
                name: "Harvester's Bounty I",
                texture: "textures/items/wheat",
                description: "kora_me.enchant.description.harvesters_bounty"
            },
            {
                displayName: "§r§aXP Bonus§h[§dMore Enchants§h]§r",
                name: "XP Bonus",
                texture: "textures/items/experience_bottle",
                description: "kora_me.enchant.description.xp_bonus"
            },
            {
                displayName: "§r§aFertilizer's Touch §h[§dMore Enchants§h]§r",
                name: "Fertilizer's Touch",
                texture: "textures/items/dye_powder_white",
                description: "kora_me.enchant.description.fertilizers_touch"
            },
            {
                displayName: "§r§2Herbalist I §h[§dMore Enchants§h]§r",
                name: "Herbalist I",
                texture: "textures/blocks/flower_dandelion",
                description: "kora_me.enchant.description.herbalist"
            }
        ],
        lvl2: [{
                displayName: "§r§aHarvester's Bounty II §h[§dMore Enchants§h]§r",
                name: "Harvester's Bounty II",
                texture: "textures/items/wheat",
                description: "kora_me.enchant.description.harvesters_bounty"
            },
            {
                displayName: "§r§eScythe's Reach I §h[§dMore Enchants§h]§r",
                name: "Scythe's Reach I",
                texture: "textures/items/iron_hoe",
                description: "kora_me.enchant.description.scythes_reach"
            },
            {
                displayName: "§r§2Herbalist II §h[§dMore Enchants§h]§r",
                name: "Herbalist II",
                texture: "textures/blocks/flower_rose_blue",
                description: "kora_me.enchant.description.herbalist"
            }
        ],
        lvl3: [{
                displayName: "§r§aHarvester's Bounty III §h[§dMore Enchants§h]§r",
                name: "Harvester's Bounty III",
                texture: "textures/items/wheat",
                description: "kora_me.enchant.description.harvesters_bounty"
            },
            {
                displayName: "§r§eScythe's Reach II §h[§dMore Enchants§h]§r",
                name: "Scythe's Reach II",
                texture: "textures/items/diamond_hoe",
                description: "kora_me.enchant.description.scythes_reach"
            },
            {
                displayName: "§r§2Herbalist III §h[§dMore Enchants§h]§r",
                name: "Herbalist III",
                texture: "textures/blocks/double_plant_rose_top",
                description: "kora_me.enchant.description.herbalist"
            },
            {
                displayName: "§r§aReplanter §h[§dMore Enchants§h]§r",
                name: "Replanter",
                texture: "textures/items/wheat_seeds",
                description: "kora_me.enchant.description.replanter"
            },
        ]
    },
    is_boots: {
        lvl1: [
            {
                displayName: "§r§bDepth Strider I §h[§dMore Enchants§h]§r",
                name: "Depth Strider I",
                texture: "textures/items/potion_bottle_waterbreathing",
                description: "kora_me.enchant.description.depth_strider"
            },
            {
                displayName: "§r§aJump Boost I §h[§dMore Enchants§h]§r",
                name: "Jump Boost I",
                texture: "textures/items/feather",
                description: "kora_me.enchant.description.jump_boost"
            },
            {
                displayName: "§r§bWind Leaper I §h[§dMore Enchants§h]§r",
                name: "Wind Leaper I",
                texture: "textures/items/elytra",
                description: "kora_me.enchant.description.wind_leaper"
            },
            {
                displayName: "§r§cHunter's Pace I §h[§dMore Enchants§h]§r",
                name: "Hunter's Pace I",
                texture: "textures/items/bow_pulling_2",
                description: "kora_me.enchant.description.hunters_pace"
            },
            {
                displayName: "§r§eTrailblazer §h[§dMore Enchants§h]§r",
                name: "Trailblazer",
                texture: "textures/items/flint_and_steel",
                description: "kora_me.enchant.description.trailblazer"
            },
            {
                displayName: "§r§bEarth Grip §h[§dMore Enchants§h]§r",
                name: "Earth Grip",
                texture: "textures/blocks/ice_packed",
                description: "kora_me.enchant.description.earth_grip"
            }
        ],
        lvl2: [
            {
                displayName: "§r§bDepth Strider II §h[§dMore Enchants§h]§r",
                name: "Depth Strider II",
                texture: "textures/items/potion_bottle_waterbreathing",
                description: "kora_me.enchant.description.depth_strider"
            },
            {
                displayName: "§r§aJump Boost II §h[§dMore Enchants§h]§r",
                name: "Jump Boost II",
                texture: "textures/items/feather",
                description: "kora_me.enchant.description.jump_boost"
            },
            {
                displayName: "§r§bWind Leaper II §h[§dMore Enchants§h]§r",
                name: "Wind Leaper II",
                texture: "textures/items/elytra",
                description: "kora_me.enchant.description.wind_leaper"
            },
            {
                displayName: "§r§cHunter's Pace II §h[§dMore Enchants§h]§r",
                name: "Hunter's Pace II",
                texture: "textures/items/bow_pulling_2",
                description: "kora_me.enchant.description.hunters_pace"
            },
            {
                displayName: "§r§fSlow Falling§h[§dMore Enchants§h]§r",
                name: "Slow Falling",
                texture: "textures/items/phantom_membrane",
                description: "kora_me.enchant.description.slow_falling"
            },
            {
                displayName: "§r§qShockwave§h[§dMore Enchants§h]§r",
                name: "Shockwave",
                texture: "textures/blocks/piston_top_normal",
                description: "kora_me.enchant.description.shockwave"
            }
        ],
        lvl3: [
            {
                displayName: "§r§bDepth Strider III §h[§dMore Enchants§h]§r",
                name: "Depth Strider III",
                texture: "textures/items/potion_bottle_waterbreathing",
                description: "kora_me.enchant.description.depth_strider"
            },
            {
                displayName: "§r§6Magma Walker§h[§dMore Enchants§h]§r",
                name: "Magma Walker",
                texture: "textures/items/magma_cream",
                description: "kora_me.enchant.description.magma_walker"
            },
            {
                displayName: "§r§8Shadowstep§h[§dMore Enchants§h]§r",
                name: "Shadowstep",
                texture: "textures/items/potion_bottle_invisibility",
                description: "kora_me.enchant.description.shadowstep"
            }
        ]
    },
    is_leggings: {
        lvl1: [{
                displayName: "§r§eSpeed I §h[§dMore Enchants§h]§r",
                name: "Speed I",
                texture: "textures/items/sugar",
                description: "kora_me.enchant.description.speed"
            },
            {
                displayName: "§r§a Sprinting Stamina I §h[§dMore Enchants§h]§r",
                name: "Sprinting Stamina I",
                texture: "textures/items/golden_carrot",
                description: "kora_me.enchant.description.sprinting_stamina"
            },
            {
                displayName: "§r§cEndurance I §h[§dMore Enchants§h]§r",
                name: "Endurance I",
                texture: "textures/items/beef_cooked",
                description: "kora_me.enchant.description.endurance"
            },
            {
                displayName: "§r§fLightweight I §h[§dMore Enchants§h]§r",
                name: "Lightweight I",
                texture: "textures/items/leather_leggings",
                description: "kora_me.enchant.description.lightweight"
            },
            {
                displayName: "§r§8Iron Legs I §h[§dMore Enchants§h]§r",
                name: "Iron Legs I",
                texture: "textures/items/iron_leggings",
                description: "kora_me.enchant.description.iron_legs"
            },
            {
                displayName: "§r§aGrounded I §h[§dMore Enchants§h]§r",
                name: "Grounded I",
                texture: "textures/blocks/dirt",
                description: "kora_me.enchant.description.grounded"
            }
        ],
        lvl2: [{
                displayName: "§r§eSpeed II §h[§dMore Enchants§h]§r",
                name: "Speed II",
                texture: "textures/items/sugar",
                description: "kora_me.enchant.description.speed"
            },
            {
                displayName: "§r§aSprinting Stamina II §h[§dMore Enchants§h]§r",
                name: "Sprinting Stamina II",
                texture: "textures/items/golden_carrot",
                description: "kora_me.enchant.description.sprinting_stamina"
            },
            {
                displayName: "§r§cEndurance II §h[§dMore Enchants§h]§r",
                name: "Endurance II",
                texture: "textures/items/beef_cooked",
                description: "kora_me.enchant.description.endurance"
            },
            {
                displayName: "§r§fLightweight II §h[§dMore Enchants§h]§r",
                name: "Lightweight II",
                texture: "textures/items/chainmail_leggings",
                description: "kora_me.enchant.description.lightweight"
            },
            {
                displayName: "§r§8Iron Legs II §h[§dMore Enchants§h]§r",
                name: "Iron Legs II",
                texture: "textures/items/iron_leggings",
                description: "kora_me.enchant.description.iron_legs"
            },
            {
                displayName: "§r§aGrounded II §h[§dMore Enchants§h]§r",
                name: "Grounded II",
                texture: "textures/blocks/dirt",
                description: "kora_me.enchant.description.grounded"
            },
            {
                displayName: "§r§fSwift Sneak §h[§dMore Enchants§h]§r",
                name: "Swift Sneak",
                texture: "textures/items/leather_boots",
                description: "kora_me.enchant.description.swift_sneak"
            },
            {
                displayName: "§r§cAdrenaline Rush §h[§dMore Enchants§h]§r",
                name: "Adrenaline Rush",
                texture: "textures/items/potion_bottle_speed",
                description: "kora_me.enchant.description.adrenaline_rush"
            },
            {
                displayName: "§r§aClimber §h[§dMore Enchants§h]§r",
                name: "Climber",
                texture: "textures/blocks/ladder",
                description: "kora_me.enchant.description.climber"
            },
            {
                displayName: "§r§bWind Runner §h[§dMore Enchants§h]§r",
                name: "Wind Runner",
                texture: "textures/items/elytra",
                description: "kora_me.enchant.description.wind_runner"
            }
        ],
        lvl3: [{
                displayName: "§r§cEndurance III §h[§dMore Enchants§h]§r",
                name: "Endurance III",
                texture: "textures/items/beef_cooked",
                description: "kora_me.enchant.description.endurance"
            },
            {
                displayName: "§r§8Iron Legs III §h[§dMore Enchants§h]§r",
                name: "Iron Legs III",
                texture: "textures/items/iron_leggings",
                description: "kora_me.enchant.description.iron_legs"
            },
            {
                displayName: "§r§bDouble Jump §h[§dMore Enchants§h]§r",
                name: "Double Jump",
                texture: "textures/items/rabbit_foot",
                description: "kora_me.enchant.description.double_jump"
            },
            {
                displayName: "§r§fWall Kick §h[§dMore Enchants§h]§r",
                name: "Wall Kick",
                texture: "textures/blocks/cobblestone_wall",
                description: "kora_me.enchant.description.wall_kick"
            }
        ]
    },
    is_chestplate: {
        lvl1: [{
                displayName: "§r§eAgility I §h[§dMore Enchants§h]§r",
                name: "Agility I",
                texture: "textures/items/feather",
                description: "kora_me.enchant.description.agility"
            },
            {
                displayName: "§r§cLife Bonus I §h[§dMore Enchants§h]§r",
                name: "Life Bonus I",
                texture: "textures/items/apple_golden",
                description: "kora_me.enchant.description.life_bonus"
            },
            {
                displayName: "§r§bMagnetism I §h[§dMore Enchants§h]§r",
                name: "Magnetism I",
                texture: "textures/items/iron_ingot",
                description: "kora_me.enchant.description.magnetism"
            },
            {
                displayName: "§r§7Spikes I §h[§dMore Enchants§h]§r",
                name: "Spikes I",
                texture: "textures/blocks/cactus_side",
                description: "kora_me.enchant.description.spikes"
            },
            {
                displayName: "§r§3Guardian's Oath I §h[§dMore Enchants§h]§r",
                name: "Guardian's Oath I",
                texture: "textures/items/prismarine_crystals",
                description: "kora_me.enchant.description.guardians_oath"
            },
            {
                displayName: "§r§6Flame Guard I §h[§dMore Enchants§h]§r",
                name: "Flame Guard I",
                texture: "textures/items/magma_cream",
                description: "kora_me.enchant.description.flame_guard"
            },
            {
                displayName: "§r§8Wither Ward I §h[§dMore Enchants§h]§r",
                name: "Wither Ward I",
                texture: "textures/items/skull_wither",
                description: "kora_me.enchant.description.wither_ward"
            },
            {
                displayName: "§r§fIron Will I §h[§dMore Enchants§h]§r",
                name: "Iron Will I",
                texture: "textures/items/iron_chestplate",
                description: "kora_me.enchant.description.iron_will"
            },
            {
                displayName: "§r§6Teleportation I §h[§dMore Enchants§h]§r",
                name: "Teleportation I",
                texture: "textures/items/ender_pearl",
                description: "kora_me.enchant.description.teleportation"
            }
        ],
        lvl2: [{
                displayName: "§r§eAgility II §h[§dMore Enchants§h]§r",
                name: "Agility II",
                texture: "textures/items/feather",
                description: "kora_me.enchant.description.agility"
            },
            {
                displayName: "§r§cLife Bonus II §h[§dMore Enchants§h]§r",
                name: "Life Bonus II",
                texture: "textures/items/apple_golden",
                description: "kora_me.enchant.description.life_bonus"
            },
            {
                displayName: "§r§bMagnetism II §h[§dMore Enchants§h]§r",
                name: "Magnetism II",
                texture: "textures/items/iron_ingot",
                description: "kora_me.enchant.description.magnetism"
            },
            {
                displayName: "§r§7Spikes II §h[§dMore Enchants§h]§r",
                name: "Spikes II",
                texture: "textures/blocks/cactus_side",
                description: "kora_me.enchant.description.spikes"
            },
            {
                displayName: "§r§3Guardian's Oath II §h[§dMore Enchants§h]§r",
                name: "Guardian's Oath II",
                texture: "textures/items/prismarine_crystals",
                description: "kora_me.enchant.description.guardians_oath"
            },
            {
                displayName: "§r§6Flame Guard II §h[§dMore Enchants§h]§r",
                name: "Flame Guard II",
                texture: "textures/items/magma_cream",
                description: "kora_me.enchant.description.flame_guard"
            },
            {
                displayName: "§r§8Wither Ward II §h[§dMore Enchants§h]§r",
                name: "Wither Ward II",
                texture: "textures/items/skull_wither",
                description: "kora_me.enchant.description.wither_ward"
            },
            {
                displayName: "§r§fIron Will II §h[§dMore Enchants§h]§r",
                name: "Iron Will II",
                texture: "textures/items/netherite_chestplate",
                description: "kora_me.enchant.description.iron_will"
            },
            {
                displayName: "§r§6Teleportation II §h[§dMore Enchants§h]§r",
                name: "Teleportation II",
                texture: "textures/items/ender_pearl",
                description: "kora_me.enchant.description.teleportation"
            }
        ],
        lvl3: [{
                displayName: "§r§eAgility III §h[§dMore Enchants§h]§r",
                name: "Agility III",
                texture: "textures/items/feather",
                description: "kora_me.enchant.description.agility"
            },
            {
                displayName: "§r§cLife Bonus III §h[§dMore Enchants§h]§r",
                name: "Life Bonus III",
                texture: "textures/items/apple_golden",
                description: "kora_me.enchant.description.life_bonus"
            },
            {
                displayName: "§r§bMagnetism III §h[§dMore Enchants§h]§r",
                name: "Magnetism III",
                texture: "textures/items/iron_ingot",
                description: "kora_me.enchant.description.magnetism"
            },
            {
                displayName: "§r§6Flame Guard III §h[§dMore Enchants§h]§r",
                name: "Flame Guard III",
                texture: "textures/items/magma_cream",
                description: "kora_me.enchant.description.flame_guard"
            },
            {
                displayName: "§r§8Blast Shield §h[§dMore Enchants§h]§r",
                name: "Blast Shield",
                texture: "textures/blocks/obsidian",
                description: "kora_me.enchant.description.blast_shield"
            },
            {
                displayName: "§r§4Rage §h[§dMore Enchants§h]§r",
                name: "Rage",
                texture: "textures/items/potion_bottle_strength",
                description: "kora_me.enchant.description.rage"
            },
            {
                displayName: "§r§7Stoneform §h[§dMore Enchants§h]§r",
                name: "Stoneform",
                texture: "textures/blocks/stone",
                description: "kora_me.enchant.description.stoneform"
            },
            {
                displayName: "§r§aVital Surge §h[§dMore Enchants§h]§r",
                name: "Vital Surge",
                texture: "textures/ui/heart_new",
                description: "kora_me.enchant.description.vital_surge"
            },
            {
                displayName: "§r§fWeightless §h[§dMore Enchants§h]§r",
                name: "Weightless",
                texture: "textures/items/elytra",
                description: "kora_me.enchant.description.weightless"
            },
            {
                displayName: "§r§bStormcaller §h[§dMore Enchants§h]§r",
                name: "Stormcaller",
                texture: "textures/items/trident",
                description: "kora_me.enchant.description.stormcaller"
            },
            {
                displayName: "§r§4Berserker's Core §h[§dMore Enchants§h]§r",
                name: "Berserker's Core",
                texture: "textures/items/netherite_sword",
                description: "kora_me.enchant.description.berserkers_core"
            },
            {
                displayName: "§r§6Teleportation III §h[§dMore Enchants§h]§r",
                name: "Teleportation III",
                texture: "textures/items/ender_pearl",
                description: "kora_me.enchant.description.teleportation"
            }
        ]
    },
    is_helmet: {
        lvl1: [{
                displayName: "§r§6Lava Swimmer I §h[§dMore Enchants§h]§r",
                name: "Lava Swimmer I",
                texture: "textures/items/magma_cream",
                description: "kora_me.enchant.description.lava_swimmer"
            },
            {
                displayName: "§r§bAqua Breather I §h[§dMore Enchants§h]§r",
                name: "Aqua Breather I",
                texture: "textures/items/potion_bottle_waterbreathing",
                description: "kora_me.enchant.description.aqua_breather"
            },
            {
                displayName: "§r§3Guardian's Ward I §h[§dMore Enchants§h]§r",
                name: "Guardian's Ward I",
                texture: "textures/items/prismarine_shard",
                description: "kora_me.enchant.description.guardians_ward"
            },
            {
                displayName: "§r§fThick Skull I §h[§dMore Enchants§h]§r",
                name: "Thick Skull I",
                texture: "textures/items/iron_helmet",
                description: "kora_me.enchant.description.thick_skull"
            },
            {
                displayName: "§r§eNight Vision §h[§dMore Enchants§h]§r",
                name: "Night Vision",
                texture: "textures/items/potion_bottle_nightvision",
                description: "kora_me.enchant.description.night_vision"
            }
        ],
        lvl2: [{
                displayName: "§r§6Lava Swimmer II §h[§dMore Enchants§h]§r",
                name: "Lava Swimmer II",
                texture: "textures/items/magma_cream",
                description: "kora_me.enchant.description.lava_swimmer"
            },
            {
                displayName: "§r§bAqua Breather II §h[§dMore Enchants§h]§r",
                name: "Aqua Breather II",
                texture: "textures/items/potion_bottle_waterbreathing",
                description: "kora_me.enchant.description.aqua_breather"
            },
            {
                displayName: "§r§3Guardian's Ward II §h[§dMore Enchants§h]§r",
                name: "Guardian's Ward II",
                texture: "textures/items/prismarine_shard",
                description: "kora_me.enchant.description.guardians_ward"
            },
            {
                displayName: "§r§fThick Skull II §h[§dMore Enchants§h]§r",
                name: "Thick Skull II",
                texture: "textures/items/iron_helmet",
                description: "kora_me.enchant.description.thick_skull"
            },
            {
                displayName: "§r§fClarity §h[§dMore Enchants§h]§r",
                name: "Clarity",
                texture: "textures/items/milk_bucket",
                description: "kora_me.enchant.description.clarity"
            },
            {
                displayName: "§r§ePhotosynthesis §h[§dMore Enchants§h]§r",
                name: "Photosynthesis",
                texture: "textures/blocks/sunflower_front",
                description: "kora_me.enchant.description.photosynthesis"
            },
            {
                displayName: "§r§aBeast Sense §h[§dMore Enchants§h]§r",
                name: "Beast Sense",
                texture: "textures/items/spider_eye",
                description: "kora_me.enchant.description.beast_sense"
            }
        ],
        lvl3: [{
                displayName: "§r§6Lava Swimmer III §h[§dMore Enchants§h]§r",
                name: "Lava Swimmer III",
                texture: "textures/items/magma_cream",
                description: "kora_me.enchant.description.lava_swimmer"
            },
            {
                displayName: "§r§bAqua Breather III §h[§dMore Enchants§h]§r",
                name: "Aqua Breather III",
                texture: "textures/items/potion_bottle_waterbreathing",
                description: "kora_me.enchant.description.aqua_breather"
            },
            {
                displayName: "§r§fThick Skull III §h[§dMore Enchants§h]§r",
                name: "Thick Skull III",
                texture: "textures/items/iron_helmet",
                description: "kora_me.enchant.description.thick_skull"
            },
            {
                displayName: "§r§eHighlight §h[§dMore Enchants§h]§r",
                name: "Highlight",
                texture: "textures/blocks/torch_on",
                description: "kora_me.enchant.description.highlight"
            },
            {
                displayName: "§r§5Echo Locator §h[§dMore Enchants§h]§r",
                name: "Echo Locator",
                texture: "textures/items/amethyst_shard",
                description: "kora_me.enchant.description.echo_locator"
            },
            {
                displayName: "§r§dMind Shield §h[§dMore Enchants§h]§r",
                name: "Mind Shield",
                texture: "textures/items/shield",
                description: "kora_me.enchant.description.mind_shield"
            },
            {
                displayName: "§r§eSolar Shield §h[§dMore Enchants§h]§r",
                name: "Solar Shield",
                texture: "textures/items/phantom_membrane",
                description: "kora_me.enchant.description.solar_shield"
            },
            {
                displayName: "§r§7Moon's Grace §h[§dMore Enchants§h]§r",
                name: "Moon's Grace",
                texture: "textures/blocks/glowstone",
                description: "kora_me.enchant.description.moons_grace"
            }
        ]
    }
};