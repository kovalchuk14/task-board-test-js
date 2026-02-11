import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import { isVaildId } from '../middlewares/isValidCardId';
import {
  createCardSchema,
  moveCardSchema,
  updateCardSchema,
} from '../validation/cards';
import {
  createCardController,
  deleteCardController,
  moveCardController,
  updateCardController,
} from '../controllers/cards';

const router = Router();

router.post(
  '/',
  validateBody(createCardSchema),
  ctrlWrapper(createCardController),
);

router.patch(
  '/:cardId',
  isVaildId,
  validateBody(updateCardSchema),
  ctrlWrapper(updateCardController),
);

router.delete('/:cardId', isVaildId, ctrlWrapper(deleteCardController));

router.patch(
  '/:cardId/move',
  isVaildId,
  validateBody(moveCardSchema),
  ctrlWrapper(moveCardController),
);

export default router;
