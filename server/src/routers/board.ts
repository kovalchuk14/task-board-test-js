import { Router } from 'express';
import { isVaildId } from '../middlewares/isValidBoardId';
import { ctrlWrapper } from '../utils/ctrlWrapper';
import {
  createBoardController,
  deleteBoardController,
  getBoardByIdController,
  updateBoardController,
} from '../controllers/boards';
import { validateBody } from '../middlewares/validateBody';
import { createBoardSchema, updateBoardSchema } from '../validation/boards';

const router = Router();

router.get('/:boardId', isVaildId, ctrlWrapper(getBoardByIdController));

router.post(
  '/',
  validateBody(createBoardSchema),
  ctrlWrapper(createBoardController),
);

router.delete('/:boardId', isVaildId, ctrlWrapper(deleteBoardController));

router.patch(
  '/:boardId',
  isVaildId,
  validateBody(updateBoardSchema),
  ctrlWrapper(updateBoardController),
);

export default router;
