const { createWriteStream } = require('node:fs');

let current_filename

function makeHandlerRegistrator(target) {
    return (evt, handler) => {
        if (!target.has(evt))
            target.set(evt, [handler])
        else
            target.get(evt).push(handler)
    }
}

function implementHandlers(type, target) {
    if (target.size == 0)
        return

    const path = `../${type}_scripts/${current_filename}`
    
    const ws = createWriteStream(path)

    for (const [key, handlers] of target) {
        const handler_results = []

        handlers.forEach(handler => {
            let result = ''

            const ctx = {
                line: (str) => {
                    result += str + '\n    '
                }
            }

            handler(ctx)

            handler_results.push(result)
        })

        ws.write(`// This script was auto-generated. If you want to change it, consider looking into ../generators/${current_filename}
${key}(event => {
    ${handler_results.join('\n')}
})
`)
    }

    ws.close()

    console.log(`Implemented ${target.size} handlers in ${path}`)
}

function process(filename) {
    current_filename = filename

    const server_handlers = new Map()
    const client_handlers = new Map()
    const startup_handlers = new Map()

    global.server = makeHandlerRegistrator(server_handlers)
    global.client = makeHandlerRegistrator(client_handlers)
    global.startup = makeHandlerRegistrator(startup_handlers)

    require(`./${filename}`)

    implementHandlers('server', server_handlers)
    implementHandlers('client', client_handlers)
    implementHandlers('startup', startup_handlers)
}

process('ban_items.js')