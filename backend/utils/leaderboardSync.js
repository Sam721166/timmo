import leaderboardModel from "../model/leaderboard.js"
import stopwatchModel from "../model/stopwatch.js"
import countdownModel from "../model/countdown.js"
import { localDateKey } from "./localDate.js"

export const syncLeaderboardForUser = async (userId) => {
    const today = localDateKey();
    
    // 1. Fetch today's records for both countdown and stopwatch
    const [countdownToday, stopwatchToday] = await Promise.all([
        countdownModel.findOne({ userId, date: today }),
        stopwatchModel.findOne({ userId, date: today })
    ]);
    
    const todayTime = (countdownToday?.totalTime || 0) + (stopwatchToday?.totalTime || 0);
    
    // 2. Fetch the user's leaderboard record
    let me = await leaderboardModel.findOne({ userId });
    
    // 3. Compute current streak dynamically from database records to ensure it's always accurate
    const [stopwatchRecords, countdownRecords] = await Promise.all([
        stopwatchModel.find({ userId }).lean(),
        countdownModel.find({ userId }).lean()
    ]);
    
    const dateSet = new Set([
        ...stopwatchRecords.map((r) => r.date),
        ...countdownRecords.map((r) => r.date)
    ]);
    
    let currentStreak = 0;
    let startCheckingDate = new Date();
    
    const todayStr = localDateKey(startCheckingDate);
    const yesterdayStr = localDateKey(new Date(Date.now() - 86400000));
    
    let shouldCheck = false;
    if (dateSet.has(todayStr)) {
        shouldCheck = true;
    } else if (dateSet.has(yesterdayStr)) {
        shouldCheck = true;
        startCheckingDate.setDate(startCheckingDate.getDate() - 1);
    }
    
    if (shouldCheck) {
        while (true) {
            const dateStr = localDateKey(startCheckingDate);
            if (dateSet.has(dateStr)) {
                currentStreak++;
                startCheckingDate.setDate(startCheckingDate.getDate() - 1);
            } else {
                break;
            }
        }
    }
    
    if (!me) {
        me = new leaderboardModel({
            userId,
            todayTime,
            streak: currentStreak,
            lastActiveDate: todayTime > 0 ? today : ""
        });
    } else {
        me.todayTime = todayTime;
        me.streak = currentStreak;
        if (todayTime > 0) {
            me.lastActiveDate = today;
        } else {
            // Find most recent active date if none today
            const sortedDates = Array.from(dateSet).sort();
            me.lastActiveDate = sortedDates.length > 0 ? sortedDates[sortedDates.length - 1] : "";
        }
    }
    
    await me.save();
    return me;
};
