// Library imports
const {PythonShell} = require('python-shell')
const Store = require('electron-store')

// Create new storage file
const store = new Store()

// To run recorder.py script
document.getElementById('recordBtn').addEventListener('click', () => {
    // Run recorder.py
    const options = {
        mode: 'json',
        pythonPath: 'venv/Scripts/python.exe',
        scriptPath: 'pyScripts'
    }
    PythonShell.run('recorder.py', options, (err, resultBot) => {
        // Throw err if err
        if (err) {
            throw err
        }

        // Delete previously saved bot
        store.delete('bot')

        // Save bot (i.e. the event sequence given by python)
        store.set('bot', resultBot)
    })
})

// To run player.py script
document.getElementById('playBtn').addEventListener('click', () => {
    // Get bot and check if exists
    const bot = store.get('bot')
    if (bot) {
        // Run player.py
        const options = {
            mode: 'json',
            pythonPath: 'venv/Scripts/python.exe',
            scriptPath: 'pyScripts',
            args: [JSON.stringify(bot[0])]
        }
        PythonShell.run('player.py', options, (err) => {
            // Throw err if err
            if (err) {
                throw err
            }
        })
    }
})
