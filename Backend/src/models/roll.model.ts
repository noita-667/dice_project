export type DiceType = string;

export interface RollEntry {
  id:        string;
  type:      DiceType;
  label:     string;
  value:     number;
<<<<<<< HEAD
  timestamp: number; // Date.now() en ms
  player:    string;
=======
  timestamp: number;
>>>>>>> 19c4d1f79ae4ddde0e4bd7ff905725307e455491
}
