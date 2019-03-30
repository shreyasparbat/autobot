// Library imports
const {ipcRenderer} = require('electron')

// To play bot using text value (i.e. run player.py)
const playBot = (e) => {
    // TODO: run player.py
}

// To delete bot using text value
const deleteBot = (e) => {
    ipcRenderer.send('delete-bot', e.target.textContent)
}

// To run recorder.py script and minimise mainWindow
document.getElementById('recorderBtn').addEventListener('click', () => {
    // Minimise window
    ipcRenderer.send('minimise-main-window')

    // TODO: Run recorder.py
    // TODO: When recorder replies with a bot, open save as window
    ipcRenderer.send('save-as-window')
})

ipcRenderer.on('bots', (event, bots) => {
    // Get botList ul
    const botList = document.getElementById('botList')

    // Create html string for all rows to be added to botList
    // Set botList's inner html to the generated rows
    botList.innerHTML = bots.reduce((html, bot) => {
        html += '<li class="botRow">${bot}' +
            '<button id="play" type="button" class="btn">Play</button>' +
            '<button id="delete" type="button" class="btn">Delete</button>' +
            '</li>'

        // Return individual row
        return html
    }, '')

    // Add click handlers to play bot
    botList.querySelectorAll('.play').forEach(bot => {
        bot.addEventListener('click', playBot)
    })

    // Add click handlers to delete bot
    botList.querySelectorAll('.delete').forEach(bot => {
        bot.addEventListener('click', deleteBot)
    })
})
