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
      username: 'saskara',
      password: 'jengjet',
    })
    .expect(201);
});

it('returns a 400 with an invalid username', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'rad@rad.com',
      username: 'rad',
      password: 'jengjet',
    })
    .expect(201);
});

it('returns a 400 with missing credentials', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: '',
      username: 'saskara',
      password: 'jengjet',
    })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'rad@rad.com',
      username: '',
      password: 'jengjet',
    })
    .expect(201);
});

it('no duplicate emails and username', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'rad@rad.com',
      username: 'saskara',
      password: 'jengjet',
    })
    .expect(201);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'rad@rad.com',
      username: 'saskarad',
      password: 'jengjet',
    })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'saskarad@rad.com',
      username: 'saskara',
      password: 'jengjet',
    })
    .expect(400);
});

it('sets a cookie after succesful signup', async () => {
  const response = request(app)
    .post('/api/users/signup')
    .send({
      email: 'rad@rad.com',
      username: 'saskara',
      password: 'jengjet',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
