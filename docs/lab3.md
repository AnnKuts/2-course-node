## Lab3. Node.js Web Application (MVC Layers)

---

## Table of Contents

1. [Project Flow](#project-flow)
2. [How to Run](#how-to-run)
3. [Conclusion](#conclusion)

---

## Project Flow

Lab3 introduces a layered MVC-style structure with service and repository levels.

Main flow:

1. `src/app.ts` starts Express, configures middleware, and mounts routes from `src/routes/routes.ts`.
2. Route handlers in controllers receive requests for:
   - auth (`/auth/*`)
   - fanfics (`/fanfic/*`)
   - reviews (`/review/*`)
   - comments (`/comment/*`)
3. Controllers delegate business logic to services.
4. Services call repository functions.
5. Repositories in Lab3 read/write data from local JSON files in `lab3/data/` (sync and async file I/O patterns).
6. Controllers return rendered EJS pages or JSON responses to the client.

Authentication flow:

- Login/Register endpoints generate and validate JWT.
- Protected endpoints use `middleware/authMiddleware.ts`.

So Lab3 flow is: **HTTP request → route → controller → service → file-based repository → response**.

---

## How to Run

1. Go to the folder:

```bash
cd lab3
```

2. Configure `.env` with `JWT_SECRET`.

3. Start the app:

```bash
npm run dev
```

---

## Conclusion

Lab3 establishes the full application architecture (routes, controllers, services, repositories, models, middleware) while still using file-based stubs for data storage.

