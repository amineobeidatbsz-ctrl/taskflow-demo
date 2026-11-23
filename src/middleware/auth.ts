import { Request, Response, NextFunction } from 'express';
import { store } from '../store';
import { User } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.header('authorization') || req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const token = authHeader.substring('Bearer '.length);
  // Improved debug logging to help trace auth issues in production
  // Note: This logs the raw token for correlation with backend logs.
  // eslint-disable-next-line no-console
  console.log(`[auth] incoming bearer token=${token}`);
  const user = store.getUserByToken(token);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.user = user;
  next();
}
