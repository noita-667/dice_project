import { Request, Response } from 'express';
import { z } from 'zod';
import { getHistory, saveRoll } from '../services/roll.service';


const RollBody = z.object({
  type:  z.string().min(1).max(50),
  label: z.string().min(1).max(50),
  value: z.number().int().min(1),
});


export async function getRolls(_req: Request, res: Response): Promise<void> {
  const rolls = await getHistory();
  res.json(rolls);
}


export async function postRoll(req: Request, res: Response): Promise<void> {
  const parsed = RollBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { type, label, value } = parsed.data;
  const entry = await saveRoll(type, label, value);
  res.status(201).json(entry);
}
