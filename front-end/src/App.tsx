import { useState, useEffect, useCallback } from 'react';
import type { DiceConfig, DiceType, RollEntry } from './types/dice';
import { DicePicker } from './components/DicePicker';
import { DiceResult } from './components/DiceResult';
import { RollHistory } from './components/RollHistory';
import { DiceCreator } from './components/DiceCreator';
import { AnimatedDie } from './components/AnimatedDie';

/** URL de base de l'API back-end */
const API_URL = 'http://localhost:3000';

/** Durée de l'animation de lancer en ms avant d'afficher le résultat final */
const ROLL_ANIMATION_DURATION = 800;

/**
 * Dés de base affichés en fallback si l'API est indisponible.
 * Correspond aux données seedées par la migration côté back-end.
 */
const DEFAULT_DICE: DiceConfig[] = [
  { type: 'd6',  faces: 6,  label: 'D6',  custom: false },
  { type: 'd12', faces: 12, label: 'D12', custom: false },
  { type: 'd20', faces: 20, label: 'D20', custom: false },
];

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
 * - la liste complète des dés (chargée depuis GET /dice, avec fallback hardcodé)
 * - la création de dés custom (POST /dice) et leur suppression (DELETE /dice/:type)
 * - la sélection du dé actif
 * - l'animation de lancer (isRolling)
 * - l'enregistrement du résultat via POST /rolls
 * - l'affichage de l'historique via GET /rolls
 */
export default function App() {
  /** Dé actuellement sélectionné (null = aucun) */
  const [selected, setSelected] = useState<DiceType | null>(null);
  /**
   * Liste complète des dés (base + custom).
   * Initialisée avec DEFAULT_DICE pour que les dés de base s'affichent
   * immédiatement, même avant la réponse de l'API.
   */
  const [allDice, setAllDice] = useState<DiceConfig[]>(DEFAULT_DICE);
  /** Résultat du dernier lancer terminé */
  const [lastRoll, setLastRoll] = useState<{ value: number; label: string } | null>(null);
  /** Historique des lancers récupéré depuis l'API */
  const [history, setHistory] = useState<RollEntry[]>([]);
  /** true pendant la durée de l'animation de lancer */
  const [isRolling, setIsRolling] = useState(false);
  /** Nombre de faces du dé en cours de lancer (pour le cycling de l'AnimatedDie) */
  const [rollingFaces, setRollingFaces] = useState(6);

  /** Dés créés par l'utilisateur (filtrés depuis allDice) */
  const customDice = allDice.filter((d) => d.custom);

  /**
   * Charge la liste des dés depuis GET /dice.
   * En cas d'erreur (back-end indisponible), conserve le fallback DEFAULT_DICE.
   */
  const fetchDice = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/dice`);
      if (!res.ok) throw new Error(`GET /dice → ${res.status}`);
      const data: DiceConfig[] = await res.json();
      setAllDice(data);
    } catch (err) {
      console.warn('[App] Impossible de charger les dés depuis l\'API, fallback sur la liste locale.', err);
      // On conserve l'état actuel (DEFAULT_DICE au démarrage)
    }
  }, []);

  /**
   * Récupère l'historique des lancers depuis GET /rolls.
   * En cas d'erreur, laisse l'historique vide (aucun crash).
   */
  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/rolls`);
      if (!res.ok) throw new Error(`GET /rolls → ${res.status}`);
      const data: RollEntry[] = await res.json();
      setHistory(data);
    } catch (err) {
      console.warn('[App] Impossible de charger l\'historique.', err);
    }
  }, []);

  // Chargement initial au montage
  useEffect(() => {
    fetchDice();
    fetchHistory();
  }, [fetchDice, fetchHistory]);

  /**
   * Crée un dé personnalisé via POST /dice, puis rafraîchit la liste.
   * Le type unique est généré côté serveur.
   *
   * @returns null si succès, message d'erreur string si échec
   */
  const handleAddDie = useCallback(async (label: string, faces: number): Promise<string | null> => {
    try {
      const res = await fetch(`${API_URL}/dice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, faces }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        console.error('[App] Échec création dé :', res.status, body);
        return `Erreur serveur (${res.status})`;
      }
      await fetchDice();
      return null;
    } catch {
      return 'Serveur inaccessible — vérifiez que le back-end tourne.';
    }
  }, [fetchDice]);

  /**
   * Supprime un dé custom via DELETE /dice/:type, puis rafraîchit la liste.
   * Réinitialise la sélection si le dé supprimé était sélectionné.
   */
  const handleRemoveDie = useCallback(async (type: string) => {
    try {
      await fetch(`${API_URL}/dice/${type}`, { method: 'DELETE' });
    } catch (err) {
      console.error('[App] Erreur lors de la suppression du dé.', err);
    }
    setSelected((prev) => (prev === type ? null : prev));
    fetchDice();
  }, [fetchDice]);

  /**
   * Effectue un lancer de dé :
   * 1. Déclenche l'animation (isRolling = true)
   * 2. Génère la valeur aléatoire immédiatement
   * 3. Après ROLL_ANIMATION_DURATION ms, arrête l'animation, affiche le résultat
   *    et l'enregistre via POST /rolls
   */
  const handleRoll = useCallback(() => {
    if (!selected || isRolling) return;
    const die = allDice.find((d) => d.type === selected);
    if (!die) return;

    // Tirage aléatoire uniforme entre 1 et die.faces (inclus)
    const value = Math.floor(Math.random() * die.faces) + 1;

    setRollingFaces(die.faces);
    setIsRolling(true);

    // Après l'animation : afficher le résultat et sauvegarder
    setTimeout(() => {
      setIsRolling(false);
      setLastRoll({ value, label: `${die.label} · ${die.faces} faces` });

      // On rafraîchit l'historique dans tous les cas (succès ou échec du POST)
      fetch(`${API_URL}/rolls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: die.type, label: die.label, value }),
      })
        .catch((err) => console.warn('[App] Impossible de sauvegarder le lancer.', err))
        .finally(() => fetchHistory());
    }, ROLL_ANIMATION_DURATION);
  }, [selected, isRolling, allDice, fetchHistory]);

  return (
    <>
      {/* Keyframes CSS pour l'animation de secousse du dé */}
      <style>{ANIMATION_STYLES}</style>

      <main style={{ maxWidth: 400, margin: '2rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 16, fontWeight: 500, marginBottom: '1.5rem' }}>Lancer de dés</h1>

        {/* Sélecteur de dé : affiche tous les dés (base + custom) */}
        <DicePicker diceList={allDice} selected={selected} onSelect={setSelected} />

        {/* Formulaire de création de dé personnalisé */}
        <div style={{ margin: '1.25rem 0 0' }}>
          <DiceCreator customDice={customDice} onAdd={handleAddDie} onRemove={handleRemoveDie} />
        </div>

        {/* Grand affichage du dernier résultat (mis à jour après animation) */}
        <DiceResult value={lastRoll?.value ?? null} label={lastRoll?.label ?? null} />

        {/* Ligne d'action : petit dé animé + bouton lancer */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: '1.5rem' }}>
          {/* Petit dé qui s'anime pendant le lancer */}
          <AnimatedDie
            faces={rollingFaces}
            isRolling={isRolling}
            value={lastRoll?.value ?? null}
          />
          {/* Bouton désactivé pendant l'animation ou sans sélection */}
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

        {/* Historique des lancers (allDice passé pour calculer les couleurs par nb de faces) */}
        <RollHistory history={history} allDice={allDice} />
      </main>
    </>
  );
}
