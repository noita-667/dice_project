export type DiceType = 'd6' | 'd12' | 'd20';

export interface DiceConfig {
  type: DiceType;
  faces: number;
  label: string;
}

export interface RollEntry {
  id: string;
  type: DiceType;
  label: string;
  value: number;
  timestamp: number;
}

export const DICE_LIST: DiceConfig[] = [
  { type: 'd6',  faces: 6,  label: 'D6'  },
  { type: 'd12', faces: 12, label: 'D12' },
  { type: 'd20', faces: 20, label: 'D20' },
];