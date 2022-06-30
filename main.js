// npm init -y
//npm install electron --save-dev
// modify package.json
const electron = require("electron");
const ejs = require("ejs-electron");
const app = electron.app;

// to provide data to ________
ejs.data({
    title: "My Excel",
    rows: 100,
    cols: 26
})

const BrowserWindow = electron.BrowserWindow;
// async because file might wait for the application to be ready and open a window

async function createWindow() {

    // Create the browser window.
    const win = new BrowserWindow({
        // provides node to electron app
        webPreferences: {
            nodeIntegration: true
        }
    })
    // load html file
    await win.loadFile("index.ejs");
    // to open with maximum window size
    win.maximize();
    // to open dev tools
    win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);