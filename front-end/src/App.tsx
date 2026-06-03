import { useState, useEffect, useCallback } from 'react';
import { DICE_LIST } from './types/dice';
import type { DiceConfig, DiceType, RollEntry } from './types/dice';
import { DicePicker } from './components/DicePicker';
import { DiceResult } from './components/DiceResult';
import { RollHistory } from './components/RollHistory';
import { DiceCreator } from './components/DiceCreator';
import { AnimatedDie } from './components/AnimatedDie';

const API_URL = 'http://localhost:3000';

const ROLL_ANIMATION_DURATION = 800;

/**
 * Styles CSS globaux injectés dans <head> pour l'animation du dé.
 * Définis ici pour rester colocalisés avec la logique de lancer.
 */
const ANIMATION_STYLES = `
  @keyframes diceShake {
    0%   { transform: rotate(0deg)   scale(1);    }
    20%  { transform: rotate(-18deg) scale(1.15); }
    40%  { transform: rotate(18deg)  scale(1.15); }
    60%  { transform: rotate(-12deg) scale(1.08); }
    80%  { transform: rotate(12deg)  scale(1.08); }
    100% { transform: rotate(0deg)   scale(1);    }
  }
  .die-rolling {
    animation: diceShake 0.25s ease-in-out infinite;
  }
`;

/**
 * Composant racine de l'application.
 *
 * Gère :
 * - la sélection du dé (dés de base + dés personnalisés)
 * - la création et suppression de dés personnalisés
 * - l'animation de lancer (isRolling)
 * - l'enregistrement du résultat via l'API
 * - l'affichage de l'historique des lancers
 */
export default function App() {
  const [selected, setSelected] = useState<DiceType | null>(null);
  const [customDice, setCustomDice] = useState<DiceConfig[]>([]);
  const [lastRoll, setLastRoll] = useState<{ value: number; label: string } | null>(null);
  const [history, setHistory] = useState<RollEntry[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [rollingFaces, setRollingFaces] = useState(6);

  /** Liste combinée : dés de base + dés personnalisés */
  const allDice = [...DICE_LIST, ...customDice];

  /**
   * Récupère l'historique depuis l'API et met à jour l'état.
   * Mémorisé car utilisé dans plusieurs endroits.
   */
  const fetchHistory = useCallback(async () => {
    const res = await fetch(`${API_URL}/rolls`);
    const data = await res.json();
    setHistory(data);
  }, []);

  // Chargement initial de l'historique au montage
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  /** Ajoute un dé personnalisé à la liste */
  const handleAddDie = useCallback((die: DiceConfig) => {
    setCustomDice((prev) => [...prev, die]);
  }, []);

  /**
   * Supprime un dé personnalisé.
   * Si ce dé était sélectionné, réinitialise la sélection.
   */
  const handleRemoveDie = useCallback((type: string) => {
    setCustomDice((prev) => prev.filter((d) => d.type !== type));
    setSelected((prev) => (prev === type ? null : prev));
  }, []);

  /**
   * Effectue un lancer de dé :
   * 1. Déclenche l'animation (isRolling = true)
   * 2. Génère la valeur aléatoire immédiatement
   * 3. Après ROLL_ANIMATION_DURATION ms, arrête l'animation, affiche le résultat
   *    et l'enregistre via l'API
   */
  const handleRoll = useCallback(() => {
    if (!selected || isRolling) return;

    const allDiceLocal = [...DICE_LIST, ...customDice];
    const die = allDiceLocal.find((d) => d.type === selected);
    if (!die) return;

    const value = Math.floor(Math.random() * die.faces) + 1;

    // Démarrer l'animation
    setRollingFaces(die.faces);
    setIsRolling(true);

    setTimeout(() => {
      setIsRolling(false);
      setLastRoll({ value, label: `${die.label} · ${die.faces} faces` });

      fetch(`${API_URL}/rolls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: die.type, label: die.label, value }),
      }).then(() => fetchHistory());
    }, ROLL_ANIMATION_DURATION);
  }, [selected, isRolling, customDice, fetchHistory]);

  return (
    <>
      {/* Injection des keyframes CSS pour l'animation du dé */}
      <style>{ANIMATION_STYLES}</style>

      <main style={{ maxWidth: 400, margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 16, fontWeight: 500, marginBottom: '1.5rem' }}>Lancer de dés</h1>

        {/* Sélecteur de dé (dés de base + personnalisés) */}
        <DicePicker diceList={allDice} selected={selected} onSelect={setSelected} />

        {/* Séparateur visuel */}
        <div style={{ margin: '1.25rem 0 0' }}>
          {/* Formulaire de création de dé personnalisé */}
          <DiceCreator customDice={customDice} onAdd={handleAddDie} onRemove={handleRemoveDie} />
        </div>

        {/* Affichage en grand du dernier résultat (mis à jour après l'animation) */}
        <DiceResult value={lastRoll?.value ?? null} label={lastRoll?.label ?? null} />

        {/* Ligne d'action : petit dé animé + bouton lancer */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: '1.5rem' }}>
          {/* Petit dé qui s'anime pendant le lancer */}
          <AnimatedDie
            faces={rollingFaces}
            isRolling={isRolling}
            value={lastRoll?.value ?? null}
          />
          {/* Bouton désactivé pendant l'animation ou si aucun dé n'est sélectionné */}
          <button
            onClick={handleRoll}
            disabled={!selected || isRolling}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: 15,
              cursor: selected && !isRolling ? 'pointer' : 'default',
              borderRadius: 8,
              border: '1.5px solid #ccc',
              background: 'transparent',
            }}
          >
            {isRolling ? 'Lancer en cours…' : 'Lancer'}
          </button>
        </div>

        {/* Historique de tous les lancers */}
        <RollHistory history={history} />
      </main>
    </>
  );
}
