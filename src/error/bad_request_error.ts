/**
 * Class representing a Bad Request error.
 * @extends Error
 */
export class BadRequestError extends Error {
  constructor(message = "Bad Request") {
    super(message);

    this.message = message;
  }
}
