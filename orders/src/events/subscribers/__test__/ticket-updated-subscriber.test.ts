import { TicketUpdatedEvent } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { TicketUpdatedSubscriber } from '../ticket/ticket-updated-subscriber'
import { Item } from '../../../models/item'

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedSubscriber(natsWrapper.client)
  // create and save a ticket
  const ticket = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'hehe',
    price: 20,
  })
  await ticket.save()

  // create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'new hehe',
    price: 999,
    schedule: new Date(),
    userId: 'radrad',
  }
  // create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { msg, data, ticket, listener }
}

it('finds,update,and saves a ticket', async () => {
  const { msg, data, ticket, listener } = await setup()

  await listener.onMessage(data, msg)

  const updatedTicket = await Item.findById(ticket.id)

  expect(updatedTicket!.title).toEqual(data.title)
  expect(updatedTicket!.price).toEqual(data.price)
})

it('acks the message', async () => {
  const { msg, data, listener } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, ticket, listener } = await setup()

  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
