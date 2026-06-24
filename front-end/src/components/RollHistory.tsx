import type { DiceConfig, RollEntry } from '../types/dice';

interface Props {
  history: RollEntry[];
  allDice: DiceConfig[];
}

/** Formate un timestamp */
function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}


function getValueColor(value: number, faces: number): string {
  if (faces <= 0) return 'transparent';
  const ratio = value / faces;
  if (ratio >= 0.85) return '#e6f7ee';
  if (ratio <= 0.20) return '#fdecea';
  return 'transparent';
}

// Calcule quelques statistiques sur l'historique complet
function computeStats(history: RollEntry[]) {
  if (history.length === 0) return null;
  const values    = history.map((e) => e.value);
  const best      = Math.max(...values);
  const avg       = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);

  // Compter les lancers par type de dé
  const perType: Record<string, number> = {};
  for (const e of history) {
    perType[e.type] = (perType[e.type] ?? 0) + 1;
  }
  const favoriteType = Object.entries(perType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return { best, avg, favoriteType, total: history.length };
}

export function RollHistory({ history, allDice }: Props) {
  const stats = computeStats(history);

  // Index des dés par type 
  const diceByType = Object.fromEntries(allDice.map((d) => [d.type, d]));

  return (
    <div>
      {/* ── En-tête ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>
          Historique
        </span>
        {history.length > 0 && (
          <span style={{ fontSize: 12, color: '#aaa' }}>
            {history.length} lancer{history.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* ── Statistiques ── */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
          {[
            { label: 'Meilleur',  value: stats.best },
            { label: 'Moyenne',   value: stats.avg },
            { label: 'Dé favori', value: diceByType[stats.favoriteType]?.label ?? stats.favoriteType },
          ].map(({ label, value }) => (
            <div key={label} style={{
              textAlign: 'center',
              padding: '8px 4px',
              borderRadius: 8,
              border: '0.5px solid #eee',
              background: '#fafafa',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Liste ── */}
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🎲</div>
          <p style={{ fontSize: 13, color: '#bbb', margin: 0 }}>Aucun lancer pour l'instant</p>
        </div>
      ) : (
        <ul style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          maxHeight: 320,
          overflowY: 'auto',
          paddingRight: 2,
        }}>
          {history.map((entry, i) => {
            // Retrouver le dé par type pour obtenir le nombre de faces réel
            const die     = diceByType[entry.type];
            const faces   = die?.faces ?? 0;
            const bgColor = getValueColor(entry.value, faces);
            const isFirst = i === 0;

            return (
              <li
                key={entry.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 10px',
                  borderRadius: 8,
                  border: isFirst ? '1px solid #c5ddf7' : '0.5px solid #eee',
                  background: isFirst ? '#EBF4FD' : bgColor,
                  fontSize: 13,
                }}
              >
                {/* Libellé du dé + joueur */}
                <span style={{ fontWeight: isFirst ? 600 : 400, color: isFirst ? '#1a6ab5' : '#333' }}>
                  {entry.label}
                  <span style={{ fontWeight: 400, color: '#aaa', marginLeft: 5, fontSize: 11 }}>
                    {entry.player ?? 'Anonyme'}
                  </span>
                </span>
                {/* Valeur obtenue */}
                <span style={{
                  fontWeight: 700,
                  fontSize: isFirst ? 16 : 14,
                  color: isFirst ? '#1a6ab5' : '#222',
                  minWidth: 28,
                  textAlign: 'right',
                }}>
                  {entry.value}
                </span>
                {/* Heure */}
                <span style={{ color: '#bbb', fontSize: 11, minWidth: 56, textAlign: 'right' }}>
                  {formatTime(entry.timestamp)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
