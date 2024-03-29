import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order, OrderStatus } from '../../models/order'
import { Item } from '../../models/item'
import { natsWrapper } from '../../nats-wrapper'

it('returns an error if the item does not exist', async () => {
  const itemId = mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ itemId })
    .expect(404)
})
it('returns an error if the item is already reserved', async () => {
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'HEHE',
    price: 9090,
  })

  await item.save()

  const order = Order.build({
    item,
    userId: 'hehehe',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  })

  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(400)
})
it('it reserves a items', async () => {
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'HEHE',
    price: 9090,
  })
  await item.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(201)
})

it('emits an order created event', async () => {
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'HEHE',
    price: 9090,
  })
  await item.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
