import BaseModel from "./base";

export class EasyPayPointsModel extends BaseModel {
  /**
   * Updates the easy pay points for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {number} points - The new easy pay points.
   * @return {Promise<void>} - A promise that resolves when the points are updated.
   */
  static updateEasyPayPoints = async (
    userId: string,
    points: number
  ): Promise<void> => {
    await this.queryBuilder()
      .update({
        easyPayPoints: points,
      })
      .table("users")
      .where("id", userId);
  };

  /**
   * Redeems the easy pay points for a user.
   *
   * @param {string} userId - The ID of the user.
   * @param {number} points - The number of points to redeem.
   * @return {Promise<void>} - A promise that resolves when the points are redeemed.
   */
  static redeemEasyPayPoints = async (
    userId: string,
    points: number
  ): Promise<void> => {
    await this.queryBuilder()
      .update({
        easyPayPoints: points,
      })
      .table("users")
      .where("id", userId);
  };
}
