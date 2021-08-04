import request from 'supertest'
import { app } from '../../app'
import { Item } from '../../models/item'
import mongoose from 'mongoose'

it('fetches the order', async () => {
  // Create a item
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Hehe',
    price: 909,
  })

  await item.save()

  const user = global.signin()
  // make a request to build an order with this item
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ itemId: item.id })
    .expect(201)

  // fetch the order
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(fetchOrder.id).toEqual(order.id)
})

it('returns an error if another user tries to fetch another users order', async () => {
  // Create a item
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'Hehe',
    price: 909,
  })

  await item.save()

  const user = global.signin()
  // make a request to build an order with this item
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ itemId: item.id })
    .expect(201)

  // fetch the order
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401)
})
