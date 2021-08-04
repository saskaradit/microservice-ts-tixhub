import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Product } from '../models/products'
import {
  BadRequestError,
  NotAuthorizedError,
  requireAuth,
  RouteError,
  validateRequest,
} from '@rad-sas/common'
import { natsWrapper } from '../nats-wrapper'
import { ProductUpdatedPublisher } from '../events/publishers/product-updated-publisher'

const router = express.Router()

router.put(
  '/api/products/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('desc').not().isEmpty().withMessage('Please input a description '),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, desc } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      throw new RouteError()
    }
    if (product.orderId) {
      throw new BadRequestError('Cannot edit a reserved product')
    }

    if (product.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }

    product.set({
      title,
      price,
      desc,
    })
    await product.save()

    new ProductUpdatedPublisher(natsWrapper.client).publish({
      id: product.id,
      title: product.title,
      desc: product.desc,
      price: product.price,
      version: product.version,
      userId: product.userId,
    })

    res.status(201).send(product)
  }
)

export { router as createProductRouter }
