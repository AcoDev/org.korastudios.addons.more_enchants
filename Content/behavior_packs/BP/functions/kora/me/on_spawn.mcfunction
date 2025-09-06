execute as @s[tag=!koraMeGuideBook] at @s run loot spawn ~~~ loot "kora/me/guidebook.loot"

execute as @s[tag=!koraMeGuideBook] at @s run gamerule sendcommandfeedback false

execute as @s[tag=!koraMeGuideBook] at @s run tellraw @s { "rawtext": [ { "translate": "kora_me.join.welcome" } ] }

tag @s[tag=!koraMeGuideBook] add koraMeGuideBook