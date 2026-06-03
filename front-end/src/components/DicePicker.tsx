import type { DiceConfig, DiceType } from '../types/dice';

interface Props {
  diceList: DiceConfig[];
  selected: DiceType | null;
  onSelect: (type: DiceType) => void;
}

/**
 * Affiche une grille de boutons permettant de sélectionner un dé.
 * Le dé sélectionné est mis en évidence visuellement (bordure bleue + fond clair).
 * L'attribut aria-pressed indique l'état de sélection pour l'accessibilité.
 */
export function DicePicker({ diceList, selected, onSelect }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
      {diceList.map((die) => (
        <button
          key={die.type}
          onClick={() => onSelect(die.type)}
          aria-pressed={selected === die.type}
          style={{
            padding: '1rem 0.5rem',
            borderRadius: 12,
            border: selected === die.type ? '2px solid #378ADD' : '1.5px solid #ccc',
            background: selected === die.type ? '#E6F1FB' : 'transparent',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 15,
          }}
        >
          {die.label}
        </button>
      ))}
    </div>
  );
}