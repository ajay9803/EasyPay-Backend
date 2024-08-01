import { BaseError } from "./base_error";

/**
 * Class representing an Unauthenticated Error.
 * @extends BaseError
 */
export class UnauthenticatedError extends BaseError {
  constructor(message = "Authentication failed.") {
    super(message);

    this.message = message;
  }
}
