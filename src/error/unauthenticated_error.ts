import { BaseError } from "./base_error";

// class - unauthenticated error
export class UnauthenticatedError extends BaseError {
  constructor(message = "Authentication failed.") {
    super(message);

    this.message = message;
  }
}
