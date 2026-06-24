/**
 * Identifiant d'un dé.
 * Vaut 'd6', 'd12', 'd20' pour les dés de base,
 * ou un identifiant unique (ex: 'custom-<uuid>') pour les dés personnalisés.
 */
export type DiceType = string;

/** Entrée d'historique d'un lancer, telle que retournée par l'API */
export interface RollEntry {
  id:        string;
  type:      DiceType;
  label:     string;
  value:     number;
  timestamp: number; // Date.now() en ms
  player:    string;
}
