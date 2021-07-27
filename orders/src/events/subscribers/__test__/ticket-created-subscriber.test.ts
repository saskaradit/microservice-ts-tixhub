import { TicketCreatedEvent } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { TicketCreatedSubscriber } from '../ticket-created-subscriber'
import { Ticket } from '../../../models/ticket'
import { natsWrapper } from '../../../nats-wrapper'

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedSubscriber(natsWrapper.client)
  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'hehe',
    price: 200,
    image:
      'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()
  // call the onMessage with data object + message object
  await listener.onMessage(data, msg)
  // write assertion
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  // call the onMessage with data object + message object
  await listener.onMessage(data, msg)
  // write assertion
  expect(msg.ack).toHaveBeenCalled()
})
