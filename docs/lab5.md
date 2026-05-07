## Lab5. Object-Relational Mapping with Sequelize

---

## Table of Contents

1. [Project Flow](#project-flow)
2. [How to Run](#how-to-run)
3. [Conclusion](#conclusion)

---

## Project Flow

Lab5 evolves Lab4 by replacing raw SQL repositories with Sequelize-based ORM repositories.

Main flow:

1. `src/app.ts` loads environment, Express middleware, routes, Sequelize instance, and model associations.
2. The server starts only after `sequelize.authenticate()` succeeds.
3. Routes dispatch requests to controllers (`auth`, `fanfic`, `review`, `comment`).
4. Controllers call services, and services call repositories.
5. Repositories use Sequelize models (`FanficModel`, `GenreModel`, `ReviewModel`, `CommentModel`, etc.) instead of manual SQL.

Data flow specifics:

- Entity relations are declared in `src/models/associations.ts` (including many-to-many fanfic–genre links).
- Repository methods convert Sequelize entities to domain models.
- Create/update/delete operations use Sequelize transactions to preserve consistency.

Authentication flow:

- JWT-based middleware protects mutating endpoints.
- Ownership checks remain in place for secured operations.

So Lab5 flow is: **HTTP request → route → controller → service → Sequelize ORM repository (models + associations + transactions) → response**.

---

## How to Run

1. Go to the folder:

```bash
cd lab5
```

2. Configure `.env` with `DATABASE_URL` and `JWT_SECRET`.

3. Start the app:

```bash
npm run dev
```

---

## Conclusion

Lab5 keeps the same web application behavior while improving data-access maintainability by introducing ORM models, associations, and transaction-managed repository operations.

