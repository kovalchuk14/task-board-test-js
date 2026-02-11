import createHttpError from 'http-errors';
import { Ctrl } from '../types/controllers';
import {
  createCard,
  deleteCard,
  moveCard,
  updateCard,
} from '../services/cards';

export const createCardController: Ctrl = async (req, res, _next) => {
  const payload = {
    ...req.body,
  };

  const card = await createCard(payload);

  res.status(201).json(card);
};

export const updateCardController: Ctrl = async (req, res, next) => {
  const { cardId } = req.params;

  const payload = {
    ...req.body,
  };
  const updatedCard = await updateCard(cardId, payload);

  if (!updatedCard) return next(createHttpError(404, 'Card not found'));

  res.status(200).json(updatedCard);
};

export const deleteCardController: Ctrl = async (req, res, next) => {
  const { cardId } = req.params;
  const card = await deleteCard(cardId);

  if (!card) return next(createHttpError(404, 'Card not found'));

  res.status(204).end();
};

export const moveCardController: Ctrl = async (req, res, next) => {
  const { cardId } = req.params;

  const status = req.query.status;
  const order = Number(req.query.order);

  const payload = {
    status,
    order,
  };
  if (order < 0) {
    return next(createHttpError(400, 'Order cannot be negative'));
  }
  const updatedCard = await moveCard(cardId, payload);
  if (!updatedCard) return next(createHttpError(404, 'Card not found'));

  res.status(200).json(updatedCard);
};
