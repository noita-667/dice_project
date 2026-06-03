import { Router } from "express";
import { getFaces, rollDice } from "../controller/dice.controller";

const router = Router();

router.get("/", getFaces);
router.post("/roll", rollDice);

export default router;