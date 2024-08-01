import { BadRequestError } from "../error/bad_request_error";
import { NotFoundError } from "../error/not_found_error";
import { EasyPayPointsModel } from "../models/easy_pay_point";
import UserModel from "../models/user";
import HttpStatusCodes from "http-status-codes";

export const updateEasyPayPoints = async (userId: string, points: number) => {
  const user = await UserModel.getUserById(userId);

  if (!user) {
    throw new NotFoundError("No user found.");
  }

  const newPoints: number = +user.easyPayPoints + points;

  await EasyPayPointsModel.updateEasyPayPoints(userId, newPoints);

  return {
    statusCode: HttpStatusCodes.OK,
    messsage: "Points updated successfully.",
  };
};


export const redeemEasyPayPoints = async (userId: string) => {
  const user = await UserModel.getUserById(userId);

  if (!user) {
    throw new NotFoundError("No user found.");
  }

  const easyPayPoints = +user.easyPayPoints;
  if (easyPayPoints < 50) {
    throw new BadRequestError("You do not have enough points to redeem.");
  }
  const remainingPoints = easyPayPoints % 50;
  const redeemedCash = Math.floor(easyPayPoints / 50) * 5;

  const newBalance = redeemedCash + +user.balance;

  await EasyPayPointsModel.updateEasyPayPoints(userId, remainingPoints);

  await UserModel.updateBalance(userId, newBalance);

  return {
    statusCode: HttpStatusCodes.OK,
    message: "Easy Pay Points redeemed successfully.",
  };
};