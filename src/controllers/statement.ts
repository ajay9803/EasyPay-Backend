import { NextFunction, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import * as StatementService from "../services/statement";

export const fetchLoadFundTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const result = await StatementService.fetchLoadFundTransactions(userId);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const getBalanceTransferStatements = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;
    const { page, size, cashFlow, startDate, endDate } = req.query;
    const result = await StatementService.getBalanceTransferStatements(
      userId,
      +page!,
      +size!,
      cashFlow!.toString(),
      +startDate!,
      +endDate!,
    );

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
