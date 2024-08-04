import { IOtp } from "../interfaces/otp";
import BaseModel from "./base";

class AuthModel extends BaseModel {
  /**au
   * Finds an OTP by email.
   * @param {string} email - The email to search for.
   * @returns {Promise<Object>} The OTP object if found, otherwise null.
   */
  static findOtpByEmail = async (email: string): Promise<IOtp | null> => {
    const otp = await this.queryBuilder()
      .select()
      .from("otps")
      .where("email", email)
      .first();

    return otp;
  };

  /**
   * Creates a new OTP record.
   * @param {string} email - The email associated with the OTP.
   * @param {string} otp - The OTP to be stored.
   * @returns {Promise<void>}
   */
  static createOtp = async (email: string, otp: string): Promise<void> => {
    let newOtpData = {
      email: email,
      otp: otp,
      createdAt: new Date().getTime(),
    };
    await this.queryBuilder().insert(newOtpData).table("otps");
  };

  /**
   * Updates an existing OTP record.
   * @param {string} email - The email associated with the OTP.
   * @param {string} otp - The new OTP to be updated.
   * @returns {Promise<void>}
   */
  static updateExistingOtp = async (
    email: string,
    otp: string
  ): Promise<void> => {
    let newOtpData = {
      email: email,
      otp: otp,
      createdAt: new Date().getTime(),
    };
    await this.queryBuilder()
      .update(newOtpData)
      .table("otps")
      .where("email", email);
  };
}

export default AuthModel;
