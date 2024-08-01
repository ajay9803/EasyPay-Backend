import { BaseError } from "./base_error";

/**
 * Class representing a Conflict Error.
 * @extends BaseError
 */
export class ConflictError extends BaseError {
  constructor(message = "Conflict in Resources.") {
    super(message);

    this.message = message;
  }
}
