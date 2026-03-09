ServerEvents.recipes(event => {
    event.custom({
        type: 'betterend:infusion',
        input: { item: 'minecraft:nether_star' },
        catalysts: {
            north:      { item: 'betterend:crystal_shards' },
            north_east: { item: 'betterend:aeternium_ingot' },
            east:       { item: 'minecraft:ender_pearl' },
            south_east: { item: 'betterend:aeternium_ingot' },
            south:      { item: 'betterend:crystal_shards' },
            south_west: { item: 'betterend:aeternium_ingot' },
            west:       { item: 'minecraft:ender_pearl' },
            north_west: { item: 'betterend:aeternium_ingot' },
        },
        result: { item: 'kubejs:ender_star' },
        time: 300
    });

    const recipes = [
        'mekanism:module_gravitational_modulating_unit',
        'solarpanels:light_absorbing_solar_element',
        'solarpanels:photonic_solar_element'
    ]

    recipes.forEach(recipe => {
        event.replaceInput(
            { id: recipe },
            'minecraft:nether_star',
            'kubejs:ender_star'
        )
    })
})