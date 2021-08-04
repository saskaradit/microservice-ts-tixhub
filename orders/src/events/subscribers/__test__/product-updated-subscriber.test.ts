import { Item } from '../../../models/item'
import { natsWrapper } from '../../../nats-wrapper'
import mongoose from 'mongoose'
import { ProductUpdatedSubscriber } from '../product/product-updated-subscriber'
import { ProductUpdatedEvent } from '@rad-sas/common'

const setup = async () => {
  // create a listener
  const listener = new ProductUpdatedSubscriber(natsWrapper.client)
  // create and save a ticket
  const product = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'hehe',
    price: 20,
  })
  await product.save()

  // create a fake data object
  const data: ProductUpdatedEvent['data'] = {
    id: product.id,
    version: product.version + 1,
    title: 'new hehe',
    price: 999,
    desc: 'jengjet',
    userId: 'radrad',
  }
  // create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  }

  return { msg, data, product, listener }
}

it('finds,update,and saves a ticket', async () => {
  const { msg, data, product, listener } = await setup()

  await listener.onMessage(data, msg)

  const updatedProduct = await Item.findById(product.id)

  expect(updatedProduct!.title).toEqual(data.title)
  expect(updatedProduct!.price).toEqual(data.price)
})

it('acks the message', async () => {
  const { msg, data, listener } = await setup()

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, product, listener } = await setup()

  data.version = 10

  try {
    await listener.onMessage(data, msg)
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled()
})
