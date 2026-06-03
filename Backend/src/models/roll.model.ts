// Correspond exactement au type RollEntry du frontend
export type DiceType = 'd6' | 'd12' | 'd20';

export interface RollEntry {
  id: string;
  type: DiceType;
  label: string;
  value: number;
  timestamp: number; // Date.now()
}
