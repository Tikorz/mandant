const { app } = require('electron');
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const server = express();
const PORT = 3001;

server.use(cors());
server.use(express.json());

server.post('/create-folders', (req, res) => {
  try {
    const { mandatenNummer } = req.body;
    const firstDigit = mandatenNummer.charAt(0);
    const firstTwo = mandatenNummer.substring(0, 2);
    
    const basePath = `M:\\STB\\${firstDigit}\\${firstTwo}\\${mandatenNummer}`;
    
    // Erstelle Ordnerstruktur
    fs.mkdirSync(basePath, { recursive: true });
    fs.mkdirSync(path.join(basePath, 'Jahresabschluss'), { recursive: true });
    fs.mkdirSync(path.join(basePath, 'Steuererklärung'), { recursive: true });
    fs.mkdirSync(path.join(basePath, 'Steuerberatung'), { recursive: true });
    fs.mkdirSync(path.join(basePath, 'Rechtsberatung'), { recursive: true });
    
    res.json({ success: true, path: basePath });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

app.whenReady().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 HPTP Bridge läuft auf Port ${PORT}`);
    console.log('✅ Browser kann jetzt M:\\ Ordner erstellen!');
  });
});

app.on('window-all-closed', () => {
  // Lasse App laufen auch ohne Fenster
});

// Verhindere zweite Instanz
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}