// Library imports
const path = require('path')
const {app, ipcMain} = require('electron/electron')

// Custom imports
const Window = require('./app/Window')
const DataStore = require('./app/DataStore')

// Create new bots store
const botsData = new DataStore({name: 'Bots Main'})

/**
 * Used to initialise the main browser window
 * and carry out all other tasks
 */
const main = () => {
    let mainWindow = new Window({
        file: path.join('renderer', 'index.html')
    })

    // Add saveAs window
    let saveAsWindow

    // Initialise with existing bots
    mainWindow.once('show', () => {
        mainWindow.webContents.send('bots', botsData.bots)
    })

    // Create saveAs Window
    ipcMain.on('save-as-window', () => {
        // If saveAs doesn't already exists
        if (!saveAsWindow) {
            // Create a new saveAs window
            saveAsWindow = new Window({
                file: path.join('renderer', 'add.html'),
                width: 400,
                height: 200,
                // Close if main window closed
                parent: mainWindow
            })

            // Cleanup when closed
            saveAsWindow.on('closed', () => {
                saveAsWindow = null
            })
        }
    })

    // Add bot from saveAsWindow to mainWindow
    ipcMain.on('add-bot', (event, bot) => {
        const updatedBots = botsData.addBot(bot).bots
        mainWindow.send('bots', updatedBots)
    })

    // Delete bot from bot list on mainWindow
    ipcMain.on('delete-bot', (event, bot) => {
        const updatedBots = botsData.deleteBot(bot).bots
        mainWindow.send('bots' ,updatedBots)
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', main)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit()
})