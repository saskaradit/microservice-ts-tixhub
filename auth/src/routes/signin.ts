import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError, validateRequest } from '@rad-sas/common'
import { User } from '../models/user'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post(
  '/api/users/signin',
  [
    // body('email').isEmail().withMessage('Email must be valid'),
    body('username').trim().notEmpty().withMessage('Username must be valid'),
    body('password').trim().notEmpty().withMessage('You must input a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { username, password } = req.body

    const existingUser = await User.findOne({ username })
    if (!existingUser) {
      throw new BadRequestError('Invalid Credentials')
    }

    const passwordMatch = await Password.compareHash(
      password,
      existingUser?.password
    )

    if (!passwordMatch) {
      throw new BadRequestError('Invalid Credentials')
    }
    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        username: existingUser.username,
      },
      process.env.JWT_KEY!
    )

    // Store on session
    req.session = {
      jwt: userJwt,
    }

    res.status(200).send(existingUser)
  }
)

export { router as signInRouter }
