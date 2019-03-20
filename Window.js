// Import library modules
const {BrowserWindow} = require('electron')

// Default window settings
const defaultProps = {
    width: 500,
    height: 800,
    show: false
}

class Window extends BrowserWindow {
    constructor({file, ...windowSettings}) {
    // Calls new BrowserWindow with these props
        super({...defaultProps, ...windowSettings})

        // Load html and open devtools
        this.loadFile(file)
        this.webContents.openDevTools()

        // Show this window when ready (to prevent flickering)
        this.once('ready-to-show', () => {
            this.show()
        })
    }
}

// Export Window
module.exports = Window