// Library imports
const { PythonShell } = require('python-shell')
const path = require('path')

// const Store = require('electron-store')

/**
 * Record peripheral input events and save in readable format
 */
const invokeRecorder = async (botFilePath) => {
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
const invokePlayer = async (botFilePath) => {
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

// Export
module.exports = {
    invokeRecorder,
    invokePlayer
}
