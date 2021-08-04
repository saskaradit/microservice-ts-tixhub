import { ProductCreatedEvent } from '@rad-sas/common'
import { Message } from 'node-nats-streaming'
import { natsWrapper } from '../../../nats-wrapper'
import { Item } from '../../../models/item'
import mongoose from 'mongoose'
import { ProductCreatedSubscriber } from '../product/product-created-subscriber'

const setup = async () => {
  // create an instance of the listener
  const listener = new ProductCreatedSubscriber(natsWrapper.client)
  // create a fake data event
  const data: ProductCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'hehe',
    price: 200,
    desc: 'heheh',
    userId: new mongoose.Types.ObjectId().toHexString(),
  }
  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { listener, data, msg }
}

it('creates and saves a product', async () => {
  const { listener, data, msg } = await setup()
  // call the onMessage with data object + message object
  await listener.onMessage(data, msg)
  // write assertion
  const product = await Item.findById(data.id)

  expect(product).toBeDefined()
  console.log(data)
  expect(product!.title).toEqual(data.title)
})

it('acks the message', async () => {
  const { listener, data, msg } = await setup()
  // call the onMessage with data object + message object
  await listener.onMessage(data, msg)
  // write assertion
  expect(msg.ack).toHaveBeenCalled()
})
