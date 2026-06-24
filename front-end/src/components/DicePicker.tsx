import type { DiceConfig, DiceType } from '../types/dice';
import '../styles/DicePicker.css';

interface Props {
  diceList: DiceConfig[];
  selected: DiceType | null;
  onSelect: (type: DiceType) => void;
}

export function DicePicker({ diceList, selected, onSelect }: Props) {
  return (
    <div className="dice-picker">
      {diceList.map((die) => (
        <button
          key={die.type}
          onClick={() => onSelect(die.type)}
          aria-pressed={selected === die.type} // utilisé en CSS pour le style sélectionné
          className="dice-btn"
        >
          {die.label}
        </button>
      ))}
    </div>
  );
}
