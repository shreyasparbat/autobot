// Library imports
const ioHook = require('iohook')
const robot = require('robotjs')
// const Store = require('electron-store')

/**
 * Record peripheral input events and save in readable format
 */
const record = async (botName) => {
    // // Initialise store
    // const store = new Store()
    //
    // // Retrieve bot (create default bot if doesn't exist)
    // let bot = store.get(botName)
    let bot = null
    if (!bot) {
        bot = {
            variables: [],
            events: []
        }
    }

    // Define mouse button mapping
    const mouseButtonMapping = {
        1: 'left',
        2: 'right',
        3: 'middle'
    }

    // Register and start hook (debugging disabled)
    ioHook.start(false)

    // Mouse click event
    ioHook.on('mouseclick', (event) => {
        // Get mouse coordinates according to robotJs
        const mouse = robot.getMousePos()

        // Create clean event
        const cleanEvent = {
            eventName: 'mouseMove->mouseClick',
            button: mouseButtonMapping[event.button],
            x: mouse.x,
            y: mouse.y,
            double: null
        }

        // Check if previous click pos was same as this one (=> double click)
        const prevEvent = bot.events[bot.events.length - 1]
        if (prevEvent && prevEvent.event === 'mouseMove->mouseClick' && !prevEvent.double
                && prevEvent.button === cleanEvent.button
                && prevEvent.x === cleanEvent.x && prevEvent.y === cleanEvent.y) {
            // Modify prevEvent to be double click
            bot.events[bot.events.length - 1].double = true
        } else {
            // Save firstEvent and secondEvent (as single click)
            cleanEvent.double = false
        }

        // Save to bot
        bot.events.push(cleanEvent)
    })

    // Mouse drag event
    ioHook.on('mousedrag', () => {
        // Get mouse coordinates according to robotJs
        const mouse = robot.getMousePos()

        // Create clean event
        const cleanEvent = {
            eventName: 'dragMouse',
            fromX: mouse.x,
            fromY: mouse.y,
            toX: null,
            toY: null
        }

        // Check if prevEvent was dragMouse
        const prevEvent = bot.events[bot.events.length - 1]
        if (prevEvent && prevEvent.eventName === 'dragMouse') {
            // Modify toX and toY of prevEvent to current position
            bot.events[bot.events.length - 1].toX = mouse.x
            bot.events[bot.events.length - 1].toY = mouse.y
        } else {
            // Save cleaned version of event to bot
            bot.events.push(cleanEvent)
        }
    })

    // // Mouse wheel event
    // ioHook.on('mousewheel', (event) => {
    //     // Save to bot
    //     console.log(event)
    //     bot.events.push(event)
    // })

    // Key down event
    ioHook.on('keydown', (event) => {
        // TODO: Save bot and exit if 'esc' pressed
        // store.set(botName, bot)
        console.log(bot)
        // return true

        // Save to bot
        bot.events.push(event)
    })

    // Key up event
    ioHook.on('keyup', (event) => {
        // Save to bot
        console.log(event)
        bot.events.push(event)
    })
}

record('test')

/**
 * Execute given bot
 */
const play = async (botName) => {
    console.log('playing' + botName)
}

// Export
module.exports = {
    record,
    play
}
