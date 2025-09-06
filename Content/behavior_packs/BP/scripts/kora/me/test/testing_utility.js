import { world, system, ItemStack } from "@minecraft/server";
import { listOfEnchants } from '../exports';

// Maps the key from listOfEnchants to the corresponding Minecraft item ID.
const gearTypeToItemId = {
    is_sword: 'minecraft:netherite_sword',
    is_mace: 'minecraft:mace',
    is_bow: 'minecraft:bow',
    is_crossbow: 'minecraft:crossbow',
    is_pickaxe: 'minecraft:netherite_pickaxe',
    is_axe: 'minecraft:netherite_axe',
    is_shovel: 'minecraft:netherite_shovel',
    is_hoe: 'minecraft:netherite_hoe',
    is_helmet: 'minecraft:netherite_helmet',
    is_chestplate: 'minecraft:netherite_chestplate',
    is_leggings: 'minecraft:netherite_leggings',
    is_boots: 'minecraft:netherite_boots',
};

/**
 * Generates and gives a player one item for each enchantment in a given gear category.
 * @param {import("@minecraft/server").Player} player The player to give items to.
 * @param {string} gearKey The key for the gear type from listOfEnchants (e.g., 'is_sword').
 */
function generateTestItems(player, gearKey) {
    const itemId = gearTypeToItemId[gearKey];
    if (!itemId) {
        player.sendMessage(`§cError: Unknown gear category "${gearKey}".`);
        return;
    }

    const inventory = player.getComponent("inventory").container;
    let itemsGenerated = 0;

    const enchantLevels = listOfEnchants[gearKey];
    for (const levelKey in enchantLevels) {
        const enchantments = enchantLevels[levelKey];
        for (const enchant of enchantments) {
            try {
                const item = new ItemStack(itemId, 1);
                item.setLore([enchant.displayName]);
                inventory.addItem(item);
                itemsGenerated++;
            } catch (error) {
                console.error(`Failed to create item for enchant: ${enchant.name}. Error: ${error}`);
                player.sendMessage(`§cFailed to create item for: ${enchant.name}`);
            }
        }
    }

    const gearName = gearKey.replace('is_', '');
    player.sendMessage(`§aSuccessfully generated ${itemsGenerated} test item(s) for category: ${gearName}.`);
}

// Listen for the vanilla /scriptevent command
system.afterEvents.scriptEventReceive.subscribe((event) => {
    const { id, message, sourceEntity } = event;

    // We only care about events with our custom ID and that come from a player
    if (id !== "me:test" || sourceEntity.typeId !== "minecraft:player") {
        return;
    }

    const player = sourceEntity;
    const command = message.toLowerCase();

    if (!command || command === 'help') {
        player.sendMessage("§e--- More Enchants Testing Utility ---");
        player.sendMessage("§7Usage: §f/scriptevent me:test <category>");
        player.sendMessage("§7Available Categories:§f");
        Object.keys(gearTypeToItemId).forEach(key => {
            player.sendMessage(`- ${key.replace('is_', '')}`);
        });
        return;
    }
    
    const gearKey = `is_${command}`;
    if (gearTypeToItemId[gearKey]) {
        generateTestItems(player, gearKey);
    } else {
        player.sendMessage(`§cUnknown category: "${command}". Type '/scriptevent me:test help' for a list of categories.`);
    }
}, { namespaces: ["me"] }); // Filter for our custom namespace for performance