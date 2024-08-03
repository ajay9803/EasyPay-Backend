import { BadRequestError } from "../error/bad_request_error";
import { NotFoundError } from "../error/not_found_error";
import { EasyPayPointsModel } from "../models/easy_pay_point";
import NotificationModel from "../models/notification";
import UserModel from "../models/user";
import HttpStatusCodes from "http-status-codes";

/**
 * Updates the easy pay points of a user.
 *
 * @async
 * @function updateEasyPayPoints
 * @param {string} userId - The ID of the user.
 * @param {number} points - The number of points to be updated.
 * @throws {NotFoundError} If the user is not found.
 * @throws {BadRequestError} If the user does not have enough points.
 * @returns {Promise<{statusCode: number, message: string}>} The result of the update.
 */
export const updateEasyPayPoints = async (
  userId: string,
  points: number
): Promise<{ statusCode: number; message: string }> => {
  const user = await UserModel.getUserById(userId);

  if (!user) {
    throw new NotFoundError("No user found.");
  }

  /**
   * Add up new points to existing user points.
   */
  const newPoints: number = +user.easyPayPoints + points;

  await EasyPayPointsModel.updateEasyPayPoints(userId, newPoints);

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Points updated successfully.",
  };
};

export const redeemEasyPayPoints = async (userId: string) => {
  const user = await UserModel.getUserById(userId);

  if (!user) {
    throw new NotFoundError("No user found.");
  }

  const easyPayPoints = +user.easyPayPoints;

  /**
   * Check if the user has enough points to redeem.
   */
  if (easyPayPoints < 50) {
    throw new BadRequestError("You do not have enough points to redeem.");
  }

  /**
   * Get remaining points.
   * Redeem the cash equivalent of the points.
   */
  const remainingPoints = easyPayPoints % 50;
  const redeemedCash = Math.floor(easyPayPoints / 50) * 5;

  const newBalance = redeemedCash + +user.balance;

  await EasyPayPointsModel.updateEasyPayPoints(userId, remainingPoints);

  await UserModel.updateBalance(userId, newBalance).then(async () => {
    await NotificationModel.createBasicNotification(
      userId,
      `You redeemed Rs.${redeemedCash} from Easy Pay Points.`,
      "Redeem Easy Pay Points",
      "0"
    );
  });

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Easy Pay Points redeemed successfully.",
  };
};
