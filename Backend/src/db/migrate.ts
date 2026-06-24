import { pool } from './client';

/**
 * Crée ou met à jour les tables de la base de données.
 *
 * Stratégie :
 * - Détecte si l'ancien schéma (sans colonne `custom`) est présent.
 * - Si oui, supprime les anciennes tables et les recrée proprement (migration destructive,
 *   acceptable en développement).
 * - Si le nouveau schéma est déjà en place, ne fait rien hormis insérer les données initiales.
 */
export async function migrate(): Promise<void> {

  // ── Détection de l'ancien schéma ──────────────────────────────────────────
  // On vérifie si la colonne `custom` existe dans la table dice.
  // Si elle n'existe pas → ancien schéma → on recrée tout.
  const { rows: cols } = await pool.query<{ column_name: string }>(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'dice'
      AND column_name  = 'custom'
  `);

  if (cols.length === 0) {
    console.log('[DB] Ancien schéma détecté — recréation des tables…');
    // Supprimer dans le bon ordre (rolls référence dice via FK dans l'ancien schéma)
    await pool.query(`DROP TABLE IF EXISTS rolls`);
    await pool.query(`DROP TABLE IF EXISTS dice`);
  }

  // ── Ajout de la colonne player si absente ─────────────────────────────────
  const { rows: playerCol } = await pool.query<{ column_name: string }>(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'rolls'
      AND column_name  = 'player'
  `);

  if (playerCol.length === 0) {
    // La table existe déjà mais sans la colonne player → on l'ajoute
    await pool.query(`
      ALTER TABLE rolls ADD COLUMN IF NOT EXISTS player VARCHAR(50) NOT NULL DEFAULT 'Anonyme'
    `).catch(() => null); // ignore si la table n'existe pas encore (sera créée après)
  }

  // ── TABLE dice ────────────────────────────────────────────────────────────
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dice (
      type   VARCHAR(50) PRIMARY KEY,
      label  VARCHAR(50) NOT NULL,
      faces  INTEGER     NOT NULL CHECK (faces >= 2),
      custom BOOLEAN     NOT NULL DEFAULT false
    )
  `);

  // Insérer les 3 dés de base (ignoré si déjà présents)
  await pool.query(`
    INSERT INTO dice (type, label, faces, custom) VALUES
      ('d6',  'D6',  6,  false),
      ('d12', 'D12', 12, false),
      ('d20', 'D20', 20, false)
    ON CONFLICT DO NOTHING
  `);

  // ── TABLE rolls ───────────────────────────────────────────────────────────
  // Pas de FK sur dice_type : les dés custom doivent pouvoir être supprimés
  // sans invalider l'historique des lancers.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rolls (
      id        UUID        PRIMARY KEY,
      dice_type VARCHAR(50) NOT NULL,
      label     VARCHAR(50) NOT NULL,
      value     INTEGER     NOT NULL CHECK (value >= 1),
      timestamp BIGINT      NOT NULL,
      player    VARCHAR(50) NOT NULL DEFAULT 'Anonyme'
    )
  `);

  console.log('[DB] Tables dice et rolls prêtes');
}
