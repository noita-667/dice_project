import { Request, Response } from 'express';
import { getAllDice, getDiceByType } from '../services/dice.service';

// GET /dice
export async function getDice(_req: Request, res: Response): Promise<void> {
  const dice = await getAllDice();
  res.json(dice);
}

// GET /dice/:type
export async function getDiceOne(req: Request, res: Response): Promise<void> {
  const dice = await getDiceByType(req.params.type);
  if (!dice) {
    res.status(404).json({ error: `Dice '${req.params.type}' not found` });
    return;
  }
  res.json(dice);
}
