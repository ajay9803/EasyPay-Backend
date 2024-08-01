import BaseModel from "./base";

export class EasyPayPointsModel extends BaseModel {
  static updateEasyPayPoints = async (userId: string, points: number) => {
    await this.queryBuilder()
      .update({
        easyPayPoints: points,
      })
      .table("users")
      .where("id", userId);
  };

  static redeemEasyPayPoints = async (userId: string, points: number) => {
    await this.queryBuilder()
      .update({
        easyPayPoints: points,
      })
      .table("users")
      .where("id", userId);
  }
}
