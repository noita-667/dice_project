import { Request, Response } from 'express';
import { z } from 'zod';
import { getHistory, saveRoll } from '../services/roll.service';

/** Schéma de validation du corps d'un POST /rolls */
const RollBody = z.object({
  type:  z.string().min(1).max(50),
  label: z.string().min(1).max(50),
  /** Valeur du lancer — doit être un entier >= 1 */
  value: z.number().int().min(1),
});

/** GET /rolls — retourne l'historique complet des lancers */
export async function getRolls(_req: Request, res: Response): Promise<void> {
  const rolls = await getHistory();
  res.json(rolls);
}

/**
 * POST /rolls — enregistre un nouveau lancer.
 * Accepte tout type de dé (dés de base et dés personnalisés).
 */
export async function postRoll(req: Request, res: Response): Promise<void> {
  const parsed = RollBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { type, label, value, player } = parsed.data;
  const entry = await saveRoll(type, label, value, player);
  res.status(201).json(entry);
}
