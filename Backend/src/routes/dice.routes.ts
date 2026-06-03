import { Router } from 'express';
import { getDice, getDiceOne, postDice, deleteDiceOne } from '../controllers/dice.controller';

const router = Router();

/** GET  /dice        — liste tous les dés */
router.get('/',      getDice);
/** GET  /dice/:type  — détail d'un dé */
router.get('/:type', getDiceOne);
/** POST /dice        — crée un dé personnalisé */
router.post('/',     postDice);
/** DELETE /dice/:type — supprime un dé personnalisé */
router.delete('/:type', deleteDiceOne);

export default router;
