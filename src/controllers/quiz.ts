import { NextFunction, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import { createTheQuizData,fetchTheQuizData } from "../services/quiz";

export const createQuizData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const { points } = req.body;

    const result = await createTheQuizData(userId, +points);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const fetchQuizData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const result = await fetchTheQuizData(userId);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
