import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  RouteError,
  NotAuthorizedError,
  OrderStatus,
} from '@rad-sas/common'
import { stripe } from '../stripe'
import { Order } from '../models/order'
import { Payment } from '../models/payments'

const router = express.Router()

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      throw new BadRequestError('Order not found')
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order is cancelled')
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    })

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    })

    await payment.save()
    res.status(201).send({ success: true })
  }
)

export { router as createCharge }
