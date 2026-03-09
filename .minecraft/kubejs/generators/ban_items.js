const item_list = [
    // unlimited lag generator
    "mekanism:upgrade_anchor",

    // dirt-cheap overpovered system
    "mekanism:qio_drive_array",
    "mekanism:portable_qio_dashboard",
    "mekanism:qio_dashboard",
    "mekanism:qio_exporter",
    "mekanism:qio_importer",
    "mekanism:qio_redstone_adapter",
    "mekanism:qio_drive_base",
    "mekanism:qio_drive_hyper_dense",
    "mekanism:qio_drive_time_dilating",
    "mekanism:qio_drive_supermassive",

    // no need in this modpack?
    "sophisticatedbackpacks:indeption_upgrade"
]

server('ServerEvents.recipes', (ctx) => {
    item_list.forEach(item => ctx.line(`event.remove({ output: '${item}' })`))
})

client('JEIEvents.hideItems', (ctx) => {
    item_list.forEach(item => ctx.line(`event.hide('${item}')`))
})