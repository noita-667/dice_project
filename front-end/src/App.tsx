import { useState, useCallback } from 'react';
import { DICE_LIST } from './types/dice';
import type { DiceType } from './types/dice';
import { useRollHistory } from './hooks/useRollHistory';
import { DicePicker } from './components/DicePicker';
import { DiceResult } from './components/DiceResult';
import { RollHistory } from './components/RollHistory';

export default function App() {
  const [selected, setSelected] = useState<DiceType | null>(null);
  const [lastRoll, setLastRoll] = useState<{ value: number; label: string } | null>(null);
  const { history, addEntry, clearHistory } = useRollHistory();

  const handleRoll = useCallback(() => {
    if (!selected) return;
    const die = DICE_LIST.find((d) => d.type === selected);
    if (!die) return;

    const value = Math.floor(Math.random() * die.faces) + 1;
    setLastRoll({ value, label: `${die.label} · ${die.faces} faces` });
    addEntry({ type: die.type, label: die.label, value });
  }, [selected, addEntry]);

  return (
    <main style={{ maxWidth: 400, margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 16, fontWeight: 500, marginBottom: '1.5rem' }}>Lancer de dés</h1>

      <DicePicker diceList={DICE_LIST} selected={selected} onSelect={setSelected} />

      <DiceResult value={lastRoll?.value ?? null} label={lastRoll?.label ?? null} />

      <button
        onClick={handleRoll}
        disabled={!selected}
        style={{ width: '100%', padding: '0.75rem', marginBottom: '1.5rem', fontSize: 15, cursor: selected ? 'pointer' : 'default' }}
      >
        Lancer
      </button>

      <RollHistory history={history} onClear={clearHistory} />
    </main>
  );
}