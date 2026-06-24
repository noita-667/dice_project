import type { DiceConfig, RollEntry } from '../types/dice';
import '../styles/RollHistory.css';

interface Props {
  history: RollEntry[];
  allDice: DiceConfig[];
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// Vert si >= 85%, rouge si <= 20%, transparent sinon
function valueColor(value: number, faces: number) {
  if (faces <= 0) return undefined;
  const r = value / faces;
  if (r >= 0.85) return '#e6f7ee';
  if (r <= 0.20) return '#fdecea';
  return undefined;
}

function stats(history: RollEntry[]) {
  if (!history.length) return null;
  const values = history.map((e) => e.value);
  // Compte le nombre de lancers par type de dé pour trouver le favori
  const perType: Record<string, number> = {};
  for (const e of history) perType[e.type] = (perType[e.type] ?? 0) + 1;
  const favoriteType = Object.entries(perType).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  return {
    best: Math.max(...values),
    avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
    favoriteType,
  };
}

export function RollHistory({ history, allDice }: Props) {
  const s = stats(history);
  // Index pour retrouver le nb de faces par type en O(1) — nécessaire pour valueColor
  const diceByType = Object.fromEntries(allDice.map((d) => [d.type, d]));

  return (
    <div>
      <div className="history__header">
        <span className="history__title">Historique</span>
        {history.length > 0 && (
          <span className="history__count">{history.length} lancer{history.length > 1 ? 's' : ''}</span>
        )}
      </div>

      {s && (
        <div className="history__stats">
          {[
            { label: 'Meilleur',  value: s.best },
            { label: 'Moyenne',   value: s.avg },
            { label: 'Dé favori', value: diceByType[s.favoriteType]?.label ?? s.favoriteType },
          ].map(({ label, value }) => (
            <div key={label} className="stat-card">
              <div className="stat-card__value">{value}</div>
              <div className="stat-card__label">{label}</div>
            </div>
          ))}
        </div>
      )}

      {history.length === 0 ? (
        <div className="history__empty">
          <div className="history__empty-icon">🎲</div>
          <p className="history__empty-text">Aucun lancer pour l'instant</p>
        </div>
      ) : (
        <ul className="history__list">
          {history.map((entry, i) => {
            const faces   = diceByType[entry.type]?.faces ?? 0;
            const isFirst = i === 0; // le premier = le plus récent
            const bg      = isFirst ? undefined : valueColor(entry.value, faces); // pas de couleur sur le premier (déjà en bleu)
            return (
              <li
                key={entry.id}
                className={`history__item${isFirst ? ' history__item--first' : ''}`}
                style={bg ? { background: bg } : undefined}
              >
                <span className="history__item-name">
                  {entry.label}
                  <span className="history__item-player">{entry.player ?? 'Anonyme'}</span>
                </span>
                <span className="history__item-value">{entry.value}</span>
                <span className="history__item-time">{formatTime(entry.timestamp)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
