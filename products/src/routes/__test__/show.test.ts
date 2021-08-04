import request from 'supertest'
import mongoose from 'mongoose'
import { app } from '../../app'

it('returns a 404 if the product is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app).get(`/api/product/${id}`).send().expect(404)
})

it('returns the ticket if the ticket is found', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title: 'heheh',
      price: 200,
      desc: 'jengjet',
      image: Buffer.from(
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
        'utf-8'
      ),
    })
    .expect(201)

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send()
    .expect(200)

  expect(productResponse.body.title).toEqual('heheh')
  expect(productResponse.body.price).toEqual(200)
  expect(productResponse.body.desc).toEqual('jengjet')
})
