import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'hehe',
      price: 2021,
    })
    .expect(404)
})

it('returns a 404 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'hehe',
      price: 2021,
    })
    .expect(404)
})

it('returns a 404 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'hehe',
      price: 2021,
    })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'jengjet',
      price: 9090,
    })
    .expect(401)
})

it('returns a 400 if the user provieds an invalid title or price', async () => {})

it('updates the ticket provided', async () => {})
