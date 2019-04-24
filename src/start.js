// Library imports
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

// Custom imports
const record = require('./automation/recorder')
const play = require('./automation/player')

// Declare global variable for mainWindow
let mainWindow

/**
 * Called to create a window
 */
function createWindow() {
    // Initialise browserWindow
    mainWindow = new BrowserWindow({ width: 800, height: 600 })

    // Load index.html into this window
    mainWindow.loadURL(
        process.env.ELECTRON_START_URL
        || url.format({
            pathname: path.join(__dirname, '/../public/index.html'),
            protocol: 'file:',
            slashes: true,
        }),
    )

    // Destroy mainWindow when app is closed
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // Create menu and set it to the application
    const menu = Menu.buildFromTemplate([
        {
            label: 'Record',
            click() {
                record()
            },
            accelerator: 'Ctrl+R'
        },
        {
            label: 'Play',
            click() {
                play()
            },
            accelerator: 'Ctrl+P'
        }
    ])
    Menu.setApplicationMenu(menu)
}

// Create mainWindow when app started
app.on('ready', createWindow)

// Quit app if all windows are closed
app.on('window-all-closed', () => {
    app.quit()
})

// Create mainWindow only if it doesn't already exist
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
