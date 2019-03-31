// Library imports
const path = require('path')
const {app, ipcMain} = require('electron')

// Custom imports
const Window = require('./app/Window')

/**
 * Used to initialise the main browser window
 * and carry out all other tasks
 */
const main = () => {
    // Create mainWindow
    new Window({
        file: path.join('app', 'renderer', 'index.html')
    })
}

// Electron has finished initialization and is ready to create browser windows.
app.on('ready', main)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit()
})