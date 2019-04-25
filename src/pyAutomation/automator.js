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

    // // Define keyboard mapping
    // const keyboard = {
    //     8: 'backspace',
    //     9: 'tab'
    //     13: 'enter'
    //     caps_lock: 20
    //     escape: 27
    //     page_up: 33
    //     page_down: 34
    //     end: 35
    //     home: 36
    //     left_arrow: 37
    //     up_arrow: 38
    //     right_arrow: 39
    //     down_arrow: 40
    //     insert: 45
    //     delete: 46
    //     0: 48
    //     1: 49
    //     2: 50
    //     3: 51
    //     4: 52
    //     5: 53
    //     6: 54
    //     7: 55
    //     8: 56
    //     9: 57
    //     a: 65
    //     b: 66
    //     c: 67
    //     d: 68
    //     e: 69
    //     f: 70
    //     g: 71
    //     h: 72
    //     i: 73
    //     j: 74
    //     k: 75
    //     l: 76
    //     m: 77
    //     n: 78
    //     o: 79
    //     p: 80
    //     q: 81
    //     r: 82
    //     s: 83
    //     t: 84
    //     u: 85
    //     v: 86
    //     w: 87
    //     x: 88
    //     y: 89
    //     z: 90
    //     left_window_key: 91
    //     right_window_key: 92
    //     select_key: 93
    //     numpad_0: 96
    //     numpad_1: 97
    //     numpad_2: 98
    //     numpad_3: 99
    //     numpad_4: 100
    //     numpad_5: 101
    //     numpad_6: 102
    //     numpad_7: 103
    //     numpad_8: 104
    //     numpad_9: 105
    //     multiply: 106
    //     add: 107
    //     subtract: 109
    //     decimal_point: 110
    //     divide: 111
    //     f1: 112
    //     f2: 113
    //     f3: 114
    //     f4: 115
    //     f5: 116
    //     f6: 117
    //     f7: 118
    //     f8: 119
    //     f9: 120
    //     f10: 121
    //     f11: 122
    //     f12: 123
    //     num_lock: 144
    //     scroll_lock: 145
    //     semi_colon: 186
    //     equal_sign: 187
    //     comma: 188
    //     dash: 189
    //     period: 190
    //     forward_slash: 191
    //     grave_accent: 192
    //     open_bracket: 219
    //     back_slash: 220
    //     close_braket: 221
    //     single_quote: 222
    // }

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
        console.log(event)
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
