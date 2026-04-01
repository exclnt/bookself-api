import Joi from "joi";

export const bookPayloadShema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().integer().required(),
  author: Joi.string().required(),
  summary: Joi.string().required(),
  publisher: Joi.string().required(),
  pageCount: Joi.number().integer().required(),
  readPage: Joi.number().integer().required(),
  reading: Joi.boolean().required(),
});

export const bookQuerySchema = Joi.object({
  name: Joi.string().empty(),
  reading: Joi.number().valid(0, 1).empty(),
  finished: Joi.number().valid(0, 1).empty(),
});
