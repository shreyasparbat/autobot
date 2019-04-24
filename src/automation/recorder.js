// Library imports
const ioHook = require('iohook')
const Store = require('electron-store')

/**
 * Record peripheral input events and save in readable format
 */
const record = async (botName) => {
    // Retrieve store
    const store = new Store()

    // Retrieve bot (create default bot if doesn't exist)
    const bot = store.get(botName)
    if (!this.bot) {
        this.bot = {
            variables: [],
            steps: []
        }
    }

    // Register and start hook (debugging disabled)
    ioHook.start(false)

    // Mouse click event
    ioHook.on('mouseclick', (event) => {
        // Save to bot
        bot.steps.append(event)
    })

    // Mouse drag event
    ioHook.on('mousedrag', (event) => {
        // Save to bot
        bot.steps.append(event)
    })

    // Mouse wheel event
    ioHook.on('mousewheel', (event) => {
        // Save to bot
        bot.steps.append(event)
    })

    // Key down event
    ioHook.on('keydown', (event) => {
        // TODO: Save bot and exit if 'esc' pressed
        store.set(botName, bot)

        // Save to bot
        bot.steps.append(event)
    })

    // Key up event
    ioHook.on('keyup', (event) => {
        // Save to bot
        bot.steps.append(event)
    })
}

// Export
module.exports = record
