import { Router } from 'express';
import { getHistory_, postRoll } from '../controller/roll.controller';

const router = Router();

router.get('/', getHistory_);
router.post('/', postRoll);

export default router;