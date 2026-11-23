import request from 'supertest';
import { app } from '../src/app';

async function createUserAndGetToken() {
  const username = `bob_${Date.now()}`;
  const password = 'verysecret';
  await request(app).post('/users/register').send({ username, password }).expect(201);
  const login = await request(app).post('/users/login').send({ username, password }).expect(200);
  return { token: login.body.token, username };
}

describe('tasks CRUD', () => {
  it('requires auth', async () => {
    await request(app).get('/tasks').expect(401);
  });

  it('creates, reads, updates, deletes a task', async () => {
    const { token } = await createUserAndGetToken();
    const auth = { Authorization: `Bearer ${token}` };

    const create = await request(app)
      .post('/tasks')
      .set(auth)
    .send({ name: 'Write tests', description: 'Add unit tests' })
      .expect(201);

    expect(create.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      name: 'Write tests',
        description: 'Add unit tests',
        completed: false
      })
    );
    const id = create.body.id;

    const list = await request(app).get('/tasks').set(auth).expect(200);
    expect(list.body.data).toEqual(
    expect.arrayContaining([expect.objectContaining({ id, name: 'Write tests' })])
    );

    const detail = await request(app).get(`/tasks/${id}`).set(auth).expect(200);
    expect(detail.body.id).toBe(id);

    const update = await request(app)
      .put(`/tasks/${id}`)
      .set(auth)
      .send({ completed: true })
      .expect(200);
    expect(update.body.completed).toBe(true);

    await request(app).delete(`/tasks/${id}`).set(auth).expect(204);

    await request(app).get(`/tasks/${id}`).set(auth).expect(404);
  });
});
