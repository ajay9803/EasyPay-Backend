import * as UserService from "../services/user";
import { NextFunction, Request, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";

/**
 * Create a new user in the database.
 *
 * @param {Request} req - The request object containing the user details.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 * @return {Promise<void>} - A promise that resolves when the user is created.
 */
export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, email, password, dob, gender, otp } = req.body;

    /**
     * Create user based on req-data
     */
    let newUser = {
      username: username,
      email: email,
      password: password,
      dob: dob,
      gender: gender,
    };

    const result = await UserService.createUser(newUser, otp);

    // Send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Fetches users from the database.
 *
 * @param {Request} req - The request object containing the pagination details.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 * @return {Promise<void>} - A promise that resolves when the users are fetched.
 */
export const fetchUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, size } = req.query;

    const result = await UserService.fetchUsers(+page!, +size!);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.user!.id;

    const result = await UserService.getUserById(id);

    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};

// controller to fetch user by email
export const getUserByEmail = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.query;

    const result = await UserService.getUserByEmail(email as string);

    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};

// controller to update user by id
export const updateUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // the body only contains email, name and password
    const { email, name, password, dob, gender } = req.body;

    const user = {
      email: email,
      username: name,
      password: password,
      dob: dob,
      gender: gender,
    };

    const result = await UserService.updateUserById(id, user);

    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};

// controller to delete user by id
export const deleteUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const result = await UserService.deleteUserById(id);

    // send success message
    res.send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};

// controller to update passwrod by id
export const updatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // the body contains password
    const { oldPassword, newPassword } = req.body;

    const result = await UserService.updatePassword(
      id,
      oldPassword,
      newPassword
    );

    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};

// controller to update email by id
export const updateEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // the body contains password
    const { email, otp } = req.body;

    const result = await UserService.updateEmailAddress(id, email, otp);

    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};

// controller to set new passwrod by id
export const setNewPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // the body contains password
    const { password, otp } = req.body;

    const result = await UserService.setNewPassword(id, password, otp);

    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    // send error to generic error handler
    next(e);
  }
};
