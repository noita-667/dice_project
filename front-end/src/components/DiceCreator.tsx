import { useState } from 'react';
import type { DiceConfig } from '../types/dice';
import '../styles/DiceCreator.css';

interface Props {
  customDice: DiceConfig[];
  onAdd: (label: string, faces: number) => Promise<string | null>;
  onRemove: (type: string) => void;
}

export function DiceCreator({ customDice, onAdd, onRemove }: Props) {
  const [faces,   setFaces]   = useState('');
  const [label,   setLabel]   = useState('');
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const n = parseInt(faces, 10);
    // Validation locale avant d'appeler l'API
    if (!n || n < 2 || n > 10_000) {
      setError('Le nombre de faces doit être entre 2 et 10 000');
      return;
    }
    setError('');
    setLoading(true);
    const err = await onAdd(label.trim() || `D${n}`, n); // nom par défaut si champ vide
    setLoading(false);
    if (err) setError(err);
    else { setFaces(''); setLabel(''); } // réinitialise les champs après succès
  };

  // Permet de valider avec la touche Entrée
  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter') handleAdd(); };

  return (
    <div className="dice-creator">
      <div className="field-label">Créer un dé</div>

      <div className="dice-creator__row">
        <input
          type="number" min={2} max={10000} placeholder="Faces"
          value={faces} disabled={loading}
          onChange={(e) => { setFaces(e.target.value); setError(''); }}
          onKeyDown={onKey}
          className={`dice-creator__input-faces${error ? ' error' : ''}`}
        />
        <input
          type="text" placeholder="Nom (ex: D100)"
          value={label} disabled={loading}
          onChange={(e) => setLabel(e.target.value)} onKeyDown={onKey}
          className="dice-creator__input-label"
        />
        <button onClick={handleAdd} disabled={loading} className="dice-creator__btn-add">
          {loading ? '…' : '+ Ajouter'}
        </button>
      </div>

      {error && <p className="dice-creator__error">{error}</p>}

      {customDice.length > 0 && (
        <div className="dice-creator__chips">
          {customDice.map((die) => (
            <div key={die.type} className="dice-creator__chip">
              <span className="dice-creator__chip-name">{die.label}</span>
              <span className="dice-creator__chip-faces">{die.faces}f</span>
              <button onClick={() => onRemove(die.type)} aria-label={`Supprimer ${die.label}`} className="dice-creator__chip-remove">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
