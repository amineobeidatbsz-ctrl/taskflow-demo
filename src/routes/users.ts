import { Router } from 'express';
import { store } from '../store';
import { CreateUserSchema, LoginSchema } from '../validation/schemas';

export const usersRouter = Router();

usersRouter.post('/register', (req, res) => {
  const parse = CreateUserSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }
  try {
    const user = store.createUser(parse.data.username, req.body.password);
    res.status(201).json({ id: user.id, username: user.username, token: user.token });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Registration failed';
    res.status(409).json({ error: message });
  }
});

usersRouter.post('/login', (req, res) => {
  const parse = LoginSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }
  const verified = store.verifyUser(parse.data.username, req.body.password);
  if (!verified) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  const refreshed = store.refreshToken(parse.data.username);
  res.json({ id: refreshed!.id, username: refreshed!.username, token: refreshed!.token });
});
