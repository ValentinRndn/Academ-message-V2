# Tech Context

## Core Technologies

- **Framework:** Nuxt 3 (Vue 3)
- **Language:** TypeScript (implied by `.ts` files and `ts-node` dependency)
- **Database:** MongoDB
- **ORM:** Prisma
- **Styling:** Tailwind CSS
- **Authentication:** bcrypt (hashing), jsonwebtoken (JWT)
- **Payments:** Stripe
- **PWA:** @vite-pwa/nuxt

## Development Environment Setup

- **Prerequisites:** Node.js, npm (or compatible package manager), MongoDB instance.
- **Installation:** Run `npm install`.
- **Database Setup:**
    - Configure `DATABASE_URL` environment variable for MongoDB connection.
    - Run `npx prisma generate` (likely handled by `postinstall`).
    - Potentially run MongoDB setup script: `npm run setup-mongo`.
    - Seed database: `npm run seed` (Prisma seed) or `npm run seed-mongodb` (custom script).
- **Running:** `npm run dev` for development server.

## Technical Constraints

*(Outline any technical limitations or constraints, e.g., performance requirements, browser compatibility, infrastructure limitations.)*

## Key Dependencies

- **External Services:** MongoDB, Stripe (for payments).
- **Core Libraries:** Nuxt, Vue, Prisma Client, Tailwind CSS, bcrypt, jsonwebtoken.

## Tool Usage Patterns

- **Package Management:** npm
- **Version Control:** Git (implied by `.gitignore`)
- **Database Migrations/Management:** Prisma Migrate, Prisma Studio (likely)
- **Development Server:** Nuxt dev server (`npm run dev`)
- **Build Process:** Nuxt build (`npm run build`)
- **Database Seeding:** Custom scripts (`prisma/seed.ts`, `scripts/seed-mongodb.js`)
