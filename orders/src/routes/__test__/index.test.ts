import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import mongoose from 'mongoose'
import { Item } from '../../models/item'

const builditem = async () => {
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'heh',
    price: 9090,
  })

  await item.save()
  return item
}

it('fetches orders for a particular user', async () => {
  // Create three items
  const itemOne = await builditem()
  const itemTwo = await builditem()
  const itemThree = await builditem()

  const userOne = global.signin()
  const userTwo = global.signin()
  // Create an order as user #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ itemId: itemOne.id })

  // Create two order as user #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ itemId: itemTwo.id })
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ itemId: itemThree.id })

  // Make request for the user #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)
  // Make sure we only got 2 orders
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
})
