import express from "express"
const stopwatchRouter = express.Router()
import stopwatchModel from "../model/stopwatch.js"
import countdownModel from "../model/countdown.js"
import userModel from "../model/user.js"
import sessionModel from "../model/session.js"
import { localDateKey, buildDailySeries, splitTimeIntervalByDay } from "../utils/localDate.js"
import { syncLeaderboardForUser } from "../utils/leaderboardSync.js"
import {
    getValidationMessage,
    timerSaveSchema
} from "../utils/validationSchemas.js";

stopwatchRouter.post("/start", async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        await sessionModel.findOneAndUpdate(
            { userId: req.user.id },
            { timerType: "stopwatch", startTime: new Date() },
            { upsert: true, returnDocument: "after" }
        );
        res.status(200).json({ success: true, message: "Stopwatch session started" });
    } catch (err) {
        console.error("Error starting stopwatch session:", err);
        res.status(500).json({ message: "Server error" });
    }
});

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

        // Validate active session
        const session = await sessionModel.findOne({ userId: user._id });
        if (!session || session.timerType !== "stopwatch") {
            return res.status(400).json({ success: false, message: "No active stopwatch session found. Please start the timer first." });
        }

        const endTime = new Date();
        const elapsedMs = endTime.getTime() - session.startTime.getTime();
        const MAX_SESSION_DURATION = 12 * 60 * 60 * 1000 + 60000; // 12 hours + 1 min grace
        if (elapsedMs > MAX_SESSION_DURATION) {
            await sessionModel.deleteOne({ _id: session._id });
            return res.status(400).json({ success: false, message: "Session expired. Max session duration is 12 hours." });
        }

        const elapsedSeconds = elapsedMs / 1000;
        const graceBuffer = 60; // 60 seconds grace for network/clock differences
        if (savedSeconds > elapsedSeconds + graceBuffer) {
            return res.status(400).json({ success: false, message: "Verification failed. Saved time exceeds real-world elapsed time." });
        }

        // Also check lastTimerSavedAt if it is too recent (additional protection)
        const lastSave = user.lastTimerSavedAt || user.createdAt;
        const timeSinceLastSave = (endTime.getTime() - lastSave.getTime()) / 1000;
        if (savedSeconds > timeSinceLastSave + graceBuffer) {
            return res.status(400).json({ success: false, message: "Verification failed. Please wait before saving another session." });
        }

        const splitIntervals = splitTimeIntervalByDay(savedSeconds, endTime);

        let lastRecord = null;
        const MAX_DAILY_TIME = 24 * 60 * 60; // 86,400 seconds (24 hours)

        for (const interval of splitIntervals) {
            const { date, time } = interval;

            const [existingCountdown, existingStopwatch] = await Promise.all([
                countdownModel.findOne({ userId: user._id, date }),
                stopwatchModel.findOne({ userId: user._id, date })
            ]);

            const currentTotal = (existingCountdown?.totalTime || 0) + (existingStopwatch?.totalTime || 0);

            if (currentTotal >= MAX_DAILY_TIME) {
                continue;
            }

            let finalSavedSeconds = time;
            if (currentTotal + time > MAX_DAILY_TIME) {
                finalSavedSeconds = MAX_DAILY_TIME - currentTotal;
            }

            let existing = existingStopwatch;
            let record;

            if (existing) {
                existing.totalTime += finalSavedSeconds;
                await existing.save();
                record = existing;
            } else {
                record = await stopwatchModel.create({
                    totalTime: finalSavedSeconds,
                    userId: user._id,
                    date
                });
            }
            lastRecord = record;
        }

        // Update user's last save timestamp
        user.lastTimerSavedAt = endTime;
        await user.save();

        // Delete active session
        await sessionModel.deleteOne({ _id: session._id });

        // Sync leaderboard status for the user
        await syncLeaderboardForUser(user._id);

        res.status(200).send({
            stopwatchTime: lastRecord || { totalTime: 0, date: localDateKey(endTime) },
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
        if (!req.user || !req.user.id) {
            return res.status(401).json({ 
                success: false,
                message: "Unauthorized" 
            });
        }

        // Fetch all stopwatch records for the user directly using req.user.id
        const allRecords = await stopwatchModel.find({ userId: req.user.id }).lean();

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
