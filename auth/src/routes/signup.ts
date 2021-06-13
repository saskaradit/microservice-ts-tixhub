import express, { Request, Response } from 'express';
import { User } from '../models/user';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from './middlewares/validate-request';
import { BadRequestError } from '../errors/bad-request-errors';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('username')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Username must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, username, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestError('Email already used');
    } else {
      existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new BadRequestError('Username already used');
      }
    }

    const user = User.build({ username, email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      process.env.JWT_KEY!
    );

    // Store on session
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
