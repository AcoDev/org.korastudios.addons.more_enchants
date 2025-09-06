import {
    world,
    system,
    ItemStack,
    ItemComponentTypes,
    BlockPermutation,
    EquipmentSlot 
} from '@minecraft/server';
import {
    listOfEnchants
} from './exports';

const SAFEGUARD_MAX_BLOCKS = 64; // Performance safeguard for Vein Miner and Timber

// how many ABOVE the first broken block
const MAX_SANDSTORM_HEIGHT = 5;

const INDESTRUCTIBLE_BLOCKS = [
    "minecraft:bedrock", "minecraft:barrier", "minecraft:light_block", "minecraft:deny",
    "minecraft:structure_block", "minecraft:portal", "minecraft:end_portal",
    "minecraft:end_portal_frame", "minecraft:border_block"
];

// Define world height limits for boundary checks
const WORLD_MIN_Y = -64;
const WORLD_MAX_Y = 319;

/**
 * A robust function to break a block using commands and log any errors.
 * @param {import('@minecraft/server').Dimension} dimension The dimension to run the command in.
 * @param {import('@minecraft/server').Vector3} blockLocation The location of the block to break.
 * @param {string} enchantName The name of the enchantment triggering the break, for logging purposes.
 */
async function breakBlockWithFeedback(dimension, blockLocation, enchantName) {
    try {
        await dimension.runCommandAsync(`setblock ${blockLocation.x} ${blockLocation.y} ${blockLocation.z} air destroy`);
    } catch (error) {
        console.error(`[MoreEnchants] ${enchantName} failed to break block at ${blockLocation.x},${blockLocation.y},${blockLocation.z}. Error: ${JSON.stringify(error)}`);
    }
}

// Helper: spawn particles around a block for 5 seconds (100 ticks)
function spawnOreParticlesAround(dimension, blockLocation) {
    const {
        x,
        y,
        z
    } = blockLocation;

    // Offsets (square around block, 0.5 above center)
    const offsets = [{
            x: 1,
            y: 0.5,
            z: 0
        }, // east
        {
            x: -1,
            y: 0.5,
            z: 0
        }, // west
        {
            x: 0,
            y: 0.5,
            z: 1
        }, // south
        {
            x: 0,
            y: 0.5,
            z: -1
        } // north
    ];

    let ticks = 0;
    const interval = system.runInterval(() => {
        for (const offset of offsets) {
            const px = x + 0.5 + offset.x;
            const py = y + offset.y;
            const pz = z + 0.5 + offset.z;

            dimension.runCommandAsync(
                `particle minecraft:redstone_ore_dust_particle ${px} ${py} ${pz}`
            ).catch(err => console.warn("Particle failed:", err));
        }

        ticks++;
        if (ticks >= 60) { // 5 seconds at 20 tps
            system.clearRun(interval);
        }
    }, 1); // every tick
}


// Iterative (non-recursive) function for Vein Miner
async function veinMine(player, dimension, startBlock, item, oreTypeId) {
    const durability = item.getComponent(ItemComponentTypes.Durability);
    let count = 0;

    const queue = [startBlock];
    const visited = new Set([`${startBlock.x},${startBlock.y},${startBlock.z}`]);

    while (queue.length > 0) {
        if (count >= SAFEGUARD_MAX_BLOCKS || durability.damage >= durability.maxDurability) break;

        const currentBlock = queue.shift();

        await breakBlockWithFeedback(dimension, currentBlock.location, 'Vein Miner');
        durability.damage++;
        count++;

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) continue;

                    const neighborLocation = {
                        x: currentBlock.x + x,
                        y: currentBlock.y + y,
                        z: currentBlock.z + z
                    };
                    const key = `${neighborLocation.x},${neighborLocation.y},${neighborLocation.z}`;

                    if (!visited.has(key)) {
                        visited.add(key);
                        const neighborBlock = dimension.getBlock(neighborLocation);
                        if (neighborBlock && neighborBlock.typeId === oreTypeId) {
                            queue.push(neighborBlock);
                        }
                    }
                }
            }
        }
    }
    player.getComponent("minecraft:equippable").setEquipment("Mainhand", item);
}

// Iterative function for Timber
async function timber(player, dimension, startBlock, item) {
    const durability = item.getComponent(ItemComponentTypes.Durability);
    let count = 0;

    const queue = [startBlock];
    const visited = new Set([`${startBlock.x},${startBlock.y},${startBlock.z}`]);

    while (queue.length > 0) {
        if (count >= SAFEGUARD_MAX_BLOCKS || durability.damage >= durability.maxDurability) break;

        const currentBlock = queue.shift();

        await breakBlockWithFeedback(dimension, currentBlock.location, 'Timber');
        durability.damage++;
        count++;

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    if (x === 0 && y === 0 && z === 0) continue;

                    const neighborLocation = {
                        x: currentBlock.x + x,
                        y: currentBlock.y + y,
                        z: currentBlock.z + z
                    };
                    const key = `${neighborLocation.x},${neighborLocation.y},${neighborLocation.z}`;

                    if (!visited.has(key)) {
                        visited.add(key);
                        const neighborBlock = dimension.getBlock(neighborLocation);
                        if (neighborBlock && neighborBlock.typeId.includes('log')) {
                            queue.push(neighborBlock);
                        }
                    }
                }
            }
        }
    }
    player.getComponent("minecraft:equippable").setEquipment("Mainhand", item);
}

world.afterEvents.playerBreakBlock.subscribe(async (event) => {
    const {
        brokenBlockPermutation,
        block,
        player,
        itemStackAfterBreak: item
    } = event;
    const dimension = player.dimension;

    if (!item) return;

    const itemLores = item.getLore();
    const itemTypeId = item.typeId;
    const brokenBlockId = brokenBlockPermutation.type.id;

    // --- PICKAXE ENCHANTS ---
    if (itemTypeId.includes('pickaxe')) {
        const isOre = brokenBlockId.includes('ore');

        // Vein Miner (Priority)
        if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[3].displayName)) && isOre) {
            await veinMine(player, dimension, block, item, brokenBlockId);
            return;
        }

        // Mega Digger (New for Pickaxe)
        if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[2].displayName))) {
            const durability = item.getComponent(ItemComponentTypes.Durability);
            const view = player.getViewDirection();

            const absX = Math.abs(view.x);
            const absY = Math.abs(view.y);
            const absZ = Math.abs(view.z);

            for (const a of [-1, 0, 1]) {
                for (const b of [-1, 0, 1]) {
                    if (a === 0 && b === 0) continue;
                    if (durability.damage >= durability.maxDurability) break;

                    let targetLocation;
                    if (absY > absX && absY > absZ) { // Looking up/down -> X/Z plane
                        targetLocation = {
                            x: block.x + a,
                            y: block.y,
                            z: block.z + b
                        };
                    } else if (absX > absY && absX > absZ) { // Looking east/west -> Y/Z plane
                        targetLocation = {
                            x: block.x,
                            y: block.y + a,
                            z: block.z + b
                        };
                    } else { // Looking north/south -> X/Y plane
                        targetLocation = {
                            x: block.x + a,
                            y: block.y + b,
                            z: block.z
                        };
                    }

                    const targetBlock = dimension.getBlock(targetLocation);
                    if (targetBlock && !INDESTRUCTIBLE_BLOCKS.includes(targetBlock.typeId)) {
                        breakBlockWithFeedback(dimension, targetLocation, 'Mega Digger');
                        durability.damage++;
                    }
                }
                if (durability.damage >= durability.maxDurability) break;
            }
            player.getComponent("minecraft:equippable").setEquipment("Mainhand", item);
            return;
        }

        // Auto Smelter
        if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[0].displayName)) && isOre) {
            system.run(() => {
                const items = dimension.getEntities({
                    type: 'item',
                    location: player.location,
                    maxDistance: 3
                });
                for (const itemEntity of items) {
                    if (!itemEntity.isValid()) continue;
                    const itemStack = itemEntity.getComponent("minecraft:item").itemStack;
                    let smeltedItem = null;
                    if (itemStack.typeId.includes('raw_iron')) smeltedItem = 'minecraft:iron_ingot';
                    if (itemStack.typeId.includes('raw_gold')) smeltedItem = 'minecraft:gold_ingot';
                    if (itemStack.typeId.includes('raw_copper')) smeltedItem = 'minecraft:copper_ingot';

                    if (smeltedItem) {
                        const newItem = new ItemStack(smeltedItem, itemStack.amount);
                        dimension.spawnItem(newItem, itemEntity.location);
                        itemEntity.remove();
                    }
                }
            });
        }

        // Geologist's Luck
        const geoLuck2 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[0].displayName));
        const geoLuck1 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[1].displayName));
        if ((geoLuck1 || geoLuck2) && isOre) {
            const chance = geoLuck2 ? 0.15 : 0.08;
            if (Math.random() < chance) {
                const gems = [new ItemStack('minecraft:lapis_lazuli'), new ItemStack('minecraft:amethyst_shard'), new ItemStack('minecraft:emerald')];
                dimension.spawnItem(gems[Math.floor(Math.random() * gems.length)], block.location);
            }
        }

        // Earthshaker
        const earthshaker2 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[2].displayName));
        const earthshaker1 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[5].displayName));
        if (earthshaker1 || earthshaker2) {
            const chance = earthshaker2 ? 0.50 : 0.25;
            if (Math.random() < chance) {
                const radius = earthshaker2 ? 5 : 3;
                const durability = item.getComponent(ItemComponentTypes.Durability);
                const earthshakerBlocks = ['gravel', 'sand'];

                dimension.spawnParticle("minecraft:knockback_roar_particle", block.location);

                for (let x = -radius; x <= radius; x++) {
                    for (let y = -radius; y <= radius; y++) {
                        for (let z = -radius; z <= radius; z++) {
                            if (x === 0 && y === 0 && z === 0) continue;
                            if (durability.damage >= durability.maxDurability) break;

                            const targetLocation = { x: block.x + x, y: block.y + y, z: block.z + z };
                            if (targetLocation.y < WORLD_MIN_Y || targetLocation.y > WORLD_MAX_Y) continue;
                            const targetBlock = dimension.getBlock(targetLocation);

                            if (targetBlock && earthshakerBlocks.some(keyword => targetBlock.typeId.includes(keyword))) {
                                await breakBlockWithFeedback(dimension, targetLocation, 'Earthshaker');
                                durability.damage++;
                            }
                        }
                        if (durability.damage >= durability.maxDurability) break;
                    }
                    if (durability.damage >= durability.maxDurability) break;
                }
                player.getComponent("minecraft:equippable").setEquipment("Mainhand", item);
            }
        }

        // Crystal Fortune
        const crystalFortune3 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl3[1].displayName));
        const crystalFortune2 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[3].displayName));
        const crystalFortune1 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[6].displayName));
        if (crystalFortune1 || crystalFortune2 || crystalFortune3) {
            let dropAmount = 0;
            if (crystalFortune3) dropAmount = Math.random() < 0.5 ? 3 : 2;
            else if (crystalFortune2) dropAmount = Math.random() < 0.5 ? 2 : 1;
            else if (crystalFortune1) dropAmount = Math.random() < 0.5 ? 1 : 0;

            if (dropAmount > 0) {
                let droppedItem = null;
                if (brokenBlockId.includes('amethyst')) droppedItem = 'minecraft:amethyst_shard';
                if (brokenBlockId.includes('quartz')) droppedItem = 'minecraft:quartz';
                if (brokenBlockId.includes('diamond')) droppedItem = 'minecraft:diamond';
                if (brokenBlockId.includes('emerald')) droppedItem = 'minecraft:emerald';

                if (droppedItem) dimension.spawnItem(new ItemStack(droppedItem, dropAmount), block.location);
            }
        }

        // Lucky Miner: Small chance to find valuable resources when mining common stone.
        if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl3[2].displayName))) {
            const luckyBlocks = ['stone', 'deepslate', 'andesite', 'diorite', 'granite', 'tuff', 'netherrack'];
            // Ensure it doesn't trigger on ores, which are handled by other enchants.
            if (luckyBlocks.some(b => brokenBlockId.includes(b) && !brokenBlockId.includes('ore'))) {
                if (Math.random() < 0.005) { // 0.5% chance
                    const luckyDrops = [
                        new ItemStack("minecraft:diamond", 1),
                        new ItemStack("minecraft:emerald", 1),
                        new ItemStack("minecraft:lapis_lazuli", 2),
                        new ItemStack("minecraft:amethyst_shard", 1),
                        new ItemStack("minecraft:gold_nugget", 3),
                        new ItemStack("minecraft:iron_ingot", 1),
                        new ItemStack("minecraft:redstone", 3),
                        new ItemStack("minecraft:coal", 2),
                        new ItemStack("minecraft:quartz", 1),
                        new ItemStack("minecraft:netherite_scrap", 1)
                    ];
                    const drop = luckyDrops[Math.floor(Math.random() * luckyDrops.length)];
                    dimension.spawnItem(drop, block.location);
                    player.playSound("random.orb", { location: player.location, pitch: 1.5 });
                    dimension.spawnParticle("minecraft:totem_particle", block.location);
                }
            }
        }

        // Prospector's Instinct
        const prospectorLore = listOfEnchants.is_pickaxe.lvl1[7].displayName;
        if (itemLores.some(lore => lore.includes(prospectorLore)) && isOre) {
            const durability = item.getComponent(ItemComponentTypes.Durability);
            if (durability.damage < durability.maxDurability - 5) {
                durability.damage += 5;
                player.getComponent("minecraft:equippable").setEquipment("Mainhand", item);
                const radius = 5;

                const round = (n) => Math.round(n * 100) / 100;

                for (let x = -radius; x <= radius; x++) {
                    for (let y = -radius; y <= radius; y++) {
                        const targetY = block.y + y;
                        if (targetY < WORLD_MIN_Y || targetY > WORLD_MAX_Y) continue;

                        for (let z = -radius; z <= radius; z++) {
                            const targetBlock = dimension.getBlock({
                                x: block.x + x,
                                y: targetY,
                                z: block.z + z
                            });

                            if (targetBlock && targetBlock.typeId.includes('ore')) {
                                // Center of the ore block
                                const blockCenter = {
                                    x: round(targetBlock.x),
                                    y: round(targetBlock.y),
                                    z: round(targetBlock.z)
                                };

                                // Spawn redstone dust particle for 5s
                                spawnOreParticlesAround(dimension, blockCenter);
                            }
                        }
                    }
                }
            }
        }

        // XP Bonus (Pickaxe)
        const xpBonus3 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl3[0].displayName));
        const xpBonus2 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[1].displayName));
        const xpBonus1 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[4].displayName));
        if (xpBonus1 || xpBonus2 || xpBonus3) {
            const level = xpBonus3 ? 3 : xpBonus2 ? 2 : 1;
            if (Math.random() < (0.2 * level)) {
                dimension.spawnEntity('minecraft:xp_orb', block.location);
            }
        }

        // Speed
        const speed3 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl3[3].displayName));
        const speed2 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl2[4].displayName));
        const speed1 = itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl1[8].displayName));

        const speedBlocks = ['stone', 'cobblestone', 'deepslate', 'andesite', 'diorite', 'granite', 'tuff', 'calcite', 'sandstone', 'netherrack', 'end_stone', 'ore'];
        const isSpeedBlock = speedBlocks.some(keyword => brokenBlockId.includes(keyword));

        if ((speed1 || speed2 || speed3) && isSpeedBlock) {
            const amplifier = speed3 ? 2 : speed2 ? 1 : 0; // Haste I, II, III
            player.addEffect("haste", 40, { // 2 seconds
                amplifier: amplifier,
                showParticles: false
            });
        }
    }

    // --- AXE ENCHANTS ---
    else if (itemTypeId.includes('axe')) {

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[4].displayName)) && brokenBlockId.includes('log')) {
            await timber(player, dimension, block, item);
            return;
        }

        const lumberjack3 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[0].displayName));
        const lumberjack2 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[1].displayName));
        const lumberjack1 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[1].displayName));
        if ((lumberjack1 || lumberjack2 || lumberjack3) && brokenBlockId.includes('log')) {
            const level = lumberjack3 ? 3 : lumberjack2 ? 2 : 1;
            if (Math.random() < (0.1 * level)) dimension.spawnItem(new ItemStack("minecraft:sapling", 1), block.location);
            if (Math.random() < (0.1 * level)) dimension.spawnItem(new ItemStack("minecraft:stick", 1), block.location);
            if (Math.random() < (0.05 * level)) dimension.spawnItem(new ItemStack("minecraft:apple", 1), block.location);
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[2].displayName)) && brokenBlockId.includes('log')) {
            system.runTimeout(() => {
                try {
                    dimension.getBlock(block.location).setPermutation(brokenBlockPermutation);
                } catch (e) {
                    // Block could not be placed (e.g. another block is now there)
                }
            }, 100);
        }

        const carver3 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl3[1].displayName));
        const carver2 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[3].displayName));
        const carver1 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[2].displayName));

        const carverBlocks = ['planks', 'fence', 'door', 'trapdoor', 'sign', 'slab', 'stairs'];
        const isCarverBlock = carverBlocks.some(keyword => brokenBlockId.includes(keyword));

        if ((carver1 || carver2 || carver3) && isCarverBlock) {
            const speed = carver3 ? 4 : carver2 ? 2 : 1;
            player.addEffect("haste", 20, {
                amplifier: speed,
                showParticles: false
            });
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[4].displayName)) && brokenBlockId.includes('log')) {
            if (Math.random() < 0.1) {
                dimension.spawnItem(new ItemStack("minecraft:charcoal", 1), block.location);
            }
        }

        const nature2 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl2[5].displayName));
        const nature1 = itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[3].displayName));
        if ((nature1 || nature2) && (brokenBlockId.includes('mushroom') || brokenBlockId.includes('vine') || brokenBlockId.includes('leaves'))) {
            const bonus = nature2 ? 2 : 1;
            if (Math.random() < 0.2) {
                dimension.spawnItem(new ItemStack(brokenBlockId, bonus), block.location);
            }
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_axe.lvl1[5].displayName))) {
            if (Math.random() < 0.2) {
                dimension.spawnEntity("minecraft:xp_orb", block.location);
            }
        }
    }

    // --- SHOVEL ENCHANTS ---
    else if (itemTypeId.includes('shovel')) {
        const durability = item.getComponent(ItemComponentTypes.Durability);

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl3[1].displayName))) { // Excavator
            const view = player.getViewDirection();
            const absX = Math.abs(view.x);
            const absY = Math.abs(view.y);
            const absZ = Math.abs(view.z);

            for (const a of [-1, 0, 1]) {
                for (const b of [-1, 0, 1]) {
                    if (a === 0 && b === 0) continue;
                    if (durability.damage >= durability.maxDurability) break;

                    let targetLocation;
                    if (absY > absX && absY > absZ) {
                        targetLocation = {
                            x: block.x + a,
                            y: block.y,
                            z: block.z + b
                        };
                    } else if (absX > absY && absX > absZ) {
                        targetLocation = {
                            x: block.x,
                            y: block.y + a,
                            z: block.z + b
                        };
                    } else {
                        targetLocation = {
                            x: block.x + a,
                            y: block.y + b,
                            z: block.z
                        };
                    }
                    if (targetLocation.y < WORLD_MIN_Y || targetLocation.y > WORLD_MAX_Y) continue;

                    const targetBlock = dimension.getBlock(targetLocation);
                    if (targetBlock && (targetBlock.typeId.includes('dirt') || targetBlock.typeId.includes('sand') || targetBlock.typeId.includes('gravel'))) {
                        breakBlockWithFeedback(dimension, targetLocation, 'Excavator');
                        durability.damage++;
                    }
                }
                if (durability.damage >= durability.maxDurability) break;
            }
            player.getComponent("minecraft:equippable").setEquipment("Mainhand", item);
        }

        const tunnelBore2 = itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl3[2].displayName));
        const tunnelBore1 = itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl2[1].displayName));
        if (tunnelBore1 || tunnelBore2) {
            const view = player.getViewDirection();
            const length = tunnelBore2 ? 3 : 2;
            for (let i = 1; i <= length; i++) {
                if (durability.damage >= durability.maxDurability) break;
                const targetLocation = {
                    x: block.x + Math.round(view.x) * i,
                    y: block.y + Math.round(view.y) * i,
                    z: block.z + Math.round(view.z) * i
                };

                if (targetLocation.y < WORLD_MIN_Y || targetLocation.y > WORLD_MAX_Y) continue;

                const targetBlock = dimension.getBlock(targetLocation);
                if (targetBlock && !INDESTRUCTIBLE_BLOCKS.includes(targetBlock.typeId)) {
                    breakBlockWithFeedback(dimension, targetLocation, 'Tunnel Bore');
                    durability.damage++;
                }
            }
            player.getComponent("minecraft:equippable").setEquipment("Mainhand", item);
        }

        const earthmover3 = itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl3[0].displayName));
        const earthmover2 = itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl2[0].displayName));
        const earthmover1 = itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[0].displayName));
        if (earthmover1 || earthmover2 || earthmover3) {
            const level = earthmover3 ? 3 : earthmover2 ? 2 : 1;
            player.addEffect("haste", 20 * level, {
                amplifier: level - 1,
                showParticles: false
            });
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[1].displayName))) { // Prospector's Eye
            if (Math.random() < 0.1 && (brokenBlockId.includes('dirt') || brokenBlockId.includes('gravel'))) {
                const valuables = [new ItemStack("minecraft:flint"), new ItemStack("minecraft:iron_nugget")];
                dimension.spawnItem(valuables[Math.floor(Math.random() * valuables.length)], block.location);
            }
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[2].displayName))) { // Treasure Hunter
            if (Math.random() < 0.05) {
                const treasures = [new ItemStack("minecraft:emerald"), new ItemStack("minecraft:gold_nugget")];
                dimension.spawnItem(treasures[Math.floor(Math.random() * treasures.length)], block.location);
            }
        }

        const fossilFinder2 = itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl2[3].displayName));
        const fossilFinder1 = itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[3].displayName));
        if ((fossilFinder1 || fossilFinder2) && block.location.y < 50) {
            const chance = fossilFinder2 ? 0.1 : 0.05;
            if (Math.random() < chance) {
                dimension.spawnItem(new ItemStack("minecraft:bone"), block.location);
            }
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl2[2].displayName))) { // Soil Rejuvenation
            if (brokenBlockId.includes('dirt') && dimension.getBlock({
                    x: block.x,
                    y: block.y + 1,
                    z: block.z
                }).isAir) {
                system.runTimeout(() => {
                    try {
                        dimension.getBlock(block.location).setPermutation(brokenBlockPermutation.withState("dirt_type", "grass"));
                    } catch (e) {}
                }, 100);
            }
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_shovel.lvl1[4].displayName))) { // XP Bonus
            if (Math.random() < 0.15) {
                dimension.spawnEntity("minecraft:xp_orb", block.location);
            }
        }
    }

    // --- HOE ENCHANTS ---
    else if (itemTypeId.includes('hoe')) {
        const scythe2 = itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl3[1].displayName));
        const scythe1 = itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl2[1].displayName));
        const harvestableCrops = ["minecraft:wheat", "minecraft:carrots", "minecraft:potatoes", "minecraft:beetroot", "minecraft:nether_wart"];

        if ((scythe1 || scythe2) && harvestableCrops.includes(brokenBlockId)) {
            const hoe = item.clone();
            const durability = hoe.getComponent(ItemComponentTypes.Durability);
            let durabilityChanged = false;
            const radius = scythe2 ? 2 : 1;

            for (let x = -radius; x <= radius; x++) {
                for (let z = -radius; z <= radius; z++) {
                    if (x === 0 && z === 0) continue;
                    if (durability.damage >= durability.maxDurability) break;

                    const targetLocation = { x: block.x + x, y: block.y, z: block.z + z };
                    const targetBlock = dimension.getBlock(targetLocation);

                    if (targetBlock && harvestableCrops.includes(targetBlock.typeId)) {
                        const perm = targetBlock.permutation;
                        let isMature = false;

                        const age = perm.getState("age");
                        const growth = perm.getState("growth");

                        if ((targetBlock.typeId === 'minecraft:nether_wart' && age === 3) || (age === 7 || growth === 7)) {
                            isMature = true;
                        }

                        if (isMature) {
                            await breakBlockWithFeedback(dimension, targetLocation, 'Scythes Reach');
                            durability.damage++;
                            durabilityChanged = true;
                        }
                    }
                }
                if (durability.damage >= durability.maxDurability) break;
            }
            if (durabilityChanged) {
                player.getComponent("minecraft:equippable").setEquipment("Mainhand", hoe);
            }
        }

        const bounty3 = itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl3[0].displayName));
        const bounty2 = itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl2[0].displayName));
        const bounty1 = itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl1[0].displayName));
        if (bounty1 || bounty2 || bounty3) {
            const cropMap = {
                "minecraft:wheat": "minecraft:wheat",
                "minecraft:carrots": "minecraft:carrot",
                "minecraft:potatoes": "minecraft:potato",
                "minecraft:beetroot": "minecraft:beetroot",
                "minecraft:nether_wart": "minecraft:nether_wart"
            };

            if (cropMap[brokenBlockId]) {
                let chance = 0;
                let bonusAmount = 0;
                if (bounty3) chance = 0.75;
                else if (bounty2) chance = 0.50;
                else if (bounty1) chance = 0.25;

                if (bounty3) bonusAmount = Math.floor(Math.random() * 2) + 2; // 2-3 extra
                else if (bounty2) bonusAmount = Math.floor(Math.random() * 2) + 1; // 1-2 extra
                else if (bounty1) bonusAmount = 1; // 1 extra

                if (Math.random() < chance) {
                    try {
                        const bonusDrop = new ItemStack(cropMap[brokenBlockId], bonusAmount);
                        dimension.spawnItem(bonusDrop, block.location);
                    } catch (e) {
                        console.error(`[MoreEnchants] Harvester's Bounty failed: ${e}`);
                    }
                }
            }
        }

        // List of all harvestable plants for Herbalist enchant
        const herbalistBlocks = [
            "minecraft:dandelion",
            "minecraft:poppy",
            "minecraft:blue_orchid",
            "minecraft:allium",
            "minecraft:azure_bluet",
            "minecraft:red_tulip",
            "minecraft:orange_tulip",
            "minecraft:white_tulip",
            "minecraft:pink_tulip",
            "minecraft:oxeye_daisy",
            "minecraft:brown_mushroom",
            "minecraft:red_mushroom",
            "minecraft:sunflower",
            "minecraft:lilac",
            "minecraft:rose_bush",
            "minecraft:tall_grass",
            "minecraft:peony",
            "minecraft:large_fern",
            "minecraft:lily_of_the_valley",
            "minecraft:cornflower",
            "minecraft:wither_rose",
            "minecraft:crimson_fungus",
            "minecraft:warped_fungus",
            "minecraft:warped_roots",
            "minecraft:nether_sprouts",
            "minecraft:azalea",
            "minecraft:flowering_azalea",
            "minecraft:spore_blossom"
        ];

        // Check if item has Herbalist enchant
        const herbalist3 = itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl3[2].displayName));
        const herbalist2 = itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl2[2].displayName));
        const herbalist1 = itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl1[3].displayName));

        if ((herbalist1 || herbalist2 || herbalist3) && herbalistBlocks.includes(brokenBlockId)) {
            const level = herbalist3 ? 3 : herbalist2 ? 2 : 1;
            if (Math.random() < (0.2 * level)) {
                dimension.spawnItem(new ItemStack(brokenBlockId, 1), block.location);
            }
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl3[3].displayName))) { // Replanter
            const playerInv = player.getComponent("minecraft:inventory").container;
            const seedMap = {
                "minecraft:wheat": "minecraft:wheat_seeds",
                "minecraft:carrots": "minecraft:carrot",
                "minecraft:potatoes": "minecraft:potato",
                "minecraft:beetroot": "minecraft:beetroot_seeds",
                "minecraft:nether_wart": "minecraft:nether_wart"
            };
            const seedId = seedMap[brokenBlockId];
            if (seedId) {
                for (let i = 0; i < playerInv.size; i++) {
                    const invItem = playerInv.getItem(i);
                    if (invItem && invItem.typeId === seedId) {
                        invItem.amount -= 1;
                        if (invItem.amount < 1) {
                            playerInv.setItem(i);
                        } else {
                            playerInv.setItem(i, invItem);
                        }
                        block.setPermutation(BlockPermutation.resolve(brokenBlockId, {
                            growth: 0
                        }));
                        break;
                    }
                }
            }
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl1[2].displayName))) { // Fertilizer's Touch
            if (Math.random() < 0.1) {
                dimension.spawnItem(new ItemStack("minecraft:bone_meal", 1), block.location);
            }
        }

        if (itemLores.some(lore => lore.includes(listOfEnchants.is_hoe.lvl1[1].displayName))) { // XP Bonus
            const randomXP = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < randomXP; i++) {
                dimension.spawnEntity('minecraft:xp_orb', block.location);
            }
        }
    }
});