/**
 * Base class for all application errors.
 *
 * @class
 * @extends Error
 */
export class BaseError extends Error {
  constructor(message = "Something went wrong.") {
    super(message);

    this.message = message;
  }
}
