const { app, BrowserWindow, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });


  
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handler für Ordner erstellen
ipcMain.handle('create-folders', async (event, mandatData) => {
  try {
    const { mandatenNummer } = mandatData;
    const firstDigit = mandatenNummer.charAt(0);
    const firstTwo = mandatenNummer.substring(0, 2);
    
    const basePath = `M:\\STB\\${firstDigit}\\${firstTwo}\\${mandatenNummer}`;
    
    // Erstelle Ordnerstruktur
    fs.mkdirSync(basePath, { recursive: true });
    fs.mkdirSync(path.join(basePath, 'Jahresabschluss'), { recursive: true });
    fs.mkdirSync(path.join(basePath, 'Steuererklärung'), { recursive: true });
    fs.mkdirSync(path.join(basePath, 'Steuerberatung'), { recursive: true });
    fs.mkdirSync(path.join(basePath, 'Rechtsberatung'), { recursive: true });
    
    return { success: true, path: basePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});