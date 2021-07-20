import { OrderCreatedListener } from '../order-created-subscriber'
import { natsWrapper } from '../../../nats-wrapper'
import { Ticket } from '../../../models/tickets'
import { OrderCreatedEvent, OrderStatus } from '@rad-sas/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'

const setup = async () => {
  // Create instance of listener
  const listener = new OrderCreatedListener(natsWrapper.client)

  // create and save a ticket
  const ticket = Ticket.build({
    title: 'ehe',
    price: 20,
    userId: 'radrad',
  })

  await ticket.save()
  // create fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    userId: 'rarad',
    version: 0,
    expiresAt: 'hihi',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  }

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, ticket, data, msg }
}
