# JobFlow

A full-stack career and job application tracking platform built with React, TypeScript, Node.js, Express, and MongoDB. Includes an interactive Kanban pipeline, calendar interview scheduler, conversion analytics, ATS email integration, and structured LLM-powered job extraction via OpenRouter.

---

## System Architecture

JobFlow uses a decoupled client-server architecture organized into a monorepo structure.

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (Client)                      │
│   React 18 • TypeScript • Tailwind CSS • React Query • Vite │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON (REST + JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (Server)                       │
│        Node.js • Express • TypeScript • Zod Validation      │
├──────────────────────────────┬──────────────────────────────┤
│       Business Services      │        Integrations          │
│ • Application / Kanban       │ • OpenRouter API (LLM)       │
│ • Interview Scheduler        │ • Gmail API / ATS Parser     │
│ • Analytics & Timeline       │ • OAuth2 / Google API        │
└──────────────────────────────┴──────────────────────────────┘
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     MongoDB Database                        │
│   Users • Applications • Interviews • Tasks • Events • Logs │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Features

- **Application Pipeline & Kanban Board**: Full lifecycle tracking (`Applied`, `Shortlisted`, `Interview`, `Offer`, `Rejected`, `Withdrawn`) with HTML5 drag-and-drop state transitions.
- **Detailed Application Management**: Sub-resource tracking for timestamped notes, activity audit timelines, and actionable tasks with due dates.
- **Interview Scheduling**: Multi-round interview tracking (`Screening`, `Technical`, `System Design`, `Behavioral`, `Manager`, `Final`) with agenda and monthly calendar grid views.
- **Funnel & Pipeline Analytics**: Recharts-powered stage conversion rates, drop-off ratios, weekly application velocity, and status breakdowns.
- **ATS Email Ingestion & Parsing**: Deterministic regex-based classification for major ATS platforms (Greenhouse, Lever, Workday, Ashby) with fuzzy deduplication to prevent duplicate entries.
- **LLM-Powered Extraction (OpenRouter)**: Zero-shot extraction of job descriptions into structured JSON schemas (Company, Role, Salary Range, Skills, Location) and context-aware career assistant.
- **Export & Import**: Instant CSV export and bulk-import parsing for pipeline data portability.

---

## Engineering Highlights & Design Decisions

1. **Layered Backend Architecture**: Strict separation of concerns (`Routes` ➔ `Middleware` ➔ `Controllers` ➔ `Services` ➔ `Models`), preventing business logic leakage into HTTP handlers.
2. **Deterministic-First ATS Parsing**: Incoming emails are first evaluated against high-precision regex templates before falling back to LLM completion, minimizing external API costs and latency.
3. **Resilient Database Layer**: Configured with connection state management, timeout thresholds, and in-memory mock fallback mode to prevent server crashes in local or offline development.
4. **End-to-End Type Safety**: Shared Zod schemas on the backend ensure request validation at runtime while mirroring TypeScript interfaces on the client.
5. **Secure Authentication**: Bcrypt-hashed credentials (salt rounds: 10) paired with signed JWTs (7-day expiry) verified on protected endpoints via Express middleware.

---

## Tech Stack

### Client
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Lucide Icons
- **State & Data Fetching**: TanStack React Query v5, Axios (with JWT interceptors)
- **Visualizations**: Recharts
- **Utilities**: Papaparse (CSV), date-fns

### Server
- **Runtime & Framework**: Node.js, Express (ES Modules)
- **Language**: TypeScript 5.6
- **Database & ODM**: MongoDB, Mongoose 8.x
- **Validation**: Zod
- **Security**: Helmet, CORS, Express Rate Limit, Bcrypt.js, JsonWebToken
- **Integrations**: OpenRouter API (`fetch`), Google APIs (`googleapis`)

---

## Getting Started

### Prerequisites
- Node.js 18.x or 20.x+
- MongoDB instance (local or MongoDB Atlas connection string)
- *(Optional)* OpenRouter API key for LLM job parsing and AI assistant features

### 1. Clone the repository
```bash
git clone https://github.com/KaranPathak001/JOB-APPLICATION-TRACKING-PLATFORM.git
cd JOB-APPLICATION-TRACKING-PLATFORM
```

### 2. Configure Environment Variables

Create `server/.env` based on the provided example:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/jobflow_ai
JWT_SECRET=your_jwt_secret_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=openai/gpt-4o-mini
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=http://localhost:5000/api/gmail/callback
```

### 3. Verify Database & Integrations
Before launching, you can run the built-in diagnostic scripts:

```bash
cd server
npm install

# Test database connection, latency, and read/write integrity
npm run test:db

# Audit all environment variables and external service endpoints
npm run check:connections
```

### 4. Run Locally

**Start Backend:**
```bash
cd server
npm run dev
```
*Server starts on `http://localhost:5000`.*

**Start Frontend:**
```bash
cd client
npm install
npm run dev
```
*Client starts on `http://localhost:5173`.*

---

## API Reference

### Auth
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/auth/me` - Get current session profile
- `PATCH /api/auth/preferences` - Update user settings

### Applications & Sub-Resources
- `GET /api/applications` - List applications (supports search, filters, pagination)
- `POST /api/applications` - Create application
- `GET /api/applications/:id` - Fetch single application
- `PATCH /api/applications/:id` - Update application details
- `PATCH /api/applications/:id/status` - Fast status update (Kanban transitions)
- `DELETE /api/applications/:id` - Remove application
- `POST /api/applications/bulk-import` - Bulk import applications via CSV
- `GET /api/applications/:id/events` - Get application audit timeline
- `POST /api/applications/:id/events` - Append custom timeline event
- `GET /api/applications/:id/notes` - Get application notes
- `POST /api/applications/:id/notes` - Add application note
- `DELETE /api/applications/:id/notes/:noteId` - Remove note

### Interviews & Tasks
- `GET /api/interviews` - List upcoming and past interview rounds
- `POST /api/interviews` - Schedule an interview round
- `PATCH /api/interviews/:id` - Update interview round
- `DELETE /api/interviews/:id` - Delete interview round
- `GET /api/tasks` - List tasks and action items
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update / toggle task completion
- `DELETE /api/tasks/:id` - Delete task

### Analytics & AI
- `GET /api/analytics/dashboard` - High-level metrics and active pipeline summary
- `GET /api/analytics/overview` - Funnel conversion and distribution data
- `GET /api/analytics/activity` - Chronological activity feed
- `POST /api/ai/parse-job` - Extract structured fields from raw job description text
- `POST /api/ai/assistant` - Career assistant chat query

---

## Database Schema Overview

```
User (id, name, email, passwordHash, preferences)
  └── Application (id, userId, company, role, status, salaryMin, salaryMax, location, workMode, jobUrl, appliedDate)
        ├── Interview (id, applicationId, type, scheduledAt, roundNumber, meetingLink, notes)
        ├── Note (id, applicationId, title, content, createdAt)
        ├── Task (id, applicationId, title, dueDate, priority, completed)
        └── ApplicationEvent (id, applicationId, type, description, source, timestamp)
```

---

## License

MIT License. See [LICENSE](LICENSE) for details.
