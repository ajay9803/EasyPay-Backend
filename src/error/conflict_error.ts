import { BaseError } from "./base_error";

// class - conflict error
export class ConflictError extends BaseError {
  constructor(message = "Conflict in Resources.") {
    super(message);

    this.message = message;
  }
}
