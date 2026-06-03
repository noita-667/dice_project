import { useState } from 'react';
import type { DiceConfig } from '../types/dice';

interface Props {
  customDice: DiceConfig[];
  /**
   * Callback de création.
   * Retourne null si succès, ou un message d'erreur string si le serveur a refusé.
   */
  onAdd: (label: string, faces: number) => Promise<string | null>;
  onRemove: (type: string) => void;
}

export function DiceCreator({ customDice, onAdd, onRemove }: Props) {
  const [faces, setFaces]       = useState('');
  const [label, setLabel]       = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleAdd = async () => {
    const n = parseInt(faces, 10);
    if (!n || n < 2 || n > 10_000) {
      setError('Le nombre de faces doit être entre 2 et 10 000');
      return;
    }

    setError('');
    setLoading(true);

    // onAdd retourne null si succès, ou un message d'erreur si échec
    const err = await onAdd(label.trim() || `D${n}`, n);

    setLoading(false);

    if (err) {
      // Affiche l'erreur renvoyée par le serveur/réseau
      setError(err);
    } else {
      // Succès : vider les champs
      setFaces('');
      setLabel('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888', marginBottom: 8 }}>
        Créer un dé
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        <input
          type="number"
          min={2}
          max={10000}
          placeholder="Faces"
          value={faces}
          disabled={loading}
          onChange={(e) => { setFaces(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          style={{
            width: 72,
            padding: '0.5rem 0.4rem',
            borderRadius: 8,
            border: error ? '1.5px solid #e55' : '1.5px solid #ccc',
            fontSize: 14,
            outline: 'none',
            opacity: loading ? 0.6 : 1,
          }}
        />
        <input
          type="text"
          placeholder="Nom (ex: D100)"
          value={label}
          disabled={loading}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: 8,
            border: '1.5px solid #ccc',
            fontSize: 14,
            outline: 'none',
            opacity: loading ? 0.6 : 1,
          }}
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: '1.5px solid #378ADD',
            background: loading ? '#f0f0f0' : '#E6F1FB',
            color: loading ? '#aaa' : '#1a6ab5',
            fontSize: 13,
            cursor: loading ? 'default' : 'pointer',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? '…' : '+ Ajouter'}
        </button>
      </div>

      {/* Message d'erreur (validation locale ou erreur serveur) */}
      {error && (
        <p style={{ fontSize: 12, color: '#e55', margin: '4px 0 0' }}>{error}</p>
      )}

      {/* Chips des dés custom existants */}
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
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: 16, lineHeight: 1, padding: '0 0 0 2px' }}
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
