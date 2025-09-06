import { world, system } from "@minecraft/server";

world.afterEvents.playerSpawn.subscribe((data) => {
    if (data.initialSpawn) {
        try {
            const player = data.player;
            if (player.isValid() == true) {
                system.runTimeout(() => {
                    player.runCommandAsync(`function kora/me/on_spawn`);
                }, 20)
            }
        } catch (error) { }
    }
});