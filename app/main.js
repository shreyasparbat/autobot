// Library imports
const path = require('path')
const {app, BrowserWindow} = require('electron/electron')

/**
 * Used to initialise the main browser window
 * and carry out all other tasks
 */
const createMainWindow = () => {
    // Create mainWindow
    const mainWindow = new BrowserWindow({
        width: 200,
        height: 100
    })

    // Load html
    mainWindow.loadFile(path.join('renderer', 'index.html'))

    // Open developer tools
    // mainWindow.webContents.openDevTools()

    // Show this window when ready (to prevent flickering)
    mainWindow.once('ready-to-show', () => {
        this.show()
    })
}

// Electron has finished initialization and is ready to create browser windows.
app.on('ready', createMainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit()
})