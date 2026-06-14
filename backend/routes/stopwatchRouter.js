import express from "express"
const stopwatchRouter = express.Router()
import stopwatchModel from "../model/stopwatch.js"
import userModel from "../model/user.js"
import { localDateKey, buildDailySeries } from "../utils/localDate.js"
import leaderboardModel from "../model/leaderboard.js";
import {
    getValidationMessage,
    timerSaveSchema
} from "../utils/validationSchemas.js";

stopwatchRouter.post("/save", async (req, res) => {
    try{
        const parsed = timerSaveSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: getValidationMessage(parsed.error)
            });
        }

        const savedSeconds = parsed.data.totalTime

        const user = await userModel.findOne({email: req.user.email})

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // calculate the total "totaltime" if the date is same and store in single place in database
        const today = localDateKey();
        
        let existing = await stopwatchModel.findOne({
            userId: user._id,
            date: today
        });

        let total;

        if (existing) {
            existing.totalTime += savedSeconds;
            await existing.save();
            total = existing;
        } else {
            total = await stopwatchModel.create({
                totalTime: savedSeconds,
                userId: user._id,
                date: today
            });
        }

        let leaderboardUser = await leaderboardModel.findOne({
            userId: user._id
        });

        if (!leaderboardUser) {
            leaderboardUser = await leaderboardModel.create({
                userId: user._id,
                todayTime: savedSeconds,
                streak: 1,
                lastActiveDate: today
            });
        } else {
            if (leaderboardUser.lastActiveDate !== today) {
                leaderboardUser.todayTime = 0;
                
                const yesterday = localDateKey(
                    new Date(Date.now() - 86400000)
                );

                if (leaderboardUser.lastActiveDate === yesterday) {
                    leaderboardUser.streak += 1;
                } else {
                    leaderboardUser.streak = 1;
                }

                leaderboardUser.lastActiveDate = today;
            }

            leaderboardUser.todayTime += savedSeconds;
            await leaderboardUser.save();
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

// GET all statistics for logged-in user
stopwatchRouter.get("/stats", async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Fetch all stopwatch records for the user
        const allRecords = await stopwatchModel.find({ userId: user._id });

        // Calculate total time (all-time)
        const totalTime = allRecords.reduce((sum, record) => sum + record.totalTime, 0);

        // Get today's time (computed in memory)
        const today = localDateKey();
        const todayRecord = allRecords.find(r => r.date === today);
        const todayTime = todayRecord?.totalTime || 0;

        // Calculate average time per day
        const uniqueDays = new Set(allRecords.map(r => r.date)).size;
        const averageTime = uniqueDays > 0 ? Math.round(totalTime / uniqueDays) : 0;

        const dateMap = new Map(allRecords.map((r) => [r.date, r.totalTime]))
        const chartData = buildDailySeries(30, dateMap)
        const heatmapData = buildDailySeries(365, dateMap)

        // Calculate monthly stats (computed in memory)
        const currentDate = new Date();
        const monthStart = localDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1));
        const monthlyRecords = allRecords.filter(r => r.date >= monthStart);
        const monthlyTotal = monthlyRecords.reduce((sum, record) => sum + record.totalTime, 0);

        return res.status(200).json({
            success: true,
            stats: {
                totalTime,           // all-time total in seconds
                todayTime,           // today's total in seconds
                averageTime,         // average per day in seconds
                monthlyTotal,        // this month's total in seconds
                totalDays: uniqueDays // total days with records
            },
            chartData,               // last 30 days for bar chart
            heatmapData,             // last 365 days for heatmap
            msg: "Stats fetched successfully"
        });

    } catch(err) {
        console.log("error fetching stats", err);
        res.status(500).json({ 
            success: false,
            message: "Server error" 
        });
    }
})

export default stopwatchRouter
