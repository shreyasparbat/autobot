// Library imports
const path = require('path')
const {app, ipcMain} = require('electron')

// Custom imports
const Window = require('./Window')

/**
 * Used to initialise the main browser window
 * and carry out all other tasks
 */
const main = () => {
    let mainWindow = new Window({
        file: path.join('renderer', 'index.html')
    })

    // Add 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', main)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit()
})