// Library imports
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')

// Custom imports
const Recorder = require('./automation/recorder')
const Player = require('./automation/player')

// Declare global variable for mainWindow
let mainWindow

/**
 * Called to create a window
 */
function createWindow() {
    // Create a recorder and player instance for given file
    const botName = 'test1'
    const recorder = new Recorder(botName)
    const player = new Player(botName)

    // Initialise browserWindow and maximize it
    mainWindow = new BrowserWindow({ show: false })
    mainWindow.maximize()

    // Load index.html into this window
    mainWindow.loadURL(
        process.env.ELECTRON_START_URL
        || url.format({
            pathname: path.join(__dirname, '/../public/index.html'),
            protocol: 'file:',
            slashes: true,
        }),
    )

    // Show window
    mainWindow.show()

    // Destroy mainWindow when app is closed
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    // Create menu and set it to the application
    const menu = Menu.buildFromTemplate([
        {
            label: 'Record',
            click() {
                await recorder.record()
            },
            accelerator: 'Ctrl+R'
        },
        {
            label: 'Play',
            click() {
                player.play()
            },
            accelerator: 'Ctrl+P'
        },
        {
            label: 'Dev Tools',
            click() {
                mainWindow.webContents.openDevTools()
            }
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
