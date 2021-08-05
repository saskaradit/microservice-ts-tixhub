import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { Product } from '../models/products'
import { requireAuth, validateRequest } from '@rad-sas/common'
import { natsWrapper } from '../nats-wrapper'
import { ProductCreatedPublisher } from '../events/publishers/product-created-publisher'

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
    // body('image').not().isEmpty().withMessage('Please upload an image'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price, desc } = req.body
    // console.log(Buffer.from(image, 'utf-8'))

    const product = Product.build({
      title,
      price,
      // image: Buffer.from(image, 'utf-8'),
      desc,
      userId: req.currentUser!.id,
    })
    await product.save()

    new ProductCreatedPublisher(natsWrapper.client).publish({
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
