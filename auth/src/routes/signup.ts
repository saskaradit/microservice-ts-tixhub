import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

const router = express.Router();

router.post(
  "api/users/signUp",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    body("username")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Username must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response) => {
    const err = validationResult(req);

    if (!err.isEmpty()) {
      throw new RequestValidationError(err.array());
    }

    console.log("Creating a user...");
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signUpRouter };
