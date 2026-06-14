import express from "express";
const streakRouter = express.Router();

import stopwatchModel from "../model/stopwatch.js";
import countdownModel from "../model/countdown.js";
import userModel from "../model/user.js";
import { localDateKey } from "../utils/localDate.js";

streakRouter.get("/", async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.user.email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch stopwatch and countdown records in parallel
    const [stopwatchRecords, countdownRecords] = await Promise.all([
      stopwatchModel.find({ userId: user._id }),
      countdownModel.find({ userId: user._id })
    ]);

    const dateSet = new Set([
      ...stopwatchRecords.map((r) => r.date),
      ...countdownRecords.map((r) => r.date),
    ]);

    let currentStreak = 0;
    const currentDate = new Date();

    while (true) {
      const dateStr = localDateKey(currentDate);

      if (dateSet.has(dateStr)) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
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
