import request from 'supertest';
import { app } from '../src/app';

async function getToken() {
  const username = `carol_${Date.now()}`;
  const password = 'topsecret';
  await request(app).post('/users/register').send({ username, password }).expect(201);
  const login = await request(app).post('/users/login').send({ username, password }).expect(200);
  return login.body.token as string;
}

describe('tasks pagination', () => {
  it('returns paginated results with metadata', async () => {
    const token = await getToken();
    const auth = { Authorization: `Bearer ${token}` };

    // Create 15 tasks
    for (let i = 1; i <= 15; i++) {
      // eslint-disable-next-line no-await-in-loop
      await request(app)
        .post('/tasks')
        .set(auth)
        .send({ title: `Task ${i}` })
        .expect(201);
    }

    const res = await request(app).get('/tasks?limit=5&page=2').set(auth).expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        page: 2,
        limit: 5,
        total: 15,
        totalPages: 3,
        data: expect.any(Array)
      })
    );
    expect(res.body.data).toHaveLength(5);
  });
});
