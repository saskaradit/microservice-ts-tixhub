import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/order'
import { OrderStatus } from '@rad-sas/common'
import { stripe } from '../../stripe'
import { Payment } from '../../models/payments'

it('returns a 400 when the order does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'heheh',
      orderId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(400)
})
it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 300,
    status: OrderStatus.Created,
  })

  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'heheh',
      orderId: order.id,
    })
    .expect(401)
})
it('returns a 404 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price: 300,
    status: OrderStatus.Cancelled,
  })
  await order.save()
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'heheh',
      orderId: order.id,
    })
    .expect(400)
})

it('returns a 204 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const price = Math.floor(Math.random() * 100000)
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  })
  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id,
    })
    .expect(201)

  const stripeCharges = await stripe.charges.list({ limit: 50 })
  const stripeCharge = stripeCharges.data.find((charge) => {
    return charge.amount === price * 100
  })

  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.currency).toEqual('usd')

  const payment = await Payment.findOne({
    orderId: order.id,
    id: stripeCharge!.id,
  })
  expect(payment).not.toBeNull()
})
