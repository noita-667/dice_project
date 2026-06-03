/**
 * Identifiant d'un dé.
 * Les dés de base utilisent 'd6', 'd12', 'd20'.
 * Les dés personnalisés utilisent un identifiant généré côté serveur (ex: 'custom-a1b2c3d4').
 */
export type DiceType = string;

/**
 * Configuration d'un dé telle que retournée par l'API GET /dice.
 */
export interface DiceConfig {
  /** Identifiant unique du dé */
  type: DiceType;
  /** Nombre de faces */
  faces: number;
  /** Libellé affiché (ex: 'D6', 'Mon dé') */
  label: string;
  /** true si le dé a été créé par l'utilisateur, false pour les dés de base */
  custom: boolean;
}

/** Représente un lancer enregistré en base de données */
export interface RollEntry {
  id:        string;
  type:      DiceType;
  label:     string;
  value:     number;
  /** Horodatage Unix en ms */
  timestamp: number;
}