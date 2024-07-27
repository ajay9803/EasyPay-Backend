import { Request as AuthRequest } from "../interfaces/auth";
import { NextFunction, Request, Response } from "express";
import * as BalanceService from "../services/balance";

export const loadBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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

export const transferBalance = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
