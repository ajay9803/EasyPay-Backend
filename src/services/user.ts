import { ConflictError } from "../error/conflict_error";
import { NotFoundError } from "../error/not_found_error";
import { User } from "../interfaces/user";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import HttpStatusCodes from "http-status-codes";
import * as AuthService from "../services/auth";
import { InvalidError } from "../error/invalid_error";
import { UnauthenticatedError } from "../error/unauthenticated_error";
import BankAccountModel from "../models/bank_account";
import { IReqKyc } from "../interfaces/kyc";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../firebase";
import fs from "fs";

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

export const applyForKyc = async (kyc: IReqKyc) => {
  const firstKey = Object.keys(kyc.imageFiles)[0];
  const userPhoto = kyc.imageFiles[firstKey][0];

  const secondKey = Object.keys(kyc.imageFiles)[1];
  const citizenshipPhoto = kyc.imageFiles[secondKey][0];

  console.log(userPhoto, citizenshipPhoto);

  const userImageStorageRef = ref(
    storage,
    `user-images/${kyc.userId}/${userPhoto.originalname}`
  );
  const userImageMetaData = {
    contentType: userPhoto.mimetype,
  };
  const userImageSnapshot = await uploadBytesResumable(
    userImageStorageRef,
    userPhoto.buffer,
    userImageMetaData
  );
  const userImageUrl = await getDownloadURL(userImageSnapshot.ref);

  const ctzImageStorageRef = ref(
    storage,
    `user-citizenships/${kyc.userId}/${citizenshipPhoto.originalname}`
  );
  const ctzImageMetaData = {
    contentType: citizenshipPhoto.mimetype,
  };
  const ctzImageSnapshot = await uploadBytesResumable(
    ctzImageStorageRef,
    citizenshipPhoto.buffer,
    ctzImageMetaData
  );
  const ctzUrl = await getDownloadURL(ctzImageSnapshot.ref);
  console.log(ctzUrl);

  await UserModel.applyForKyc({
    userId: kyc.userId,
    citizenshipNumber: kyc.citizenshipNumber,
    citizenshipIssueDate: kyc.citizenshipIssueDate,
    userPhotoUrl: userImageUrl,
    citizenshipPhotoUrl: ctzUrl,
  });

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Your application has been sent for review.",
  };
};

export const fetchKycApplication = async (userId: string) => {
  const kycApplication = await UserModel.fetchKycApplication(userId);

  if (!kycApplication) {
    throw new NotFoundError("You haven't submitted your KYC application.");
  } else {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "Kyc application fetched successfully.",
      application: kycApplication,
    };
  }
};

export const fetchKycApplications = async (
  page: number,
  size: number
) => {
  const kycApplications = await UserModel.fetchKycApplications(
    page,
    size
  );

  if (kycApplications.length === 0) {
    throw new NotFoundError("No applications found.");
  } else {
    return {
      statusCode: HttpStatusCodes.OK,
      message: "Kyc applications fetched successfully.",
      applications: kycApplications,
    };
  }
};

export const verifyKycApplication = async (
  userId: string,
  isVerified: boolean
) => {
  await UserModel.verifyKycApplication(userId, isVerified);
  return {
    statusCode: HttpStatusCodes.OK,
    message: isVerified
      ? "Your Kyc application has been verified."
      : "Your KYC application has been rejected.",
  };
};

export const loadBalance = async (
  userId: string,
  bankAccountId: string,
  amount: number
) => {
  await UserModel.loadBalance(userId, bankAccountId, amount);
  return {
    statusCode: HttpStatusCodes.OK,
    message: `You've successfully loaded Rs.${amount}.`,
  }
};
