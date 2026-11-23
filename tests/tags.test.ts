import request from 'supertest';
import { app } from '../src/app';

async function authHeader() {
  const username = `erin_${Date.now()}`;
  const password = 'strongpass';
  await request(app).post('/users/register').send({ username, password }).expect(201);
  const login = await request(app).post('/users/login').send({ username, password }).expect(200);
  return { Authorization: `Bearer ${login.body.token as string}` };
}

describe('task tags', () => {
  it('normalizes tags (lowercase, unique, sorted)', async () => {
    const auth = await authHeader();
    const res = await request(app)
      .post('/tasks')
      .set(auth)
      .send({ title: 'Tagged', tags: ['Work', 'urgent', 'work'] })
      .expect(201);
    // Expect tags to be normalized; current implementation does not, so this should fail
    expect(res.body.tags).toEqual(['urgent', 'work']);
  });
});
