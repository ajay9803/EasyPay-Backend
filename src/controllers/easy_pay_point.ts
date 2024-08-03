import { NextFunction, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import {
  updateEasyPayPoints,
  redeemEasyPayPoints,
} from "../services/easy_pay_point";

/**
 * Updates the easy pay points for a user.
 *
 * @async
 * @function updateEPayPoints
 * @param {AuthRequest} req - The express request object containing the user's id.
 * @param {Response} res - The express response object.
 * @param {NextFunction} next - The express next function.
 * @return {Promise<void>} - A promise that resolves when the points are updated.
 * @throws {Error} - If there is an error updating the points.
 */
export const updateEPayPoints = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const { points } = req.body;

    const result = await updateEasyPayPoints(userId!, +points);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Redeems the easy pay points for a user.
 *
 * @async
 * @function redeemTheEasyPayPoints
 * @param {AuthRequest} req - The express request object containing the user's id.
 * @param {Response} res - The express response object.
 * @param {NextFunction} next - The express next function.
 * @return {Promise<void>} - A promise that resolves when the points are redeemed.
 * @throws {Error} - If there is an error redeeming the points.
 */
export const redeemTheEasyPayPoints = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const result = await redeemEasyPayPoints(userId!);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
