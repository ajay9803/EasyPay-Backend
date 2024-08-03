import { ConflictError } from "../error/conflict_error";
import { IKycApplication, IReqKyc } from "../interfaces/kyc";
import { KycModel } from "../models/kyc";
import {
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../firebase";
import { NotFoundError } from "../error/not_found_error";
import HttpStatusCodes from "http-status-codes";

/**
 * Applies for KYC.
 *
 * @param {IReqKyc} kyc - The KYC application data.
 * @return {Promise<any>} - A promise that resolves when the function completes.
 * @throws {ConflictError} - If the user has an existing KYC application that is pending or already verified.
 * @throws {NotFoundError} - If the user's images are not found.
 */
export const applyForKyc = async (kyc: IReqKyc): Promise<any> => {
  const existingKycApplication = await KycModel.fetchExistingKycApplication(
    kyc.userId
  );

  /**
   * Throw error, if the application's state is Pending or already Verified.
   */
  if (existingKycApplication) {
    if (existingKycApplication.status === "Pending") {
      throw new ConflictError("Your application is on pending.");
    } else if (existingKycApplication.status === "Verified") {
      throw new ConflictError("Your account is already verified.");
    }
  }

  /**
   * Get images files.
   */
  const firstKey = Object.keys(kyc.imageFiles)[0];
  const userPhoto = kyc.imageFiles[firstKey][0];

  const secondKey = Object.keys(kyc.imageFiles)[1];
  const citizenshipPhoto = kyc.imageFiles[secondKey][0];

  /**
   * Create storage reference for firebase storage
   */
  const userImageStorageRef = ref(
    storage,
    `user-images/${kyc.userId}/${userPhoto.originalname}`
  );
  const userImageMetaData = {
    contentType: userPhoto.mimetype,
  };

  /**
   * Upload images to firebase.
   */
  const userImageSnapshot = await uploadBytesResumable(
    userImageStorageRef,
    userPhoto.buffer,
    userImageMetaData
  );

  /**
   * Get image url.
   */
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

/**
 * Fetches a KYC application for a user.
 *
 * @async
 * @function fetchKycApplication
 * @param {string} userId - The ID of the user.
 * @returns {Promise<any>} - A promise that resolves to an object with the status code, message, and KYC application details.
 * @throws {NotFoundError} - If the KYC application is not found.
 */
export const fetchKycApplication = async (
  userId: string
): Promise<any> => {
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

/**
 * Fetches KYC applications based on query parameters.
 *
 * @async
 * @function fetchKycApplications
 * @param {number} page - The page number of the KYC applications to fetch.
 * @param {number} size - The number of KYC applications to fetch per page.
 * @param {string} status - The status of the KYC applications to fetch.
 *   Valid values are "Pending", "Verified", "Rejected", and "All".
 * @param {string} email - The email of the user whose KYC applications to fetch.
 * @returns {Promise<any>} - A promise that resolves to an object with the status code, message, and an array of KYC applications.
 */
export const fetchKycApplications = async (
  page: number,
  size: number,
  status: string,
  email: string
): Promise<any> => {
  const kycApplications = await KycModel.fetchKycApplications(
    page,
    size,
    status,
    email
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

/**
 * Verifies a KYC application.
 *
 * @async
 * @function verifyKycApplication
 * @param {string} userId - The ID of the user whose application to verify.
 * @param {boolean} isVerified - Whether to mark the application as verified or rejected.
 * @returns {Promise<any>} - A promise that resolves to an object with the status code, message, and an array of KYC applications.
 * @throws {Error} - If there is an error verifying the KYC application.
 */
export const verifyKycApplication = async (
  userId: string,
  isVerified: boolean
): Promise<any> => {
  await KycModel.verifyKycApplication(userId, isVerified);
  return {
    statusCode: HttpStatusCodes.OK,
    message: isVerified
      ? "Your Kyc application has been verified."
      : "Your KYC application has been rejected.",
  };
};
