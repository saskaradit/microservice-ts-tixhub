import { natsWrapper } from '../../../nats-wrapper'
import { Message } from 'node-nats-streaming'
import { OrderStatus, ExpirationCompleteEvent } from '@rad-sas/common'
import { ExpirationCompleteSubscriber } from '../expiration-complete-subscriber'
import { Ticket } from '../../../models/ticket'
import { Order } from '../../../models/order'
import mongoose from 'mongoose'

const setup = async () => {
  const listener = new ExpirationCompleteSubscriber(natsWrapper.client)

  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'hehe',
    price: 20,
  })

  await ticket.save()
  const order = Order.build({
    userId: '1234',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  })
  await order.save()

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, order, ticket, data, msg }
}

it('updates the order to cancelled', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an orderCancelled Event', async () => {
  const { listener, order, data, msg } = await setup()
  await listener.onMessage(data, msg)

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  )
  expect(eventData.id).toEqual(order.id)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})
