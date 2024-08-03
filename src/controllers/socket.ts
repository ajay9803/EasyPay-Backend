import { NextFunction, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import { createSocket, deleteSocket } from "../services/socket";

/**
 * Create a socket for a user.
 *
 * @param {AuthRequest} req - The request object containing user information.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 * @return {Promise<void>} - A promise that resolves when the socket is created.
 */
export const createTheSocket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { socketId } = req.body;

    const result = await createSocket(socketId, +userId);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Delete a socket for a user.
 *
 * @param {AuthRequest} req - The request object containing user information.
 * @param {Response} res - The response object to send the result.
 * @param {NextFunction} next - The next function to call in the middleware chain.
 * @return {Promise<void>} - A promise that resolves when the socket is deleted.
 */
export const deleteTheSocket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const result = await deleteSocket(+userId);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
