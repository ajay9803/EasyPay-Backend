import BaseModel from "./base";

class AuthModel extends BaseModel {
  static findOtpByEmail = async (email: string) => {
    const otp = await this.queryBuilder()
      .select()
      .from("otps")
      .where("email", email)
      .first();


    return otp;
  };

  static createOtp = async (email: string, otp: string) => {
    let newOtpData = {
      email: email,
      otp: otp,
    };
    await this.queryBuilder().insert(newOtpData).table("otps");
  };

  static updateExistingOtp = async (email: string, otp: string) => {
    let newOtpData = {
      email: email,
      otp: otp,
    };
    await this.queryBuilder()
      .update(newOtpData)
      .table("otps")
      .where("email", email);
  };
}

export default AuthModel;
