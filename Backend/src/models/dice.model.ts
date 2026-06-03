/** Représentation d'un dé en base de données */
export interface Dice {
  type:   string;
  label:  string;
  faces:  number;
  /** true pour les dés créés par l'utilisateur, false pour les dés de base (d6, d12, d20) */
  custom: boolean;
}
