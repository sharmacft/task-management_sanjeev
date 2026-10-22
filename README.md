# Task Management REST API

ES module REST API built with Node.js, Express 5, MongoDB/Mongoose, JWT, bcryptjs and Joi.

## Setup

1. Install Node.js 20+ and run `npm install`.
2. Copy `.env.example` to `.env` in the project root. Set `MONGODB_URI` and a private `JWT_SECRET` of at least 32 characters. For compatibility, the server also loads `src/.env` if the root `.env` does not exist.
3. Start MongoDB locally or provide a MongoDB Atlas connection string.
4. Run `npm run dev` for development or `npm start` for production.

The default server port is 3000. `CORS_ORIGIN` accepts a comma-separated list of allowed browser origins. An empty value disables browser cross-origin access. MongoDB indexes are managed by Mongoose.

## Response format

Success responses use `{ "success": true, "message": "...", "data": ... }`; list responses also include `meta` pagination. Errors use `{ "success": false, "message": "...", "errors": [...] }` where field details apply. Stack traces are included only outside production.

## Endpoints

All endpoints are under `/api`. Task routes require `Authorization: Bearer <JWT>`.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Register with `name`, `email`, `password` |
| POST | `/auth/login` | Login with `email`, `password`; limited to 10 attempts per 15 minutes |
| GET | `/auth/me` | Current user's profile |
| POST | `/tasks` | Create task (`title` required; optional `description`, `priority`, `status`, `dueDate`) |
| GET | `/tasks?page=1&limit=10&status=pending&search=keyword&sort=dueDate` | List own tasks with pagination and filters |
| GET | `/tasks/:id` | Read an owned task |
| PUT/PATCH | `/tasks/:id` | Update allowed fields; send at least one field |
| DELETE | `/tasks/:id` | Delete an owned task |
| GET | `/health` | Health check |

Statuses: `pending`, `in-progress`, `completed`. Priorities: `low`, `medium`, `high`. Dates should be ISO 8601 strings. Invalid IDs return 400; missing or non-owned tasks return 404.

## Security and design

- Passwords are hashed with bcryptjs (12 rounds), omitted from user serialization, and excluded from normal queries.
- JWT contains only the user subject and is checked for signature, expiry, and issuer.
- Task queries always scope by the authenticated user ID. Ownership is never taken from request input.
- Joi validates body and query inputs; MongoDB duplicate-email errors become HTTP 409.
- Helmet, restricted CORS, JSON size limits, login rate limiting, and centralized error handling are enabled.
- Controllers, services, models, validators, middleware, and routes are separated for maintainability.

## Postman

Import `postman_collection.json` into Postman. Set collection variables `baseUrl` (default `http://localhost:3000/api`) and `token`; register/login, then paste the returned JWT into `token` before calling protected endpoints.
