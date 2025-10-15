const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/create-folders', (req, res) => {
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

app.get('/status', (req, res) => {
  res.json({ status: 'running', message: 'Folder Bridge aktiv' });
});

app.listen(PORT, () => {
  console.log(`🚀 Folder Bridge läuft auf http://localhost:${PORT}`);
  console.log('✅ Browser kann jetzt M:\\ Ordner erstellen!');
});