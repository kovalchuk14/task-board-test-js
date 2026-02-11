import { Router } from 'express';
import cardsRouter from './cards';
import boardsRouter from './board';

const router = Router();

router.use('/cards', cardsRouter);
router.use('/boards', boardsRouter);

export default router;
