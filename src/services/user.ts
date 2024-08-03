import { ConflictError } from "../error/conflict_error";
import { NotFoundError } from "../error/not_found_error";
import { User } from "../interfaces/user";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import HttpStatusCodes from "http-status-codes";
import * as AuthService from "../services/auth";
import { UnauthenticatedError } from "../error/unauthenticated_error";
import BankAccountModel from "../models/bank_account";
import { adminCheck } from "../utils/admin_check";
import { UnauthorizedError } from "../error/unauthorized_error";



/**
 * Creates a new user in the database.
 *
 * @param {Object} user - The user object containing the user details.
 * @param {string} user.username - The username of the user.
 * @param {string} user.email - The email address of the user.
 * @param {string} user.password - The password of the user.
 * @param {Date} user.dob - The date of birth of the user.
 * @param {string} user.gender - The gender of the user.
 * @param {string} otp - The OTP sent to the user's email for verification.
 * @throws {UnauthenticatedError} If OTP verification fails.
 * @throws {ConflictError} If a user with the same email already exists.
 * @return {Promise<any>} The newly created user.
 */
export const createUser = async (
  user: Omit<User, "id" | "permissions" | "isVerified">,
  otp: string
): Promise<any> => {
  const verifyOtp = await AuthService.verifyOtp(user.email, otp);

  if (!verifyOtp) {
    throw new UnauthenticatedError("OTP verification failed.");
  }
  const existingUser = await UserModel.getUserByEmail(user.email);

  // Avoid duplicate email address
  if (existingUser) {
    throw new ConflictError("User already exists.");
  }

  // Hash the password - to store hashed password to the users data
  const hashedPassword = await bcrypt.hash(user.password, 10);
  const newUser = {
    ...user,
    password: hashedPassword,
  };

  const userId = await UserModel.createUser(newUser);
  await BankAccountModel.createBankAccounts(userId);

  // Return success-message
  return {
    statusCode: HttpStatusCodes.CREATED,
    message: "User created successfully",
  };
};

/**
 * Fetches users from the database.
 *
 * @async
 * @function fetchUsers
 * @param {number} page - The page number of the users to fetch.
 * @param {number} size - The number of users to fetch per page.
 * @throws {NotFoundError} If no users are available.
 * @returns {Promise<{statusCode: number, message: string, users: User[], totalCount: string}>}
 * An object containing the status code, message, array of users, and total count.
 */
export const fetchUsers = async (page: number, size: number): Promise<{ statusCode: number; message: string; users: User[]; totalCount: string; }> => {
  const result = await UserModel.fetchUsers(page, size);

  if (result.users.length === 0) {
    throw new NotFoundError("No available users.");
  } else {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "Users fetched successfully.",
      users: result.users,
      totalCount: result.totalCount.count,
    };
  }
};

/**
 * Fetch user by Id
 */
export const getUserById = async (id: string) => {
  const data = await UserModel.getUserById(id);

  // Return success-message
  if (data) {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "User fetched successfully.",
      user: data,
    };
  } else {
    // Throw user-user-not-found error
    const error = new NotFoundError("User not found.");
    throw error;
  }
};

/**
 * Fetch user by email.
 */
export const getUserByEmail = async (email: string) => {
  const data = await UserModel.getUserByEmail(email);

  // Return success-message
  if (data) {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "User fetched successfully.",
      user: data,
    };
  } else {
    // Throw user-user-not-found error
    const error = new NotFoundError("User not found.");
    throw error;
  }
};

// Update user by id
export const updateUserById = async (
  id: string,
  theUser: Omit<User, "id" | "permissions" | "isVerified">
) => {
  // Hash the password - to store hashed password to the users data
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

// Delete user by id
export const deleteUserById = async (id: string) => {

  const user = await UserModel.getUserById(id);

  if (!user) {
    throw new NotFoundError("User not found.");
  } else if (user && adminCheck(user.roleId)) {
    throw new UnauthorizedError("Task forbidden.");
  }
  await UserModel.deleteUserById(id);
  return {
    statusCode: HttpStatusCodes.NO_CONTENT,
    message: "User deleted successfully",
  };
};

// Update password
export const updatePassword = async (
  id: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await UserModel.getUserById(id);

  if (user) {
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isOldPasswordValid) {
      throw new UnauthenticatedError("Invalid old password was provided.");
    }

    // Hash the password - to store hashed password to the users data
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    newPassword = hashedPassword;

    await UserModel.updatePassword(id, hashedPassword);

    return {
      statusCode: HttpStatusCodes.OK,
      message: "Password updated successfully",
    };
  } else {
    throw new NotFoundError("No such user found.");
  }
};

// Update email address of theuser
export const updateEmailAddress = async (
  id: string,
  emailAddress: string,
  otp: string
) => {
  const verifyOtp = await AuthService.verifyOtp(emailAddress, otp);

  // Check for otp verification
  if (!verifyOtp) {
    throw new UnauthenticatedError("OTP verification failed.");
  }
  const existingUser = await UserModel.getUserByEmail(emailAddress);

  // Avoid duplicate email address
  if (existingUser) {
    throw new ConflictError("User already exists.");
  }

  const userId = await UserModel.updateEmail(id, emailAddress);

  // Return success-message
  return {
    statusCode: HttpStatusCodes.OK,
    message: "Email updated successfully.",
  };
};

/**
 * Set new password for the user.
 */
export const setNewPassword = async (
  id: string,
  newPassword: string,
  otp: string
) => {
  const user = await UserModel.getUserById(id);

  if (!user) {
    throw new NotFoundError("No such user found.");
  }

  const verifyOtp = await AuthService.verifyOtp(user.email, otp);

  if (!verifyOtp) {
    throw new UnauthenticatedError("OTP verification failed.");
  }

  // Hash the password - to store hashed password to the users data
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  newPassword = hashedPassword;

  await UserModel.setNewPassword(id, hashedPassword);

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Password updated successfully",
  };
};
