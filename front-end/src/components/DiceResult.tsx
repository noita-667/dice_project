import '../styles/DiceResult.css';

interface Props {
  value: number | null;
  label: string | null;
}

export function DiceResult({ value, label }: Props) {
  return (
    <div className="dice-result">
      {/* Affiche '—' tant qu'aucun lancer n'a été effectué */}
      <div className="dice-result__value">{value ?? '—'}</div>
      {label && <div className="dice-result__label">{label}</div>}
    </div>
  );
}
