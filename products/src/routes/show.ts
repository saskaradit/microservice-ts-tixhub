import express, { Request, Response } from 'express'
import { Product } from '../models/products'
import { RouteError } from '@rad-sas/common'

const router = express.Router()

router.get('/api/products/:id', async (req: Request, res: Response) => {
  const products = await Product.findById(req.params.id)

  if (!products) {
    throw new RouteError()
  }

  res.send(products)
})

export { router as showProductRouter }
