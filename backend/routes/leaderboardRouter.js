import express from "express"
const leaderboardRoute = express.Router()
import countdownModel from "../model/countdown.js"
import stopwatchModel from "../model/stopwatch.js"
import userModel from "../model/user.js"
import leaderboardModel from "../model/leaderboard.js"
import { localDateKey } from "../utils/localDate.js";

leaderboardRoute.get("/", async (req, res) => {
    try{
        const today = localDateKey()
        
        const topUsers = await leaderboardModel
            .find({
                lastActiveDate: today,
                todayTime: { $gt: 0 }
            })
            .sort({ 
                todayTime: -1,
                streak: -1,
            })
            .limit(100)
            .populate("userId", "name");

        const leaderboard = topUsers
            .filter(user => user.userId) // Filter out deleted users where populate returned null
            .map((user, index) => ({
                rank: index + 1,
                userId: user.userId?._id,
                name: user.userId?.name,
                todayTime: user.todayTime,
                streak: user.streak
            }))
        
        res.status(200).json({
            success: true,
            leaderboard
        });

    }  catch (err) {
        console.log("Error calculating leaderboard data:", err);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
})

leaderboardRoute.get("/me", async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }
        
        const today = localDateKey();
        const userId = req.user.id;
        const userName = req.user.name;

        // Run independent queries in parallel to minimize network round-trips
        const [usersNumber, countdownToday, stopwatchToday, meData] = await Promise.all([
            userModel.countDocuments(),
            countdownModel.findOne({ userId, date: today }),
            stopwatchModel.findOne({ userId, date: today }),
            leaderboardModel.findOne({ userId })
        ]);

        const todayTime =
            (countdownToday?.totalTime || 0) +
            (stopwatchToday?.totalTime || 0);

        let me = meData;
        let needsSave = false;

        if (!me) {
            me = new leaderboardModel({
                userId,
                todayTime,
                streak: todayTime > 0 ? 1 : 0,
                lastActiveDate: todayTime > 0 ? today : ""
            });
            needsSave = true;
        } else if (todayTime > 0 && me.lastActiveDate !== today) {
            const yesterday = localDateKey(
                new Date(Date.now() - 86400000)
            );

            me.streak = me.lastActiveDate === yesterday ? me.streak + 1 : 1;
            me.lastActiveDate = today;
            me.todayTime = todayTime;
            needsSave = true;
        } else if (me.todayTime !== todayTime) {
            me.todayTime = todayTime;
            needsSave = true;
        }

        if (needsSave) {
            await me.save();
        }

        const rank = await leaderboardModel.countDocuments({
            lastActiveDate: today,
            todayTime: { $gt: 0 },
            $or: [
                { todayTime: { $gt: me.todayTime } },
                {
                    todayTime: me.todayTime,
                    streak: { $gt: me.streak }
                },
                {
                    todayTime: me.todayTime,
                    streak: me.streak,
                    _id: { $lt: me._id }
                }
            ]
        }) + 1;

        const totalUsers = usersNumber; // Re-use the count query from above

        const focusedMoreThan =
            Math.round(
                ((totalUsers - rank) / totalUsers) * 100
            );
        
        const percentile = Math.max(
            1,
            100 - focusedMoreThan
        );
         
        res.json({
            usersNumber,
            userId,
            name: userName,
            rank,
            focusedMoreThan,
            percentile,
            todayTime,
            streak: me.streak
        });
    } catch (err) {
        console.log("Error fetching user leaderboard status:", err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

export default leaderboardRoute
