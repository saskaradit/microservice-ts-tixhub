import { CustomError } from "./custom-errors";
export class DatabaseConnectionError extends CustomError {
  statusCode = 503;
  reason = "Error connecting to database";
  constructor() {
    super("Error Connecting to DB");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  createErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
