interface Props {
  value: number | null;
  label: string | null;
}

/**
 * Affiche le résultat du dernier lancer de dé en grand au centre de l'écran.
 * Affiche un tiret "—" tant qu'aucun lancer n'a été effectué.
 * Le libellé du dé (type + nombre de faces) s'affiche en dessous si disponible.
 */
export function DiceResult({ value, label }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      <div style={{ fontSize: 64, fontWeight: 500, lineHeight: 1 }}>
        {value ?? '—'}
      </div>
      {label && (
        <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
          {label}
        </div>
      )}
    </div>
  );
}