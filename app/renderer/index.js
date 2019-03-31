// Library imports
const PythonShell = require('python-shell')
const Store = require('electron-store')

// Create new storage file
const store = new Store()

// To run recorder.py script
document.getElementById('recorderBtn').addEventListener('click', () => {
    // Run recorder.py
    const pyShell = new PythonShell('../../pyScripts/recorder.py')
    pyShell.on('message', (bot) => {
        // Delete previously saved bot
        store.delete('bot')

        // Save bot (i.e. the event sequence given by python)
        store.set('bot', JSON.parse(bot))
    })

    // End input stream and let process exit
    pyShell.end((err) => {
        if (err) {
            throw err
        }
    })
})

// To run player.py script
document.getElementById('playBtn').addEventListener('click', () => {
    // Get bot and check if exists
    const bot = store.get('bot')
    if (bot) {

    }
})
