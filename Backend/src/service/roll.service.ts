import { v4 as uuidv4 } from 'uuid';
import { DiceType, RollEntry } from '../model/roll.model';

const VALID_TYPES: DiceType[] = ['d6', 'd12', 'd20'];

// Store in-memory
const rolls: RollEntry[] = [];

export function isValidType(value: unknown): value is DiceType {
  return VALID_TYPES.includes(value as DiceType);
}

export function getHistory(): RollEntry[] {
  return [...rolls].reverse(); // plus récent en premier
}

export function saveRoll(type: DiceType, label: string, value: number): RollEntry {
  const entry: RollEntry = {
    id: uuidv4(),
    type,
    label,
    value,
    timestamp: Date.now(),
  };
  rolls.push(entry);
  return entry;
}