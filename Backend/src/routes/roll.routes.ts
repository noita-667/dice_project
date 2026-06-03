import { Router } from 'express';
import { getRolls, postRoll } from '../controllers/roll.controller';

const router = Router();

router.get('/', getRolls);
router.post('/', postRoll);

export default router;
