import Joi from "joi";


/**
 * The Joi schema to validate the query parameters for fetching balance transfer statements.
 *
 * @typedef {Object} FetchBalanceTransferStatementQuerySchema
 * @property {number} page - The page number of the results.
 * @property {number} size - The number of results per page.
 * @property {string} cashFlow - The cash flow to filter the statements by (All, Debit, Credit).
 * @property {number} startDate - The start date to filter the statements by.
 * @property {number} endDate - The end date to filter the statements by.
 * @returns {Joi.ObjectSchema} The Joi schema for the query parameters.
 */
export const fetchBalanceTransferStatementQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).required().messages({
    "number.base": '"Page" must be a number.',
    "number.integer": '"Page" must be an integer.',
    "number.min": '"Page" must be at least 1.',
    "any.required": '"Page" is required.',
  }),
  size: Joi.number().integer().min(1).required().messages({
    "number.base": '"Size" must be a number.',
    "number.integer": '"Size" must be an integer.',
    "number.min": '"Size" must be at least 1.',
    "any.required": '"Size" is required.',
  }),
  cashFlow: Joi.string().valid("All", "Debit", "Credit").required().messages({
    "any.only": '"CashFlow" should be either All, Debit, or Credit.',
    "any.required": '"CashFlow" is required.',
  }),
  startDate: Joi.number().integer().required().messages({
    "number.base": '"StartDate" must be a number.',
    "number.integer": '"StartDate" must be an integer.',
    "any.required": '"StartDate" is required.',
  }),
  endDate: Joi.number().integer().required().messages({
    "number.base": '"EndDate" must be a number.',
    "number.integer": '"EndDate" must be an integer.',
    "any.required": '"EndDate" is required.',
  }),
}).options({
    stripUnknown: true,
});
