# ⌛ Timmo — Beautiful Focus Timer, Heatmaps & Leaderboards

Timmo is a minimalist, premium productivity and focus application designed to help users track their focus times, observe their work consistency, and compete on a global leaderboard. It features custom countdowns, stopwatches, a GitHub-style activity heatmap, and a fully customizable dark-mode aesthetic.

---

## 🚀 Key Features

* **Dual-Timer Mode**: Support for both manual **Stopwatch** tracking and structured **Countdown** sessions.
* **Achievements & Badges**: Gamified achievements tracking user progress (e.g., *Touched the Timer*, *Locked In*, *Touch Grass Pls*, *Has No Life*, *Seek Professional Help*, etc.) featuring a modern aesthetic list of gamer-inspired solid-color badges (Zap, Target, Leaf, Crown, Trophy, ShieldAlert, HeartCrack, LifeBuoy, Ghost).
* **Global Leaderboards**: A real-time leaderboard showing the top 100 focus builders of the day. Features personalized ranking cards and hover tooltips showing earned user badges. Optimized for responsive layouts with text truncation to prevent column overlapping.
* **Visual Performance Analytics**: Custom dashboard charting your daily focus trends over the last 30 days.
* **Activity Heatmaps**: A GitHub-style 365-day calendar visualizing your focus history.
* **Premium Custom Settings**:
  * Customizable theme accent colors (White, Gold, Coral, Blue, Mint, Purple, Peach, Lime) plus a **Custom Color Picker** allowing users to select any custom hex color for all three clock interfaces.
  * Multiple sidebar opening options (Manual toggle, Hover, Mix).
  * Time layout formats (12-hour AM/PM vs. 24-hour) and option to toggle seconds.
* **Responsive Design**: Optimized layouts with flexible flex/grid wrapping for smooth mobile and desktop experiences.
* **Detailed Profile Statistics**: Displays today's focus, current streak, best streak, total sessions, and all-time milestone records formatted dynamically with seconds precision.

---

## 🛠️ Technology Stack

### Frontend
* **Core**: React 19 & Vite
* **Styling**: Tailwind CSS (with `@tailwindcss/vite` plugin)
* **Animations**: Framer Motion
* **Charts**: Shad cn components (for analytics and heatmap calendar)
* **API Client**: Axios

### Backend
* **Runtime**: Node.js & Express.js
* **Validation**: Zod (for request validation schemas)
* **Authentication**: JSON Web Tokens (stored in HTTP-only cookies) & BCrypt (password hashing)
* **Rate Limiting**: Express Rate Limiter (to prevent brute force attacks)

### Database
* **Database**: MongoDB (managed via Mongoose ODM with database indexing for optimal performance)

---

## 📂 Project Structure

```
├── backend/                  # Express REST API
│   ├── db/                   # Database connection helper
│   ├── middlewares/          # Auth guards and rate limiters
│   ├── model/                # Mongoose Database schemas
│   ├── routes/               # API route controllers
│   ├── utils/                # Helper utilities (dates, validation)
│   └── app.js                # Server entry point
│
├── frontend/                 # React client
│   ├── public/               # Static assets (favicons, og-image)
│   ├── src/
│   │   ├── components/       # Custom React views and components
│   │   ├── App.jsx           # Main App shell and global event listeners
│   │   └── main.jsx          # App root entry point
│   ├── vercel.json           # Vercel SPA routing & API rewrites configuration
│   └── vite.config.js        # Vite build and development configuration
```

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/Sam721166/timmo.git
cd timmo
```

### 2. Set up the Backend
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI="mongodb://localhost:27017/timmo"
   JWT_SECRET="yourSecret123"
   PORT=3000
   ```
3. Start the backend server in development mode:
   ```bash
   npm run dev
   ```

### 3. Set up the Frontend
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   npm install
   ```
2. Create a `.env` file in the `frontend` directory:
   ```env
   BACKEND_URL="http://localhost:3000"
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

Open `http://localhost:5173` in your browser.

---

## 🌐 Production Deployment

### Backend (Deployed on Render)
1. Hosted on a persistent server (e.g., Render Web Service).
2. Set up environment variables: `MONGO_URI` (pointing to a MongoDB Atlas cluster) and `JWT_SECRET`.
3. Configure **CORS** in `backend/app.js` to allow requests originating from your frontend Vercel domain.

### Frontend (Deployed on Vercel)
1. Hosted on Vercel with the **Root Directory** set to `frontend`.
2. Vercel automatically detects the Vite preset and builds the application output into the `dist` directory.
3. Uses a reverse proxy in `vercel.json` to route `/api/*` requests directly to the backend Render app, bypassing CORS restrictions:

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
