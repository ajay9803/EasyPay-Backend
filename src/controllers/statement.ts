import { NextFunction, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import * as StatementService from "../services/statement";

/**
 * Fetches the load fund transactions for a user.
 *
 * @param {AuthRequest} req - The request object containing user information.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 * @throws {Error} - If an error occurs during the operation.
 */
export const fetchLoadFundTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const result = await StatementService.fetchLoadFundTransactions(userId);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Fetches a load fund transaction by its ID for a user.
 *
 * @param {AuthRequest} req - The request object containing user information.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 * @throws {Error} - If an error occurs during the operation.
 */
export const fetchLoadFundTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const result = await StatementService.fetchLoadFundTransaction(id, userId!);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Fetches balance transfer statements for a user.
 *
 * @param {AuthRequest} req - The request object containing user information.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 * @throws {Error} - If an error occurs during the operation.
 */
export const getBalanceTransferStatements = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { page, size, cashFlow, startDate, endDate } = req.query;
    const result = await StatementService.getBalanceTransferStatements(
      userId,
      +page!,
      +size!,
      cashFlow!.toString(),
      +startDate!,
      +endDate!
    );

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
