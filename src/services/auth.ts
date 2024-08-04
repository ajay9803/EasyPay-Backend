import config from "../config";
import { InvalidError } from "../error/invalid_error";
import { NotFoundError } from "../error/not_found_error";
import { UnauthenticatedError } from "../error/unauthenticated_error";
import bcrypt from "bcrypt";
import { verify, sign, JsonWebTokenError } from "jsonwebtoken";
import { User } from "../interfaces/user";
import HttpStatusCodes from "http-status-codes";
import UserModel from "../models/user";
import AuthModel from "../models/auth";
import * as EmailService from "../utils/node_mailer";

/**
 * Verify Otp Function
 */
/**
 * Verify Otp Function
 *
 * @param {string} email - The email address associated with the OTP.
 * @param {string} otp - The OTP to verify.
 * @return {Promise<boolean>} A promise that resolves to a boolean indicating
 * whether the OTP is valid or not.
 * @throws {InvalidError} If the OTP doesn't match.
 */
export const verifyOtp = async (
  email: string,
  otp: string
): Promise<boolean> => {
  const existingOtp = await AuthModel.findOtpByEmail(email);
  if (existingOtp) {
    let currentTime = new Date().getTime();
    const timeDifference = (currentTime - +existingOtp.createdAt) / 1000;
    console.log(timeDifference);

    if (timeDifference < 120) {
      if (existingOtp.otp === otp) {
        return true;
      } else {
        return false;
      }
    } else {
      throw new InvalidError("OTP has expired.");
    }
  } else {
    throw new InvalidError("OTP verification failed.");
  }
};

/**
 * Sends a signup OTP to the specified email address.
 *
 * @param {string} email - The email address to send the OTP to.
 * @return {Promise<{statusCode: number, message: string, otp: string}>} A promise that resolves when the OTP is sent
 * successfully.
 */
export const sendSignupOtp = async (
  email: string
): Promise<{ statusCode: number; message: string; otp: string }> => {
  let otp = EmailService.generateOtp();

  console.log(otp);

  const exitingOtp = await AuthModel.findOtpByEmail(email);

  if (exitingOtp) {
    await AuthModel.updateExistingOtp(email, otp);
  } else {
    await AuthModel.createOtp(email, otp);
  }

  console.log('Here send otp now');

  await EmailService.sendSignupOtp(email, otp);
  return {
    statusCode: HttpStatusCodes.OK,
    message: "Sign up OTP has been sent.",
    otp: otp,
  };
};

/**
 * Sends a change email OTP to the specified email address.
 *
 * @param {string} email - The email address to send the OTP to.
 * @return {Promise<{statusCode: number, message: string, otp: string}>} - A promise that resolves when the OTP is sent
 * successfully. The resolved value is an object with the following properties:
 *   - `statusCode` {number} - The HTTP status code indicating the success of the operation.
 *   - `message` {string} - A message indicating the success of the operation.
 *   - `otp` {string} - The OTP sent to the user's email for verification.
 */
export const sendUpdateEmailOtp = async (
  email: string
): Promise<{ statusCode: number; message: string; otp: string }> => {
  let otp = EmailService.generateOtp();

  const exitingOtp = await AuthModel.findOtpByEmail(email);

  if (exitingOtp) {
    await AuthModel.updateExistingOtp(email, otp);
  } else {
    await AuthModel.createOtp(email, otp);
  }

  await EmailService.sendChangeEmailOtp(email, otp);
  return {
    statusCode: HttpStatusCodes.OK,
    message: "Reset email OTP has been sent.",
    otp: otp,
  };
};

/**
 * Sends a forgot password link to the specified email address.
 *
 * @param {string} email - The email address to send the link to.
 * @return {Promise<{statusCode: number, message: string}>} - A promise that resolves when the link is sent
 * successfully. The resolved value is an object with the following properties:
 *   - `statusCode` {number} - The HTTP status code indicating the success of the operation.
 *   - `message` {string} - A message indicating the success of the operation.
 */
export const sendForgotPasswordLink = async (
  email: string
): Promise<{ statusCode: number; message: string }> => {
  let otp = EmailService.generateOtp();

  const exitingOtp = await AuthModel.findOtpByEmail(email);

  if (exitingOtp) {
    await AuthModel.updateExistingOtp(email, otp);
  } else {
    await AuthModel.createOtp(email, otp);
  }

  const user = await UserModel.getUserByEmail(email);

  if (user) {
    await EmailService.sendForgotOtpLink(email, user.id, otp);
    return {
      statusCode: HttpStatusCodes.OK,
      message: "To reset your password, click on the link sent to your email.",
    };
  } else {
    throw new NotFoundError("No such user found.");
  }
};

/**
 * Handles the login request.
 *
 * @param {string} email - The email address of the user.
 * @param {string} userPassword - The password of the user.
 * @return {Promise<{statusCode: number, message: string, user: User, accessToken: string, refreshToken: string}>} - A promise that resolves when the login is successful.
 * The resolved value is an object with the following properties:
 *   - `statusCode` {number} - The HTTP status code indicating the success of the operation.
 *   - `message` {string} - A message indicating the success of the operation.
 *   - `user` {User} - The user object.
 *   - `accessToken` {string} - The access token for the user.
 * @throws {NotFoundError} If no user is found with the associated email.
 * @throws {UnauthenticatedError} If the email or password is incorrect.
 */
export const login = async (
  email: string,
  userPassword: string
): Promise<{
  statusCode: number;
  message: string;
  user: User;
  accessToken: string;
}> => {
  // Fetch existing user by email
  const existingUser = await UserModel.getUserByEmail(email);

  // Throw error when the user data is null
  if (!existingUser) {
    const error = new NotFoundError("No user found with associated email.");
    throw error;
  }

  // Check for password validation
  const isValidPassword = await bcrypt.compare(
    userPassword,
    existingUser.password
  );

  // Throw error on invalid password
  if (!isValidPassword) {
    const error = new UnauthenticatedError("Invalid email or password.");
    throw error;
  }

  // Create a payload
  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    permissions: existingUser.permissions,
    isVerified: existingUser.isVerified,
  };

  // Create access token
  const accessToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.accesstoken_expiry,
  });

  const { password, ...userWithoutPassword } = existingUser;

  // Return success message
  return {
    statusCode: HttpStatusCodes.OK,
    message: "User login successful.",
    user: userWithoutPassword,
    accessToken: accessToken,
  };
};

export const refreshAccessToken = (refreshToken: string) => {
  try {
    // Split the token on empty spacing
    const token = refreshToken.split(" ");

    // Check if the bearer token is provided
    if (token.length !== 2 || token[0] !== "Bearer") {
      // Throw error if token isn't provided
      const error = new NotFoundError("No Bearer token provided.");
      throw error;
    }

    let bearerToken = token[1];

    // Get data by verifying the token
    const decodedToken = verify(bearerToken, config.jwt.jwt_secret!) as Omit<
      User,
      "password"
    >;

    if (!decodedToken) {
      // Throw error if token is null
      const error = new UnauthenticatedError("Invalid token provided.");
      throw error;
    }

    // Create a payload from verified token
    const payload = {
      id: decodedToken.id,
      name: decodedToken.username,
      email: decodedToken.email,
      permissions: decodedToken.permissions,
    };

    // Create new access token
    const accessToken = sign(payload, config.jwt.jwt_secret!, {
      expiresIn: config.jwt.accesstoken_expiry,
    });

    // Return success message
    return { statusCode: HttpStatusCodes.OK, accessToken: accessToken };
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      throw new InvalidError("Invalid token.");
    }
    throw e;
  }
};
