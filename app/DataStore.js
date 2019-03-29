// Library imports
const Store = require('electron-store')

/**
 * A class for storing and accessing
 * bots in memory
 */
class DataStore extends Store {
    constructor(settings) {
        // Same as new Store(settings)
        super(settings)

        // Initialise with bots or empty array
        this.bots = this.get('bots') || []
    }

    saveBots() {
        // Save bots to JSON file
        this.set('bots', this.bots)

        // Returning 'this' allows method chaining
        return this
    }

    getBots() {
        // Set object's robots to bots in JSON file
        this.bots = this.get('bots') || []

        // Method chaining
        return this
    }

    addBot(bot) {
        // Merge existing bots with new bot and return
        // updated list
        this.bots = [...this.bots, bot]
        return this.saveBots()
    }

    deleteBot(bot) {
        // Filter out target bot and return updated list
        this.bots = this.bots.filter(b => b !== bot)
        return this.saveBots()
    }
}

module.exports = DataStore