import { Request as AuthRequest } from "../interfaces/auth";
import { NextFunction, Request, Response } from "express";
import * as BalanceService from "../services/balance";

/**
 * Handles the loadBalance request.
 *
 * @param {AuthRequest} req - The request object containing the authenticated user.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
export const loadBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { bankAccountId, amount, purpose, remarks } = req.body;
    const result = await BalanceService.loadBalance(
      userId,
      bankAccountId,
      amount,
      purpose,
      remarks
    );
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Handles the transferBalance request.
 *
 * @param {AuthRequest} req - The request object containing the authenticated user.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 */
export const transferBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const senderUserId = req.user!.id;

    const result = await BalanceService.transferBalance({
      senderUserId,
      ...req.body,
    });

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
