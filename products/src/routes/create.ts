import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Product } from '../models/products'
import { requireAuth, validateRequest } from '@rad-sas/common'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.post(
  '/api/products',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('desc').not().isEmpty().withMessage('Please input a description '),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    body('image').not().isEmpty().withMessage('Please input an image link'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, image, desc } = req.body

    const product = Product.build({
      title,
      price,
      image,
      desc,
      userId: req.currentUser!.id,
    })
    await product.save()

    res.status(201).send(product)
  }
)

export { router as createProductRouter }
