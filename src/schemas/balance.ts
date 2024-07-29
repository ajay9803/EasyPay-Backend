import Joi from "joi";

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
