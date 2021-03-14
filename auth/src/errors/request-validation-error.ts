import { ValidationError } from "express-validator";
import { CustomError } from "./custom-errors";

export class RequestValidationError extends CustomError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Error in Form");

    // Only in typescript because i am extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  createErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
