// Library imports
const { PythonShell } = require('python-shell')
const path = require('path')
const Store = require('electron-store')
const fs = require('fs')

/**
 * Get botFilePath from botName
 */
const getBotFilePath = (botName) => {
    // Get bot path from electron-store
    const store = new Store()
    let botFilePath = store.get(botName)

    // If newly created bot (doesn't exist in electron-store)
    if (!botFilePath) {
        // Create bot file path
        botFilePath = path.join(process.env.APPDATA, botName + '.json')

        // Create default (empty) bot
        const bot = {
            variables: [],
            events: []
        }

        // Stringify bot and save it
        fs.writeFileSync(botFilePath, JSON.stringify(bot, null, 2))

        // Save  botFilePath in electron-store
        store.set(botName, botFilePath)
    }
}

/**
 * Record peripheral input events and save in readable format
 */
const invokeRecorder = async (botName) => {
    // Get botFilePath
    const botFilePath = getBotFilePath(botName)

    // Run recorder.py
    const options = {
        mode: 'text',
        pythonPath: path.join(__dirname, 'venv', 'Scripts', 'python.exe'),
        scriptPath: __dirname,
        args: [botFilePath]
    }
    PythonShell.run('recorder.py', options, (err) => {
        // Throw err if err
        if (err) {
            throw err
        }
    })
}
/**
 * Execute given bot
 */
const invokePlayer = async (botName) => {
    // Get botFilePath
    const botFilePath = getBotFilePath(botName)

    // Run player.py
    const options = {
        mode: 'text',
        pythonPath: path.join(__dirname, 'venv', 'Scripts', 'python.exe'),
        scriptPath: __dirname,
        args: [botFilePath]
    }
    PythonShell.run('player.py', options, (err) => {
        // Throw err if err
        if (err) {
            throw err
        }
    })
}

const loadSteps = async (botName) => {

}

// Export
module.exports = {
    invokeRecorder,
    invokePlayer,
}
