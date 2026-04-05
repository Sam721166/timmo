import express from "express"
const stopwatchRouter = express.Router()
import stopwatchModel from "../model/stopwatch.js"
import userModel from "../model/user.js"


stopwatchRouter.post("/save", async (req, res) => {
    try{
        const {totalTime} = req.body

        
        const user = await userModel.findOne({email: req.user.email})

        if (!totalTime || totalTime <= 0) {
            return res.status(400).json({ message: "Invalid time" });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // calculate the total "totaltime" if the date is same and store in single place in database
        const today = new Date().toISOString().split("T")[0];
        
        let existing = await stopwatchModel.findOne({
            userId: user._id,
            date: today
        });

        let total;

        if (existing) {
            existing.totalTime += totalTime;
            await existing.save();
            total = existing;
        } else {
            total = await stopwatchModel.create({
                totalTime,
                userId: user._id,
                date: today
            });
        }

        res.status(200).send({
            stopwatchTime: total,
            msg: "total time saved"
        })
    } catch(err){
        console.log("error while start in backend", err);
        res.status(500).json({ message: "Server error" });
    }
})







export default stopwatchRouter