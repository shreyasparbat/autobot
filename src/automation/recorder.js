// Library imports
const ioHook = require('iohook')
const Store = require('electron-store')

/**
 * Record peripheral input events and save in readable format
 */
class Recorder {
    constructor(botName) {
        // Retrieve store
        const store = new Store()

        // Retrieve bot (create default bot if doesn't exist)
        this.bot = store.get(botName)
        if (!this.bot) {
            this.bot = {
                variables: [],
                steps: []
            }
        }

        // Register and start hook (debugging disabled)
        ioHook.start(false)
    }

    async record() {
        // Mouse click event
        ioHook.on('mouseclick', (event) => {
            this.bot.steps.append(event)
        })

        // Mouse drag event
        ioHook.on('mousedrag', (event) => {
            this.bot.steps.append(event)
        })

        // Mouse wheel event
        ioHook.on('mousewheel', (event) => {
            this.bot.steps.append(event)
        })

        // Key down event
        ioHook.on('keydown', (event) => {
            // TODO: Save bot and exit if 'esc' pressed
            this.bot.steps.append(event)
        })

        // Key up event
        ioHook.on('keyup', (event) => {
            this.bot.steps.append(event)
        })
    }
}

// Export
module.exports = Recorder
