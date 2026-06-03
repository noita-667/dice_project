import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db/client';
import { DiceType, RollEntry } from '../models/roll.model';

const VALID_TYPES: DiceType[] = ['d6', 'd12', 'd20'];

export function isValidType(value: unknown): value is DiceType {
  return VALID_TYPES.includes(value as DiceType);
}

export async function getHistory(): Promise<RollEntry[]> {
  const { rows } = await pool.query<RollEntry>(
    'SELECT id, dice_type AS type, label, value, timestamp FROM rolls ORDER BY timestamp DESC'
  );
  return rows;
}

export async function saveRoll(type: DiceType, label: string, value: number): Promise<RollEntry> {
  const entry: RollEntry = {
    id: uuidv4(),
    type,
    label,
    value,
    timestamp: Date.now(),
  };

  await pool.query(
    'INSERT INTO rolls (id, dice_type, label, value, timestamp) VALUES ($1, $2, $3, $4, $5)',
    [entry.id, entry.type, entry.label, entry.value, entry.timestamp]
  );

  return entry;
}
