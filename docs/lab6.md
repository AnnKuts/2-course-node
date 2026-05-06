## Lab6. RESTful Web Services

---

## Table of Contents

1. [What is a RESTful Web Service](#what-is-a-restful-web-service)
2. [Project Structure](#project-structure)
3. [Work Progress](#work-progress)
4. [API Reference](#api-reference)
5. [How to Run the Project](#how-to-run-the-project)
6. [Conclusion](#conclusion)
7. [Control Questions](#control-questions)

---

## What is a RESTful Web Service

**REST** (Representational State Transfer) is an architectural style for designing networked applications. A RESTful web service exposes resources over HTTP using a uniform interface.

Key constraints of REST:
- **Stateless** — each request from a client contains all information needed to process it; the server stores no session state.
- **Client-Server** — the UI and data storage are separated, allowing each to evolve independently.
- **Uniform Interface** — resources are identified by URIs; they are manipulated using standard HTTP methods (GET, POST, PUT, DELETE).
- **Layered System** — the client cannot tell whether it is connected directly to the server or to an intermediary.
- **Cacheable** — responses must define themselves as cacheable or non-cacheable.

HTTP methods map to CRUD operations:

| HTTP Method | CRUD Operation | Typical Status Codes |
|-------------|---------------|----------------------|
| GET         | Read          | 200 OK, 404 Not Found |
| POST        | Create        | 201 Created, 400 Bad Request, 409 Conflict |
| PUT / PATCH | Update        | 200 OK, 403 Forbidden, 404 Not Found |
| DELETE      | Delete        | 200 OK, 403 Forbidden, 404 Not Found |

---

## Project Structure

The project extends Lab5 (Express + Sequelize ORM) with a dedicated REST API layer mounted at `/api/v1`.

```
lab6/
├── src/
│   ├── app.ts                          # Entry point — mounts both web and API routers
│   ├── sequelize.ts                    # Sequelize instance (PostgreSQL)
│   ├── routes/
│   │   ├── routes.ts                   # Web (EJS) routes — unchanged from lab5
│   │   └── apiRoutes.ts                # REST API routes under /api/v1
│   ├── controllers/
│   │   ├── fanficController.ts         # Web controllers (EJS rendering)
│   │   ├── authController.ts
│   │   ├── reviewController.ts
│   │   ├── commentController.ts
│   │   └── api/
│   │       ├── fanficApiController.ts  # REST: CRUD + filtering/pagination
│   │       ├── reviewApiController.ts  # REST: CRUD
│   │       └── commentApiController.ts # REST: CRUD
│   ├── services/
│   │   ├── fanficService.ts            # + getFanficsFilteredAsync
│   │   ├── reviewService.ts
│   │   ├── commentService.ts
│   │   └── authService.ts
│   ├── repository/
│   │   ├── fanficRepository.ts         # + getFanficsFiltered (Sequelize)
│   │   ├── reviewRepo.ts
│   │   ├── commentRepo.ts
│   │   └── userRepo.ts
│   ├── models/
│   │   ├── fanfic.ts / user.ts / ...   # TypeScript interfaces
│   │   ├── FanficModel.ts              # Sequelize models
│   │   ├── GenreModel.ts
│   │   ├── ReviewModel.ts
│   │   ├── CommentModel.ts
│   │   ├── UserModel.ts
│   │   ├── FanficContentModel.ts
│   │   ├── FanficGenreModel.ts
│   │   └── associations.ts            # All Sequelize relationships
│   └── middleware/
│       └── authMiddleware.ts           # JWT Bearer token verification
├── public/                             # Static assets (CSS)
├── package.json
└── tsconfig.json
```

---

## Work Progress

### 1. Reviewing RESTful Web Services

REST is an architectural approach where the server exposes **resources** (e.g., `/api/v1/fanfics`) and clients interact with them using standard HTTP methods. Each request is self-contained (stateless) and returns a meaningful HTTP status code along with a JSON body.

The project already had a working application with Sequelize ORM (Lab5). Lab6 adds a parallel REST API layer on top of the existing service/repository architecture, without touching the existing web (EJS) routes.

---

### 2. REST API Router

A dedicated router was created at `src/routes/apiRoutes.ts` and mounted in `app.ts` at the `/api/v1` prefix:

```typescript
// app.ts
app.use('/', fanficRoutes);      // existing web routes
app.use('/api/v1', apiRoutes);   // new REST API
```

This separation keeps the rendered web application and the API independent.

---

### 3. Fanfics — Full CRUD with Filtering and Pagination

`fanficApiController.ts` implements all four CRUD operations for the `Fanfic` resource.

**Filtering and pagination** are implemented in `fanficRepository.getFanficsFiltered` using Sequelize's `findAndCountAll`, `Op.iLike` (case-insensitive title search), `Op.gte` (minimum rating), and a conditional `INNER JOIN` on the genres table:

```typescript
// repository/fanficRepository.ts
const { rows, count } = await FanficModel.findAndCountAll({
    where,                          // restriction, rating, title filters
    include: [genreInclude, ...],   // INNER JOIN when genre filter is set
    limit,
    offset: (page - 1) * limit,
    distinct: true,                 // correct count with LEFT JOINs
});
```

Supported query parameters for `GET /api/v1/fanfics`:

| Parameter   | Type   | Description                          |
|-------------|--------|--------------------------------------|
| `page`      | number | Page number (default: 1)             |
| `limit`     | number | Items per page (default: 10, max: 100) |
| `genre`     | string | Filter by exact genre name           |
| `restriction` | string | Filter by age restriction (0+, 12+, 16+, 18+) |
| `minRating` | number | Minimum average rating (0–5)         |
| `search`    | string | Case-insensitive search in title     |

Response format:

```json
{
  "data": [ ... ],
  "pagination": {
    "total": 42,
    "page": 2,
    "limit": 10,
    "totalPages": 5
  }
}
```

---

### 4. Reviews and Comments — CRUD

`reviewApiController.ts` and `commentApiController.ts` implement create, read, update, and delete for their respective resources.

All write operations require a JWT Bearer token (`Authorization: Bearer <token>`). Ownership is verified before update/delete — a `403 Forbidden` is returned if the requesting user is not the author.

---

### 5. HTTP Status Codes

Every endpoint returns an appropriate status code:

| Situation                         | Code |
|-----------------------------------|------|
| Successful read                   | 200  |
| Resource created                  | 201  |
| Validation error (missing fields) | 400  |
| Missing or invalid token          | 401  |
| Not the owner of the resource     | 403  |
| Resource not found                | 404  |
| Duplicate resource (title)        | 409  |
| Validation error (invalid value)  | 422  |
| Unexpected server error           | 500  |

---

## API Reference

Base URL: `http://localhost:3000/api/v1`

### Fanfics

```
GET    /fanfics                  List fanfics (filter + pagination)
GET    /fanfics/:id              Get fanfic by ID
POST   /fanfics                  Create fanfic          [auth]
PUT    /fanfics/:id              Update fanfic           [auth, owner]
DELETE /fanfics/:id              Delete fanfic           [auth, owner]
```

**Example — create a fanfic:**

```http
POST /api/v1/fanfics
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Story",
  "description": "A tale of adventure",
  "content": "Once upon a time...",
  "genre": ["fantasy", "adventure"],
  "restriction": "0+"
}
```

**Example — filtered list:**

```
GET /api/v1/fanfics?genre=fantasy&minRating=4&page=1&limit=5
```

### Reviews

```
GET    /fanfics/:id/reviews      List reviews for a fanfic
POST   /reviews                  Create review           [auth]
PUT    /reviews/:id              Update review           [auth, owner]
DELETE /reviews/:id              Delete review           [auth, owner]
```

### Comments

```
GET    /fanfics/:id/comments     List comments for a fanfic
POST   /comments                 Create comment          [auth]
PUT    /comments/:id             Update comment          [auth, owner]
DELETE /comments/:id             Delete comment          [auth, owner]
```

---

## How to Run the Project

1. Go to the project directory:

```bash
cd lab6
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your_secret_key
```

4. Run the server:

```bash
npm run dev
```

5. The web application is available at:

```
http://localhost:3000
```

6. The REST API is available at:

```
http://localhost:3000/api/v1
```

---

## Conclusion

During this laboratory work, a REST API layer was added to the existing fanfiction platform (built in Lab5 with Express and Sequelize ORM). The API exposes three resources — fanfics, reviews, and comments — with full CRUD operations, JWT-based authentication, ownership authorization, and filtering with pagination for fanfics. All endpoints return appropriate HTTP status codes according to REST conventions.

---

## Control Questions

---

### 1. What is a RESTful web service?

A RESTful web service is a web API that follows the REST architectural style. It exposes resources identified by URIs and uses standard HTTP methods (GET, POST, PUT, DELETE) to perform operations on them. Communication is stateless — each request carries all information the server needs.

---

### 2. What are the main HTTP methods and what do they represent?

- **GET** — retrieve a resource or a collection of resources (safe, idempotent)
- **POST** — create a new resource (not idempotent)
- **PUT** — replace a resource entirely (idempotent)
- **PATCH** — partially update a resource (idempotent)
- **DELETE** — remove a resource (idempotent)

---

### 3. What is the difference between REST and SOAP?

- **REST** is an architectural style using HTTP, JSON/XML, lightweight and stateless
- **SOAP** is a protocol with strict standards, XML-only, with built-in error handling and security
- REST is simpler and more widely used for public APIs; SOAP is common in enterprise systems

---

### 4. What is a resource in the context of REST?

A resource is any entity the server manages and exposes via a URI. Examples: a fanfic (`/fanfics/123`), a list of reviews (`/fanfics/123/reviews`). Resources are nouns, not verbs.

---

### 5. What HTTP status codes should a REST API use?

- **2xx** — success (200 OK, 201 Created, 204 No Content)
- **4xx** — client error (400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity)
- **5xx** — server error (500 Internal Server Error)

---

### 6. What is the difference between stateful and stateless communication?

- **Stateful** — the server stores session information between requests (e.g., traditional web sessions)
- **Stateless** — each request is independent and self-contained; the server holds no client state (REST requirement)

Statelessness improves scalability because any server instance can handle any request.

---

### 7. What is pagination and why is it needed?

Pagination splits a large collection of resources into smaller pages. Without it, a single request could return thousands of records, degrading performance and usability. Common approaches:
- **Offset-based**: `?page=2&limit=10` (used in this lab)
- **Cursor-based**: `?after=<cursor>` (better for large datasets)

---

### 8. What is content negotiation in REST?

Content negotiation allows a client to specify the format of the response it expects (via the `Accept` header) and the format of the request body (via `Content-Type`). For example, `Accept: application/json` tells the server to respond with JSON.

---

### 9. What is HATEOAS?

**HATEOAS** (Hypermedia As The Engine Of Application State) is a REST constraint where responses include links to related actions or resources. For example, a fanfic response could include links to its reviews, author, or delete endpoint. It makes APIs self-discoverable but adds complexity.

---

### 10. How is authentication typically implemented in REST APIs?

Since REST is stateless, sessions are not used. Common approaches:
- **JWT (JSON Web Token)** — the client receives a signed token on login and includes it in subsequent requests as `Authorization: Bearer <token>` (used in this lab)
- **OAuth2** — delegated authorization protocol used by third-party providers
- **API Keys** — simple secret keys passed in headers or query parameters
