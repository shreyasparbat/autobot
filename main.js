// Library imports
const {app} = require('electron')

/**
 * Used to initialise the main browser window
 * and carry out all other tasks
 */
function main() {
    let mainWindow = new Window({
        file: 'index.html'
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