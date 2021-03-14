import { CustomError } from "./custom-errors";

export class RouteError extends CustomError {
  statusCode = 404;

  constructor() {
    super("Route not found");

    Object.setPrototypeOf(this, RouteError.prototype);
  }

  createErrors() {
    return [{ message: "Route not found" }];
  }
}
