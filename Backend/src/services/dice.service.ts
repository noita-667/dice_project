import { v4 as uuidv4 } from 'uuid';
import { pool } from '../db/client';
import { Dice } from '../models/dice.model';

/** Retourne tous les dés (de base + personnalisés), triés par nombre de faces */
export async function getAllDice(): Promise<Dice[]> {
  const { rows } = await pool.query<Dice>('SELECT * FROM dice ORDER BY faces ASC');
  return rows;
}

/** Retourne un dé par son type, ou null s'il n'existe pas */
export async function getDiceByType(type: string): Promise<Dice | null> {
  const { rows } = await pool.query<Dice>('SELECT * FROM dice WHERE type = $1', [type]);
  return rows[0] ?? null;
}

/**
 * Crée un nouveau dé personnalisé en base de données.
 * L'identifiant unique (type) est généré côté serveur via UUID.
 *
 * @param label - Nom affiché du dé (ex: "Mon D100")
 * @param faces - Nombre de faces (>= 2)
 */
export async function createDice(label: string, faces: number): Promise<Dice> {
  // Génération d'un identifiant unique court : "custom-" + 8 premiers chars de l'UUID
  const type = `custom-${uuidv4().slice(0, 8)}`;

  const { rows } = await pool.query<Dice>(
    'INSERT INTO dice (type, label, faces, custom) VALUES ($1, $2, $3, true) RETURNING *',
    [type, label, faces]
  );
  return rows[0];
}

/**
 * Supprime un dé personnalisé par son type.
 * Seuls les dés marqués `custom = true` peuvent être supprimés.
 *
 * @returns true si le dé a été supprimé, false s'il n'existait pas ou n'est pas custom
 */
export async function deleteDice(type: string): Promise<boolean> {
  const { rowCount } = await pool.query(
    'DELETE FROM dice WHERE type = $1 AND custom = true',
    [type]
  );
  return (rowCount ?? 0) > 0;
}
