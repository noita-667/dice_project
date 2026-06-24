import { pool } from './client';

export async function migrate(): Promise<void> {
  const { rows: cols } = await pool.query<{ column_name: string }>(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'dice'
      AND column_name  = 'custom'
  `);

  if (cols.length === 0) {
    console.log('[DB] Ancien schéma détecté — recréation des tables…');
    await pool.query(`DROP TABLE IF EXISTS rolls`);
    await pool.query(`DROP TABLE IF EXISTS dice`);
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS dice (
      type   VARCHAR(50) PRIMARY KEY,
      label  VARCHAR(50) NOT NULL,
      faces  INTEGER     NOT NULL CHECK (faces >= 2),
      custom BOOLEAN     NOT NULL DEFAULT false
    )
  `);

  await pool.query(`
    INSERT INTO dice (type, label, faces, custom) VALUES
      ('d6',  'D6',  6,  false),
      ('d12', 'D12', 12, false),
      ('d20', 'D20', 20, false)
    ON CONFLICT DO NOTHING
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS rolls (
      id        UUID        PRIMARY KEY,
      dice_type VARCHAR(50) NOT NULL,
      label     VARCHAR(50) NOT NULL,
      value     INTEGER     NOT NULL CHECK (value >= 1),
      timestamp BIGINT      NOT NULL
    )
  `);

  console.log('[DB] Tables dice et rolls prêtes');
}
