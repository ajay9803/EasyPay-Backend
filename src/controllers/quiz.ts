import { NextFunction, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import { createTheQuizData, fetchTheQuizData } from "../services/quiz";

/**
 * Handles the request to create quiz data.
 *
 * @async
 * @function
 * @name createQuizData
 * @param {AuthRequest} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {Promise<void>} A promise that resolves when the request is handled.
 */
export const createQuizData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { points } = req.body;

    const result = await createTheQuizData(userId, +points);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Handles the request to fetch quiz data.
 *
 * @async
 * @function
 * @name fetchQuizData
 * @param {AuthRequest} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {Promise<void>} A promise that resolves when the request is handled.
 */

export const fetchQuizData = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const result = await fetchTheQuizData(userId);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
