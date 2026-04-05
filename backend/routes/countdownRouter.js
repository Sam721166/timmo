import express from "express"
const countdownRouter = express.Router()
import countdownModel from "../model/countdown.js"
import userModel from "../model/user.js"


countdownRouter.post("/save", async (req, res) => {
    try{
        const {totalTime} = req.body

        
        const user = await userModel.findOne({email: req.user.email})

        if (!totalTime || totalTime <= 0) {
            return res.status(400).json({ message: "Invalid time" });
        }

        if (!user) {
             console.log("USER NOT FOUND IN REQ");
            return res.status(404).json({ message: "User not found" });
        }

        // calculate the total "totaltime" if the date is same and store in single place in database
        const today = new Date().toISOString().split("T")[0];

        let existing = await countdownModel.findOne({
            userId: user._id,
            date: today
        });

        let total;

        if (existing) {
            existing.totalTime += totalTime;
            await existing.save();
            total = existing;
        } else {
            total = await countdownModel.create({
                totalTime,
                userId: user._id,
                date: today
            });
        }

        res.status(200).send({
            countdownTime: total,
            msg: "total time saved"
        })
    } catch(err){
        console.log("error while start in backend", err);
        res.status(500).json({ message: "Server error" });
    }
})






export default countdownRouter