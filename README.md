# Taskflow API

Taskflow is a small TypeScript + Express task tracker API. It demonstrates:

- Simple token-based auth
- Users module with register/login
- Tasks CRUD with validation
- Jest tests with Supertest
- ESLint and GitHub Actions CI

## Quick start

Requirements: Node 18+.

```bash
npm install
npm run dev      # starts the API on http://localhost:3000
```

Build and run:

```bash
npm run build
npm start
```

Run tests and lint:

```bash
npm test
npm run lint
```

## API

Base URL: http://localhost:3000

- POST `/users/register` — body: `{ username, password }` → `{ id, username, token }`
- POST `/users/login` — body: `{ username, password }` → `{ id, username, token }`

Authenticated routes require header: `Authorization: Bearer <token>`

- GET `/tasks` — list tasks for the authenticated user
- POST `/tasks` — create task: `{ title, description?, dueDate?, completed? }`
- GET `/tasks/:id` — get a task
- PUT `/tasks/:id` — update any subset of fields
- DELETE `/tasks/:id` — delete a task

Notes:
- Dates use ISO 8601 strings. `dueDate`, when provided, must be in the future.
- In-memory data store; restart resets data.

## Development

- TypeScript config in `tsconfig.json`
- Tests in `tests/`, app in `src/`
- CI runs lint and tests on pull requests
