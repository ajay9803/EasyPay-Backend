import { BaseError } from "./base_error";

/**
 * Error class for when a resource is not found.
 * @extends BaseError
 */
export class NotFoundError extends BaseError {
    constructor(message = "Not found.") {
        super(message);

        this.message = message;
    }
}