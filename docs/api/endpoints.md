# API Endpoints

## Base URL

All endpoints are relative to `VITE_API_BASE_URL` (default:
`http://localhost:3001/api`).

## Authentication

| Method | Endpoint      | Description                            |
| ------ | ------------- | -------------------------------------- |
| POST   | `/auth/login` | Authenticate user and return JWT token |

## Students

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| GET    | `/students/:id`         | Get student profile            |
| GET    | `/students/:id/courses` | Get student's enrolled courses |
| GET    | `/students/:id/grades`  | Get student's grade data       |

## Courses

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| GET    | `/courses/:id`          | Get course details  |
| GET    | `/courses/:id/progress` | Get course progress |

## Error Responses

All errors return JSON: `{ "message": "description", "status": <http_code> }`

Common status codes: 400, 401, 403, 404, 429, 500, 503.
