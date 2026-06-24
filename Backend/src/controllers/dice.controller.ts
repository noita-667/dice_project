import { Request, Response } from 'express';
import { z } from 'zod';
import { getAllDice, getDiceByType, createDice, deleteDice } from '../services/dice.service';


export async function getDice(_req: Request, res: Response): Promise<void> {
  const dice = await getAllDice();
  res.json(dice);
}


export async function getDiceOne(req: Request, res: Response): Promise<void> {
  const dice = await getDiceByType(req.params.type);
  if (!dice) {
    res.status(404).json({ error: `Dé '${req.params.type}' introuvable` });
    return;
  }
  res.json(dice);
}


const DiceBody = z.object({
  label: z.string().min(1).max(50),
  faces: z.number().int().min(2).max(10_000),
});


export async function postDice(req: Request, res: Response): Promise<void> {
  const parsed = DiceBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const die = await createDice(parsed.data.label, parsed.data.faces);
  res.status(201).json(die);
}


export async function deleteDiceOne(req: Request, res: Response): Promise<void> {
  const deleted = await deleteDice(req.params.type);
  if (!deleted) {
    res.status(404).json({ error: `Dé custom '${req.params.type}' introuvable ou non supprimable` });
    return;
  }
  res.status(204).send();
}
