import config from "../config";
import { InvalidError } from "../error/invalid_error";
import { NotFoundError } from "../error/not_found_error";
import { UnauthenticatedError } from "../error/unauthenticated_error";
import bcrypt from "bcrypt";
import { verify, sign, JsonWebTokenError } from "jsonwebtoken";
import { User } from "../interfaces/user";
import HttpStatusCodes from "http-status-codes";
import * as UserModel from "../models/user";
import AuthModel from "../models/auth";
import * as EmailService from "../utils/node_mailer";

export const verifyOtp = async (email: string, otp: string) => {
  const existingOtp = await AuthModel.findOtpByEmail(email);
  const currentTime = new Date();
  const otpCreationTime = new Date(existingOtp.created_at);
  const timeDifference =
    (currentTime.getTime() - otpCreationTime.getTime()) / 1000;

  if (timeDifference <= 60) {
    if (existingOtp.otp === otp) {
      return true;
    } else {
      return false;
    }
  } else {
    throw new InvalidError("OTP has expired.");
  }
};

export const sendSignupOtp = async (email: string) => {
  let otp = EmailService.generateOtp();

  const exitingOtp = await AuthModel.findOtpByEmail(email);

  if (exitingOtp) {
    console.log("The otp does exist.");
    await AuthModel.updateExistingOtp(email, otp);
  } else {
    console.log("The otp does not exist.");
    await AuthModel.createOtp(email, otp);
  }

  await EmailService.sendSignupOtp(email, otp);
  return {
    statusCode: 200,
    message: "Sign up OTP has been sent.",
    otp: otp,
  };
};

export const verifySignupOtp = async (sentOtp: string, receivedOtp: string) => {
  if (sentOtp === receivedOtp) {
    return true;
  } else {
    return false;
  }
};

export const login = async (email: string, password: string) => {
  // fetch existing user by email
  const existingUser = await UserModel.UserModel.getUserByEmail(email);

  // throw error when the user data is null
  if (!existingUser) {
    const error = new NotFoundError("No user found with associated email.");
    throw error;
  }

  // check for password validation
  const isValidPassword = await bcrypt.compare(password, existingUser.password);

  // throw error on invalid password
  if (!isValidPassword) {
    const error = new UnauthenticatedError("Invalid email or password.");
    throw error;
  }

  // create a payload
  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    permissions: existingUser.permissions,
  };

  // create access token
  const accessToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.accesstoken_expiry,
  });

  // create refresh token
  const refreshToken = sign(payload, config.jwt.jwt_secret!, {
    expiresIn: config.jwt.refreshtoken_expiry,
  });

  // return success message
  return {
    statusCode: HttpStatusCodes.OK,
    message: "User login successful.",
    user: existingUser,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const refreshAccessToken = (refreshToken: string) => {
  try {
    // split the token on empty spacing
    const token = refreshToken.split(" ");

    // check if the bearer token is provided
    if (token.length !== 2 || token[0] !== "Bearer") {
      // throw error if token isn't provided
      const error = new NotFoundError("No Bearer token provided.");
      throw error;
    }

    let bearerToken = token[1];

    // get data by verifying the token
    const decodedToken = verify(bearerToken, config.jwt.jwt_secret!) as Omit<
      User,
      "password"
    >;

    if (!decodedToken) {
      // throw error if token is null
      const error = new UnauthenticatedError("Invalid token provided.");
      throw error;
    }

    // create a payload from verified token
    const payload = {
      id: decodedToken.id,
      name: decodedToken.username,
      email: decodedToken.email,
      permissions: decodedToken.permissions,
    };

    // create new access token
    const accessToken = sign(payload, config.jwt.jwt_secret!, {
      expiresIn: config.jwt.accesstoken_expiry,
    });

    // return success message
    return { statusCode: HttpStatusCodes.OK, accessToken: accessToken };
  } catch (e) {
    if (e instanceof JsonWebTokenError) {
      throw new InvalidError("Invalid token.");
    }
    throw e;
  }
};
