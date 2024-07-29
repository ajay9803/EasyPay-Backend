import { IKyc, IKycApplication } from "../interfaces/kyc";
import BaseModel from "./base";

export class KycModel extends BaseModel {
  /**
   * Fetches the existing KYC application for a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<object | null>} A promise that resolves to the existing KYC application, or null if not found.
   */
  static fetchExistingKycApplication = async (
    userId: string
  ): Promise<IKycApplication | null> => {
    const existingKyc = await this.queryBuilder()
      .select()
      .from("kyc_applications")
      .where("user_id", userId)
      .first();

    return existingKyc;
  };

  /**
   * Submits a new KYC application.
   * @param {Omit<IKyc, "id">} kyc - The KYC application data.
   * @returns {Promise<void>}
   */
  static applyForKyc = async (kyc: Omit<IKyc, "id">): Promise<void> => {
    await this.queryBuilder().insert(kyc).table("kyc_applications");
  };

  /**
   * Fetches the KYC application for a user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<IKycApplication | null>} A promise that resolves to the KYC application, or null if not found.
   */
  static fetchKycApplication = async (
    userId: string
  ): Promise<object | null> => {
    const existingKyc = await this.queryBuilder()
      .select()
      .from("kyc_applications")
      .where("user_id", userId)
      .first();

    return existingKyc;
  };

  /**
   * Fetches KYC applications with pagination and status filtering.
   * @param {number} page - The page number.
   * @param {number} size - The number of records per page.
   * @param {string} status - The status of the KYC applications to fetch.
   * @returns {Promise<Array<IKycApplication>>} A promise that resolves to an array of KYC applications.
   */
  static fetchKycApplications = async (
    page: number,
    size: number,
    status: string
  ): Promise<Array<IKycApplication>> => {
    // Construct the base query for fetching KYC applications
    const query = this.queryBuilder()
      .select()
      .from("kyc_applications")
      .join("users", "users.id", "kyc_applications.user_id")
      .limit(size)
      .offset((page - 1) * size);

    // Fetch applications based on the status filter
    let applications: IKycApplication[];
    if (status !== "All") {
      applications = await query.where("status", status);
    } else {
      applications = await query;
    }

    return applications;
  };

  /**
   * Verifies or rejects a KYC application.
   * @param {string} userId - The ID of the user.
   * @param {boolean} isVerified - Whether the application is verified.
   * @returns {Promise<void>}
   */
  static verifyKycApplication = async (
    userId: string,
    isVerified: boolean
  ): Promise<void> => {
    // Update the status of the KYC application
    await this.queryBuilder()
      .update("status", isVerified ? "Verified" : "Rejected")
      .from("kyc_applications")
      .where("user_id", userId);

    // Update the verification status of the user
    await this.queryBuilder()
      .update("is_verified", isVerified)
      .from("users")
      .where("id", userId);
  };
}
