import { NextFunction, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import {
  updateEasyPayPoints,
  redeemEasyPayPoints,
} from "../services/easy_pay_point";

export const updateEPayPoints = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const { points } = req.body;

    const result = await updateEasyPayPoints(userId!, +points);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const redeemTheEasyPayPoints = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;

    const result = await redeemEasyPayPoints(userId!);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
