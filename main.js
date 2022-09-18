// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, nativeTheme } = require('electron')
const path = require('path')
const storage = require('electron-json-storage')
const os = require('os')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "Scraper v1.0.0",
    width: 800,
    height: 600,
    webPreferences: {
      //preload: path.join(__dirname, 'preload.js'),
      webSecurity: false,
      resizable: true,
      fullscreenable: true,
      disableDialogs: true,
    }
  })

  // and load the index.html of the app.
  mainWindow.loadURL("https://www.google.ru");
  // mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Некоторые интерфейсы API могут использоваться только после возникновения этого события.
/*app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})*/

nativeTheme.themeSource = 'dark';

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

const { session } = require('electron')

app.on('ready', () => {
    createWindow()

    /*const twoWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        webSecurity: false,,
        show: false
      }
    })
    twoWindow.loadFile('index.html')
    twoWindow.hide();
    twoWindow.show();
    twoWindow.webContents.openDevTools();*/


  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
    // Modify the origin for all requests to the following urls.
    const filter = {
      urls: ['https://www.google.ru/*']
    };
    
    session.defaultSession.webRequest.onBeforeSendHeaders(
      filter,
      (details, callback) => {

        details.requestHeaders['Origin'] = 'https://www.google.ru/';
        callback({ requestHeaders: details.requestHeaders });
      }
    )
  
    session.defaultSession.webRequest.onHeadersReceived(
      filter,
      (details, callback) => {

        details.responseHeaders['Access-Control-Allow-Origin'] = [
          '*'
        ];
        
        details.responseHeaders['X-Frame-Options'] = [
          '*'
        ];

        details.responseHeaders['Access-Control-Allow-Methods'] = [
          'GET, OPTIONS'
        ];

        details.responseHeaders['Access-Control-Allow-Headers'] = [
          'Content-Type'
        ];

        var keys = Object.keys(details.responseHeaders);
        var values = Object.values(details.responseHeaders);

        var newResponseHeaders = {};

        for(let i = 0; i < keys.length; i++)
        {
          if(keys[i] == 'x-frame-options' || keys[i] == 'X-Frame-Options')
            continue;

            newResponseHeaders[keys[i]] = values[i];
        }

        callback({ responseHeaders: newResponseHeaders });
      }
    )
  })


// data here
  storage.setDataPath(os.tmpdir());
  
  storage.set('params', null);
  storage.set("step", 1);
  storage.set("counter", 0);
  storage.set('hidden_opened', false);
  storage.set('last_page', 0);

  setInterval( () =>
  {
    let allWindows = BrowserWindow.getAllWindows();
    if(allWindows.length > 1)
      allWindows[0].close();
  }, 100);