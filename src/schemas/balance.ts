import Joi from "joi";

/**
 * The Joi schema to validate the request body for loading balance.
 *
 * @typedef {Object} LoadBalanceBodySchema
 * @property {number} bankAccountId - The ID of the bank account to load balance.
 * @property {number} amount - The amount to load into the bank account.
 * @property {string} purpose - The purpose of loading the balance.
 * @property {string} remarks - Any additional remarks for the balance load.
 *
 * @returns {Joi.ObjectSchema} The Joi schema for the request body.
 */
export const loadBalanceBodySchema = Joi.object({
  bankAccountId: Joi.number().required().messages({
    "number.base": '"bankAccountId" should be a number.',
    "any.required": '"bankAccountId" is required.',
  }),
  amount: Joi.number().min(1).required().messages({
    "number.base": '"amount" should be a number.',
    "number.min": '"amount" should be at least 1.',
    "any.required": '"amount" is required.',
  }),
  purpose: Joi.string().required().messages({
    "string.any": "Purpose is required.",
  }),
  remarks: Joi.string().required().messages({
    "string.any": "Remarks is required.",
  }),
}).options({
  stripUnknown: true,
});

/**
 * The Joi schema to validate the request body for transferring balance.
 *
 * @typedef {Object} TransferBalanceBodySchema
 * @property {string} receiverEmail - The email of the receiver.
 * @property {number} amount - The amount to transfer.
 * @property {string} purpose - The purpose of transfer.
 *
 * @returns {Joi.ObjectSchema} The Joi schema for the request body.
 */
export const transferBalanceBodySchema = Joi.object({
  receiverEmail: Joi.string().email().required().messages({
    "string.email": '"receiverEmail" must be a valid email.',
    "any.required": '"receiverEmail" is required.',
  }),
  amount: Joi.number().min(1).required().messages({
    "number.base": '"amount" should be a number.',
    "number.min": '"amount" should be at least 1.',
    "any.required": '"amount" is required.',
  }),
  purpose: Joi.string().required().messages({
    "string.base": '"purpose" should be a string.',
    "any.required": '"purpose" is required.',
  }),
  remarks: Joi.string().max(50).required().messages({
    "string.base": '"remarks" should be a string.',
    "any.required": '"remarks" is required.',
    "string.max": '"remarks" should be at most 50 characters.',
  }),
}).options({
  stripUnknown: true,
});
