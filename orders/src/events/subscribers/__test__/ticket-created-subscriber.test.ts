import { TicketCreatedEvent } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import mongoose from 'mongoose'
import { Item } from '../../../models/item'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedSubscriber } from '../ticket/ticket-created-subscriber'

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedSubscriber(natsWrapper.client)
  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'hehe',
    price: 200,
    schedule: new Date(),
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
  const ticket = await Item.findById(data.id)

  expect(ticket).toBeDefined()
  console.log(data)
  expect(ticket!.title).toEqual(data.title)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  // call the onMessage with data object + message object
  await listener.onMessage(data, msg)
  // write assertion
  expect(msg.ack).toHaveBeenCalled()
})
