## Lab4. Relational Database Integration (SQL)

---

## Table of Contents

1. [Project Flow](#project-flow)
2. [How to Run](#how-to-run)
3. [Conclusion](#conclusion)

---

## Project Flow

Lab4 keeps the Lab3 layered structure but replaces file stubs with PostgreSQL access via SQL queries.

Main flow:

1. `src/app.ts` initializes Express and routes.
2. Routes send requests to controllers (`auth`, `fanfic`, `review`, `comment`).
3. Controllers call services for business logic.
4. Services call repositories.
5. Repositories (`src/repository/*`) execute SQL using `pg` and `pool` from `src/db.ts`.
6. Results are mapped to model-friendly objects and returned back up the stack.

Database and transaction flow:

- CRUD operations are implemented for core entities.
- Write operations use explicit transactions (`BEGIN` / `COMMIT` / `ROLLBACK`) in repositories.
- On error, repositories roll back and propagate failure to services/controllers.

Authentication flow:

- JWT middleware protects create/update/delete endpoints.
- Ownership checks are enforced before editing/deleting user-owned content.

So Lab4 flow is: **HTTP request → route → controller → service → SQL repository (PostgreSQL, transactions) → response**.

---

## How to Run

1. Go to the folder:

```bash
cd lab4
```

2. Configure `.env` with `DATABASE_URL`.

3. Start the app:

```bash
npm run dev
```

---

## Conclusion

Lab4 transitions the application from mock/file storage to a real relational database and introduces transaction-safe SQL operations in the repository layer.

