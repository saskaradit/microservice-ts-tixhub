import { async } from 'q'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { Ticket } from '../../models/ticket'
import mongoose from 'mongoose'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'heh',
    price: 9090,
  })

  await ticket.save()
  return ticket
}

it('fetches orders for a particular user', async () => {
  // Create three tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = global.signin()
  const userTwo = global.signin()
  // Create an order as user #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })

  // Create two order as user #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })

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
