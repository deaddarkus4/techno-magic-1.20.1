// Smelters:
// enderio - alloy smelter
// thermal expansion - induction smelter
// better end - end stone smelter
// evolved mekanism - alloyer

// Recipes:
// Steel - thermal expansion
// Terminite - better end

ServerEvents.recipes(event => {
    // Constants for mod IDs
    const enderio = 'enderio';
    const thermal_expansion = 'thermal';
    const better_end = 'betterend';
    const evolved_mekanism = 'mekanism';

    function normalizeDataCommon(input) {
        const result = [];
        
        // Process 'item' field
        if (input.item !== undefined) {
            if (Array.isArray(input.item)) {
                input.item.forEach(value => {
                    var entry = { item: value };
                    if (input.count !== undefined) entry.count = input.count;
                    result.push(entry);
                });
            } else {
                var entry = { item: input.item };
                if (input.count !== undefined) entry.count = input.count;
                result.push(entry);
            }
        }
        
        // Process 'tag' field
        if (input.tag !== undefined) {
            if (Array.isArray(input.tag)) {
                input.tag.forEach(value => {
                    var entry = { tag: value };
                    if (input.count !== undefined) entry.count = input.count;
                    result.push(entry);
                });
            } else {
                var entry = { tag: input.tag };
                if (input.count !== undefined) entry.count = input.count;
                result.push(entry);
            }
        }
        
        // Return single entry or list
        return result.length === 1 ? result[0] : result;
    }

    function normalizeDataEnderIO(input) {
        // Create result object
        const result = { ingredient: [] };
        
        // Process 'item' field
        if (input.item !== undefined) {
            if (Array.isArray(input.item)) {
                input.item.forEach(value => {
                    result.ingredient.push({ item: value });
                });
            } else {
                result.ingredient.push({ item: input.item });
            }
        }
        
        // Process 'tag' field
        if (input.tag !== undefined) {
            if (Array.isArray(input.tag)) {
                input.tag.forEach(value => {
                    result.ingredient.push({ tag: value });
                });
            } else {
                result.ingredient.push({ tag: input.tag });
            }
        }
        
        // Add count if present, otherwize 1
        result.count = (input.count !== undefined)
            ? input.count
            : 1;
        
        return result;
    }

    // Add EnderIO Alloy Smelter recipe
    function add_enderio(result, inputs, energy) {
        event.custom({
            type: 'enderio:alloy_smelting',
            inputs: inputs,
            result: result,
            energy: energy
        });
    }

    // Add Thermal Expansion Induction Smelter recipe
    function add_thermal(result, inputs, energy) {
        event.custom({
            type: 'thermal:smelter',
            ingredients: inputs,
            result: [result],
            energy: energy
        });
    }

    // Add BetterEnd End Stone Smelter recipe
    function add_betterend(result, inputs, energy) {
        if (inputs.length != 2) {
            console.error(`${result.item} - Attempt to add Better End smelt recipe with num inputs != 2\n${JSON.stringify(inputs)}`)
        }

        //for (let i = 0; i < inputs.length; i++) {
        //    if (typeof(inputs[i].count) != 'undefined' && inputs[i].count > 1) {
        //        console.error(`${result.item} - Attempt to add Better End smelt recipe with ingredient num > 1\n${JSON.stringify(inputs)}`)
        //    }
        //}

        event.custom({
            type: 'bclib:alloying',
            ingredients: inputs,
            result: result,
            experience: 2.5,
            smelttime: energy / 20
        });
    }

    // Add Evolved Mekanism Alloyer recipe
    function add_mekanism(result, inputs, energy) {
        if (inputs.length != 3) {
            console.error(`${result.item} - Attempt to add Evolved Mekanism alloying recipe with num inputs != 3\n${JSON.stringify(inputs)}`)
        }

        event.custom({
            type: 'evolvedmekanism:alloying',
            mainInput: { ingredient: inputs[0] },
            extraInput: { ingredient: inputs[1] },
            secondExtraInput: { ingredient: inputs[2] },
            output: result,
            energy: energy
        });
    }

    // Unified recipe adder
    function unify(types, result, ingredients, energy) {
        const normalizedIngredientsCommon = ingredients.map(ing => normalizeDataCommon(ing))
        const normalizedIngredientsEnderIO = ingredients.map(ing => normalizeDataEnderIO(ing))

        if (types.includes(enderio)) {
            add_enderio(result, normalizedIngredientsEnderIO, energy);
        }
        if (types.includes(thermal_expansion)) {
            add_thermal(result, normalizedIngredientsCommon, energy);
        }
        if (types.includes(better_end)) {
            add_betterend(result, normalizedIngredientsCommon, energy);
        }
        if (types.includes(evolved_mekanism)) {
            add_mekanism(result, normalizedIngredientsCommon, energy);
        }
    }

    /////////////
    // Better End
    /////////////

    unify([enderio, thermal_expansion],
        { item: 'betterend:terminite_ingot' },
        [
            { item: 'betterend:thallasium_ingot' },
            { item: 'betterend:ender_dust' }
        ],
        4800
    )

    unify([enderio, thermal_expansion],
        { item: 'betterend:aeternium_ingot' },
        [
            { item: 'betterend:terminite_ingot' },
            { item: 'minecraft:netherite_ingot' }
        ],
        4800
    )

    //////////
    // EnderIO
    //////////

    unify([thermal_expansion, better_end],
        { item: 'enderio:copper_alloy_ingot' },
        [
            { item: 'minecraft:copper_ingot' },
            { tag: 'forge:silicon' }
        ],
        3200
    )

    unify([thermal_expansion],
        { item: 'enderio:energetic_alloy_ingot' },
        [
            { item: 'minecraft:redstone' },
            { item: 'minecraft:gold_ingot' },
            { item: 'minecraft:glowstone_dust' },
        ],
        4800
    )

    unify([thermal_expansion, better_end],
        { item: 'enderio:vibrant_alloy_ingot' },
        [
            { item: 'enderio:energetic_alloy_ingot' },
            { item: 'minecraft:ender_pearl' }
        ],
        4800
    )

    unify([thermal_expansion, better_end],
        { item: 'enderio:redstone_alloy_ingot' },
        [
            { item: 'minecraft:redstone' },
            { tag: 'forge:silicon' }
        ],
        3200
    )

    unify([thermal_expansion],
        { item: 'enderio:conductive_alloy_ingot' },
        [
            { item: 'enderio:copper_alloy_ingot' },
            { tag: 'c:iron_ingots' },
            { item: 'minecraft:redstone' },
        ],
        4800
    )

    unify([thermal_expansion, better_end],
        { item: 'enderio:pulsating_alloy_ingot' },
        [
            { tag: 'c:iron_ingots' },
            { item: 'minecraft:ender_pearl' }
        ],
        4800
    )

    unify([thermal_expansion],
        { item: 'enderio:dark_steel_ingot' },
        [
            { tag: 'c:iron_ingots' },
            { tag: 'forge:dusts/coal' },
            { item: 'minecraft:obsidian' },
        ],
        6400
    )

    unify([thermal_expansion, better_end],
        { item: 'enderio:soularium_ingot' },
        [
            { item: 'minecraft:gold_ingot' },
            { item: 'minecraft:soul_sand' }
        ],
        5600
    )

    unify([thermal_expansion],
        { item: 'enderio:end_steel_ingot' },
        [
            { item: 'minecraft:end_stone' },
            { item: 'enderio:dark_steel_ingot' },
            { item: 'minecraft:obsidian' },
        ],
        6400
    )

    ////////////////////
    // Thermal Expansion
    ////////////////////

    unify([enderio, better_end],
        { item: 'thermal:rose_gold_ingot', count: 2 },
        [
            { tag: 'forge:dusts/copper', item: 'minecraft:copper_ingot' },
            { tag: 'forge:dusts/gold', item: 'minecraft:gold_ingot' },
        ],
        1600
    )

    unify([enderio, better_end],
        { item: 'thermal:bronze_ingot', count: 4 },
        [
            { tag: ['forge:dusts/tin', 'forge:ingots/tin'] },
            { tag: 'forge:dusts/copper', item: 'minecraft:copper_ingot', count: 3 },
        ],
        6400
    )

    unify([enderio, better_end],
        { item: 'thermal:electrum_ingot', count: 2 },
        [
            { tag: ['forge:dusts/silver', 'forge:ingots/silver'] },
            { tag: 'forge:dusts/gold', item: 'minecraft:gold_ingot' },
        ],
        3200
    )

    unify([enderio, better_end],
        { item: 'thermal:invar_ingot', count: 3 },
        [
            { tag: ['forge:dusts/nickel', 'forge:ingots/nickel'] },
            { tag: ['forge:dusts/gold', 'forge:ingots/iron'], count: 2 },
        ],
        4800
    )

    unify([enderio],
        { item: 'thermal:constantan_ingot', count: 2 },
        [
            { tag: ['forge:dusts/nickel', 'forge:ingots/nickel'] },
            { tag: 'forge:dusts/copper', item: 'minecraft:copper_ingot', count: 2 },
        ],
        32000
    )

    unify([enderio],
        { item: 'thermal:signalum_ingot', count: 4 },
        [
            { tag: ['forge:dusts/silver', 'forge:ingots/silver'] },
            { tag: 'forge:dusts/copper', item: 'minecraft:copper_ingot', count: 3 },
            { item: 'minecraft:redstone', count: 4 },
        ],
        12000
    )

    unify([enderio],
        { item: 'thermal:lumium_ingot', count: 4 },
        [
            { tag: ['forge:dusts/silver', 'forge:ingots/silver'] },
            { tag: ['forge:dusts/tin', 'forge:ingots/tin'], count: 3 },
            { item: 'minecraft:glowstone', count: 2 },
        ],
        12000
    )

    unify([enderio],
        { item: 'thermal:enderium_ingot', count: 2 },
        [
            { tag: 'forge:dusts/diamond' },
            { tag: ['forge:dusts/lead', 'forge:ingots/lead'], count: 3 },
            { tag: 'forge:dusts/ender_pearl', item: 'minecraft:ender_pearl', count: 2 },
        ],
        16000
    )
})