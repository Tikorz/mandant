'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getmandatByNummer, savemandat, generatemandatenNummer, createDefaultmandat } from '@/lib/storage';
import { FolderBridge } from '@/lib/bridge';
import { Plus } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [searchNumber, setSearchNumber] = useState('40100');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customNumber, setCustomNumber] = useState('');

  // Beispiel-mandat beim ersten Laden erstellen
  useEffect(() => {
    const existing = getmandatByNummer('40100');
    if (!existing) {
      const examplemandat = createDefaultmandat('40100');
      savemandat(examplemandat);
    }
  }, []);

  const handleSearch = () => {
    if (!searchNumber) return;

    const mandat = getmandatByNummer(searchNumber);
    if (mandat) {
      router.push(`/mandat/${searchNumber}`);
    } else {
      alert('Mandat nicht gefunden. Bitte legen Sie einen neuen Mandaten an.');
    }
  };

  const handleCreatemandat = async () => {
    const newNumber = customNumber || generatemandatenNummer();
    const newmandat = createDefaultmandat(newNumber);
    savemandat(newmandat);
    
    // Ordner auf M: erstellen
    await FolderBridge.createFolder(newNumber);
    
    setDialogOpen(false);
    setCustomNumber('');
    router.push(`/mandat/${newNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
              <button className="text-gray-600 hover:text-blue-600">🔍</button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="relative h-64 mb-12 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=400&fit=crop"
            alt="Office"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Kontaktverwaltung</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                In der Kontaktverwaltung befinden sich alle Informationen, die für die Beziehungspflege und
                Kommunikation mit unseren mandaten sowie für die Identitätsprüfung und Risikoanalyse im Rahmen
                des Geldwäschegesetzes benötigt werden. Sämtliche Kommunikations- und
                Kundenbindungsmaßnahmen, wie beispielsweise Newsletterversand und Geburtstagskarten werden
                hierüber gesteuert.
              </p>
              <p>
                Um einen bestehenden Kontakt zu bearbeiten, sucht man ihn per mandatennummer oder Name im
                nebenstehenden Suchfeld.
              </p>
              <p>
                Einen neuen Kontakt/mandaten fügt man über „neuen Kontakt anlegen" hinzu.
              </p>
            </div>
          </div>

          {/* Right Column - Search */}
          <div className="space-y-4">
            <div className="bg-blue-600 p-6 rounded-lg shadow-sm text-white">
              <h3 className="text-xl font-bold mb-4">Kontakt suchen</h3>
              <Input
                type="text"
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                placeholder="NAME ODER mandatENNUMMER *"
                className="bg-white text-gray-900 border-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <Button
                onClick={handleSearch}
                className="w-full mt-4 bg-blue-700 hover:bg-blue-800"
              >
                Suchen
              </Button>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-white text-blue-600 border border-blue-600 hover:bg-blue-50">
                  <Plus className="mr-2 h-4 w-4" />
                  Neuen Kontakt anlegen
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Neuen mandaten anlegen</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Mandatennummer</label>
                    <Input
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value)}
                      placeholder={`Automatisch: ${generatemandatenNummer()}`}
                    />
                  </div>
                  <Button onClick={handleCreatemandat} className="w-full">
                    mandat erstellen
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 p-12 rounded-lg">
          <div className="flex items-start space-x-8">
            <div className="w-24 h-32 bg-blue-600 transform -skew-y-6"></div>
            <div>
              <h3 className="text-2xl font-bold text-blue-600 mb-2">HPTP Daily –</h3>
              <p className="text-xl text-gray-700">Alles auf einen Blick.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
