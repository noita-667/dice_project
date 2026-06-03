import { useState, useEffect, useCallback } from 'react';
import { DICE_LIST } from './types/dice';
import type { DiceType, RollEntry } from './types/dice';
import { DicePicker } from './components/DicePicker';
import { DiceResult } from './components/DiceResult';
import { RollHistory } from './components/RollHistory';

const API_URL = 'http://localhost:3000';

/**
 * Composant racine de l'application.
 *
 * Gère :
 * - la sélection du dé
 * - le lancer et l'enregistrement du résultat via l'API
 * - l'affichage de l'historique des lancers
 */
export default function App() {
  const [selected, setSelected] = useState<DiceType | null>(null);
  const [lastRoll, setLastRoll] = useState<{ value: number; label: string } | null>(null);
  const [history, setHistory] = useState<RollEntry[]>([]);

  /**
   * Récupère l'historique des lancers depuis l'API et met à jour l'état.
   * Mémorisé avec useCallback car utilisé en dépendance de useEffect.
   */
  const fetchHistory = useCallback(async () => {
    const res = await fetch(`${API_URL}/rolls`);
    const data = await res.json();
    setHistory(data);
  }, []);

  // Charge l'historique au montage du composant
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);


  const handleRoll = useCallback(async () => {
    if (!selected) return;
    const die = DICE_LIST.find((d) => d.type === selected);
    if (!die) return;

    const value = Math.floor(Math.random() * die.faces) + 1;
    setLastRoll({ value, label: `${die.label} · ${die.faces} faces` });

    // Sauvegarde du lancer côté serveur
    await fetch(`${API_URL}/rolls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: die.type, label: die.label, value }),
    });

    fetchHistory();
  }, [selected, fetchHistory]);

  return (
    <main style={{ maxWidth: 400, margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 16, fontWeight: 500, marginBottom: '1.5rem' }}>Lancer de dés</h1>

      {/* Sélecteur de dé */}
      <DicePicker diceList={DICE_LIST} selected={selected} onSelect={setSelected} />

      {/* Affichage du dernier résultat */}
      <DiceResult value={lastRoll?.value ?? null} label={lastRoll?.label ?? null} />

      <button
        onClick={handleRoll}
        disabled={!selected}
        style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', fontSize: 15, cursor: selected ? 'pointer' : 'default' }}
      >
        Lancer
      </button>

      {/* Historique de tous les lancers */}
      <RollHistory history={history} />
    </main>
  );
}