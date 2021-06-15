import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on a successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'rad@rad.com',
      username: 'saskara',
      password: 'jengjet',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'rad',
      username: 'rad',
      password: 'jengjet',
    })
    .expect(201);
});
