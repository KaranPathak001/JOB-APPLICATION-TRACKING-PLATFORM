# JobFlow AI 🚀
### Intelligent AI-Powered Job Application Tracker & Career Command Center

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.3.1-61dafb)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.6.2-blue)](https://www.typescriptlang.org/)
[![Powered by Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)](https://deepmind.google/technologies/gemini/)

JobFlow AI is a production-grade, full-stack career command center engineered to help job seekers take complete control over their job search lifecycle. It seamlessly combines manual & AI-assisted application tracking, automated Gmail ATS sync with deterministic regex parsing, multi-round interview scheduling with calendar views, funnel analytics, and an interactive Gemini AI Career Strategist.

---

## ✨ Features & Capabilities

### 1. 📊 Executive Command Center & Dashboard
- **Real-time Pipeline KPIs**: Live stats for Total Applications, Active Pipeline, Interviews, and Offers with period-over-period delta trends.
- **Conversion Funnel**: Track stage-by-stage progression (Applied ➔ Shortlisted ➔ Interview ➔ Offer) with automated drop-off calculation.
- **AI Strategic Insights**: Contextual career recommendations generated directly from your active database records.
- **Upcoming Interviews**: Integrated cards with countdowns and 1-click meeting access links.

### 2. 🗂️ Application Pipeline & Interactive Kanban
- **List & Table View**: Fast search with debouncing, status and work-mode filters, pagination, and instant CSV export.
- **Drag-and-Drop Pipeline**: HTML5-powered Kanban board allowing real-time status transitions with automatic audit trail event logging.
- **Application 360° Detail View**:
  - Full audit timeline of all interactions.
  - Timestamped notes and strategy scratchpads.
  - Action item checklist with deadline tracking.
  - In-app interview round scheduler.

### 3. 🤖 Google Gemini AI Engine
- **✨ Job Description Auto-Fill**: Paste any raw job description from LinkedIn, Indeed, or career portals. Gemini extracts Company, Role, Location, Salary Range, and Required Skills without manual entry.
- **💬 AI Career Strategist**: Conversational assistant with live RAG context over your application pipeline to answer:
  - *"Which companies haven't responded for >7 days?"*
  - *"What interviews do I have scheduled this week?"*
  - *"Generate technical preparation questions for my next interview."*

### 4. ⚡ Gmail Automation & Deduplication Engine
- **ATS Template Detection**: Deterministic parsing for Greenhouse, Lever, Workday, LinkedIn, and Ashby emails.
- **Gemini Fallback Parser**: Robust extraction for unstructured recruiter reachouts.
- **Fuzzy Deduplication**: Prevents multiple emails from the same recruiter/company from creating duplicate application entries.

### 5. 📅 Calendar & Activity Audit Trail
- **Interview Calendar**: Switch between Agenda Timeline and Month Grid views.
- **Activity Feed**: Unified chronological log across all applications, email syncs, and AI extractions.

### 6. 🚀 1-Click Instant Demo Sandbox
- Pre-populated with 8+ applications across multiple stages, scheduled interview rounds, timeline events, and notes.

---

## 🛠️ Architecture & Tech Stack

```
jobflow-ai/
├── client/                     # Vite + React + TypeScript + Tailwind CSS + Lucide + Recharts
│   ├── src/
│   │   ├── api/                # Axios instance with JWT interceptors
│   │   ├── components/         # Layout, Sidebar, Topbar, Modals
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── layouts/            # AppLayout
│   │   ├── pages/              # Dashboard, Applications, Pipeline, Calendar,
│   │   │                       # Analytics, Activity, EmailSync, Assistant, Profile,
│   │   │                       # LandingPage, LoginPage, SignupPage, OnboardingPage
│   │   ├── types/              # Client TypeScript models
│   │   └── utils/              # Formatters, status styling, CSV export
└── server/                     # Node.js + Express + TypeScript + Mongoose
    ├── src/
    │   ├── config/             # DB connection, environment configuration
    │   ├── controllers/        # Thin controllers
    │   ├── middleware/         # Auth, ErrorHandler, Zod validation
    │   ├── models/             # Mongoose schemas: User, Application, Event,
    │   │                       # Interview, Task, Note, EmailMessage, AIProcessingLog
    │   ├── routes/             # Express routes
    │   ├── services/           # Business logic: App, AI, Analytics, Gmail, Seeder
    │   ├── integrations/       # Gemini AI provider & deterministic ATS parsers
    │   └── server.ts           # Server bootstrap
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- Node.js (v18 or v20+)
- MongoDB (local or MongoDB Atlas connection string)
- (Optional) Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/jobflow-ai.git
cd jobflow-ai
```

### 2. Configure Backend Environment
Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/jobflow_ai
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Install & Start Backend
```bash
cd server
npm install
npm run dev
```

### 4. Install & Start Frontend Client
```bash
cd client
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔒 Security & Best Practices
- Strict JWT authentication with bcrypt password hashing.
- Request payload validation using Zod.
- Helmet security headers and API rate limiting.
- Protected user ownership checks on all resource mutations.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
