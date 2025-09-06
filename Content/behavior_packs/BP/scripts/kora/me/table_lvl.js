import { world, BlockPermutation } from '@minecraft/server';

world.afterEvents.playerPlaceBlock.subscribe((event)=>{
    const block = event.block;

    if (block.typeId === 'kora_me:enchanting_table'){
        const blockCardinalDir = block.permutation.getState('minecraft:cardinal_direction');
        let table_lvl = 1;
        let wallcount_lvl2 = 0;
        let wallcount_lvl3 = 0;

        if (block.offset({x: 2, y: 0, z: 0}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: 2, y: 0, z: 1}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: 2, y: 0, z: -1}).typeId === 'minecraft:bookshelf') wallcount_lvl2++;

        if (block.offset({x: -2, y: 0, z: 0}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: -2, y: 0, z: 1}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: -2, y: 0, z: -1}).typeId === 'minecraft:bookshelf') wallcount_lvl2++;

        if (block.offset({x: 0, y: 0, z: 2}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: 1, y: 0, z: 2}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: -1, y: 0, z: 2}).typeId === 'minecraft:bookshelf') wallcount_lvl2++;

        if (block.offset({x: 0, y: 0, z: -2}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: 1, y: 0, z: -2}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: -1, y: 0, z: -2}).typeId === 'minecraft:bookshelf') wallcount_lvl2++;

        if (block.offset({x: 2, y: 1, z: 0}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: 2, y: 1, z: 1}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: 2, y: 1, z: -1}).typeId === 'minecraft:bookshelf') wallcount_lvl3++;

        if (block.offset({x: -2, y: 1, z: 0}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: -2, y: 1, z: 1}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: -2, y: 1, z: -1}).typeId === 'minecraft:bookshelf') wallcount_lvl3++;

        if (block.offset({x: 0, y: 1, z: 2}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: 1, y: 1, z: 2}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: -1, y: 1, z: 2}).typeId === 'minecraft:bookshelf') wallcount_lvl3++;

        if (block.offset({x: 0, y: 1, z: -2}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: 1, y: 1, z: -2}).typeId === 'minecraft:bookshelf' &&
            block.offset({x: -1, y: 1, z: -2}).typeId === 'minecraft:bookshelf') wallcount_lvl3++;

        if (wallcount_lvl2 >= 3){
            table_lvl++;
        };
        if (wallcount_lvl2 >= 3 && wallcount_lvl3 >= 3){
            table_lvl++;
        };

        block.setPermutation(BlockPermutation.resolve('kora_me:enchanting_table',{"minecraft:cardinal_direction": blockCardinalDir,"kora_me:table_lvl": table_lvl}));
    }
});