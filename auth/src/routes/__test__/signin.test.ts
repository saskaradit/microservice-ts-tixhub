import request from 'supertest'
import { app } from '../../app'

it('fails when a username does not exist is used', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      username: 'saskarad',
      password: 'jengjet',
    })
    .expect(400)
})

it('fails when the password is incorrect', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'rad',
      email: 'rad@gmail.com',
      username: 'saskara',
      password: 'jengjet',
    })
    .expect(201)

  await request(app)
    .post('/api/users/signin')
    .send({
      username: 'saskara',
      password: 'hola',
    })
    .expect(400)
})

it('response with a cookie', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      name: 'rad',
      email: 'rad@gmail.com',
      username: 'saskara',
      password: 'jengjet',
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      username: 'saskara',
      password: 'jengjet',
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
