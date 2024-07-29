import { ConflictError } from "../error/conflict_error";
import { IReqKyc } from "../interfaces/kyc";
import { KycModel } from "../models/kyc";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../firebase";
import { NotFoundError } from "../error/not_found_error";
import HttpStatusCodes from "http-status-codes";

export const applyForKyc = async (kyc: IReqKyc) => {
  const existingKycApplication = await KycModel.fetchExistingKycApplication(
    kyc.userId
  );

  if (existingKycApplication) {
    if (existingKycApplication.status === "Pending") {
      throw new ConflictError("Your application is on pending.");
    } else if (existingKycApplication.status === "Verified") {
      throw new ConflictError("Your account is already verified.");
    }
  }

  const firstKey = Object.keys(kyc.imageFiles)[0];
  const userPhoto = kyc.imageFiles[firstKey][0];

  const secondKey = Object.keys(kyc.imageFiles)[1];
  const citizenshipPhoto = kyc.imageFiles[secondKey][0];

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

  await KycModel.applyForKyc({
    userId: kyc.userId,
    citizenshipNumber: kyc.citizenshipNumber,
    citizenshipIssueDate: kyc.citizenshipIssueDate,
    userPhotoUrl: userImageUrl,
    citizenshipPhotoUrl: ctzUrl,
    status: kyc.status,
  });

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Your application has been sent for review.",
  };
};

export const fetchKycApplication = async (userId: string) => {
  const kycApplication = await KycModel.fetchKycApplication(userId);

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
  size: number,
  status: string
) => {
  const kycApplications = await KycModel.fetchKycApplications(
    page,
    size,
    status
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
  await KycModel.verifyKycApplication(userId, isVerified);
  return {
    statusCode: HttpStatusCodes.OK,
    message: isVerified
      ? "Your Kyc application has been verified."
      : "Your KYC application has been rejected.",
  };
};
