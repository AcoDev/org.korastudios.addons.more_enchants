import {
    world,
    system,
    ItemComponentTypes,
    EntityComponentTypes,
    EquipmentSlot,
    Player
} from "@minecraft/server";
import {
    ActionFormData,
    MessageFormData
} from '@minecraft/server-ui';
import {
    mergeLores,
    returnGearType,
    listOfEnchants,
    returnLoreCost
} from './exports';

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array<any>} array The array to shuffle.
 * @returns {Array<any>} The shuffled array.
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

world.beforeEvents.itemUseOn.subscribe((event) => {
    const player = event.source;
    const playerContainer = player.getComponent(EntityComponentTypes.Inventory).container;
    const block = event.block;
    const item = event.itemStack;

    if (player.lastTick == undefined) {
        player.lastTick = 0;
    }
    if (system.currentTick - player.lastTick > 10) {
        // Executables
        system.run(() => {
            const itemIsEnchantable = item?.getComponent(ItemComponentTypes.Enchantable);
            const currentItemLores = item.getLore();
            const currentItemLoreCost = returnLoreCost(currentItemLores);
            const itemIsAlreadyEnchanted = currentItemLores.some(lore => lore.includes('§h[§dMore Enchants§h]§r'));

            // custom grindstone
            if (block.typeId === 'kora_me:grindstone' && itemIsEnchantable) {
                if (itemIsAlreadyEnchanted) {
                    const form = new MessageFormData();
                    form.title({
                        translate: 'kora_me.grindstone_ui.title'
                    });
                    form.body({
                        rawtext: [{
                                text: '\n'
                            },
                            {
                                translate: 'kora_me.grindstone_ui.body1'
                            },
                            {
                                text: '\n\n'
                            },
                            {
                                translate: 'kora_me.grindstone_ui.body2'
                            },
                            {
                                text: `§e${currentItemLoreCost}§r`
                            }
                        ]
                    });
                    form.button1({
                        translate: 'kora_me.grindstone_ui.no'
                    });
                    form.button2({
                        translate: 'kora_me.grindstone_ui.yes'
                    });
                    form.show(player).then((response) => {
                        const gearType = returnGearType(item);
                        const playerEquippableComponent = player.getComponent(EntityComponentTypes.Equippable);
                        const mainhandItem = playerEquippableComponent.getEquipment(EquipmentSlot.Mainhand);
                        const Helmet = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Head);
                        const Chestplate = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Chest);
                        const Leggings = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Legs);
                        const Boots = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Feet);

                        if (response.selection == 1) {
                            const filteredLores = currentItemLores.filter(lore => !lore.includes('§h[§dMore Enchants§h]§r'));
                            item.setLore(filteredLores);
                            player.playSound('block.grindstone.use');
                            player.addLevels(currentItemLoreCost);

                            // this is to prevent item duplication due to armor swap/equip
                            if (gearType === 'is_helmet') {
                                Helmet.setItem(mainhandItem);
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            } else if (gearType === 'is_chestplate') {
                                Chestplate.setItem(mainhandItem);
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            } else if (gearType === 'is_leggings') {
                                Leggings.setItem(mainhandItem);
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            } else if (gearType === 'is_boots') {
                                Boots.setItem(mainhandItem);
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            } else {
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            };
                        }
                    });
                } else {
                    player.runCommandAsync(`titleraw @s actionbar
                        { "rawtext": [
                                { "translate": "kora_me.grindstone.no_enchants_to_remove" }
                            ]
                        }`);
                    player.playSound('note.bass');
                }
            };

            // Custom enchantment table
            if (block.typeId === 'kora_me:enchanting_table' && itemIsEnchantable && !itemIsAlreadyEnchanted) {
                const table_lvl = block.permutation.getState('kora_me:table_lvl');
                const gearType = returnGearType(item);
                if (gearType !== undefined) {
                    const allPossibleEnchants = listOfEnchants[gearType][`lvl${table_lvl}`] || [];

                    // Shuffle the list of all possible enchantments
                    const shuffledEnchants = shuffleArray([...allPossibleEnchants]);
                    // Take only the first 3 from the shuffled list to display
                    const enchantOptions = shuffledEnchants.slice(0, 3);

                    const ArrayOfCosts = [];
                    const form = new ActionFormData();
                    form.title({
                        translate: 'kora_me.enchantment_table_ui.title'
                    });
                    form.body({
                        rawtext: [{
                                text: '\n'
                            },
                            {
                                translate: 'kora_me.enchantment_table_ui.body1'
                            },
                            {
                                text: `§e§l ${table_lvl}§r`
                            },
                            {
                                text: '\n'
                            },
                            {
                                translate: 'kora_me.enchantment_table_ui.body2'
                            },
                            {
                                text: '\n\n'
                            },
                            {
                                translate: 'kora_me.enchantment_table_ui.body3'
                            },
                            {
                                text: '\n'
                            },
                            {
                                translate: 'kora_me.enchantment_table_ui.body4'
                            },
                            {
                                text: '\n'
                            },
                            {
                                translate: 'kora_me.enchantment_table_ui.body5'
                            },
                            {
                                text: '\n'
                            },
                            {
                                translate: 'kora_me.enchantment_table_ui.body6'
                            },
                            {
                                text: '\n\n'
                            },
                            {
                                translate: 'kora_me.enchantment_table_ui.body7'
                            },
                            {
                                text: '\n\n'
                            },
                            {
                                translate: 'kora_me.enchantment_table_ui.body8'
                            },
                        ]
                    });

                    // This loop now correctly iterates over the 3 random options
                    enchantOptions.forEach(enchant => {
                        const enchantCost = returnLoreCost([enchant.displayName]);
                        ArrayOfCosts.push(enchantCost);
                        form.button(enchant.name + ', §2§l' + enchantCost + '§r§8 xp level', enchant.texture);
                    });

                    form.show(player).then((response) => {
                        const playerEquippableComponent = player.getComponent(EntityComponentTypes.Equippable);
                        const mainhandItem = playerEquippableComponent.getEquipment(EquipmentSlot.Mainhand);
                        const Helmet = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Head);
                        const Chestplate = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Chest);
                        const Leggings = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Legs);
                        const Boots = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Feet);

                        if (response.selection !== undefined && ArrayOfCosts[response.selection] <= player.level) {
                            // Get the selected enchantment from our randomized list
                            const selectedEnchant = enchantOptions[response.selection];
                            currentItemLores.unshift(selectedEnchant.displayName);
                            item.setLore(currentItemLores);
                            player.playSound('kora_me.enchant');
                            player.addLevels(-ArrayOfCosts[response.selection]);

                            if (gearType === 'is_helmet') {
                                Helmet.setItem(mainhandItem);
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            } else if (gearType === 'is_chestplate') {
                                Chestplate.setItem(mainhandItem);
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            } else if (gearType === 'is_leggings') {
                                Leggings.setItem(mainhandItem);
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            } else if (gearType === 'is_boots') {
                                Boots.setItem(mainhandItem);
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            } else {
                                playerContainer.setItem(player.selectedSlotIndex, item);
                            }
                        } else if (response.selection !== undefined && ArrayOfCosts[response.selection] > player.level) {
                            player.runCommandAsync(`titleraw @s actionbar
                                { "rawtext": [
                                        { "translate": "kora_me.enchantment_table_ui.not_enough_lvl" }
                                    ]
                                }`);
                            player.playSound('note.bass');
                        }
                        return;
                    });
                }
            } else if (block.typeId === 'kora_me:enchanting_table' && itemIsEnchantable && itemIsAlreadyEnchanted) {
                player.runCommandAsync(`titleraw @s actionbar
                    { "rawtext": [
                            { "translate": "kora_me.enchantment_table_ui.already_enchanted" }
                        ]
                    }`);
                player.playSound('note.bass');
            };

            // Custom anvil
            if (block.typeId === 'kora_me:anvil' && itemIsEnchantable) {
                const targetSlots = [];
                for (let i = 0; i < playerContainer.size; i++) {
                    const targetSlot = playerContainer.getSlot(i);
                    if (i !== player.selectedSlotIndex && targetSlot.getItem() !== undefined && targetSlot.typeId === item.typeId) {
                        targetSlots.push(targetSlot);
                    }
                }
                if (targetSlots.length !== 0) {
                    const form = new ActionFormData();
                    form.title({
                        translate: 'kora_me.anvil_ui.title'
                    });
                    form.body({
                        rawtext: [{
                                text: '\n'
                            },
                            {
                                translate: 'kora_me.anvil_ui.body1'
                            },
                            {
                                text: '\n\n'
                            }
                        ]
                    });
                    targetSlots.forEach(slot => {
                        const slotLoreCost = returnLoreCost(slot.getLore());
                        const totalLoreCost = slotLoreCost + currentItemLoreCost;
                        const flattenedCost = Math.floor(Math.log10(Math.pow((totalLoreCost + 1), 6)));
                        if (slot.nameTag) {
                            form.button(slot.nameTag + ', Total Cost: §2§l' + flattenedCost);
                        } else {
                            const itemID = slot.typeId;
                            const itemName = itemID.replace('minecraft:', '');
                            form.button({
                                rawtext: [{
                                        translate: `item.${itemName}.name`
                                    },
                                    {
                                        text: `, Total Cost: §2§l${flattenedCost}`
                                    }
                                ]
                            })
                        }
                    });
                    form.show(player).then((response) => {
                        if (response.selection !== undefined) {
                            const gearType = returnGearType(item);
                            const playerEquippableComponent = player.getComponent(EntityComponentTypes.Equippable);
                            const mainhandItem = playerEquippableComponent.getEquipment(EquipmentSlot.Mainhand);
                            const Helmet = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Head);
                            const Chestplate = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Chest);
                            const Leggings = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Legs);
                            const Boots = playerEquippableComponent.getEquipmentSlot(EquipmentSlot.Feet);

                            const selectedSlot = targetSlots[response.selection];
                            const selectedItemStack = selectedSlot.getItem();
                            const selectedLores = selectedItemStack.getLore();
                            const selectedDurability = selectedItemStack.getComponent(ItemComponentTypes.Durability);
                            const selectedDurabilityVal = selectedDurability.maxDurability - selectedDurability.damage;
                            const targetDurability = item.getComponent(ItemComponentTypes.Durability);
                            const targetDurabilityVal = targetDurability.maxDurability - targetDurability.damage;

                            const selectedLoreCost = returnLoreCost(selectedLores);
                            const totalCost = selectedLoreCost + currentItemLoreCost;
                            const flatCost = Math.floor(Math.log10(Math.pow((totalCost + 1), 6)));

                            if (flatCost <= player.level) {
                                //lore combine
                                const mergedLore = mergeLores(currentItemLores, selectedLores);

                                //durability combine
                                if ((targetDurabilityVal + selectedDurabilityVal) > targetDurability.maxDurability) {
                                    targetDurability.damage = 0;
                                } else {
                                    targetDurability.damage = targetDurability.damage - selectedDurabilityVal;
                                };

                                //set item
                                item.setLore(mergedLore);
                                player.playSound('kora_me.anvil');
                                player.addLevels(-flatCost);

                                // this is to prevent item duplication due to armor swap/equip
                                if (gearType === 'is_helmet') {
                                    Helmet.setItem(mainhandItem);
                                    playerContainer.setItem(player.selectedSlotIndex, item);
                                    selectedSlot.setItem(undefined);
                                } else if (gearType === 'is_chestplate') {
                                    Chestplate.setItem(mainhandItem);
                                    playerContainer.setItem(player.selectedSlotIndex, item);
                                    selectedSlot.setItem(undefined);
                                } else if (gearType === 'is_leggings') {
                                    Leggings.setItem(mainhandItem);
                                    playerContainer.setItem(player.selectedSlotIndex, item);
                                    selectedSlot.setItem(undefined);
                                } else if (gearType === 'is_boots') {
                                    Boots.setItem(mainhandItem);
                                    playerContainer.setItem(player.selectedSlotIndex, item);
                                    selectedSlot.setItem(undefined);
                                } else {
                                    playerContainer.setItem(player.selectedSlotIndex, item);
                                    selectedSlot.setItem(undefined);
                                };
                            } else if (flatCost > player.level) {
                                player.runCommand(`titleraw @s actionbar
                                    { "rawtext": [
                                            { "translate": "kora_me.enchantment_table_ui.not_enough_lvl" }
                                        ]
                                    }`);
                                player.playSound('note.bass');
                            }
                        }
                    });
                } else {
                    player.runCommand(`titleraw @s actionbar
                        { "rawtext": [
                                { "translate": "kora_me.anvil.no_item_found" }
                            ]
                        }`);
                    player.playSound('note.bass');
                }
            }
        });

        player.lastTick = system.currentTick;
    }
});