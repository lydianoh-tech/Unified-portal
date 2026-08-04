# Unified Portal

Secure full-stack web platform combining user registration, service booking, online shopping, media sharing, real-time communication, and cybersecurity tooling.

## Stack

- **Frontend:** React 19 + Vite + React Router (JSX)
- **Backend:** Express (MVC) + Socket.io
- **Database:** PostgreSQL + Prisma ORM, MongoDB + Mongoose (dual ORM)
- **Auth:** JWT (access + refresh tokens), bcrypt password hashing

## Modules

| Module | Description |
|--------|-------------|
| Auth & Users | Registration, login, roles (user, customer, admin) |
| Booking | Service reservations and scheduling |
| Marketplace | User-to-user item listings and purchases |
| Media | Photo and video uploads with access control |
| Chat | Real-time messaging via Socket.io |
| Tickets | Help desk / support ticketing |
| Tasks | Authenticated task management |
| Security | Cyber dashboard, SIEM-style log analysis |
| Monitoring | Network activity and platform health |

## Quick start

### Prerequisites

- Node.js 20+
- Docker (for PostgreSQL) or a local Postgres instance

### Setup

```bash
# Install dependencies
npm install

# Start PostgreSQL and MongoDB
docker compose up -d

# Copy env and run migrations
cp backend/.env.example backend/.env
npm run db:generate
npm run db:migrate
npm run db:seed

# Run dev servers (API on :4000, frontend on :5173)
npm run dev
```

### Default accounts (after seed)

| Email | Password | Role |
|-------|----------|------|
| admin@portal.local | Admin123! | admin |
| user@portal.local | User123! | user |

## Project structure

```
unified-portal/
├── frontend/        React UI
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   ├── layouts/
│   ├── assets/
│   └── App.jsx
├── backend/         Express API (MVC structure)
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── uploads/
│   ├── logs/
│   └── server.js
├── docker-compose.yml
└── package.json     npm workspaces root
```

## API

REST base URL: `http://localhost:4000/api`

WebSocket: `http://localhost:4000` (Socket.io)

## Dual database layout

| Layer | ORM | Database | Used for |
|-------|-----|----------|----------|
| Prisma | `@prisma/client` | PostgreSQL | Users, auth, bookings, marketplace, tickets, tasks, media |
| Mongoose | `mongoose` | MongoDB | Security logs (SIEM), chat conversations & messages |

All Mongoose schemas live in `backend/models/mongoose/` and mirror the Prisma models for flexibility. Core transactional data stays on PostgreSQL; document-heavy and real-time features use MongoDB.

## Security notes

- Helmet, CORS, and rate limiting enabled by default
- Passwords hashed with bcrypt (12 rounds)
- JWT secrets must be set in production via environment variables
- File uploads validated by MIME type and size limits
