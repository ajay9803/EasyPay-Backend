import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { BadRequestError } from "../error/bad_request_error";

/**
 * Validates the request parameters against a given schema.
 *
 * @param {Schema} schema - The schema to validate the request parameters against.
 * @return {Function} - The middleware function that validates the request parameters.
 */
export const validateRequestParams = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      next(new BadRequestError(error.message));
    }

    req.query = value;

    next();
  };
};

/**
 * Validates the request body against a given schema.
 *
 * @param {Schema} schema - The schema to validate the request body against.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} - The middleware function that validates the request body.
 */
export const validateReqBody = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      next(new BadRequestError(error.message));
    }

    req.body = value;

    next();
  };
};

/**
 * Validates the request query parameters against a given schema.
 *
 * @param {Schema} schema - The schema to validate the request query parameters against.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} - The middleware function that validates the request query parameters.
 */
export const validateReqQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      next(new BadRequestError(error.message));
      return;
    }

    req.query = value;

    next();
  };
};
