# HPTP Mandantenverwaltung - Hybrid-Lösung 🎯

## ⭐ Beste aus beiden Welten!

Diese Anwendung bietet **zwei Buttons** für maximale Flexibilität:

### 🟢 Button 1: "Mandat im Laufwerk M anlegen"
- **Erstellt Ordner direkt im Browser**
- ✅ Keine Admin-Rechte nötig
- ✅ Kein Download erforderlich
- ✅ Sofort einsatzbereit
- ⚠️ Ordner sind NICHT geschützt

### 🟠 Button 2: "Schreibschutz aktivieren"
- **Lädt PowerShell-Skript herunter**
- ✅ Setzt Schreibschutz auf Ordner
- ✅ Nur Admins können Ordner löschen
- ⚠️ Benötigt Admin-Rechte zum Ausführen

---

## 📋 Schritt-für-Schritt Anleitung

### Schritt 1: Ordner erstellen (Grüner Button)

1. **Öffnen Sie Chrome oder Edge**
2. **Suchen Sie nach Mandant** (z.B. 40100)
3. **Klicken Sie auf den Tab** "Allgemeines" oder "Risikoanalyse"
4. **Klicken Sie auf den grünen Button** "Mandat im Laufwerk M anlegen"
5. **Browser-Dialog öffnet sich** - Wählen Sie den Zielordner:
   - Für Mandant **40100** → `M:\STB\4\`
   - Für Mandant **38500** → `M:\STB\3\`
6. **Klicken Sie auf "Ordner auswählen"**
7. ✅ **Fertig!** Alle Ordner wurden erstellt

**Ordnerstruktur:**
```
[Mandantennummer]\
├── Dauerakte\
│   ├── Allgemeiner Schriftverkehr
│   ├── Verträge Unterlagen
│   └── Auftragswesen
└── Jahresakte\
    ├── Finanzbuchhaltung
    ├── Anlagenbuchhaltung
    ├── Jahresabschluss
    └── FIBU
```

---

### Schritt 2: Schreibschutz aktivieren (Oranger Button) 🔒

**⚠️ Nur wenn Sie Admin-Rechte haben oder jemand mit Admin-Rechten das Skript ausführen kann!**

1. **Klicken Sie auf den orangen Button** "Schreibschutz aktivieren"
2. **PowerShell-Skript wird heruntergeladen** (`Schreibschutz_[Nummer].ps1`)
3. **Rechtsklick auf die .ps1-Datei**
4. **"Als Administrator ausführen" wählen**
5. **PowerShell-Fenster öffnet sich**
   - Prüft, ob Ordner existieren
   - Setzt Read-Only Attribut
   - Konfiguriert ACL-Rechte
6. ✅ **Fertig!** Ordner sind jetzt geschützt

**Was der Schreibschutz bedeutet:**
- 👥 **Normale Benutzer:** Nur Lesen & Ausführen
- 👑 **Administratoren:** Vollzugriff (können weiterhin alles)
- ❌ **Löschen:** Nur mit Admin-Rechten möglich!

---

## 🎯 Empfohlene Workflows

### Workflow 1: Für Benutzer OHNE Admin-Rechte
1. ✅ Klicken Sie auf **"Mandat im Laufwerk M anlegen"** (grüner Button)
2. ✅ Ordner werden erstellt
3. ⏭️ **Fertig!** (Kein Schreibschutz möglich)

**Hinweis:** Bitten Sie einen Administrator, den Schreibschutz später zu aktivieren, wenn gewünscht.

---

### Workflow 2: Für Benutzer MIT Admin-Rechten
1. ✅ Klicken Sie auf **"Mandat im Laufwerk M anlegen"** (grüner Button)
2. ✅ Ordner werden erstellt
3. ✅ Klicken Sie auf **"Schreibschutz aktivieren"** (oranger Button)
4. ✅ PowerShell-Skript herunterladen und als Admin ausführen
5. ✅ **Fertig!** Ordner sind geschützt

---

### Workflow 3: Team-Ansatz (Empfohlen)
1. **Sachbearbeiter (ohne Admin):** Erstellt Ordner mit grünem Button
2. **IT-Admin:** Führt Schreibschutz-Skript für mehrere Mandanten aus

---

## 💡 Vorteile der Hybrid-Lösung

| Feature | Grüner Button | Oranger Button |
|---------|---------------|----------------|
| Admin-Rechte nötig? | ❌ Nein | ✅ Ja |
| Download nötig? | ❌ Nein | ✅ Ja (.ps1) |
| Sofort einsetzbar? | ✅ Ja | ⏱️ Nach Download |
| Ordner geschützt? | ❌ Nein | ✅ Ja |
| Browser-Support | Chrome/Edge | Alle (PowerShell) |

---

## ❓ Häufige Fragen

### Kann ich nur den grünen Button verwenden?
**Ja!** Der grüne Button erstellt die Ordner sofort. Der Schreibschutz ist optional.

### Kann ich nur den orangen Button verwenden?
**Nein!** Der orange Button setzt nur Schreibschutz auf *existierende* Ordner. Sie müssen zuerst die Ordner mit dem grünen Button erstellen.

### Was passiert, wenn ich beide Buttons klicke?
1. Grüner Button → Ordner werden erstellt
2. Oranger Button → Schreibschutz wird aktiviert
3. ✅ **Perfekt!** Ordner sind erstellt UND geschützt

### Muss ich die Buttons in einer bestimmten Reihenfolge klicken?
**Ja!** Immer zuerst **Grün** (Ordner erstellen), dann **Orange** (Schreibschutz).

### Was ist, wenn ich keine Admin-Rechte habe?
Verwenden Sie nur den **grünen Button**. Die Ordner werden erstellt, sind aber nicht schreibgeschützt. Sie können einen IT-Administrator bitten, das PowerShell-Skript später auszuführen.

### Funktioniert das auf Mac/Linux?
Der **grüne Button** funktioniert nur in Chrome/Edge auf Windows (File System Access API). Das **PowerShell-Skript** ist Windows-only.

---

## 🔧 Technische Details

### PowerShell-Skript Funktionen

Das Schreibschutz-Skript macht Folgendes:

1. **Prüft, ob Ordner existieren**
   ```powershell
   if (-not (Test-Path $basePath)) { exit }
   ```

2. **Setzt Read-Only Attribut**
   ```powershell
   $item.Attributes = $item.Attributes -bor [System.IO.FileAttributes]::ReadOnly
   ```

3. **Konfiguriert ACL-Rechte**
   - Entfernt normale Benutzerrechte
   - Fügt "ReadAndExecute" für "BUILTIN\Users" hinzu
   - Behält "FullControl" für "Administratoren" bei
   - Behält "FullControl" für "SYSTEM" bei

4. **Wendet Schutz rekursiv an**
   ```powershell
   Get-ChildItem -Path $basePath -Recurse -Directory | ForEach-Object {
       Set-FolderProtection -path $_.FullName
   }
   ```

---

## 🆘 Fehlerbehebung

### Problem: Grüner Button funktioniert nicht
**Lösung:**
- Verwenden Sie Chrome oder Edge (nicht Firefox/Safari)
- Prüfen Sie, ob Sie Schreibrechte im Zielordner haben
- Stellen Sie sicher, dass M:\ verfügbar ist

### Problem: Oranger Button lädt nichts herunter
**Lösung:**
- Prüfen Sie Download-Einstellungen im Browser
- Deaktivieren Sie Pop-up-Blocker temporär

### Problem: PowerShell-Skript funktioniert nicht
**Lösung:**
- Führen Sie es als Administrator aus (Rechtsklick!)
- Prüfen Sie, ob die Ordner existieren
- Ggf. PowerShell-Ausführungsrichtlinie anpassen:
  ```powershell
  Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
  ```

### Problem: Ordner wurden erstellt, aber ich kann sie nicht mehr löschen
**Lösung:** Das ist gewollt! Der Schreibschutz funktioniert.
- Nur Administratoren können geschützte Ordner löschen
- Melden Sie sich als Admin an oder fragen Sie Ihre IT-Abteilung

---

## 📞 Support

Bei Fragen:
- **Grüner Button (Browser):** Verwenden Sie Chrome/Edge, siehe FAQ
- **Oranger Button (PowerShell):** Kontaktieren Sie IT-Administrator
- **Allgemeine Fragen:** Siehe Hauptanleitung (`anleitung.md`)

---

**Version:** 2.0 Hybrid
**Status:** ✅ Produktionsbereit
**Empfehlung:** 🟢 Grün für alle, 🟠 Orange nur mit Admin-Rechten
