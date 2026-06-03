import { pool } from './client';

export async function migrate(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dice (
      type   VARCHAR(4)  PRIMARY KEY CHECK (type IN ('d6', 'd12', 'd20')),
      label  VARCHAR(10) NOT NULL,
      faces  INTEGER     NOT NULL CHECK (faces > 0)
    );

    INSERT INTO dice (type, label, faces) VALUES
      ('d6',  'D6',  6),
      ('d12', 'D12', 12),
      ('d20', 'D20', 20)
    ON CONFLICT DO NOTHING;

    CREATE TABLE IF NOT EXISTS rolls (
      id        UUID        PRIMARY KEY,
      dice_type VARCHAR(4)  NOT NULL REFERENCES dice(type),
      label     VARCHAR(10) NOT NULL,
      value     INTEGER     NOT NULL CHECK (value >= 1),
      timestamp BIGINT      NOT NULL
    );
  `);
  console.log('[DB] Tables dice et rolls prêtes');
}
