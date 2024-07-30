import e, { NextFunction, Request, Response } from "express";
import * as AuthService from "../services/auth";
import { NotFoundError } from "../error/not_found_error";

/**
 * Sends a signup OTP to the specified email address.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the email.
 * @param {string} req.body.email - The email address to send the OTP to.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} A promise that resolves when the OTP is sent
 * successfully.
 * @throws {NotFoundError} If no user with the specified email is found.
 */
export const sendSignupOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const result = await AuthService.sendSignupOtp(email);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Sends a change email OTP to the specified email address.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.body - The request body containing the email.
 * @param {string} req.body.email - The email address to send the OTP to.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {Promise<void>} A promise that resolves when the OTP is sent
 * successfully.
 * @throws {NotFoundError} If no user with the specified email is found.
 */
export const sendChangeEmailOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;
    console.log("Email", email);

    const result = await AuthService.sendUpdateEmailOtp(email);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const sendForgotPasswordLink = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    console.log("Email", email);

    const result = await AuthService.sendForgotPasswordLink(email);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

// controller to login user
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    // send success message
    res.status(result.statusCode).json(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};

// controller to refresh access token
export const refreshAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;

    // throw authorization error if token isn't provided
    if (!authorization) {
      const error = new NotFoundError("No token provided.");
      throw error;
    }

    // send success message
    const result = AuthService.refreshAccessToken(authorization);
    res.status(result.statusCode).json(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};
