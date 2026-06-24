export type DiceType = string;


export interface DiceConfig {
  type: DiceType;
  faces: number;
  label: string;
  custom: boolean;
}

// Représente un lancer enregistré en base de données
export interface RollEntry {
  id:        string;
  type:      DiceType;
  label:     string;
  value:     number;
  timestamp: number;
  player:    string;
}