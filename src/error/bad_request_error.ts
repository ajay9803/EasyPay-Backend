// class - bad request error
export class BadRequestError extends Error {
    constructor(message = "Bad Request") {
        super(message);

        this.message = message;
    }
}