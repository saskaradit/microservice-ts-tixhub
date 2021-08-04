import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'
import { Item } from '../../models/item'

it('marks an order as cancelled', async () => {
  // create item
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'hhe',
    price: 20,
  })
  await item.save()

  const user = global.signin()
  // make request
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ itemId: item.id })
    .expect(201)

  // cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits a order cancelled event', async () => {
  // create item
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'hhe',
    price: 20,
  })
  await item.save()

  const user = global.signin()
  // make request
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ itemId: item.id })
    .expect(201)

  // cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
