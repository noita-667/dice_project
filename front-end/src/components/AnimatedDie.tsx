import { useEffect, useState, useRef } from 'react';
import '../styles/AnimatedDie.css';

interface Props {
  faces: number;
  isRolling: boolean;
  value: number | null;
}

export function AnimatedDie({ faces, isRolling, value }: Props) {
  const [display, setDisplay] = useState<number | null>(value);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Démarre/arrête le cycling de chiffres selon isRolling
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (isRolling) {
      timerRef.current = setInterval(
        () => setDisplay(Math.floor(Math.random() * faces) + 1),
        60
      );
    } else {
      setDisplay(value);
    }

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRolling, value, faces]);

  const cls = [
    'animated-die',
    isRolling ? 'animated-die--rolling die-rolling' : '',
    !isRolling && value !== null ? 'animated-die--active' : '',
  ].filter(Boolean).join(' ');

  return <div className={cls}>{display ?? '?'}</div>;
}
