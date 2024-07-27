import { NotFoundError } from "../error/not_found_error";
import { Request as AuthRequest } from "../interfaces/auth";
import { NextFunction, Request, Response } from "express";
import * as KycService from "../services/kyc";

export const applyForKyc = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.files) {
      throw new NotFoundError("User images not found.");
    }

    const imageFiles = req.files as { [key: string]: Express.Multer.File[] };
    console.log(imageFiles);

    let { citizenshipNumber, citizenshipIssueDate, status } = req.body;
    console.log(
      "The values are: ",
      citizenshipNumber,
      citizenshipIssueDate,
      status
    );
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
    console.log("The error is: ", e);
    next(e);
  }
};

export const fetchKycApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user!.id;

    const result = await KycService.fetchKycApplication(userId);

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const fetchKycApplications = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page, size, status } = req.query;

    const result = await KycService.fetchKycApplications(
      +page!,
      +size!,
      status!.toString()
    );

    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};

export const verifyKycApplication = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { isVerified, userId } = req.body;
    const result = await KycService.verifyKycApplication(userId, isVerified);
    res.status(result.statusCode).json(result);
  } catch (e) {
    next(e);
  }
};
