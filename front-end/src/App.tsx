import { useState, useEffect, useCallback } from 'react';
import type { DiceConfig, DiceType, RollEntry } from './types/dice';
import { fetchDice, fetchHistory, addDie, removeDie, saveRoll } from './api';
import { DicePicker }  from './components/DicePicker';
import { DiceResult }  from './components/DiceResult';
import { RollHistory } from './components/RollHistory';
import { DiceCreator } from './components/DiceCreator';
import { AnimatedDie } from './components/AnimatedDie';
import './styles/animations.css';
import './styles/App.css';

// Durée de l'animation avant d'afficher le résultat
const ROLL_DURATION = 800;

export default function App() {
  const [selected,     setSelected]     = useState<DiceType | null>(null);
  const [allDice,      setAllDice]      = useState<DiceConfig[]>([]);
  const [lastRoll,     setLastRoll]     = useState<{ value: number; label: string } | null>(null);
  const [history,      setHistory]      = useState<RollEntry[]>([]);
  const [isRolling,    setIsRolling]    = useState(false);
  const [rollingFaces, setRollingFaces] = useState(6); // nb de faces du dé en cours d'animation
  const [player,       setPlayer]       = useState('');

  // Seuls les dés custom sont passés à DiceCreator pour afficher les chips
  const customDice = allDice.filter((d) => d.custom);

  const reloadDice    = useCallback(() => fetchDice().then(setAllDice), []);
  const reloadHistory = useCallback(() => fetchHistory().then(setHistory), []);

  // Chargement initial des dés et de l'historique
  useEffect(() => {
    reloadDice();
    reloadHistory();
  }, [reloadDice, reloadHistory]);

  const handleAddDie = useCallback(async (label: string, faces: number) => {
    const err = await addDie(label, faces);
    if (!err) reloadDice(); // rafraîchit la liste uniquement si succès
    return err;
  }, [reloadDice]);

  const handleRemoveDie = useCallback(async (type: string) => {
    await removeDie(type);
    // Désélectionne le dé si c'est celui qu'on vient de supprimer
    setSelected((prev) => (prev === type ? null : prev));
    reloadDice();
  }, [reloadDice]);

  const handleRoll = useCallback(() => {
    if (!selected || isRolling) return;
    const die = allDice.find((d) => d.type === selected);
    if (!die) return;

    // Tirage immédiat, résultat affiché après l'animation
    const value = Math.floor(Math.random() * die.faces) + 1;
    setRollingFaces(die.faces);
    setIsRolling(true);

    // Après l'animation : affiche le résultat et sauvegarde
    setTimeout(async () => {
      setIsRolling(false);
      setLastRoll({ value, label: `${die.label} · ${die.faces} faces` });
      await saveRoll(die.type, die.label, value, player.trim() || 'Anonyme');
      reloadHistory();
    }, ROLL_DURATION);
  }, [selected, isRolling, allDice, player, reloadHistory]);

  return (
    <main className="app-main">
      <h1 className="app-title">Lancer de dés</h1>

      <div className="player-section">
        <div className="field-label">Joueur</div>
        <input
          type="text"
          placeholder="Ton prénom"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          maxLength={50}
          className="player-input"
        />
      </div>

      <DicePicker diceList={allDice} selected={selected} onSelect={setSelected} />

      <div className="dice-creator-wrapper">
        <DiceCreator customDice={customDice} onAdd={handleAddDie} onRemove={handleRemoveDie} />
      </div>

      <DiceResult value={lastRoll?.value ?? null} label={lastRoll?.label ?? null} />

      <div className="roll-row">
        <AnimatedDie faces={rollingFaces} isRolling={isRolling} value={lastRoll?.value ?? null} />
        <button className="roll-btn" onClick={handleRoll} disabled={!selected || isRolling}>
          {isRolling ? 'Lancer en cours…' : 'Lancer'}
        </button>
      </div>

      <RollHistory history={history} allDice={allDice} />
    </main>
  );
}
