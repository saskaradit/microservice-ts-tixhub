import request from 'supertest'
import { app } from '../../app'

it('clears the cookie after signout', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'rad@gmail.com',
      username: 'saskara',
      name: 'RAD',
      password: 'jengjet',
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})
