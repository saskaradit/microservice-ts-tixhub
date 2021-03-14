import { CustomError } from "./custom-errors";

export class BadRequestError extends CustomError {
  statusCode = 400;
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  createErrors() {
    return [{ message: this.message }];
  }
}
