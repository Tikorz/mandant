const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { exec } = require('child_process');

const PORT = 3001;
const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Express-Routen
app.get('/', (req, res) => {
  res.send(`
    <h2>✅ HPTP Bridge läuft (Test-Modus)</h2>
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
    });
    
    // Ordner nach der Erstellung schützen (asynchron, ohne die Response zu blockieren)
    setTimeout(() => {
      // Hauptordner schützen - Mehrere Schutzebenen
      const protectFolder = (folderPath, folderName) => {
        // 1. System + Hidden Attribute
        exec(`attrib +S +H "${folderPath}"`, (error1) => {
          if (error1) console.warn(`Warnung: attrib für ${folderName} fehlgeschlagen:`, error1.message);
        });
        
        // 2. Verweigere Löschen für Everyone
        exec(`icacls "${folderPath}" /deny "Jeder":(DE,DC)`, (error2) => {
          if (error2) console.warn(`Warnung: icacls für ${folderName} fehlgeschlagen:`, error2.message);
          else console.log(`✓ ${folderName} geschützt`);
        });
        
        // 3. Read-only als Backup
        exec(`attrib +R "${folderPath}"`, (error3) => {
          if (error3) console.warn(`Warnung: Read-only für ${folderName} fehlgeschlagen:`, error3.message);
        });
      };
      
      // Hauptordner schützen
      protectFolder(basePath, 'Hauptordner');
      
      // Unterordner schützen
      ['Jahresabschluss', 'Steuererklärung', 'Steuerberatung', 'Rechtsberatung'].forEach(folder => {
        const folderPath = path.join(basePath, folder);
        protectFolder(folderPath, folder);
      });
    }, 100);

    res.json({ success: true, path: basePath });
  } catch (error) {
    console.error('Fehler beim Erstellen der Ordner:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Node.js-Start
app.listen(PORT, () => {
  console.log(`🚀 HPTP Bridge läuft auf http://localhost:${PORT} (Test-Modus)`);
  console.log('Drücke Ctrl+C zum Beenden');
});