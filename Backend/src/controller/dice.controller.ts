import { Request, Response } from "express";
import { z } from "zod";
import { isValidDice, roll, rollMany, getValidFaces } from "../services/dice.service";

const RollBody = z.object({
  dice: z.number({ required_error: "dice is required" }),
  count: z.number().int().min(1).max(20).optional().default(1),
});

// GET /dice
export function getFaces(_req: Request, res: Response): void {
  res.json({ validFaces: getValidFaces() });
}

// POST /dice/roll
export function rollDice(req: Request, res: Response): void {
  const parsed = RollBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    return;
  }

  const { dice, count } = parsed.data;

  if (!isValidDice(dice)) {
    res.status(400).json({ error: `Invalid dice. Valid values: ${getValidFaces().join(", ")}` });
    return;
  }

  const results = count === 1 ? roll(dice) : rollMany(dice, count);
  res.json({ success: true, data: results });
}