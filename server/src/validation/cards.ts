import Joi from 'joi';

export const createCardSchema = Joi.object({
  boardId: Joi.string().required(),
  title: Joi.string().min(1).required(),
  description: Joi.string(),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
});

export const updateCardSchema = Joi.object({
  title: Joi.string().min(1),
  description: Joi.string(),
}).min(1);

export const moveCardSchema = Joi.object({
  status: Joi.string().valid('todo', 'in_progress', 'done').required,
  order: Joi.number().required,
});
