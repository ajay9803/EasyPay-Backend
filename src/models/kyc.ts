import { IKyc } from "../interfaces/kyc";
import BaseModel from "./base";

export class KycModel extends BaseModel {
  static fetchExistingKycApplication = async (userId: string) => {
    const existingKyc = await this.queryBuilder()
      .select()
      .from("kyc_applications")
      .where("user_id", userId)
      .first();

    console.log("the existing kyc is: ", existingKyc);

    return existingKyc;
  };

  static applyForKyc = async (kyc: Omit<IKyc, "id">) => {
    await this.queryBuilder().insert(kyc).table("kyc_applications");
  };

  static fetchKycApplication = async (userId: string) => {
    const existingKyc = await this.queryBuilder()
      .select()
      .from("kyc_applications")
      .where("user_id", userId)
      .first();

    return existingKyc;
  };

  static fetchKycApplications = async (
    page: number,
    size: number,
    status: string
  ) => {
    const query = this.queryBuilder()
      .select()
      .from("kyc_applications")
      .join("users", "users.id", "kyc_applications.user_id")
      .limit(size)
      .offset((page - 1) * size);
    let applications;
    if (status !== "All") {
      console.log("Not here.");
      applications = await query.where("status", status);
    } else {
      console.log("Status is: ", status);
      applications = await query;
      console.log(applications);
    }

    return applications;
  };

  static verifyKycApplication = async (userId: string, isVerified: boolean) => {
    await this.queryBuilder()
      .update("status", isVerified ? "Verified" : "Rejected")
      .from("kyc_applications")
      .where("user_id", userId);

    await this.queryBuilder()
      .update("is_verified", isVerified)
      .from("users")
      .where("id", userId);
  };
}
