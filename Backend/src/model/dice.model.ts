export const VALID_FACES = [6, 12, 20] as const;
export type DiceFaces = (typeof VALID_FACES)[number]; // 6 | 12 | 20

export interface DiceRoll {
  dice: DiceFaces;
  result: number;
  min: number;
  max: number;
  rolledAt: string;
}