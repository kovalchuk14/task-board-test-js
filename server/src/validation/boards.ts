import Joi from 'joi';

export const updateBoardSchema = Joi.object({
  name: Joi.string().min(1).max(30).required(),
});

export const createBoardSchema = Joi.object({
  name: Joi.string().min(1).max(30),
});
