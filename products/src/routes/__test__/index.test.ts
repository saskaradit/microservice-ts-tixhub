import request from 'supertest'
import { app } from '../../app'

const createProduct = () => {
  return request(app)
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
}

it('can fetch a list of tickets', async () => {
  await createProduct()
  await createProduct()
  await createProduct()

  const response = await request(app).get('/api/products').send().expect(200)
  expect(response.body.length).toEqual(3)
})
