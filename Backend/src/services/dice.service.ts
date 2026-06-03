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
