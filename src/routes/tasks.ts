import { Router } from 'express';
import { store } from '../store';
import { CreateTaskSchema, UpdateTaskSchema } from '../validation/schemas';
import { authMiddleware } from '../middleware/auth';

export const tasksRouter = Router();

// All routes under /tasks require auth
tasksRouter.use(authMiddleware);

// List tasks with simple pagination
tasksRouter.get('/', (req, res) => {
  const user = req.user!;
  const all = store.listTasksByUser(user.id);
  const page = Math.max(1, parseInt(String(req.query.page ?? '1'), 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(String(req.query.limit ?? '10'), 10) || 10));
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  const total = all.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  res.json({ data, page, limit, total, totalPages });
});

tasksRouter.post('/', (req, res) => {
  const parse = CreateTaskSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }
  const user = req.user!;
  const created = store.createTask(user.id, {
    title: parse.data.title,
    description: parse.data.description,
    dueDate: parse.data.dueDate,
    completed: parse.data.completed ?? false
  });
  res.status(201).json(created);
});

tasksRouter.get('/:id', (req, res) => {
  const user = req.user!;
  const task = store.getTask(user.id, req.params.id);
  if (!task) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(task);
});

tasksRouter.put('/:id', (req, res) => {
  const parse = UpdateTaskSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }
  const user = req.user!;
  const updated = store.updateTask(user.id, req.params.id, parse.data);
  if (!updated) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json(updated);
});

tasksRouter.delete('/:id', (req, res) => {
  const user = req.user!;
  const ok = store.deleteTask(user.id, req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.status(204).send();
});
