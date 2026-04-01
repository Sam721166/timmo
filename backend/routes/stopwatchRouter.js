import express from "express"
const stopwatchRouter = express.Router()
import stopwatchModel from "../model/stopwatch.js"


stopwatchRouter.get("/get", async (req, res) => {
    res.json("hello ")
})


export default stopwatchRouter