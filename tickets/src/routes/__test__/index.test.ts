import request from 'supertest'
import { app } from '../../app'

const createTicket = () => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'heheh',
      price: 2021,
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
      schedule: new Date(),
    })
    .expect(201)
}

it('can fetch a list of tickets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const response = await request(app).get('/api/tickets').send().expect(200)
  expect(response.body.length).toEqual(3)
})
