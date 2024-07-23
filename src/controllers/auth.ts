import e, { NextFunction, Request, Response } from "express";
import * as AuthService from "../services/auth";
import { NotFoundError } from "../error/not_found_error";

export const sendSignupOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    const result = await AuthService.sendSignupOtp(email);
    res.status(result.statusCode).json(result);
  } catch (e) {
    console.log("The error is: ", e);
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
