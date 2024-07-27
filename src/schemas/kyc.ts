import Joi from "joi";

export const applyForKycBodySchema = Joi.object({
  citizenshipNumber: Joi.string().required().messages({
    "any.required": "Citizenship number is required.",
  }),
  citizenshipIssueDate: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Citizenship issue date must be in the format YYYY-MM-DD.",
      "any.required": "Citizenship issue date is required.",
    }),
}).options({
  stripUnknown: true,
});

export const fetchKycApplicationsQuerySchema = Joi.object({
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
  status: Joi.string()
    .valid("Pending", "Verified", "Rejected", "All")
    .messages({
      "any.only":
        '"Status" should be either Pending, Verified, Rejected or All.',
    }),
}).options({
  stripUnknown: true,
});

export const verifyKycApplicationBodySchema = Joi.object({
  isVerified: Joi.boolean().required().messages({
    "boolean.base": '"isVerified" should be a boolean',
    "any.required": '"isVerified" is required',
  }),
  userId: Joi.number().integer().required().messages({
    "number.base": '"userId" should be a number',
    "number.integer": '"userId" should be an integer',
    "any.required": '"userId" is required',
  }),
}).options({
  stripUnknown: true,
});
