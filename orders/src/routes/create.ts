import express, { Request, Response } from 'express'
import {
  requireAuth,
  validateRequest,
  RouteError,
  OrderStatus,
  BadRequestError,
} from '@rad-sas/common'
import { body } from 'express-validator'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { natsWrapper } from '../nats-wrapper'
import { Item } from '../models/item'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post(
  '/api/orders',
  requireAuth,
  [body('itemId').not().isEmpty().withMessage('itemId must be provided')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { itemId } = req.body

    // Find the item the user is trying to order in the database
    const item = await Item.findById(itemId)
    if (!item) {
      throw new RouteError()
    }

    // Make sure the item is not already reserved
    const isReserved = await item.isReserved()
    if (isReserved) {
      throw new BadRequestError('Item is already reserved')
    }

    // Calculate an expiration date for the order
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      item,
    })
    await order.save()

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      expiresAt: order.expiresAt.toISOString(),
      item: {
        id: item.id,
        price: item.price,
      },
    })
    res.status(201).send(order)
  }
)

export { router as createOrderRouter }
