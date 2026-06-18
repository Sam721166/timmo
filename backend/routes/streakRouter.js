import express from "express";
const streakRouter = express.Router();

import stopwatchModel from "../model/stopwatch.js";
import countdownModel from "../model/countdown.js";
import userModel from "../model/user.js";
import { localDateKey } from "../utils/localDate.js";

streakRouter.get("/", async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // Fetch stopwatch and countdown records in parallel using req.user.id
    const [stopwatchRecords, countdownRecords] = await Promise.all([
      stopwatchModel.find({ userId: req.user.id }).lean(),
      countdownModel.find({ userId: req.user.id }).lean()
    ]);

    const dateSet = new Set([
      ...stopwatchRecords.map((r) => r.date),
      ...countdownRecords.map((r) => r.date),
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

    res.status(200).json({
      success: true,
      currentStreak,
    });
  } catch (err) {
    console.log("Error calculating streak:", err);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default streakRouter;
