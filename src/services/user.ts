import { ConflictError } from "../error/conflict_error";
import { NotFoundError } from "../error/not_found_error";
import { User } from "../interfaces/user";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import HttpStatusCodes from "http-status-codes";
import * as AuthService from "../services/auth";
import { UnauthenticatedError } from "../error/unauthenticated_error";
import BankAccountModel from "../models/bank_account";

export const add = (a: number, b: number) => {
  return a + b;
};

// create new user
export const createUser = async (
  user: Omit<User, "id" | "permissions">,
  otp: string
) => {
  const verifyOtp = await AuthService.verifyOtp(user.email, otp);

  if (!verifyOtp) {
    throw new UnauthenticatedError("OTP verification failed.");
  }
  const existingUser = await UserModel.getUserByEmail(user.email);

  // avoid duplicate email address
  if (existingUser) {
    throw new ConflictError("User already exists.");
  }

  // hash the password - to store hashed password to the users data
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = {
    ...user,
    password: hashedPassword,
  };

  const userId = await UserModel.createUser(newUser);
  await BankAccountModel.createBankAccounts(userId);

  // return success-message
  return {
    statusCode: HttpStatusCodes.CREATED,
    message: "User created successfully",
  };
};

// get user by id
export const getUserById = async (id: string) => {
  const data = await UserModel.getUserById(id);

  // return success-message
  if (data) {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "User fetched successfully.",
      user: data,
    };
  } else {
    // throw user-user-not-found error
    const error = new NotFoundError("User not found.");
    throw error;
  }
};

// get user by email

export const getUserByEmail = async (email: string) => {
  const data = await UserModel.getUserByEmail(email);

  // return success-message
  if (data) {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "User fetched successfully.",
      user: data,
    };
  } else {
    // throw user-user-not-found error
    const error = new NotFoundError("User not found.");
    throw error;
  }
};

// update user by id
export const updateUserById = async (
  id: string,
  theUser: Omit<User, "id" | "permissions">
) => {
  // hash the password - to store hashed password to the users data
  const hashedPassword = await bcrypt.hash(theUser.password, 10);
  theUser.password = hashedPassword;

  const user = await UserModel.updateUserById(id, theUser);

  if (user) {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "User updated successfully",
      user: user,
    };
  } else {
    throw new NotFoundError("No such user found.");
  }
};

// delete user by id
export const deleteUserById = async (id: string) => {
  await UserModel.deleteUserById(id);
  return {
    statusCode: HttpStatusCodes.NO_CONTENT,
    message: "User deleted successfully",
  };
};
