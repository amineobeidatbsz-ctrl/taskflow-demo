import express from 'express';
import { usersRouter } from './routes/users';
import { tasksRouter } from './routes/tasks';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);
