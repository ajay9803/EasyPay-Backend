import * as BankAccountService from "../services/bank_account";
import { Response, NextFunction } from "express";
import { Request as AuthRequest } from "../interfaces/auth";

export const getBankAccounts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await BankAccountService.fetchBankAccounts(req.user!.id);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
