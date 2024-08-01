import { Response, NextFunction } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import { fetchNotifications } from "../services/notification";

export const fetchTheNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const { page, size } = req.query;

    const result = await fetchNotifications(userId, +size!, +page!);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
