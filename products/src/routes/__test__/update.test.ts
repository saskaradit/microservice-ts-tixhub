import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Product } from '../../models/products'

const setup = async () => {
  const cookie = global.signin()
  const product = await request(app)
    .post('/api/products')
    .set('Cookie', cookie)
    .send({
      title: 'heheh',
      price: 200,
      desc: 'jengjet',
      image: Buffer.from(
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
        'utf-8'
      ),
    })

  return { product, cookie }
}

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/products/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'heheh',
      price: 200,
      desc: 'jengjet',
    })
    .expect(404)
})

it('returns a 404 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/products/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'heheh',
      price: 200,
      desc: 'jengjet',
    })
    .expect(404)
})

it('returns a 404 if the user does not own the ticket', async () => {
  const { product, cookie } = await setup()

  await request(app)
    .put(`/api/products/${product.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'heheh',
      price: 200,
      desc: 'jengjet',
    })
    .expect(401)
})

it('updates the ticket', async () => {
  const { product, cookie } = await setup()

  await request(app)
    .put(`/api/products/${product.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'heheh',
      price: 200,
      desc: 'jengjet',
    })
    .expect(201)

  const prod = await request(app).get(`/api/products/${product.body.id}`).send()
  expect(prod.body.title).toEqual('heheh')
  expect(prod.body.price).toEqual(200)
})

it('publishes the event', async () => {
  const { product, cookie } = await setup()

  await request(app)
    .put(`/api/products/${product.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'heheh',
      price: 200,
      desc: 'jengjet',
    })
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('rejects a reserved ticket', async () => {
  const { product, cookie } = await setup()

  const prod = await Product.findById(product.body.id)
  prod!.set({ orderId: mongoose.Types.ObjectId().toHexString() })
  await prod!.save()

  await request(app)
    .put(`/api/products/${product.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'heheh',
      price: 200,
      desc: 'jengjet',
    })
    .expect(400)
})
