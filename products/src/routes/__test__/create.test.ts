import { app } from '../../app'
import request from 'supertest'
import { Product } from '../../models/products'

it('has a router handler listening for /api/products', async () => {
  const response = await request(app).post('/api/products').send()

  expect(response.status).toEqual(401)
})

it('can only be access if the user is signed in', async () => {
  const response = await request(app).post('/api/products').send({})

  expect(response.status).toEqual(401)
})
it('return a status other than 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({})

  expect(response.status).not.toEqual(401)
})

it('returns an error if input is invalid', async () => {
  await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title: 'album',
      price: 20,
    })
    .expect(400)
})

it('creates a product with valid inputs', async () => {
  let products = await Product.find({})
  expect(products.length).toEqual(0)

  await request(app)
    .post('/api/products')
    .set('Cookie', global.signin())
    .send({
      title: 'heheh',
      price: 200,
      desc: 'jengjet',
    })
    .expect(201)

  products = await Product.find({})
  expect(products.length).toEqual(1)
})
