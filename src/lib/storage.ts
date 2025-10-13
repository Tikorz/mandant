import type { mandat } from '@/types/mandat';

const STORAGE_KEY = 'mandaten';

export function getAllmandaten(): mandat[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getmandatByNummer(nummer: string): mandat | undefined {
  const mandaten = getAllmandaten();
  return mandaten.find(m => m.mandatenNummer === nummer);
}

export function savemandat(mandat: mandat): void {
  const mandaten = getAllmandaten();
  const index = mandaten.findIndex(m => m.id === mandat.id);

  if (index >= 0) {
    mandaten[index] = mandat;
  } else {
    mandaten.push(mandat);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mandaten));
}

export function generatemandatenNummer(): string {
  const mandaten = getAllmandaten();
  if (mandaten.length === 0) return '40100';

  const numbers = mandaten.map(m => Number.parseInt(m.mandatenNummer)).filter(n => !Number.isNaN(n));
  const maxNumber = Math.max(...numbers, 40099);
  return String(maxNumber + 1);
}

export function createDefaultmandat(mandatenNummer: string): mandat {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    mandatenNummer,
    leitmandatsNummer: mandatenNummer,
    gesellschaft: 'HPTP GmbH Wirtschaftsprüfungsgesellschaft',
    wirtschaftsprüfungsgesellschaft: '',
    partner: 'Sebastian Hinkel',
    manager: 'Sebastian Hinkel',
    interneAnsprechpartner: 'mandat',
    rolle: 'mandat',
    branche: 'Hotellerie',
    segment: 'Franchise',
    risikoVertragspartner: 'Kein Risiko',
    statusUnvollständig: false,
    rollemandat: 'mandat',
    zuletztBearbeitet: new Date().toISOString(),
    erstelltAm: new Date().toISOString(),
  };
}
