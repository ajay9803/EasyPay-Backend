import Joi from "joi";

export const createQuizDataBodySchema = Joi.object({
  points: Joi.number().integer().min(0).required().messages({
    "any.required": "Points is required.",
    "number.base": "Points should be a number.",
  }),
}).options({
  stripUnknown: true,
});
