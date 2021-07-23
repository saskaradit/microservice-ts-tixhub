import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { OrderCreatedSubscriber } from '../order-created-subscriber'
import { OrderCreatedEvent, OrderStatus } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import { Order } from '../../../models/order'

const setup = async () => {
  const listener = new OrderCreatedSubscriber(natsWrapper.client)

  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: '123',
    userId: 'hehehe',
    status: OrderStatus.Created,
    ticket: {
      id: 'ehehe',
      price: 200,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  const order = await Order.findById(data.id)

  expect(order!.price).toEqual(data.ticket.price)
})

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
