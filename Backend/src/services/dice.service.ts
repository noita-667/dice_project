import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db/client';
import { Dice } from '../models/dice.model';

export async function getAllDice(): Promise<Dice[]> {
  const { rows } = await pool.query<Dice>('SELECT * FROM dice ORDER BY faces ASC');
  return rows;
}


export async function getDiceByType(type: string): Promise<Dice | null> {
  const { rows } = await pool.query<Dice>('SELECT * FROM dice WHERE type = $1', [type]);
  return rows[0] ?? null;
}


export async function createDice(label: string, faces: number): Promise<Dice> {
  const type = `custom-${uuidv4().slice(0, 8)}`;

  const { rows } = await pool.query<Dice>(
    'INSERT INTO dice (type, label, faces, custom) VALUES ($1, $2, $3, true) RETURNING *',
    [type, label, faces]
  );
  return rows[0];
}


export async function deleteDice(type: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    'DELETE FROM dice WHERE type = $1 AND custom = true',
    [type]
  );
  return (rowCount ?? 0) > 0;
}
