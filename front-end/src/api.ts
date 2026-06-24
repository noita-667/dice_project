import type { DiceConfig, RollEntry } from './types/dice';

const BASE = 'http://localhost:3000';

// Fallback affiché si le back-end est indisponible au démarrage
const DEFAULT_DICE: DiceConfig[] = [
  { type: 'd6',  faces: 6,  label: 'D6',  custom: false },
  { type: 'd12', faces: 12, label: 'D12', custom: false },
  { type: 'd20', faces: 20, label: 'D20', custom: false },
];

export async function fetchDice(): Promise<DiceConfig[]> {
  try {
    const res = await fetch(`${BASE}/dice`);
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return DEFAULT_DICE;
  }
}

export async function fetchHistory(): Promise<RollEntry[]> {
  try {
    const res = await fetch(`${BASE}/rolls`);
    if (!res.ok) throw new Error();
    return res.json();
  } catch {
    return []; // historique vide si le back-end est indisponible
  }
}

// Retourne null si succès, message d'erreur sinon
export async function addDie(label: string, faces: number): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/dice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label, faces }),
    });
    if (!res.ok) return `Erreur serveur (${res.status})`;
    return null;
  } catch {
    return 'Serveur inaccessible — vérifiez que le back-end tourne.';
  }
}

export async function removeDie(type: string): Promise<void> {
  await fetch(`${BASE}/dice/${type}`, { method: 'DELETE' }).catch(() => null);
}

export async function saveRoll(type: string, label: string, value: number, player: string): Promise<void> {
  await fetch(`${BASE}/rolls`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, label, value, player }),
  }).catch(() => null);
}
