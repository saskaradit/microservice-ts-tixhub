import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { natsWrapper } from '../../nats-wrapper'
import { Ticket } from '../../models/tickets'

const setup = async () => {
  const cookie = global.signin()
  const ticket = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'hehe',
      price: 2021,
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
    })

  return { ticket, cookie }
}

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'hehe',
      price: 2021,
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
    })
    .expect(404)
})

it('returns a 404 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'hehe',
      price: 2021,
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
    })
    .expect(404)
})

it('returns a 404 if the user does not own the ticket', async () => {
  const { ticket, cookie } = await setup()

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'jengjet',
      price: 9090,
    })
    .expect(401)
})

it('returns a 400 if the user provieds an invalid title or price', async () => {
  const { ticket, cookie } = await setup()

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 2021,
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
    })
    .expect(400)
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jengjet',
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
    })
    .expect(400)
})

it('updates the ticket provided', async () => {
  const { ticket, cookie } = await setup()
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jengjet',
      price: 2021,
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
    })
    .expect(200)

  const tix = await request(app).get(`/api/tickets/${ticket.body.id}`).send()

  expect(tix.body.title).toEqual('jengjet')
  expect(tix.body.price).toEqual(2021)
})

it('publishes an event', async () => {
  const { ticket, cookie } = await setup()
  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jengjet',
      price: 2021,
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
    })
    .expect(200)

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jengjet',
      price: 2021,
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
    })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})

it('it rejects a reserved ticket', async () => {
  const { ticket, cookie } = await setup()

  const tix = await Ticket.findById(ticket.body.id)
  tix!.set({ orderId: mongoose.Types.ObjectId().toHexString() })
  await tix!.save()

  await request(app)
    .put(`/api/tickets/${ticket.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'jengjet',
      price: 2021,
      image:
        'https://images.unsplash.com/photo-1557787163-1635e2efb160?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3152&q=80',
      desc: 'rad',
    })
    .expect(400)
})
