const { app, BrowserWindow, Menu } = require('electron')
const { autoUpdater } = require("electron-updater")
const AutoLaunch = require('auto-launch')

let myWindow = null

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true
    }
  })

  win.loadFile('index.html')

  autoUpdater.checkForUpdatesAndNotify();
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (myWindow) {
      if (myWindow.isMinimized()) myWindow.restore()
      myWindow.focus()
    }
  })

  app.on('ready', () => {
    if (process.platform !== 'darwin') {
      let autoLaunch = new AutoLaunch({
        name: 'btprint',
        path: app.getPath('exe'),
      })
      autoLaunch.isEnabled().then((isEnabled) => {
        if (!isEnabled) autoLaunch.enable();
      })
    }
  })

  // Create myWindow, load the rest of the app, etc...
  app.whenReady().then(() => {
    myWindow = createWindow()
  })
}

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

Menu.setApplicationMenu(new Menu());

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"

setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
}, 1000 * 60 * 15);
