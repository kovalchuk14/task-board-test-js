import { boardCollection } from '../db/models/board';
import { cardCollection } from '../db/models/card';

export const getBoard = async (boardId: string) => {
  const board = await boardCollection.findById(boardId);
  if (!board) return null;
  const cards = await cardCollection.find({ boardId }).sort({ order: 1 });

  return {
    board,
    cards,
  };
};

type CreateBoardPayload = {
  name?: string;
};

export const createBoard = async (payload: CreateBoardPayload) => {
  const board = await boardCollection.create(payload);
  return board;
};

export const deleteBoard = async (boardId: string) => {
  await cardCollection.deleteMany({ boardId });
  const board = await boardCollection.findByIdAndDelete(boardId);
  return board;
};

type UpdateBoardPayload = {
  name: string;
};

export const updateBoard = async (
  boardId: string,
  payload: UpdateBoardPayload,
) => {
  const rawResult = await boardCollection.findByIdAndUpdate(boardId, payload, {
    new: true,
  });
  return rawResult;
};
