# Timmo — Professional Focus Timer and Productivity Tracker

<p align="center">
  <a href="https://react.dev/" target="_blank"><img src="https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19" /></a>
  <a href="https://vitejs.dev/" target="_blank"><img src="https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
  <a href="https://expressjs.com/" target="_blank"><img src="https://img.shields.io/badge/Backend-Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" /></a>
  <a href="https://www.mongodb.com/" target="_blank"><img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/UI-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Inter&weight=600&size=26&duration=2600&pause=1000&color=8B5CF6&center=true&vCenter=true&width=900&lines=Track+focus+sessions+with+precision;Visualize+consistency+with+activity+heatmaps;Compete+globally+with+real-time+leaderboards" alt="Timmo animated headline" />
</p>

Timmo is a minimalist, premium productivity and focus application built to help users track focus sessions, measure consistency, and stay motivated through progress insights and global competition.

## Live Product Highlights

- Dual tracking modes: stopwatch and countdown
- Global daily leaderboard (top 100 users)
- GitHub-style 365-day activity heatmap
- Profile statistics with streaks, sessions, and milestones
- Personalized themes and appearance controls
- Responsive interface optimized for desktop and mobile

## Core Features

### Focus Tracking
- Stopwatch mode for open-ended focus blocks
- Countdown mode for structured sessions
- Precise tracking with second-level granularity

### Analytics and Consistency
- 30-day performance trends dashboard
- Calendar heatmap to visualize long-term habits
- Daily and all-time records surfaced in profile analytics

### Competitive Motivation
- Real-time leaderboard updates
- Personalized rank cards
- User badge visibility integrated into leaderboard interactions

### Personalization
- Multiple accent presets plus custom hex color picker
- Flexible sidebar behavior (manual, hover, mixed)
- Time format controls (12-hour / 24-hour) and seconds toggle

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS (`@tailwindcss/vite`)
- Framer Motion
- Axios
- shadcn/ui components

### Backend
- Node.js
- Express.js
- Zod validation
- JWT authentication (HTTP-only cookies)
- bcrypt password hashing
- Express rate limiting

### Database
- MongoDB
- Mongoose ODM with indexing support

## Project Structure

```text
backend/
  db/                 Database connection setup
  middlewares/        Authentication and rate limiting
  model/              Mongoose data models
  routes/             REST API route handlers
  utils/              Utility helpers (dates, validation, etc.)
  app.js              Backend entry point

frontend/
  public/             Static assets
  src/
    components/       Reusable and feature components
    App.jsx           Main application shell
    main.jsx          React root bootstrap
  vercel.json         Vercel rewrites and routing
  vite.config.js      Vite configuration
```

## Local Development

### 1) Clone Repository
```bash
git clone https://github.com/G1r1shCodes/timmo.git
cd timmo
```

### 2) Backend Setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI="mongodb://localhost:27017/timmo"
JWT_SECRET="yourSecret123"
PORT=3000
```

Run backend:
```bash
npm run dev
```

### 3) Frontend Setup
```bash
cd ../frontend
npm install
```

Create `frontend/.env`:
```env
BACKEND_URL="http://localhost:3000"
```

Run frontend:
```bash
npm run dev
```

Open:
```text
http://localhost:5173
```

## Deployment

### Backend (Render)
- Deploy as a persistent web service
- Configure `MONGO_URI` and `JWT_SECRET`
- Set CORS allowlist to include frontend domain

### Frontend (Vercel)
- Set root directory to `frontend`
- Vite builds to `dist`
- Use rewrite rules to proxy `/api/*` to backend

```json
{
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-app.onrender.com/api/:path*"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

## Product Screenshots

<p align="center">
  <img width="1470" height="956" alt="Timmo Dashboard" src="https://github.com/user-attachments/assets/e5757e1f-158f-4dd9-afbb-a3efcdfa99e9" />
</p>

<p align="center">
  <img width="1470" height="956" alt="Timmo Leaderboard" src="https://github.com/user-attachments/assets/f755dbb3-b190-4a82-8d37-0497e279a8e5" />
</p>

## Roadmap Ideas

- Team workspaces and shared focus rooms
- Weekly goals and accountability reports
- Rich profile sharing and public stat cards
- Session notes and deep-work tagging

## License

No license file is currently declared in this repository. Add a license to define reuse terms.
