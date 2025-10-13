'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getmandatByNummer, savemandat } from '@/lib/storage';
import type { mandat } from '@/types/mandat';
import { ArrowLeft, X, HardDrive, Shield } from 'lucide-react';

export default function MandatPage() {
  const router = useRouter();
  const params = useParams();
  const nummer = params.nummer as string;

  const [mandat, setmandat] = useState<mandat | null>(null);
  const [activeTab, setActiveTab] = useState('allgemeines');

  useEffect(() => {
    const loadedmandat = getmandatByNummer(nummer);
    if (loadedmandat) {
      setmandat(loadedmandat);
    } else {
      alert('mandat nicht gefunden');
      router.push('/');
    }
  }, [nummer, router]);

  const handleSave = () => {
    if (mandat) {
      savemandat(mandat);
      alert('mandat gespeichert!');
    }
  };

  const handleCreateFolders = async () => {
    if (!mandat) return;

    alert('⚠️ Browser-Ordnererstellung nicht für M:\\STB geeignet!\n\n' +
          '🔧 Verwenden Sie stattdessen den orangen Button:\n' +
          '"Ordner + Schutz (PowerShell)"\n\n' +
          '✅ Das PowerShell-Skript:\n' +
          '• Findet automatisch den richtigen Pfad\n' +
          '• Erstellt alle Ordner\n' +
          '• Aktiviert Schreibschutz\n' +
          '• Funktioniert mit Netzlaufwerken');
  };

  const handleActivateProtection = () => {
    if (!mandat) return;

    const firstDigit = mandat.mandatenNummer.charAt(0);
    const num = mandat.mandatenNummer;

    const script = `# PowerShell-Skript für mandaten-Ordnerstruktur
# mandatennummer: ${num}
# Erstellt Ordner UND aktiviert Schreibschutz
# WICHTIG: Mit Administrator-Rechten ausführen!

# Automatische Pfad-Erkennung basierend auf Mandatennummer
$mandatNummer = "${num}"
$firstDigit = $mandatNummer.Substring(0,1)
$firstTwoDigits = $mandatNummer.Substring(0,2)
$basePath = "M:\\STB\\$firstDigit\\$firstTwoDigits\\$mandatNummer"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "mandaten-Ordnerstruktur erstellen" -ForegroundColor Cyan
Write-Host "mandat: $mandatNummer" -ForegroundColor Cyan
Write-Host "Pfad: $basePath" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Schritt 1: Ordner erstellen (falls nicht vorhanden)
if (-not (Test-Path $basePath)) {
    Write-Host "[1/2] Erstelle Ordnerstruktur..." -ForegroundColor Green

    # Erstelle Pfad-Hierarchie: M:\STB\4\41\41320
    $stbPath = "M:\\STB"
    $firstDigitPath = "$stbPath\\$firstDigit"
    $twoDigitPath = "$firstDigitPath\\$firstTwoDigits"
    
    New-Item -ItemType Directory -Path $stbPath -Force | Out-Null
    New-Item -ItemType Directory -Path $firstDigitPath -Force | Out-Null
    New-Item -ItemType Directory -Path $twoDigitPath -Force | Out-Null
    New-Item -ItemType Directory -Path $basePath -Force | Out-Null

    # Dauerakte
    $daueraktePath = "$basePath\\Dauerakte"
    New-Item -ItemType Directory -Path $daueraktePath -Force | Out-Null
    New-Item -ItemType Directory -Path "$daueraktePath\\Allgemeiner Schriftverkehr" -Force | Out-Null
    New-Item -ItemType Directory -Path "$daueraktePath\\Verträge Unterlagen" -Force | Out-Null
    New-Item -ItemType Directory -Path "$daueraktePath\\Auftragswesen" -Force | Out-Null

    # Jahresakte
    $jahresaktePath = "$basePath\\Jahresakte"
    New-Item -ItemType Directory -Path $jahresaktePath -Force | Out-Null
    New-Item -ItemType Directory -Path "$jahresaktePath\\Finanzbuchhaltung" -Force | Out-Null
    New-Item -ItemType Directory -Path "$jahresaktePath\\Anlagenbuchhaltung" -Force | Out-Null
    New-Item -ItemType Directory -Path "$jahresaktePath\\Jahresabschluss" -Force | Out-Null
    New-Item -ItemType Directory -Path "$jahresaktePath\\FIBU" -Force | Out-Null

    Write-Host "      ✓ Ordner erfolgreich erstellt!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "[1/2] Ordner existieren bereits - überspringe Erstellung" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "[2/2] Aktiviere Schreibschutz..." -ForegroundColor Green
Write-Host ""

function Set-FolderProtection {
    param([string]$path)

    try {
        $item = Get-Item $path
        $item.Attributes = $item.Attributes -bor [System.IO.FileAttributes]::ReadOnly

        $acl = Get-Acl $path

        $acl.Access | Where-Object {
            $_.IdentityReference -notlike "*Administrators*" -and
            $_.IdentityReference -notlike "*SYSTEM*"
        } | ForEach-Object {
            $acl.RemoveAccessRule($_) | Out-Null
        }

        $readRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            "BUILTIN\\Users",
            "ReadAndExecute",
            "ContainerInherit, ObjectInherit",
            "None",
            "Allow"
        )
        $acl.AddAccessRule($readRule)

        $adminRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            "BUILTIN\\Administrators",
            "FullControl",
            "ContainerInherit, ObjectInherit",
            "None",
            "Allow"
        )
        $acl.AddAccessRule($adminRule)

        $systemRule = New-Object System.Security.AccessControl.FileSystemAccessRule(
            "NT AUTHORITY\\SYSTEM",
            "FullControl",
            "ContainerInherit, ObjectInherit",
            "None",
            "Allow"
        )
        $acl.AddAccessRule($systemRule)

        Set-Acl -Path $path -AclObject $acl
        Write-Host "✓ Geschützt: $path" -ForegroundColor Cyan

    } catch {
        Write-Host "✗ Fehler bei: $path" -ForegroundColor Red
    }
}

Set-FolderProtection -path $basePath

Get-ChildItem -Path $basePath -Recurse -Directory | ForEach-Object {
    Set-FolderProtection -path $_.FullName
}

Write-Host ""
Write-Host "FERTIG!" -ForegroundColor Green
Write-Host "Die Ordner sind jetzt geschützt:" -ForegroundColor White
Write-Host "• Normale Benutzer: Nur Lesen & Ausführen" -ForegroundColor Yellow
Write-Host "• Administratoren: Vollzugriff" -ForegroundColor Yellow
Write-Host ""
Write-Host "Drücken Sie eine beliebige Taste zum Beenden..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
`;

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Schreibschutz_${mandat.mandatenNummer}.ps1`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('📥 PowerShell-Skript heruntergeladen!\n\n' +
           '✅ Was macht das Skript:\n' +
           '1. Erstellt Ordnerstruktur (falls noch nicht vorhanden)\n' +
           '2. Aktiviert Schreibschutz auf allen Ordnern\n\n' +
           '⚠️ SO FÜHREN SIE ES AUS:\n' +
           '1. Rechtsklick auf Schreibschutz_' + mandat.mandatenNummer + '.ps1\n' +
           '2. "Als Administrator ausführen" wählen\n' +
           '3. Warten bis "FERTIG!" angezeigt wird\n\n' +
           '🔒 Danach können nur Admins die Ordner löschen!\n\n' +
           '💡 TIPP: Dieses Skript funktioniert IMMER - auch bei\n' +
           'Netzlaufwerken wo der grüne Button nicht geht!');
  };

  if (!mandat) {
    return <div>Laden...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">H/P/T/P/</span>
            </div>
            <nav className="flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-blue-600">Personal</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">IT</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Kommunikation</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Organisation</a>
              <a href="#" className="text-orange-500 hover:text-orange-600 font-medium">HPTP intern</a>
              <a href="#" className="text-gray-600 hover:text-blue-600">Bibliothek</a>
              <button type="button" className="text-gray-600 hover:text-blue-600">🔍</button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12">
        <div className="relative h-64 mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop"
            alt="Office"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg mb-6">
              <h1 className="text-2xl font-bold mb-4">HR Group Management GmbH</h1>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p>Leitmandats: <strong>{mandat.leitmandatsNummer}</strong></p>
                  <p>mandatennummer: <strong>{mandat.mandatenNummer}</strong></p>
                  <p>Gesellschaft: <strong>{mandat.gesellschaft}</strong></p>
                  <p>Partner: <strong>{mandat.partner}</strong></p>
                  <p>Manager: <strong>{mandat.manager}</strong></p>
                </div>
                <div>
                  <p>Risiko des Vertragspartners: <strong>{mandat.risikoVertragspartner}</strong></p>
                  <p>Status: <strong>{mandat.statusUnvollständig ? 'Unvollständig' : 'Vollständig'}</strong></p>
                  <p>Rolle: <strong>{mandat.rollemandat}</strong></p>
                  <p>Zuletzt bearbeitet: <strong>{new Date(mandat.zuletztBearbeitet).toLocaleDateString('de-DE')}</strong></p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <Button variant="outline" onClick={() => router.push('/')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Startseite Kontaktverwaltung
              </Button>
              <Button variant="outline" onClick={handleSave}>
                <X className="h-4 w-4 mr-2" />
                Mandat beenden
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-sm">
              <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
                <TabsTrigger value="allgemeines" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">Allgemeines</TabsTrigger>
                <TabsTrigger value="stammdaten">Stammdaten</TabsTrigger>
                <TabsTrigger value="kommunikation">Kommunikation</TabsTrigger>
                <TabsTrigger value="identitaetspruefung">Identitätsprüfung</TabsTrigger>
                <TabsTrigger value="vertreter">Vertreter & Ansprechpartner</TabsTrigger>
                <TabsTrigger value="risikoanalyse">Risikoanalyse</TabsTrigger>
                <TabsTrigger value="vertrag">Vertrag</TabsTrigger>
              </TabsList>

              <TabsContent value="allgemeines" className="p-6">
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📁 Ordnerstruktur anlegen:</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Option 1 (Grün):</strong> Nur für lokale Tests - nicht für M:\\STB</p>
                      <p><strong>Option 2 (Orange):</strong> Automatischer M:\\STB Pfad - findet {mandat.mandatenNummer.substring(0,1)}\\{mandat.mandatenNummer.substring(0,2)}\\{mandat.mandatenNummer}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleCreateFolders} className="bg-green-600 hover:bg-green-700 text-white">
                      <HardDrive className="h-4 w-4 mr-2" />
                      Nur für Tests (nicht M:\\STB)
                    </Button>
                    <Button onClick={handleActivateProtection} className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Shield className="h-4 w-4 mr-2" />
                      Ordner + Schutz (PowerShell)
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Leitmandatsnummer</label>
                    <Input value={mandat.leitmandatsNummer} onChange={(e) => setmandat({...mandat, leitmandatsNummer: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Gesellschaft</label>
                    <Select value={mandat.gesellschaft} onValueChange={(value) => setmandat({...mandat, gesellschaft: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HPTP GmbH Wirtschaftsprüfungsgesellschaft">HPTP GmbH Wirtschaftsprüfungsgesellschaft</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Partner</label>
                    <Select value={mandat.partner} onValueChange={(value) => setmandat({...mandat, partner: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sebastian Hinkel">Sebastian Hinkel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Manager</label>
                    <Select value={mandat.manager} onValueChange={(value) => setmandat({...mandat, manager: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kohl, Stefanie">Kohl, Stefanie</SelectItem>
                        <SelectItem value="Sebastian Hinkel">Sebastian Hinkel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Branche</label>
                    <Select value={mandat.branche} onValueChange={(value) => setmandat({...mandat, branche: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hotellerie">Hotellerie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Segment</label>
                    <Select value={mandat.segment} onValueChange={(value) => setmandat({...mandat, segment: value})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Franchise">Franchise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSave} className="w-full">Speichern</Button>
                </div>
              </TabsContent>

              <TabsContent value="stammdaten" className="p-6">
                <p className="text-gray-500">Stammdaten-Formular wird hier angezeigt...</p>
              </TabsContent>

              <TabsContent value="kommunikation" className="p-6">
                <p className="text-gray-500">Kommunikations-Formular wird hier angezeigt...</p>
              </TabsContent>

              <TabsContent value="identitaetspruefung" className="p-6">
                <p className="text-gray-500">Identitätsprüfungs-Formular wird hier angezeigt...</p>
              </TabsContent>

              <TabsContent value="vertreter" className="p-6">
                <p className="text-gray-500">Vertreter & Ansprechpartner-Formular wird hier angezeigt...</p>
              </TabsContent>

              <TabsContent value="risikoanalyse" className="p-6">
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📁 Ordnerstruktur anlegen:</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      <p><strong>Option 1 (Grün):</strong> Nur für lokale Tests - nicht für M:\\STB</p>
                      <p><strong>Option 2 (Orange):</strong> Automatischer M:\\STB Pfad - findet {mandat.mandatenNummer.substring(0,1)}\\{mandat.mandatenNummer.substring(0,2)}\\{mandat.mandatenNummer}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={handleCreateFolders} className="bg-green-600 hover:bg-green-700 text-white">
                      <HardDrive className="h-4 w-4 mr-2" />
                      Nur für Tests (nicht M:\\STB)
                    </Button>
                    <Button onClick={handleActivateProtection} className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Shield className="h-4 w-4 mr-2" />
                      Ordner + Schutz (PowerShell)
                    </Button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-blue-600">
                    Faktoren für die Bewertung des Risikos zur Geldwäsche/Terrorismusfinanzierung
                  </h3>

                  <div>
                    <p className="font-medium mb-2">Angaben zur Geschäftsbeziehung (Mehrfachnennung möglich)</p>
                    <div className="space-y-2">
                      <label className="flex items-center"><input type="checkbox" className="mr-2" />Finanzbuchhaltung</label>
                      <label className="flex items-center"><input type="checkbox" className="mr-2" />Lohn-/Gehaltsabrechnung</label>
                      <label className="flex items-center"><input type="checkbox" className="mr-2" />Jahresabschluss</label>
                      <label className="flex items-center"><input type="checkbox" className="mr-2" />Steuererklärung</label>
                      <label className="flex items-center"><input type="checkbox" className="mr-2" />Steuerberatung</label>
                      <label className="flex items-center"><input type="checkbox" className="mr-2" />Wirtschaftsberatung</label>
                      <label className="flex items-center"><input type="checkbox" className="mr-2" />Rechtsberatung</label>
                      <label className="flex items-center"><input type="checkbox" className="mr-2" />Unternehmensbewertung</label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Branche</label>
                    <Input placeholder="Hotellerie" />
                  </div>

                  <div>
                    <p className="font-medium mb-2">Bargeldintensives Unternehmen?</p>
                    <div className="flex gap-4">
                      <label className="flex items-center"><input type="radio" name="bargeld" className="mr-2" />Ja</label>
                      <label className="flex items-center"><input type="radio" name="bargeld" className="mr-2" defaultChecked />Nein</label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">Niederlassungen in Hochrisikoland</label>
                    <Input placeholder="Nicht zutreffend" />
                  </div>

                  <div>
                    <p className="font-medium mb-2">Politisch exponierte Person</p>
                    <p className="text-sm text-gray-600 mb-2">
                      (Status ermittelt anhand von Mandatsstrukturen, Internetrecherche oder sonstiger Quelle)
                    </p>
                    <div className="flex gap-4">
                      <label className="flex items-center"><input type="radio" name="politisch" className="mr-2" />Ja</label>
                      <label className="flex items-center"><input type="radio" name="politisch" className="mr-2" defaultChecked />Nein</label>
                    </div>
                  </div>

                  <Button onClick={handleSave} className="w-full">Speichern</Button>
                </div>
              </TabsContent>

              <TabsContent value="vertrag" className="p-6">
                <p className="text-gray-500">Vertrags-Formular wird hier angezeigt...</p>
              </TabsContent>
            </Tabs>
          </div>

          <div className="bg-gray-100 p-6 rounded-lg h-fit">
            <p className="text-sm text-gray-600 mb-4">Zu diesem Kontakt gibt es bisher keine Anmerkungen.</p>
            <div className="flex gap-2 mb-4">
              <Button size="sm" variant="outline">+</Button>
              <Button size="sm" variant="outline">−</Button>
              <span className="text-sm">Alle Anmerkungen (0)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
