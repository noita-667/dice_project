export type DiceType = string;

export interface RollEntry {
  id:        string;
  type:      DiceType;
  label:     string;
  value:     number;
  timestamp: number; // Date.now() en ms
  player:    string;
}
