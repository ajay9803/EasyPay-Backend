import { BaseError } from "./base_error";

/**
 * Class representing an Invalid Error.
 * @extends BaseError
 */
export class InvalidError extends BaseError {
  constructor(message = "Invalid.") {
    super(message);

    this.message = message;
  }
}
