import { BaseError } from "./base_error";

// class - invalid error
export class InvalidError extends BaseError {
  constructor(message = "Invalid.") {
    super(message);

    this.message = message;
  }
}
