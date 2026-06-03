import { Request, Response } from 'express';
import { z } from 'zod';
import { getHistory, saveRoll, isValidType } from '../service/roll.service';

const RollBody = z.object({
  type: z.string(),
  label: z.string(),
  value: z.number().int().min(1),
});

// GET /rolls
export function getHistory_(req: Request, res: Response): void {
  res.json(getHistory());
}

// POST /rolls
export function postRoll(req: Request, res: Response): void {
  const parsed = RollBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { type, label, value } = parsed.data;

  if (!isValidType(type)) {
    res.status(400).json({ error: 'Invalid dice type. Valid: d6, d12, d20' });
    return;
  }

  const entry = saveRoll(type, label, value);
  res.status(201).json(entry);
}