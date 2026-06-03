import type { RollEntry } from '../types/dice';

/** Props du composant RollHistory */
interface Props {
  history: RollEntry[];
}


function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Affiche la liste de tous les lancers passés.
 * Chaque entrée montre le type de dé, la valeur obtenue et l'heure du lancer.
 * Affiche un message vide si aucun lancer n'a encore été enregistré.
 */
export function RollHistory({ history }: Props) {
  if (history.length === 0) {
    return <p style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>Aucun lancer</p>;
  }

  return (
    <div>
      {/* En-tête de section "HISTORIQUE" */}
      <div style={{ marginBottom: 8, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>
        Historique
      </div>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {history.map((entry) => (
          <li key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', border: '0.5px solid #eee', borderRadius: 8, fontSize: 14 }}>
            <span style={{ fontWeight: 500 }}>{entry.label}</span>
            <span style={{ fontWeight: 500 }}>{entry.value}</span>
            <span style={{ color: '#aaa' }}>{formatTime(entry.timestamp)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}