import Joi from "joi";


/**
 * The Joi schema to validate the request body for updating easy pay points.
 *
 * @typedef {Object} UpdateEasyPayPointsBodySchema
 * @property {number} points - The new easy pay points of the user.
 *
 * @returns {Joi.ObjectSchema} The Joi schema for the request body.
 */
export const updateEasyPayPointsBodySchema = Joi.object({
  points: Joi.number().integer().min(0).required().messages({
    "any.required": "Points is required.",
    "number.base": "Points should be a number.",
  }),
}).options({
  stripUnknown: true,
});
