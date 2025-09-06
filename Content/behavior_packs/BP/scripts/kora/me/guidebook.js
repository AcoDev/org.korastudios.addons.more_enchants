import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { listOfEnchants } from './exports';

// --- Main Menu ---
function Page1(player) {
    const page1 = new ActionFormData();
    page1.title({ translate: 'kora_me.guidebook.title' });
    page1.body({
        rawtext: [
            { text: '\n' }, { translate: 'kora_me.guidebook.page1.body1' },
            { text: '\n\n' }, { translate: 'kora_me.guidebook.page1.body2' },
            { text: '\n\n' }
        ]
    });
    page1.button({ translate: 'kora_me.guidebook.page1.button.crafting' });
    page1.button({ translate: 'kora_me.guidebook.page1.button.enchants' });
    page1.button({ translate: 'kora_me.guidebook.button.close' });

    page1.show(player).then((response) => {
        if (response.isCanceled) return;

        if (response.selection === 0) CraftingUsageCategoryPage(player);
        if (response.selection === 1) EnchantCategoryPage(player);
    });
}

// --- Crafting & Usage Sub-Menus ---
function CraftingUsageCategoryPage(player) {
    const form = new ActionFormData();
    form.title({ translate: 'kora_me.guidebook.crafting_usage.title' });
    form.body({ translate: 'kora_me.guidebook.crafting_usage.body' });

    form.button({ translate: 'tile.kora_me:enchanting_table.name' });
    form.button({ translate: 'tile.kora_me:anvil.name' });
    form.button({ translate: 'tile.kora_me:grindstone.name' });
    form.button({ translate: 'kora_me.guidebook.button.back' });

    form.show(player).then((response) => {
        if (response.isCanceled) {
            Page1(player);
            return;
        }

        switch (response.selection) {
            case 0:
                BlockInfoPage(player, 'enchanting_table');
                break;
            case 1:
                BlockInfoPage(player, 'anvil');
                break;
            case 2:
                BlockInfoPage(player, 'grindstone');
                break;
            case 3: // Back button
                Page1(player);
                break;
        }
    });
}

function BlockInfoPage(player, blockType) {
    const form = new ActionFormData();
    const bodyText = [];

    switch (blockType) {
        case 'enchanting_table':
            form.title({ translate: 'tile.kora_me:enchanting_table.name' });
            bodyText.push(
                { text: '\n' }, { translate: 'kora_me.guidebook.info.legend.crafting' }, { text: '\n' },
                { translate: 'kora_me.guidebook.info.crafting.enchanting_table_1' }, { text: '\n' },
                { translate: 'kora_me.guidebook.info.crafting.enchanting_table_2' }, { text: '\n' },
                { translate: 'kora_me.guidebook.info.crafting.enchanting_table_3' }, { text: '\n\n' },
                { translate: 'kora_me.guidebook.info.usage.enchanting_table' }
            );
            break;
        case 'anvil':
            form.title({ translate: 'tile.kora_me:anvil.name' });
            bodyText.push(
                { text: '\n' }, { translate: 'kora_me.guidebook.info.legend.crafting' }, { text: '\n' },
                { translate: 'kora_me.guidebook.info.crafting.anvil_1' }, { text: '\n' },
                { translate: 'kora_me.guidebook.info.crafting.anvil_2' }, { text: '\n' },
                { translate: 'kora_me.guidebook.info.crafting.anvil_3' }, { text: '\n\n' },
                { translate: 'kora_me.guidebook.info.usage.anvil' }
            );
            break;
        case 'grindstone':
            form.title({ translate: 'tile.kora_me:grindstone.name' });
            bodyText.push(
                { text: '\n' }, { translate: 'kora_me.guidebook.info.legend.crafting' }, { text: '\n' },
                { translate: 'kora_me.guidebook.info.crafting.grindstone_1' }, { text: '\n' },
                { translate: 'kora_me.guidebook.info.crafting.grindstone_2' }, { text: '\n' },
                { translate: 'kora_me.guidebook.info.crafting.grindstone_3' }, { text: '\n\n' },
                { translate: 'kora_me.guidebook.info.usage.grindstone' }
            );
            break;
    }

    form.body({ rawtext: bodyText });
    form.button({ translate: 'kora_me.guidebook.button.back' });
    form.show(player).then(() => CraftingUsageCategoryPage(player));
}


// --- ENCHANTMENT PAGES ---

function EnchantCategoryPage(player) {
    const categoryPage = new ActionFormData();
    categoryPage.title({ translate: 'kora_me.guidebook.enchants.title' });
    categoryPage.body({ translate: 'kora_me.guidebook.enchants.body' });

    const categories = [
        { button: 'kora_me.guidebook.enchants.button.sword', key: 'is_sword' },
        { button: 'kora_me.guidebook.enchants.button.mace', key: 'is_mace' },
        { button: 'kora_me.guidebook.enchants.button.pickaxe', key: 'is_pickaxe' },
        { button: 'kora_me.guidebook.enchants.button.axe', key: 'is_axe' },
        { button: 'kora_me.guidebook.enchants.button.shovel', key: 'is_shovel' },
        { button: 'kora_me.guidebook.enchants.button.hoe', key: 'is_hoe' },
        { button: 'kora_me.guidebook.enchants.button.helmet', key: 'is_helmet' },
        { button: 'kora_me.guidebook.enchants.button.chestplate', key: 'is_chestplate' },
        { button: 'kora_me.guidebook.enchants.button.leggings', key: 'is_leggings' },
        { button: 'kora_me.guidebook.enchants.button.boots', key: 'is_boots' },
        { button: 'kora_me.guidebook.enchants.button.bow', key: 'is_bow' },
    ];

    categories.forEach(cat => categoryPage.button({ translate: cat.button }));
    categoryPage.button({ translate: 'kora_me.guidebook.button.back' });

    categoryPage.show(player).then((response) => {
        if (response.isCanceled || typeof response.selection !== 'number') {
            Page1(player);
            return;
        }

        if (response.selection === categories.length) {
            Page1(player);
            return;
        }

        const selectedCategory = categories[response.selection];
        EnchantListPage(player, selectedCategory.key);
    });
}

function EnchantListPage(player, gearTypeKey) {
    const listPage = new ActionFormData();
    const titleKey = `kora_me.guidebook.enchants.button.${gearTypeKey.replace('is_', '')}`;
    listPage.title({ translate: titleKey });

    const enchantLevels = listOfEnchants[gearTypeKey];
    const allEnchants = [];
    if (enchantLevels) {
        Object.keys(enchantLevels).forEach(levelKey => {
            allEnchants.push(...enchantLevels[levelKey]);
        });
    }

    const bodyText = [];
    const displayedEnchants = new Set();

    allEnchants.forEach(enchant => {
        const baseNameMatch = enchant.name.match(/(.*?)(?:\s+I{1,3})?$/);
        if (!baseNameMatch) return;
        const baseName = baseNameMatch[1];

        if (displayedEnchants.has(baseName)) return;
        displayedEnchants.add(baseName);

        const colorMatch = enchant.displayName.match(/§r(§[a-z0-9])/);
        const colorCode = colorMatch ? colorMatch[1] : '§f';

        bodyText.push({ text: `§l${colorCode}${baseName}§r\n` });
        bodyText.push({ translate: enchant.description });
        bodyText.push({ text: `\n\n` });
    });

    listPage.body({ rawtext: bodyText });
    listPage.button({ translate: 'kora_me.guidebook.button.back' });
    listPage.show(player).then(() => EnchantCategoryPage(player));
}


// --- EVENT LISTENER ---
world.afterEvents.itemUse.subscribe(({ source: player, itemStack: item }) => {
    if (item.typeId === 'kora_me:guidebook') {
        Page1(player);
    }
});