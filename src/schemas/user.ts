// schema to validate request body while creating / updating user
import Joi from "joi";

export const createUserBodySchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username is required.",
  }),

  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Email must be a valid format.",
  }),

  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "Password is required.",
      "string.min": "Password must be at least 8 characters.",
      "password.uppercase":
        "Password must have at least one uppercase character.",
      "password.lowercase":
        "Password must have at least one lowercase character.",
      "password.special": "Password must have at least one special character.",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }

      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }

      if (!/[!@#$%]/.test(value)) {
        return helpers.error("password.special");
      }

      return value;
    }),

  dob: Joi.date().required().messages({
    "any.required": "Date of birth is required.",
    "date.base": "Date of birth must be a valid date.",
  }),

  gender: Joi.string().valid("Male", "Female", "Other").required().messages({
    "any.required": "Gender is required.",
    "any.only": "Gender must be either 'Male', 'Female', or 'Other'.",
  }),
  otp: Joi.string().required().min(6).messages({
    "any.required": "otp is required.",
  }),
}).options({
  stripUnknown: true,
});

// schema to validate login credentials of user
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Email must be a valid format.",
  }),

  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "Password is required..",
      "string.min": "Password must be atleast 8 characters..",
      "password.uppercase":
        "Password must have atleast one uppercase character..",
      "password.lowercase":
        "Password must have atleast one lowercase character..",
      "password.special": "Password must have atleast one special character..",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }

      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }

      if (!/[!@#$%]/.test(value)) {
        return helpers.error("password.special");
      }

      return value;
    }),
}).options({
  stripUnknown: true,
});

// schema to validate user id
export const getUserParamsSchema = Joi.object({
  id: Joi.number().min(0).required().messages({
    "number.base": '"id" should be a number.',
    "number.min": '"id" should be greater than or equal to 0.',
    "any.required": '"id" is a required field.',
  }),
}).options({
  stripUnknown: true,
});

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
