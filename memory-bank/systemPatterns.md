# System Patterns

## Architecture Overview

- **Full-stack Framework:** Nuxt 3
    - **Frontend:** Vue 3 components (`components/`, `pages/`, `layouts/`) rendered by Nuxt.
    - **Backend:** Nuxt Nitro server (`server/api/`) handling API requests.
    - **Database:** MongoDB accessed via Prisma ORM.
- **Monolithic Structure:** Frontend and backend code reside within the same Nuxt project structure.
- **API Layer:** RESTful API endpoints defined in `server/api/` handle data operations and business logic.
- **Data Modeling:** Prisma schema (`prisma/schema.prisma`) defines the database structure and relationships.

## Key Technical Decisions

- **Framework Choice:** Nuxt 3 for its integrated frontend/backend capabilities and Vue ecosystem.
- **Database Choice:** MongoDB (likely for flexibility/scalability) managed via Prisma.
- **Authentication:** JWT-based authentication implemented in `server/utils/auth.ts` and `server/utils/jwt.ts`.
- **Styling:** Tailwind CSS for utility-first styling.
- **ORM:** Prisma for type-safe database access and migrations.
- **PWA:** Enabled for offline capabilities and installability.

## Design Patterns

- **MVC/MVVM:** Implicitly followed through Nuxt/Vue structure (Models in Prisma, Views in Vue components, Controllers in API routes/Vue logic).
- **Repository Pattern (implied):** Prisma Client acts as a data access layer, abstracting direct database interactions.
- **Middleware (Nuxt):** Likely used for routing, authentication guards (though not explicitly seen yet).
- **Serverless Functions (Nitro):** API routes in `server/api/` function as serverless endpoints.

## Component Relationships

- **Pages (`pages/`)**: Define application routes and orchestrate component display.
- **Components (`components/`)**: Reusable UI elements used within pages and layouts.
- **Layouts (`layouts/`)**: Define overall page structure (e.g., `default.vue`).
- **API Routes (`server/api/`)**: Accessed by frontend components/pages via `fetch` or Nuxt's `$fetch` to interact with the backend and database.
- **Prisma Client**: Used within API routes to query/mutate data in the MongoDB database.
- **Auth Utils (`server/utils/`)**: Used by API routes to handle user authentication and authorization.

## Critical Implementation Paths

- **User Authentication:** Registration (`/api/auth/register`), Login (`/api/auth/login`), JWT handling.
- **Booking Workflow:** Teacher availability (`/api/availability`), booking creation (`/api/bookings`), status updates, potentially payment integration (Stripe).
- **Messaging:** Sending (`/api/messages`) and retrieving messages between users.
- **Teacher/Subject Management:** Linking teachers and subjects (likely via admin routes like `/api/admin/teachers`).
- **Availability Management:** Defining recurring or specific availability slots for teachers.
