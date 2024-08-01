import { BaseError } from "./base_error";

/**
 * Class representing an Unauthorized Error.
 * @extends BaseError
 */
export class UnauthorizedError extends BaseError {
  constructor(message = "Unauthorized access.") {
    super(message);
    this.message = message;
  }
}
