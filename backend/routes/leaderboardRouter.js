import express from "express"
const leaderboardRoute = express.Router()
import countdownModel from "../model/countdown.js"
import stopwatchModel from "../model/stopwatch.js"
import userModel from "../model/user.js"
import leaderboardModel from "../model/leaderboard.js"
import { localDateKey } from "../utils/localDate.js";
import { syncLeaderboardForUser } from "../utils/leaderboardSync.js"

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
            .populate("userId", "name picture badges");

        const leaderboard = topUsers
            .filter(user => user.userId) // Filter out deleted users where populate returned null
            .map((user, index) => ({
                rank: index + 1,
                userId: user.userId?._id,
                name: user.userId?.name,
                picture: user.userId?.picture,
                badges: user.userId?.badges || [],
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
        // Run independent queries in parallel to minimize network round-trips
        const [usersNumber, me, dbUser] = await Promise.all([
            userModel.countDocuments(),
            syncLeaderboardForUser(userId),
            userModel.findById(userId).select("name picture")
        ]);

        if (!dbUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const todayTime = me.todayTime;

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
            name: dbUser.name,
            picture: dbUser.picture || req.user.picture,
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
