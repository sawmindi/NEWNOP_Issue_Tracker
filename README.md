# IssueTrack - Full-Stack Issue Tracker

A production-ready issue tracker built with **React + TypeScript**, **Express.js**, and **MongoDB**, featuring JWT authentication, real-time search, and a polished dark UI.

---

## Features

### Core
- **Full CRUD** - Create, read, update, and delete issues
- **Issue fields** - Title, description, status, priority, severity, tags
- **Status workflow** - Open → In Progress → Resolved → Closed (with confirmation prompts)
- **Status counts** - Live dashboard cards showing counts per status (clickable filters)
- **Visual indicators** - Color-coded badges for every status, priority, and severity value
- **Issue detail page** - Full view with inline status transitions
- **Search** - Debounced full-text search across title and description (400ms delay - no excessive API calls)
- **Filters** - Filter by status, priority, severity, and sort order simultaneously
- **Pagination** - Page-based navigation with total count and range display
- **Export** - Export filtered issues to **CSV** or **JSON** (client-side, no extra API call)

### Auth
- **Registration & login** with email + password
- **bcrypt** password hashing (salt rounds: 12)
- **JWT** authentication (7-day expiry)
- **Persisted sessions** via Zustand + localStorage
- **Protected routes** - automatic redirect to `/login` when unauthenticated
- **401 interceptor** - auto-clears session and redirects on token expiry


---

## Project Structure

```
issue-tracker/
├── backend/                  # Express.js API
│   ├── src/
│   │   ├── config/db.js      # MongoDB connection
│   │   ├── controllers/      # authController, issueController
│   │   ├── middleware/       # JWT auth, global error handler
│   │   ├── models/           # User, Issue (Mongoose schemas)
│   │   └── routes/           # /api/auth, /api/issues
│   ├── .env
│   └── package.json
│
└── frontend/                 # React + Vite + TypeScript
    ├── src/
    │   ├── api/              # Axios instance + API modules
    │   ├── components/
    │   │   ├── issues/       # IssueTable, IssueForm, IssueFilters, Badges
    │   │   ├── layout/       # AppLayout (sidebar + mobile nav)
    │   │   └── ui/           # Button, Modal, ConfirmDialog, Pagination
    │   ├── hooks/            # useDebounce
    │   ├── pages/            # Dashboard, IssueDetail, IssuesList, Login, Register
    │   ├── store/            # authStore, issueStore (Zustand)
    │   ├── types/            # TypeScript interfaces
    │   └── utils/            # CSV/JSON export utilities
    └── package.json
```

---

## Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | ≥ 18.x |
| npm | ≥ 9.x |
| MongoDB | ≥ 6.x (local or Atlas) |

---

### 1. Clone the repository

---

### 2. Set up the Backend

```bash
cd backend
npm install
```

```env
PORT=3010
MONGODB_URI=mongodb+srv://**********
JWT_SECRET=**********
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

The API will be running at **http://localhost:3010**

---

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

Start the dev server:

```bash
npm run dev
```

The app will be running at **http://localhost:5173**

> The Vite dev server proxies `/api` requests to `http://localhost:3010` automatically — no CORS issues in development.

---

### 4. Build for Production

```bash
# Frontend
cd frontend
npm run dev 

---

## API Reference

All endpoints (except auth) require the `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user |

**Register / Login body:**
```json
{
  "name": "Jane Smith",       // register only
  "email": "jane@example.com",
  "password": "secret123"
}
```

---

### Issues

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/issues` | List issues (search, filter, paginate) |
| POST | `/api/issues` | Create a new issue |
| GET | `/api/issues/:id` | Get a single issue |
| PUT | `/api/issues/:id` | Update an issue |
| DELETE | `/api/issues/:id` | Delete an issue (reporter only) |
| PATCH | `/api/issues/:id/status` | Update status only |
| GET | `/api/issues/export` | Export CSV or JSON |

**GET /api/issues — Query parameters:**

| Param | Type | Example |
|-------|------|---------|
| `page` | number | `1` |
| `limit` | number | `10` |
| `search` | string | `login bug` |
| `status` | string | `Open` |
| `priority` | string | `High` |
| `severity` | string | `Blocker` |
| `sortBy` | string | `createdAt` |
| `sortOrder` | `asc` / `desc` | `desc` |

**Issue body (POST/PUT):**
```json
{
  "title": "Login button unresponsive on Safari",
  "description": "Steps to reproduce...",
  "status": "Open",
  "priority": "High",
  "severity": "Major",
  "tags": ["safari", "auth", "frontend"]
}
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS (custom design tokens) |
| State | Zustand (+ persist middleware) |
| Routing | React Router v6 |
| HTTP | Axios (with interceptors) |
| Backend | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit |

---
