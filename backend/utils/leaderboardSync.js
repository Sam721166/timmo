import leaderboardModel from "../model/leaderboard.js"
import stopwatchModel from "../model/stopwatch.js"
import countdownModel from "../model/countdown.js"
import userModel from "../model/user.js"
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
    
    // Calculate best streak and achievements
    const sortedDates = Array.from(dateSet).sort();
    let bestStreak = 0;
    if (sortedDates.length > 0) {
        let tempStreak = 1;
        bestStreak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            const diffTime = Math.abs(currDate - prevDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                tempStreak++;
            } else if (diffDays > 1) {
                bestStreak = Math.max(bestStreak, tempStreak);
                tempStreak = 1;
            }
        }
        bestStreak = Math.max(bestStreak, tempStreak);
    }

    const totalSessions = stopwatchRecords.length + countdownRecords.length;
    const totalStopwatchTime = stopwatchRecords.reduce((sum, r) => sum + r.totalTime, 0);
    const totalCountdownTime = countdownRecords.reduce((sum, r) => sum + r.totalTime, 0);
    const totalFocusTime = totalStopwatchTime + totalCountdownTime;

    let maxDayTime = 0;
    const dailyTotals = {};
    for (const r of stopwatchRecords) dailyTotals[r.date] = (dailyTotals[r.date] || 0) + r.totalTime;
    for (const r of countdownRecords) dailyTotals[r.date] = (dailyTotals[r.date] || 0) + r.totalTime;
    for (const time of Object.values(dailyTotals)) {
        if (time > maxDayTime) maxDayTime = time;
    }

    const earnedBadges = [];
    if (totalSessions >= 1) earnedBadges.push("newbie");
    if (bestStreak >= 7) earnedBadges.push("locked_in");
    if (bestStreak >= 30) earnedBadges.push("unstoppable");
    if (totalFocusTime >= 180000) earnedBadges.push("elite");
    if (maxDayTime >= 28800) earnedBadges.push("day_conqueror");
    if (maxDayTime >= 43200) earnedBadges.push("okay_at_home");
    if (bestStreak >= 365) earnedBadges.push("who_hurt_you");
    if (totalFocusTime >= 360000) earnedBadges.push("seek_help");
    if (bestStreak >= 500) earnedBadges.push("sunlight_allergic");

    await userModel.findByIdAndUpdate(userId, {
        bestStreak,
        badges: earnedBadges
    });

    await me.save();
    return me;
};
