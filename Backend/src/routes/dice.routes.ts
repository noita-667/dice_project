import { Router } from 'express';
import { getDice, getDiceOne, postDice, deleteDiceOne } from '../controllers/dice.controller';

const router = Router();

router.get('/',      getDice);
router.get('/:type', getDiceOne);
router.post('/',     postDice);
router.delete('/:type', deleteDiceOne);

export default router;
