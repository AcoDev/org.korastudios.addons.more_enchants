# More Enchants Add-On [Developer Documentation]

**Project Status:** Version 1.0.0 (Development)

**Lead Engineer:** Gerardo Acosta

**Contact:** Gerardo Acosta

This document provides a technical overview of the "More Enchants" add-on for Minecraft: Bedrock Edition. It is intended for developers who will be maintaining, debugging, or extending the project.

---

## 1. Project Overview

The "More Enchants" add-on is a script-heavy project that implements a custom enchantment system via the `@minecraft/server` and `@minecraft/server-ui` APIs. The primary goal is to introduce new, unique gameplay mechanics through item lores that act as enchantments, managed through custom-crafted utility blocks.

**Core Technical Features:**
* **Script-Based Enchantment Logic:** All enchantment effects are handled by TypeScript/JavaScript files, triggered by various game events.
* **Dynamic UI Forms:** The enchanting process, anvil combinations, and guidebook are all managed through dynamic `ActionFormData` and `MessageFormData` forms.
* **Custom Block System:** Three custom blocks serve as the primary interaction points for the add-on's features.
* **Centralized Enchantment Database:** A single file (`exports.js`) acts as a "database" for all enchantment definitions, making it easy to add, remove, or balance enchantments.

---

## 2. Repository & File Structure

The project is organized into standard Behavior Pack (BP) and Resource Pack (RP) folders. The most critical files for development are located within the `Content` directory.

```
├── Content/
│   ├── behavior_packs/BP/
│   │   ├── blocks/                 # Custom block definitions (e.g., kora_me:enchanting_table.block.json).
│   │   ├── functions/              # .mcfunction files, primarily for player setup on first join.
│   │   ├── items/                  # Custom item definitions (e.g., kora_me:guidebook.json).
│   │   ├── recipes/                # Crafting recipes for the custom blocks.
│   │   ├── scripts/
│   │   │   ├── main.js             # Scripting API entry point. Imports all other modules.
│   │   │   └── kora/me/
│   │   │       ├── enchant.js      # Core logic for Enchant Table, Anvil, Grindstone UI & functionality.
│   │   │       ├── exports.js      # CRITICAL: The "database" for all enchantment definitions.
│   │   │       ├── guidebook.js    # Logic for the multi-page guidebook UI.
│   │   │       ├── on_break_enchants.js # Logic for enchants triggered by playerBreakBlock event.
│   │   │       ├── on_dmg_enchants.js   # Logic for enchants triggered by entityHurt/entityDie events.
│   │   │       ├── per_tick_enchants.js # Logic for passive enchants running on a system.runInterval.
│   │   │       └── ... (other effect scripts)
│   │   ├── manifest.json           # BP manifest, including script module definitions and dependencies.
│   │   └── texts/en_US.lang        # BP-specific localization strings.
│   │
│   └── resource_packs/RP/
│       ├── font/                   # Custom font glyphs used in the guidebook for crafting recipes.
│       ├── models/blocks/          # .geo.json models for the custom blocks.
│       ├── sounds/                 # Custom sound files.
│       ├── texts/
│       │   └── en_US.lang          # CRITICAL: Main localization file for all item names, descriptions, UI text, etc.
│       ├── textures/               # All textures for items, blocks, etc.
│       └── manifest.json           # RP manifest.
│
├── Marketing Art/                  # Promotional assets for the Marketplace.
└── Store Art/                      # Assets used specifically for the Marketplace store page.
```
---

## 3. Core Systems Explained

### 3.1. Enchantment Data Management (`BP/scripts/kora/me/exports.js`)

This file is the single source of truth for all enchantment data. The primary export is the `listOfEnchants` object.

* **Structure:** The object is organized by `gearType` (e.g., `is_sword`, `is_pickaxe`), which is then broken down by `level` (`lvl1`, `lvl2`, `lvl3`) corresponding to the Enchantment Table's power level.
* **Enchantment Definition:** Each enchantment is an object with the following properties:
    * `displayName`: The full, color-coded string that is written to an item's lore. This is what the other scripts check for.
    * `name`: The clean name used for UI buttons and display.
    * `texture`: The path to the texture icon used in UI forms.
    * `description`: The localization key for the enchantment's description, defined in `RP/texts/en_US.lang`.

This file also contains critical helper functions:
* `returnLoreCost(lores)`: Calculates the XP value of an item based on its enchantments.
* `mergeLores(lores1, lores2)`: Combines lore arrays for the custom anvil, handling tiered enchantments correctly (e.g., merging "Speed I" and "Speed II" results in only "Speed II").
* `returnGearType(item)`: Determines the gear category (e.g., `is_pickaxe`) of a given item stack.

### 3.2. Custom Block Logic (`BP/scripts/kora/me/enchant.js`)

This module handles all player interactions with the three custom blocks, triggered by the `world.beforeEvents.itemUseOn` event.

* **Enchantment Table:**
    1.  Checks if the held item is enchantable and doesn't already have a custom enchant.
    2.  Reads the `kora_me:table_lvl` blockstate to determine which enchantments to offer.
    3.  Pulls the list of possible enchants from `listOfEnchants`, shuffles them, and selects three to display in an `ActionFormData` UI.
    4.  Upon selection, it verifies the player's XP level, applies the selected `displayName` to the item's lore, and deducts the XP cost.

* **Anvil:**
    1.  Scans the player's inventory for a second item of the same type.
    2.  Presents a list of combinable items in an `ActionFormData` UI.
    3.  On selection, it calculates the total XP cost, merges lores using `mergeLores`, combines durability, and updates the held item.

* **Grindstone:**
    1.  Checks if the held item has custom enchantments.
    2.  Presents a `MessageFormData` confirmation UI, showing the player how much XP they will get back.
    3.  On confirmation, it filters the item's lore to remove any custom enchantments and refunds the player the calculated XP cost.

### 3.3. Enchantment Effect Implementation

The scripts that execute enchantment effects are separated by the game event that triggers them.

* **`per_tick_enchants.js`**: Handles passive effects (e.g., Speed, Magnetism, Night Vision) using a `system.runInterval` that iterates through all players and checks their equipped armor/held item. It uses `Map` objects and dynamic properties to manage states like the `Highlight` enchant's light block or cooldowns.
* **`on_dmg_enchants.js`**: Subscribes to `world.afterEvents.entityHurt` and `entityDie`. It checks if the damage source (attacker) or hurt entity (victim) is a player and then inspects their gear for relevant lores to apply on-hit effects (e.g., `Lifesteal`, `Venomous Strike`) or defensive effects (e.g., `Agility`, `Teleportation`).
* **`on_break_enchants.js`**: Subscribes to `world.afterEvents.playerBreakBlock`. This script handles all tool-based enchantments like `Vein Miner`, `Timber`, and `Auto Smelter` by checking the player's held item lores when a block is broken.

---

## 4. Developer Workflow: Adding a New Enchantment

Follow these steps to add a new enchantment to the add-on.

**Example: Adding a new "Explosive Pick" enchantment for Pickaxes.**

1.  **Define the Enchantment (`exports.js`)**
    * Open `BP/scripts/kora/me/exports.js`.
    * Navigate to `listOfEnchants.is_<toolt/armor>`.
    * Decide which table level it should appear on (e.g., `lvl3`).
    * Add the new enchantment object to the array:
    ```javascript
    // In listOfEnchants.is_pickaxe.lvl3 array
    {
        displayName: "§r§6Explosive Pick I §h[§dMore Enchants§h]§r",
        name: "Explosive Pick I",
        texture: "textures/blocks/tnt_side", // Or another appropriate texture
        description: "kora_me.enchant.description.explosive_pick"
    }
    ```

2.  **Add Localization (`en_US.lang`)**
    * Open `RP/texts/en_US.lang`.
    * Add the description key and text:
    ```
    kora_me.enchant.description.explosive_pick=Chance to create a small, non-damaging explosion that breaks surrounding blocks.
    ```

3.  **Implement the Logic (`on_<type>_enchants.js`)**
    * Open `BP/scripts/kora/me/on_<type?_enchants.js`.
    * Inside the `world.afterEvents.playerBreakBlock.subscribe` callback, within the `if (itemTypeId.includes('pickaxe'))` block, add the new logic:
    ```javascript
    // In on_break_enchants.js, after the other pickaxe enchants
    if (itemLores.some(lore => lore.includes(listOfEnchants.is_pickaxe.lvl3[NEW_INDEX].displayName))) { // Replace NEW_INDEX with the correct index
        if (Math.random() < 0.1) { // 10% chance
            player.dimension.createExplosion(block.location, 2, { breaksBlocks: true, causesFire: false });
        }
    }
    ```

4.  **Test In-Game (`testing_utility.js`)**
    * The project includes a testing utility to quickly generate items with specific enchantments.
    * In-game, run the command: `/scriptevent me:test pickaxe`
    * This will give you one of every pickaxe enchantment, including the new "Explosive Pick," allowing you to test it immediately.

<br>
<p align="center">
  <strong>More Enchants Add-On | Developer Documentation</strong>
  <br>
  Add-On Version: 1.0.0 | Minimum Engine Version: 1.21.0
  <br>
  <em>© 2025 Kora Studios. All Rights Reserved.</em>
</p>
