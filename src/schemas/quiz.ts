import Joi from "joi";

/**
 * The Joi schema to validate the request body for creating quiz data.
 *
 * @typedef {Object} CreateQuizDataBodySchema
 * @property {number} points - The points scored in the quiz.
 *
 * @returns {Joi.ObjectSchema} The Joi schema for the request body.
 */
export const createQuizDataBodySchema = Joi.object({
  points: Joi.number().integer().min(0).required().messages({
    "any.required": "Points is required.",
    "number.base": "Points should be a number.",
  }),
}).options({
  stripUnknown: true,
});
