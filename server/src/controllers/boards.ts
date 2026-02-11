import createHttpError from 'http-errors';
import { Ctrl } from '../types/controllers';
import {
  createBoard,
  deleteBoard,
  getBoard,
  updateBoard,
} from '../services/boards';

export const getBoardByIdController: Ctrl = async (req, res, next) => {
  const { boardId } = req.params;
  const board = await getBoard(boardId);

  if (!board) return next(createHttpError(404, 'Board not found'));

  res.status(200).json(board);
};

export const createBoardController: Ctrl = async (req, res, _next) => {
  const payload = {
    ...req.body,
  };
  console.log(req.body);
  const board = await createBoard(payload);

  res.status(201).json(board);
};

export const deleteBoardController: Ctrl = async (req, res, next) => {
  const { boardId } = req.params;
  const board = await deleteBoard(boardId);

  if (!board) return next(createHttpError(404, 'Board not found'));

  res.status(204).end();
};

export const updateBoardController: Ctrl = async (req, res, next) => {
  const { boardId } = req.params;
  const payload = {
    ...req.body,
  };
  const updatedBoard = await updateBoard(boardId, payload);
  if (!updatedBoard) return next(createHttpError(404, 'Board not found'));

  res.status(200).json(updatedBoard);
};
