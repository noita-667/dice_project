import { DiceFaces, DiceRoll, VALID_FACES } from "../model/dice.model";

export function isValidDice(value: unknown): value is DiceFaces {
  return VALID_FACES.includes(value as DiceFaces);
}

export function roll(faces: DiceFaces): DiceRoll {
  return {
    dice: faces,
    result: Math.floor(Math.random() * faces) + 1,
    min: 1,
    max: faces,
    rolledAt: new Date().toISOString(),
  };
}

export function rollMany(faces: DiceFaces, count: number): DiceRoll[] {
  return Array.from({ length: count }, () => roll(faces));
}

export function getValidFaces(): readonly number[] {
  return VALID_FACES;
}