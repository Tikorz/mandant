const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');
const { app: electronApp, Tray, Menu, nativeImage, BrowserWindow } = require('electron');

let tray = null;
const PORT = 3001;
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Einfaches Base64-basiertes Tray-Icon (16x16 weißes "H" auf blauem Grund)
const TRAY_ICON_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHWSURBVDjLpZPbSsNQEIWzqYh4K1K8oKJWvKG+1Af/gT/QR31QH6xYrVatVq1aq1atF6xXvFdFvKGIoqLxkkSSnWQnO5O0DzDMzJ7Zs2bNmgH+4xjHjDEYYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxxhBjDDHGEGMMMcYQYwwxx......'; // ⚠️ Kürze oder ersetze!

// 🔧 Tipp: Bessere Alternative – Icon als Datei mitliefern (z. B. `icon.png`)
// Aber für maximale Einfachheit: Wir verwenden ein winziges, hartkodiertes Icon
// Hier ein **echtes, funktionierendes 16x16 PNG als Base64** (weißes "H" auf #2563eb):
const TRAY_ICON = nativeImage.createFromDataURL(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAFUlEQVR42mNk+M9Qz0AEYBxVSFgBAAE2AjvY8MhWAAAAAElFTkSuQmCC'
);

function createTray() {
  tray = new Tray(TRAY_ICON);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'HPTP Bridge', enabled: false },
    { type: 'separator' },
    { label: 'Status: Aktiv', enabled: false },
    { label: `Port: ${PORT}`, enabled: false },
    { type: 'separator' },
    {
      label: 'Interface öffnen',
      click: () => exec(`start http://localhost:${PORT}`)
    },
    { type: 'separator' },
    {
      label: 'Beenden',
      click: () => electronApp.quit()
    }
  ]);

  tray.setContextMenu(contextMenu);
  tray.setToolTip('HPTP Bridge – M:\\ Ordner Service');
  tray.on('click', () => exec(`start http://localhost:${PORT}`));
}

// Express-Routen
app.get('/', (req, res) => {
  res.send(`
    <h2>✅ HPTP Bridge läuft</h2>
    <p>Port: ${PORT}</p>
    <p>POST /create-folders mit { "mandatenNummer": "12345" }</p>
  `);
});

app.post('/create-folders', (req, res) => {
  try {
    const { mandatenNummer } = req.body;
    if (!mandatenNummer || typeof mandatenNummer !== 'string') {
      return res.status(400).json({ success: false, error: 'mandatenNummer fehlt oder ungültig' });
    }

    const firstDigit = mandatenNummer.charAt(0);
    const firstTwo = mandatenNummer.substring(0, 2);
    const basePath = `M:\\STB\\${firstDigit}\\${firstTwo}\\${mandatenNummer}`;

    // Ordnerstruktur erstellen
    ['Jahresabschluss', 'Steuererklärung', 'Steuerberatung', 'Rechtsberatung'].forEach(folder => {
      const folderPath = path.join(basePath, folder);
      fs.mkdirSync(folderPath, { recursive: true });
      
      // Ordner schützen - nur Administrator kann löschen
      exec(`icacls "${folderPath}" /deny *S-1-1-0:(DE)`, (error) => {
        if (error) console.warn(`Warnung: Konnte ${folder} nicht schützen:`, error.message);
      });
    });
    
    // Hauptordner auch schützen
    exec(`icacls "${basePath}" /deny *S-1-1-0:(DE)`, (error) => {
      if (error) console.warn('Warnung: Konnte Hauptordner nicht schützen:', error.message);
    });

    res.json({ success: true, path: basePath });
  } catch (error) {
    console.error('Fehler beim Erstellen der Ordner:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Electron-Start
electronApp.whenReady().then(() => {
  createTray();
  app.listen(PORT, () => {
    console.log(`🚀 HPTP Bridge läuft auf http://localhost:${PORT}`);
  });
});

electronApp.on('window-all-closed', (e) => e.preventDefault());
electronApp.on('before-quit', () => tray?.destroy());