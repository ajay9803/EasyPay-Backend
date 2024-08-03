import { NotFoundError } from "../error/not_found_error";
import { Request as AuthRequest } from "../interfaces/auth";
import { NextFunction, Request, Response } from "express";
import * as KycService from "../services/kyc";

/**
 * Applies for KYC.
 *
 * @param {AuthRequest} req - The request object containing the user's authentication information and the KYC application data.
 * @param {Response} res - The response object to send back to the client.
 * @param {NextFunction} next - The next middleware function.
 * @return {Promise<void>} - A promise that resolves when the function completes.
 * @throws {NotFoundError} - If the user's images are not found.
 */
export const applyForKyc = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.files) {
      throw new NotFoundError("User images not found.");
    }

    const imageFiles = req.files as { [key: string]: Express.Multer.File[] };

    let { citizenshipNumber, citizenshipIssueDate, status } = req.body;

    let userId = req.user!.id;

    const result = await KycService.applyForKyc({
      userId,
      citizenshipNumber,
      citizenshipIssueDate,
      imageFiles,
      status,
    });

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Fetches a KYC application for a user.
 *
 * @async
 * @function fetchKycApplication
 * @param {AuthRequest} req - The request object containing the user's authentication information.
 * @param {Response} res - The response object to send back to the client.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 * @throws {NotFoundError} - If the KYC application is not found.
 */
export const fetchKycApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;

    const result = await KycService.fetchKycApplication(userId);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Fetches KYC applications based on query parameters.
 *
 * @async
 * @function fetchKycApplications
 * @param {AuthRequest} req - The request object containing the user's authentication information.
 * @param {Response} res - The response object to send back to the client.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 * @throws {Error} - If there is an error retrieving the KYC applications.
 */
export const fetchKycApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, size, status, email } = req.query;

    const result = await KycService.fetchKycApplications(
      +page!,
      +size!,
      status!.toString(),
      email!.toString()
    );

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * Verifies a KYC application.
 *
 * @async
 * @function verifyKycApplication
 * @param {Object} req - The request object containing the user's authentication information.
 * @param {Object} res - The response object to send back to the client.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the function completes.
 * @throws {Error} - If there is an error verifying the KYC application.
 */
export const verifyKycApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isVerified, userId } = req.body;
    const result = await KycService.verifyKycApplication(userId, isVerified);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
