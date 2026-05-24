# Automated Software Quality Assurance Platform

**MCA Final Semester Project** — Full-stack Task Management System with complete automated testing, CI/CD pipelines, and regression testing workflows.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Next.js API Route Handlers |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Unit/Integration | Jest, Supertest |
| Frontend Tests | React Testing Library |
| E2E | Playwright |
| CI/CD | GitHub Actions |
| Code Quality | ESLint + Prettier |

## Features

- **Authentication** — Signup, login, logout, JWT, role-based access (Admin/User)
- **Dashboard** — Admin stats (users, tasks, bugs, coverage) / User task overview
- **Task Management** — CRUD, pagination, search, filters, sorting
- **Defect Monitoring** — Bug reports with severity and status tracking
- **Usability Testing** — Feedback forms, ratings, suggestions
- **QA Module** — Testing architecture documentation and coverage summary
- **Regression Testing** — Reusable suites that re-run on every CI push

## Project Structure

```
automate-testing/
├── src/
│   ├── app/                 # Pages & API routes
│   │   ├── (auth)/          # Login, signup
│   │   ├── (dashboard)/     # Protected pages
│   │   └── api/             # REST API handlers
│   ├── components/          # UI & layout components
│   ├── context/             # Auth context
│   ├── hooks/               # Custom hooks
│   ├── lib/                 # DB, JWT, auth, validations
│   ├── models/              # Mongoose schemas
│   └── services/            # Business logic
├── tests/
│   ├── unit/                # Unit tests
│   ├── integration/         # API + MongoDB tests
│   ├── components/          # RTL component tests
│   ├── regression/          # Regression suite
│   ├── setup/               # Jest setup files
│   └── utils/               # Mocks & helpers
├── playwright/              # E2E tests
├── .github/workflows/       # CI/CD pipeline
└── coverage/                # Generated coverage reports
```

## Prerequisites

- Node.js 20+
- MongoDB 6+ (local or Atlas)
- npm 10+

## Setup Instructions

### 1. Clone and install

```bash
git clone https://github.com/rubi-agrawal/Automate-testing.git
cd automate-testing
npm install
```

### 2. Environment variables

Copy the example file and configure:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `7d`) |
| `NEXT_PUBLIC_APP_URL` | App URL (default: `http://localhost:3000`) |

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:7

# Or use MongoDB Atlas connection string in MONGODB_URI
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **First user tip:** The first registered user can be promoted to admin if no admin exists. Register normally, then optionally set role in MongoDB.

## Testing Guide

### Run all unit tests

```bash
npm run test:unit
```

### Integration tests (uses MongoDB Memory Server)

```bash
npm run test:integration
```

### Frontend component tests

```bash
npm run test:components
```

### Regression suite

```bash
npm run test:regression
```

### Coverage report (HTML + console)

```bash
npm run test:coverage
```

Open `coverage/lcov-report/index.html` in a browser.

### E2E tests (Playwright)

```bash
# Start dev server in another terminal, then:
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui
```

### Run everything (lint + unit + integration + components)

```bash
npm run test:all
```

## CI/CD Explanation

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push/PR:

1. **Lint** — ESLint checks
2. **Unit Tests** — Jest unit project
3. **Integration Tests** — API tests with in-memory MongoDB
4. **Component Tests** — React Testing Library
5. **Regression Tests** — Core feature stability checks
6. **Coverage** — Uploads HTML coverage artifact
7. **E2E** — Playwright against built app
8. **Build** — `next build` (runs only if tests pass)

The pipeline **fails the build** if any test job fails.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/tasks` | List/create tasks |
| GET/PUT/DELETE | `/api/tasks/:id` | Task CRUD |
| GET/POST | `/api/bugs` | Bug reports |
| GET/POST | `/api/feedback` | Usability feedback |
| GET | `/api/dashboard/stats` | Dashboard statistics |

## Deployment

```bash
npm run build
npm start
```

Set production environment variables on your host (Vercel, Railway, etc.).

## Viva Presentation Points

1. **Architecture** — Separation of concerns (models, services, API, UI)
2. **Security** — bcrypt hashing, JWT, protected routes, role-based access
3. **Testing Pyramid** — Unit → Integration → Component → E2E
4. **Regression** — Automated re-testing after code changes
5. **CI/CD** — GitHub Actions with coverage artifacts
6. **QA Metrics** — Coverage reports, defect tracking, usability feedback

## License

MIT — Academic project use.
