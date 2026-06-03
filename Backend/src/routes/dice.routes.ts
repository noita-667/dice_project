import { Router } from 'express';
import { getDice, getDiceOne } from '../controllers/dice.controller';

const router = Router();

router.get('/', getDice);
router.get('/:type', getDiceOne);

export default router;
