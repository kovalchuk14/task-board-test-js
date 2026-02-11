import { cardCollection } from '../db/models/card';

type CreateCardPayload = {
  boardId: string;
  title: string;
  description?: string;
  status?: string;
};

export const createCard = async (payload: CreateCardPayload) => {
  const status = payload.status ?? 'todo';
  const list = await cardCollection
    .find({ boardId: payload.boardId, status })
    .sort({ order: -1 });

  const order = list.length ? list[0].order + 1 : 0;

  const card = await cardCollection.create({
    status,
    order,
    ...payload,
  });

  return card;
};

export const getCard = async (cardId: string) => {
  const card = await cardCollection.findById(cardId);
  return card;
};

type UpdateCardPayload = {
  title?: string;
  description?: string;
};

export const updateCard = async (
  cardId: string,
  payload: UpdateCardPayload,
) => {
  const rawResult = await cardCollection.findByIdAndUpdate(cardId, payload, {
    new: true,
  });

  return rawResult;
};

export const deleteCard = async (cardId: string) => {
  const card = await cardCollection.findById(cardId);
  if (!card) return null;

  const { boardId, status, order } = card;

  await cardCollection.findByIdAndDelete(cardId);

  await cardCollection.updateMany(
    { boardId, status, order: { $gt: order } },
    { $inc: { order: -1 } },
  );
  return card;
};

type Status = 'todo' | 'in_progress' | 'done';

type MoveCardPayload = {
  status: Status;
  order: number;
};
export const moveCard = async (cardId: string, payload: MoveCardPayload) => {
  const card = await cardCollection.findById(cardId);
  if (!card) return null;

  const { status: toStatus, order: toOrder } = payload;

  const { boardId, status: fromStatus, order: fromOrder } = card;

  const count = await cardCollection.countDocuments({
    boardId,
    status: toStatus,
  });

  const maxOrder = fromStatus === toStatus ? count - 1 : count;

  if (toOrder > maxOrder) {
    throw new Error('Order is too large');
  }

  if (fromStatus === toStatus) {
    if (toOrder === fromOrder) return card;

    if (toOrder > fromOrder) {
      await cardCollection.updateMany(
        {
          boardId,
          status: fromStatus,
          order: { $gt: fromOrder, $lte: toOrder },
        },
        { $inc: { order: -1 } },
      );
    } else {
      await cardCollection.updateMany(
        {
          boardId,
          status: fromStatus,
          order: { $gte: toOrder, $lt: fromOrder },
        },
        { $inc: { order: 1 } },
      );
    }
  } else {
    await cardCollection.updateMany(
      { boardId, status: fromStatus, order: { $gt: fromOrder } },
      { $inc: { order: -1 } },
    );

    await cardCollection.updateMany(
      { boardId, status: toStatus, order: { $gte: toOrder } },
      { $inc: { order: 1 } },
    );

    card.status = toStatus;
  }

  card.order = toOrder;
  await card.save();

  return card;
};
