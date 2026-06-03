import { useState } from 'react';
import type { DiceConfig } from '../types/dice';

/** Props du composant DiceCreator */
interface Props {
  customDice: DiceConfig[];
  onAdd: (die: DiceConfig) => void;
  onRemove: (type: string) => void;
}

/**
 * Formulaire permettant à l'utilisateur de créer un dé avec un nombre de faces personnalisé.
 *
 * Fonctionnalités :
 * - Saisie du nombre de faces (min 2, max 10 000)
 * - Nom optionnel (auto-généré "DN" si vide)
 * - Validation avec message d'erreur inline
 * - Soumission via bouton ou touche Entrée
 * - Affichage des dés créés avec bouton de suppression
 */
export function DiceCreator({ customDice, onAdd, onRemove }: Props) {
  const [faces, setFaces] = useState('');
  const [label, setLabel] = useState('');
  const [error, setError] = useState('');

  /** Valide les champs et ajoute le dé à la liste si valide */
  const handleAdd = () => {
    const n = parseInt(faces, 10);
    if (!n || n < 2 || n > 10_000) {
      setError('Le nombre de faces doit être entre 2 et 10 000');
      return;
    }
    setError('');
    onAdd({
      type: `custom-${Date.now()}`,
      faces: n,
      label: label.trim() || `D${n}`,
    });
    setFaces('');
    setLabel('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', marginBottom: 8 }}>
        Créer un dé
      </div>

      {/* Ligne de saisie : faces + nom + bouton ajouter */}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="number"
          min={2}
          max={10000}
          placeholder="Faces"
          value={faces}
          onChange={(e) => { setFaces(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          style={{
            width: 72,
            padding: '0.5rem 0.4rem',
            borderRadius: 8,
            border: error ? '1.5px solid #e55' : '1.5px solid #ccc',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Nom (ex: D100)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: 8,
            border: '1.5px solid #ccc',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1.5px solid #378ADD',
            background: '#E6F1FB',
            color: '#1a6ab5',
            fontSize: 13,
            cursor: 'pointer',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          + Ajouter
        </button>
      </div>

      {error && (
        <p style={{ fontSize: 12, color: '#e55', margin: '4px 0 0' }}>{error}</p>
      )}

      {customDice.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {customDice.map((die) => (
            <div
              key={die.type}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '3px 8px 3px 12px',
                borderRadius: 20,
                border: '1.5px solid #ddd',
                fontSize: 13,
                background: '#fafafa',
              }}
            >
              <span style={{ fontWeight: 500 }}>{die.label}</span>
              <span style={{ color: '#bbb', fontSize: 11 }}>{die.faces}f</span>
              <button
                onClick={() => onRemove(die.type)}
                aria-label={`Supprimer ${die.label}`}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#bbb',
                  fontSize: 16,
                  lineHeight: 1,
                  padding: '0 0 0 2px',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
