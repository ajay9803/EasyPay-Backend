import * as UserService from "../services/user";
import { NextFunction, Request, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import { UnauthorizedError } from "../error/unauthorized_error";
import { NotFoundError } from "../error/not_found_error";

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

export const applyForKyc = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files) {
      throw new NotFoundError("User images not found.");
    }

    const imageFiles = req.files as { [key: string]: Express.Multer.File[] };
    console.log(imageFiles);

    let { citizenshipNumber, citizenshipIssueDate } = req.body;
    let userId = req.user!.id;

    const result = await UserService.applyForKyc({
      userId,
      citizenshipNumber,
      citizenshipIssueDate,
      imageFiles,
    });

    res.status(result.statusCode).json(result);
  } catch (e) {
    console.log("The error is: ", e);
    next(e);
  }
};

export const fetchKycApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const result = await UserService.fetchKycApplication(userId);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const fetchKycApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const { page, size } = req.query;

    const result = await UserService.fetchKycApplications(+page!, +size!);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const verifyKycApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const { isVerified } = req.body;
    const result = await UserService.verifyKycApplication(userId, isVerified);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const loadBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const { bankAccountId, amount } = req.body;
    const result = await UserService.loadBalance(userId, bankAccountId, amount);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
