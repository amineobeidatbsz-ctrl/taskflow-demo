import request from 'supertest';
import { app } from '../src/app';

describe('users', () => {
  it('registers and logs in a user', async () => {
    const username = `alice_${Date.now()}`;
    const password = 'supersecret';

    const reg = await request(app)
      .post('/users/register')
      .send({ username, password })
      .expect(201);

    expect(reg.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username,
        token: expect.any(String)
      })
    );

    const login = await request(app)
      .post('/users/login')
      .send({ username, password })
      .expect(200);

    expect(login.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        username,
        token: expect.any(String)
      })
    );
    expect(login.body.token).not.toEqual(reg.body.token);
  });
});
