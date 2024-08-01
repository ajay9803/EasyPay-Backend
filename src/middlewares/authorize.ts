import { NextFunction, Response } from "express";
import { Request } from "../interfaces/auth";
import { UnauthorizedError } from "../error/unauthorized_error";

/**
 * Middleware function to authorize a user based on their permissions.
 *
 * @param {string} permission - The required permission to access the resource.
 * @return {Function} - Express middleware function that checks the user's permissions and calls the next middleware or throws an UnauthorizedError if the permission is not included.
 */
export const authorize = (
  permission: string
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get request object with user data
      const user = req.user!;

      // Check if the user has necessary permission to move along the operation
      if (!user.permissions.includes(permission)) {
        next(new UnauthorizedError("Your access is forbidden."));
      }
      next();
    } catch (e) {
      // Throw any occuring error
      throw e;
    }
  };
};
