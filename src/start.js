// Library imports
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
require('dotenv').config()

// Declare global variable for mainWindow
let mainWindow

/**
 * Called to create a window
 */
function createWindow() {
    // // TODO: receive bot name
    // const botName = 'test'
    //
    // // Get bot path from electron-store
    // const store = new Store()
    // let botFilePath = store.get(botName)
    //
    // // If newly created bot (doesn't exist in electron-store)
    // if (!botFilePath) {
    //     // Create bot file path
    //     botFilePath = path.join(app.getAppPath('userData'), botName + '.json')
    //
    //     // Create default (empty) bot
    //     const bot = {
    //         variables: [],
    //         events: []
    //     }
    //
    //     // Stringify bot and save it
    //     fs.writeFileSync(botFilePath, JSON.stringify(bot, null, 2))
    //
    //     // Save  botFilePath in electron-store
    //     store.set(botName, botFilePath)
    // }

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
        // {
        //     label: 'Record',
        //     async click() {
        //         await invokeRecorder(botFilePath)
        //     },
        //     accelerator: 'Ctrl+R'
        // },
        // {
        //     label: 'Play',
        //     async click() {
        //         await invokePlayer(botFilePath)
        //     },
        //     accelerator: 'Ctrl+P'
        // },
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
