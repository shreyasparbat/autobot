// Library imports
const {app, BrowserWindow} = require('electron')

/**
 * Used to initialise the main browser window
 * and carry out all other tasks
 */
const createMainWindow = () => {
    // Create mainWindow
    const mainWindow = new BrowserWindow({
        width: 300,
        height: 200
    })

    // Load html and (optionally) open dev tools
    mainWindow.loadFile('app/renderer/index.html')
    // mainWindow.webContents.openDevTools()
}

// Electron has finished initialization and is ready to create browser windows.
app.on('ready', createMainWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    app.quit()
})