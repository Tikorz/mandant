# HPTP Mandantenverwaltung - Anleitung

## Überblick

Diese Webanwendung ist eine Kontakt- und Mandantenverwaltung für HPTP. Sie ermöglicht das Suchen, Anlegen und Verwalten von Mandanten mit **automatischer Ordner-Erstellung direkt im Browser** - ohne Download, ohne Admin-Rechte! 🚀

## Funktionen

### 1. Startseite - Kontaktsuche
- **Mandanten suchen**: Geben Sie eine Mandantennummer (z.B. 40100) ein und klicken Sie auf "Suchen"
- **Neuen Mandanten anlegen**: Klicken Sie auf den Button "Neuen Kontakt anlegen" - die Mandantennummer wird automatisch generiert

### 2. Mandanten-Detailseite
Die Detailseite enthält folgende Tabs:
- **Allgemeines**: Grundinformationen zum Mandanten
- **Stammdaten**: Stammdaten (in Entwicklung)
- **Kommunikation**: Kommunikationsdaten (in Entwicklung)
- **Identitätsprüfung**: Identitätsprüfung (in Entwicklung)
- **Vertreter & Ansprechpartner**: Kontaktpersonen (in Entwicklung)
- **Risikoanalyse**: Risikoanalyse gemäß Geldwäschegesetz
- **Vertrag**: Vertragsdetails (in Entwicklung)

### 3. Button "Mandat im Laufwerk M anlegen" ⭐

Dieser Button ist auf zwei Tabs verfügbar:
- **Allgemeines**-Tab
- **Risikoanalyse**-Tab

#### 📋 So funktioniert es:

1. **Button klicken**: Klicken Sie auf den grünen Button "Mandat im Laufwerk M anlegen"
2. **Browser-Dialog öffnet sich**: Sie werden aufgefordert, einen Ordner auszuwählen
3. **Navigieren**: Gehen Sie zu `M:\STB\[Erste Ziffer]\`
   - Für Mandant **40100** → `M:\STB\4\`
   - Für Mandant **38500** → `M:\STB\3\`
   - Für Mandant **51234** → `M:\STB\5\`
4. **Ordner auswählen**: Klicken Sie auf "Ordner auswählen"
5. **✅ Fertig!** Alle Unterordner werden automatisch erstellt

⚠️ **Wichtig:**
- Funktioniert nur in **Chrome** oder **Edge** (nicht in Firefox)
- **Keine Admin-Rechte** erforderlich!
- **Kein Download** nötig - alles passiert direkt im Browser
- Die Ordner werden NICHT schreibgeschützt (Schreibschutz würde Admin-Rechte benötigen)

## Ordnerstruktur

Die Anwendung erstellt automatisch folgende Struktur:

```
M:\STB\[Erste Ziffer]\[Mandantennummer]\
├── Dauerakte\
│   ├── Allgemeiner Schriftverkehr\
│   ├── Verträge Unterlagen\
│   └── Auftragswesen\
└── Jahresakte\
    ├── Finanzbuchhaltung\
    ├── Anlagenbuchhaltung\
    ├── Jahresabschluss\
    └── FIBU\
```

**Beispiele:**
- Mandantennummer: **40100** → Pfad: `M:\STB\4\40100\`
- Mandantennummer: **38500** → Pfad: `M:\STB\3\38500\`
- Mandantennummer: **21500** → Pfad: `M:\STB\2\21500\`

## Browserkompatibilität

✅ **Unterstützt (File System Access API):**
- Google Chrome (ab Version 86)
- Microsoft Edge (ab Version 86)
- Opera (ab Version 72)

❌ **Nicht unterstützt:**
- Firefox (experimentell, funktioniert möglicherweise nicht)
- Safari (noch nicht verfügbar)

➡️ **Empfehlung:** Verwenden Sie **Microsoft Edge** oder **Google Chrome**

## Häufige Fragen (FAQ)

### ❓ Brauche ich Admin-Rechte?
**Nein!** Die Ordner werden mit Ihren normalen Benutzerrechten erstellt.

### ❓ Werden die Ordner geschützt?
**Nein**, die Ordner sind normal lösch- und änderbar. Schreibschutz würde Admin-Rechte erfordern, die die meisten Nutzer nicht haben.

### ❓ Was passiert, wenn der Ordner schon existiert?
Keine Sorge - bereits vorhandene Ordner werden nicht überschrieben. Die Anwendung erstellt nur die Ordner, die noch nicht existieren.

### ❓ Kann ich einen anderen Speicherort wählen?
Ja! Sie können jeden beliebigen Ordner auswählen:
- Lokale Festplatte (C:\)
- Netzlaufwerke (M:\, N:\, etc.)
- USB-Sticks
- OneDrive/SharePoint-Ordner

### ❓ Was passiert, wenn ich den falschen Ordner auswähle?
Kein Problem! Die Ordner werden dort erstellt, wo Sie sie auswählen. Sie können sie einfach löschen und den Vorgang wiederholen.

### ❓ Funktioniert das auf Mac oder Linux?
Nein, die Pfadstruktur `M:\STB\` ist Windows-spezifisch. Auf Mac/Linux müssen Sie einen anderen Pfad wählen.

## Datenspeicherung

Alle Mandantendaten werden im **localStorage** des Browsers gespeichert.

✅ **Vorteile:**
- Keine Serververbindung erforderlich
- Schneller Zugriff
- Daten bleiben lokal und privat

⚠️ **Wichtig zu wissen:**
- Daten sind nur in diesem Browser verfügbar
- Beim Löschen der Browser-Daten gehen die Mandantendaten verloren
- Nicht für mehrere Computer/Benutzer geeignet
- Für Produktiveinsatz sollte eine Datenbank-Lösung implementiert werden

## Beispiel-Mandant

Beim ersten Start wird automatisch ein Beispiel-Mandant mit der Nummer **40100** angelegt. Sie können diesen sofort suchen und öffnen, um die Funktionen zu testen.

## Fehlerbehebung

### Problem: "Ihr Browser unterstützt diese Funktion nicht"
**Lösung:** Verwenden Sie Google Chrome oder Microsoft Edge statt Firefox oder Safari.

### Problem: Ordner werden nicht erstellt
**Lösung:**
1. Prüfen Sie, ob Sie Schreibrechte im ausgewählten Ordner haben
2. Versuchen Sie einen anderen Ordner (z.B. auf C:\)
3. Starten Sie den Browser neu

### Problem: Ich kann den M:\-Laufwerk nicht sehen
**Lösung:**
1. Stellen Sie sicher, dass das Netzlaufwerk verbunden ist
2. Öffnen Sie den Windows Explorer und prüfen Sie, ob M:\ verfügbar ist
3. Wenn nicht, kontaktieren Sie Ihre IT-Abteilung

## Technische Details

- **Framework**: Next.js 15 mit TypeScript
- **UI-Komponenten**: shadcn/ui mit Tailwind CSS
- **Icons**: lucide-react
- **Datenspeicherung**: Browser localStorage
- **Ordner-Erstellung**: File System Access API
- **Browser**: Chrome/Edge (Chromium-basiert)

## Nächste Schritte (Entwicklung)

Für die Risikoanalyse-Seite kann später ein zusätzliches Feature implementiert werden:
- Spezifische Risikoanalyse-Dokumente erstellen
- Compliance-Ordner anlegen
- Vorlagen für Geldwäsche-Prüfung kopieren
- PDF-Berichte generieren

Die Anweisungen dafür werden bei Bedarf hinzugefügt.

## Support

Bei Fragen oder Problemen wenden Sie sich bitte an:
- **IT-Support-Team**
- **Dokumentation**: Diese Datei
- **Browser-Support**: Verwenden Sie Chrome oder Edge

---

**Version:** 1.0
**Letzte Aktualisierung:** 2025
**Status:** ✅ Produktionsbereit
