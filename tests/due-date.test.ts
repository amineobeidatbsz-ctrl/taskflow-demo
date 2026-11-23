import request from 'supertest';
import { app } from '../src/app';

async function token() {
  const username = `dana_${Date.now()}`;
  const password = 'password1';
  await request(app).post('/users/register').send({ username, password }).expect(201);
  const res = await request(app).post('/users/login').send({ username, password }).expect(200);
  return res.body.token as string;
}

describe('due date validation', () => {
  it('rejects past due dates', async () => {
    const t = await token();
    const auth = { Authorization: `Bearer ${t}` };
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const res = await request(app)
      .post('/tasks')
      .set(auth)
      .send({ title: 'Past task', dueDate: yesterday })
      .expect(400);
    expect(JSON.stringify(res.body)).toMatch(/future/i);
  });
});
