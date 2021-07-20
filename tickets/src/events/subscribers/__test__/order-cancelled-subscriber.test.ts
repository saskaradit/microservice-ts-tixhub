import { natsWrapper } from '../../../nats-wrapper'
import { OrderCancelledEvent } from '@rad-sas/common'
import { Ticket } from '../../../models/tickets'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { OrderCancelledSubscriber } from '../order-cancelled-subscriber'

const setup = async () => {
  const listener = new OrderCancelledSubscriber(natsWrapper.client)

  const orderId = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: 'hehe',
    price: 20,
    userId: '1212',
  })
  ticket.set({ orderId })

  await ticket.save()

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  }

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg, orderId, ticket }
}

it('updates the ticket, publishes and acks the message', async () => {
  const { listener, data, msg, orderId, ticket } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket!.orderId).not.toBeDefined()
  expect(msg.ack).toHaveBeenCalled()
  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
