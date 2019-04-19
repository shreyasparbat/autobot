// Library imports
const electron = require('electron')
const path = require('path')
const url = require('url')

// Initialise electron app and main window
const app = electron.app
const BrowserWindow = electron.BrowserWindow

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
