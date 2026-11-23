import { z } from 'zod';

const isoDateString = z
  .string()
  .optional()
  .refine((val) => {
    if (val === undefined) return true;
    const d = new Date(val);
    return !Number.isNaN(d.getTime());
  }, 'dueDate must be a valid ISO date string');

export const CreateUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const LoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const CreateTaskSchema = z.object({
  title: z.string().min(1),
  tags: z.array(z.string().min(1)).max(10).optional(),
  description: z.string().min(1).optional(),
  dueDate: isoDateString,
  completed: z.boolean().optional()
});

export const UpdateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  tags: z.array(z.string().min(1)).max(10).optional(),
  description: z.string().min(1).optional(),
  dueDate: isoDateString,
  completed: z.boolean().optional()
});
