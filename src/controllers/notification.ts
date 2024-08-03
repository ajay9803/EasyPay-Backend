import { Response, NextFunction } from "express";
import { Request as AuthRequest } from "../interfaces/auth";
import { fetchNotifications } from "../services/notification";

/**
 * Fetches the notifications for the authenticated user.
 *
 * @async
 * @function fetchTheNotifications
 * @param {AuthRequest} req - The request object containing the authenticated user.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function in the middleware chain.
 * @returns {Promise<void>} A promise that resolves when the notifications are successfully fetched.
 * @throws {Error} If an error occurs while fetching the notifications.
 */
export const fetchTheNotifications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const { page, size } = req.query;

    const result = await fetchNotifications(userId, +size!, +page!);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
