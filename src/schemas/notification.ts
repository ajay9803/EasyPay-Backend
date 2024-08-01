import Joi from "joi";

/**
 * The Joi schema to validate the query parameters for fetching notifications.
 *
 * @typedef {Object} FetchNotificationsQuerySchema
 * @property {number} page - The page number of the results.
 * @property {number} size - The number of results per page.
 *
 * @returns {Joi.ObjectSchema} The Joi schema for the query parameters.
 */
export const fetchNotificationsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).required().messages({
    "number.base": '"Page" should be a number.',
    "number.integer": '"Page" should be an integer.',
    "number.min": '"Page" should be at least 1.',
    "any.required": '"Page" is required.',
  }),
  size: Joi.number().integer().min(1).required().messages({
    "number.base": '"Size" should be a number.',
    "number.integer": '"Size" should be an integer.',
    "number.min": '"Size" should be at least 1.',
    "any.required": '"Size" is required.',
  }),
}).options({
  stripUnknown: true,
});
