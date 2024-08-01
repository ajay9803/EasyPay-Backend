import Joi from "joi";

/**
 * Validates the body schema for sending an OTP.
 *
 * @typedef {Object} SendOtpBodySchema
 * @property {string} email - The email address to send the OTP to.
 *
 * @returns {Joi.Schema} The Joi schema for the body of the request.
 */
export const sendOtpBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Email must be a valid format.",
  }),
}).options({
  stripUnknown: true,
});

/**
 * Validates the body schema for creating a user.
 *
 * @typedef {Object} CreateUserBodySchema
 * @property {string} username - The username of the user.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 *
 * @returns {Joi.Schema} The Joi schema for the body of the request.
 */
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

/**
 * Validates the body schema for user login.
 *
 * @typedef {Object} LoginUserBodySchema
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 *
 * @returns {Joi.Schema} The Joi schema for the body of the request.
 */
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

/**
 * The Joi schema to validate the request parameters for getting user details.
 *
 * @typedef {Object} GetUserParamsSchema
 * @property {number} id - The ID of the user.
 *
 * @returns {Joi.ObjectSchema} The Joi schema for the request parameters.
 */
export const getUserParamsSchema = Joi.object({
  id: Joi.number().min(0).required().messages({
    "number.base": '"id" should be a number.',
    "number.min": '"id" should be greater than or equal to 0.',
    "any.required": '"id" is a required field.',
  }),
}).options({
  stripUnknown: true,
});

/**
 * The Joi schema to validate the request body for updating password.
 *
 * @typedef {Object} UpdatePasswordBodySchema
 * @property {string} oldPassword - The old password of the user.
 * @property {string} newPassword - The new password of the user.
 *
 * @returns {Joi.ObjectSchema} The Joi schema for the request body.
 */
export const updatePasswordBodySchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": '"Old Password" is required.',
  }),
  newPassword: Joi.string().required().messages({
    "any.required": '"New Password" is required.',
  }),
}).options({ stripUnknown: true });

/**
 * The Joi schema to validate the request body for setting a new password.
 *
 * @typedef {Object} SetNewPasswordBodySchema
 * @property {string} password - The new password of the user.
 * @property {string} otp - The OTP sent to the user's email for verification.
 *
 * @returns {Joi.ObjectSchema} The Joi schema for the request body.
 */
export const setNewPasswordBodySchema = Joi.object({
  password: Joi.string().required().messages({
    "any.required": '"Password" is required.',
  }),
  otp: Joi.string().required().messages({
    "any.required": '"OTP" is required.',
  }),
}).options({ stripUnknown: true });

/**
 * The Joi schema to validate the request body for updating email.
 *
 * @typedef {Object} UpdateEmailBodySchema
 * @property {string} email - The new email of the user.
 * @property {string} otp - The OTP sent to the user's email for verification.
 *
 * @returns {Joi.ObjectSchema} The Joi schema for the request body.
 */
export const updateEmailBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": '"Email" must be a valid format.',
    "any.required": '"Email" is required.',
  }),
  otp: Joi.string().required().messages({
    "any.required": '"OTP" is required.',
  }),
}).options({ stripUnknown: true });
