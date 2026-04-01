import express from "express"
const app = express()
import userRouter from "./routes/userRouter.js"
import todoRouter from "./routes/todoRouter.js"
import stopwatchRouter from "./routes/stopwatchRouter.js" 
// import countdownRouter from "./routes/countdownRouter.js"
import cors from "cors"

import dotenv from "dotenv"
dotenv.config()
 
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5176"],
    credentials: true
}))  
app.use(express.json())
app.use(express.urlencoded({extended: true})) 
 
import { ConectDB } from "./db/db.js"
ConectDB()


app.get("/", (req, res) => {
    res.send("backend is running")
})

app.use("/api/user", userRouter)
app.use("/api/todo", todoRouter)
app.use("/api/stopwatch", stopwatchRouter)
// app.use("/api/countdown", countdownRouter)

app.listen(3000, (req, res) => {
    console.log("server is running on port 3000");
})