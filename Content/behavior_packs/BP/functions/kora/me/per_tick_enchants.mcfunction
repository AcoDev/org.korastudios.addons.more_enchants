# life bonus
execute as @a[tag=koraMeLifeBonusI] at @s run effect @s absorption 2 1 true
execute as @a[tag=koraMeLifeBonusII] at @s run effect @s absorption 2 2 true
execute as @a[tag=koraMeLifeBonusIII] at @s run effect @s absorption 2 3 true

# magnetism
execute as @a[tag=koraMeMagnetismI] at @s run tp @e[type=item,r=5] @s
execute as @a[tag=koraMeMagnetismII] at @s run tp @e[type=item,r=10] @s
execute as @a[tag=koraMeMagnetismIII] at @s run tp @e[type=item,r=15] @s

# speed
execute as @a[tag=koraMeSpeedI] at @s run effect @s speed 2 0 true
execute as @a[tag=koraMeSpeedII] at @s run effect @s speed 2 1 true

# jump boost
execute as @a[tag=koraMeJumpBoostI] at @s run effect @s jump_boost 2 0 true
execute as @a[tag=koraMeJumpBoostII] at @s run effect @s jump_boost 2 1 true