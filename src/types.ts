export interface User {
  id: string;
  username: string;
  password: string;
  token: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO string
  completed: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
