# GigFlow - Smart Leads Dashboard

Full-stack MERN lead management dashboard built with React, TypeScript, TailwindCSS, Node.js, Express, MongoDB, and Mongoose.

## Features

- JWT authentication with registration, login, password hashing, and protected routes
- Role-based access control: Admin and Sales User
- Leads CRUD with status/source enums
- Backend pagination with 10 records per page
- Combined filters for status, source, debounced search, and latest/oldest sorting
- CSV export for the current result page
- Responsive dashboard with loading, empty, error, and validation states
- Dark mode support
- Docker Compose setup for MongoDB, backend, and frontend

## API Documentation

Base URL: `http://localhost:5000/api`

### Auth

`POST /auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}
```

`POST /auth/login`

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

`GET /auth/me`

Requires `Authorization: Bearer <token>`.

### Leads

All lead routes require `Authorization: Bearer <token>`.

`GET /leads?page=1&status=Qualified&source=Instagram&search=Rahul&sort=latest`

Returns:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 1
  }
}
```

`POST /leads`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "Qualified",
  "source": "Instagram"
}
```

`GET /leads/:id`

`PUT /leads/:id`

`DELETE /leads/:id` requires Admin role.

## Local Setup

1. Copy environment files:

```bash
cp .env.example .env
cp backend/src/.env.example backend/src/.env
cp frontend/.env.example frontend/.env
```

2. Start MongoDB locally or use Docker.

3. Backend:

```bash
cd backend/src
npm install
npm run dev
```

With MongoDB and the backend running, verify the API flow:

```bash
npm run smoke
```

4. Frontend:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`; backend runs on `http://localhost:5000`.

## Docker

```bash
docker compose up --build
```

## Project Structure

```text
backend/src
  config
  controllers
  middleware
  models
  routes
  types
  utils
frontend/src
  components
  context
  hooks
  pages
  services
  types
```
