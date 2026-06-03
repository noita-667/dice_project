import { useEffect, useState, useRef } from 'react';

interface Props {
  faces: number;
  isRolling: boolean;
  value: number | null;
}

/**
 * Petit dé visuel qui s'anime lors d'un lancer.
 *
 * Comportement :
 * - Pendant `isRolling = true` : fait défiler des valeurs aléatoires rapidement
 *   avec une animation CSS de secousse (classe `.die-rolling` définie dans App.tsx).
 * - Quand `isRolling = false` : affiche la valeur finale ou '?' si aucun lancer.
 */
export function AnimatedDie({ faces, isRolling, value }: Props) {
  const [display, setDisplay] = useState<number | null>(value);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (isRolling) {
      timerRef.current = setInterval(() => {
        setDisplay(Math.floor(Math.random() * faces) + 1);
      }, 60);
    } else {
      setDisplay(value);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRolling, value, faces]);

  return (
    <div
      className={isRolling ? 'die-rolling' : ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        borderRadius: 10,
        border: `2px solid ${isRolling || value !== null ? '#378ADD' : '#ccc'}`,
        background: isRolling ? '#ddeeff' : value !== null ? '#f0f7ff' : '#fafafa',
        fontSize: 18,
        fontWeight: 700,
        transition: 'border-color 0.2s, background 0.2s',
        userSelect: 'none',
        flexShrink: 0,
        cursor: 'default',
      }}
    >
      {display ?? '?'}
    </div>
  );
}
