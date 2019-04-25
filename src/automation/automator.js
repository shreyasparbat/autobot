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
            steps: []
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
            event: 'mouseMove->mouseClick',
            button: mouseButtonMapping[event.button],
            x: mouse.x,
            y: mouse.y
        }

        // Check if previous click pos was same as this one (=> double click)
        const prevEvent = bot.steps[bot.steps.length - 1]
        if (prevEvent && prevEvent.event === 'mouseMove->mouseClick' && !prevEvent.double
                && prevEvent.button === cleanEvent.button
                && prevEvent.x === cleanEvent.x && prevEvent.y === cleanEvent.y) {
            // Save only secondEvent (as double click)
            cleanEvent.double = true
            bot.steps.pop()
        } else {
            // Save firstEvent and secondEvent (as single click)
            cleanEvent.double = false
        }

        // Save to bot
        bot.steps.push(cleanEvent)
        console.log(cleanEvent)
    })

    // Mouse drag event
    ioHook.on('mousedrag', (event) => {
        // Save to bot
        console.log(event)
        bot.steps.push(event)
    })

    // // Mouse wheel event
    // ioHook.on('mousewheel', (event) => {
    //     // Save to bot
    //     console.log(event)
    //     bot.steps.push(event)
    // })

    // Key down event
    ioHook.on('keydown', (event) => {
        // TODO: Save bot and exit if 'esc' pressed
        // store.set(botName, bot)
        console.log(event)
        // return true

        // Save to bot
        bot.steps.push(event)
    })

    // Key up event
    ioHook.on('keyup', (event) => {
        // Save to bot
        console.log(event)
        bot.steps.push(event)
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
