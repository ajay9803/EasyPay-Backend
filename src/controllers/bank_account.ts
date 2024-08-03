import * as BankAccountService from "../services/bank_account";
import { Response, NextFunction } from "express";
import { Request as AuthRequest } from "../interfaces/auth";

/**
 * Controller function to fetch bank accounts.
 * 
 * @param {AuthRequest} req - The authenticated request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @return {Promise<void>} - A promise that resolves when the request is handled.
 */
export const getBankAccounts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await BankAccountService.fetchBankAccounts(req.user!.id);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
