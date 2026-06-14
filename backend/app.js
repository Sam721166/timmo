import express from "express"
const app = express()
import userRouter from "./routes/userRouter.js"
import stopwatchRouter from "./routes/stopwatchRouter.js" 
import countdownRouter from "./routes/countdownRouter.js"
import streakRouter from "./routes/streakRouter.js"
import leaderboardRouter from "./routes/leaderboardRouter.js"
// import "./cron/resetLeaderboard.js"



import cors from "cors"
import cookieParser from "cookie-parser"


import dotenv from "dotenv"
dotenv.config()
import {
    authLimiter,
    leaderboardLimiter,
    timerSaveLimiter
} from "./middlewares/rateLimiters.js"
 
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5176"],
    credentials: true
}))  
app.use(express.json())
app.use(express.urlencoded({extended: true})) 

app.use(cookieParser()); 
 
import { ConectDB } from "./db/db.js"
import { isLoggedIn } from "./middlewares/isLoggedIn.js"
ConectDB()


app.get("/", (req, res) => {
    res.send("backend is running")
})

app.use("/api/user/login", authLimiter)
app.use("/api/user/signup", authLimiter)
app.use("/api/user", userRouter) 
app.use("/api/stopwatch", isLoggedIn, timerSaveLimiter, stopwatchRouter)
app.use("/api/countdown", isLoggedIn, timerSaveLimiter, countdownRouter)
app.use("/api/streak", isLoggedIn, streakRouter)
app.use("/api/leaderboard", isLoggedIn, leaderboardLimiter, leaderboardRouter)


app.listen(3000, (req, res) => {
    console.log("server is running on port 3000");
}) 
