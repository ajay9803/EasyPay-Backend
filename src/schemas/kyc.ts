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

export const fetchKycApplicationsQuerySchema = Joi.object().options({
  stripUnknown: true,
});