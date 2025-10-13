import type { Mandant } from '@/types/mandant';

const STORAGE_KEY = 'mandanten';

export function getAllMandanten(): Mandant[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getMandantByNummer(nummer: string): Mandant | undefined {
  const mandanten = getAllMandanten();
  return mandanten.find(m => m.mandantenNummer === nummer);
}

export function saveMandant(mandant: Mandant): void {
  const mandanten = getAllMandanten();
  const index = mandanten.findIndex(m => m.id === mandant.id);

  if (index >= 0) {
    mandanten[index] = mandant;
  } else {
    mandanten.push(mandant);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mandanten));
}

export function generateMandantenNummer(): string {
  const mandanten = getAllMandanten();
  if (mandanten.length === 0) return '40100';

  const numbers = mandanten.map(m => Number.parseInt(m.mandantenNummer)).filter(n => !Number.isNaN(n));
  const maxNumber = Math.max(...numbers, 40099);
  return String(maxNumber + 1);
}

export function createDefaultMandant(mandantenNummer: string): Mandant {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    mandantenNummer,
    leitmandatsNummer: mandantenNummer,
    gesellschaft: 'HPTP GmbH Wirtschaftsprüfungsgesellschaft',
    wirtschaftsprüfungsgesellschaft: '',
    partner: 'Sebastian Hinkel',
    manager: 'Sebastian Hinkel',
    interneAnsprechpartner: 'Mandant',
    rolle: 'Mandant',
    branche: 'Hotellerie',
    segment: 'Franchise',
    risikoVertragspartner: 'Kein Risiko',
    statusUnvollständig: false,
    rolleMandant: 'Mandant',
    zuletztBearbeitet: new Date().toISOString(),
    erstelltAm: new Date().toISOString(),
  };
}
