import { NextFunction, Response } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import { createSocket, deleteSocket } from "../services/socket";

export const createTheSocket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const { socketId } = req.body;

    const result = await createSocket(socketId, +userId);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const deleteTheSocket = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const result = await deleteSocket(+userId);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
