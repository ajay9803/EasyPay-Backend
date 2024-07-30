import * as UserService from "../services/user";
import { NextFunction, Request, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";

// controller to create new user
export const createNewUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password, dob, gender, otp } = req.body;

    // create new user
    let newUser = {
      username: username,
      email: email,
      password: password,
      dob: dob,
      gender: gender,
    };

    const result = await UserService.createUser(newUser, otp);
    // send success message
    res.status(result.statusCode).send(result);
  } catch (e) {
    next(e);
  }
};

// controller to fetch user by id
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
  req: Request,
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
