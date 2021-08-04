import express, { Request, Response } from 'express'
import { Order, OrderStatus } from '../models/order'
import { requireAuth, NotAuthorizedError, RouteError } from '@rad-sas/common'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from '../nats-wrapper'

const router = express.Router()

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params
    const order = await Order.findById(orderId).populate('item')

    if (!order) {
      throw new RouteError()
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError()
    }
    order.status = OrderStatus.Cancelled
    await order.save()

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      item: {
        id: order.item.id,
      },
    })
    res.status(204).send(order)
  }
)

export { router as deleteOrderRouter }
