/** Types de dés disponibles dans l'application */
export type DiceType = 'd6' | 'd12' | 'd20';

/**
 * Configuration d'un dé : son identifiant, son nombre de faces et son libellé affiché.
 */
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

/** Liste des dés disponibles, utilisée pour l'affichage et le calcul des lancers */
export const DICE_LIST: DiceConfig[] = [
  { type: 'd6',  faces: 6,  label: 'D6'  },
  { type: 'd12', faces: 12, label: 'D12' },
  { type: 'd20', faces: 20, label: 'D20' },
];