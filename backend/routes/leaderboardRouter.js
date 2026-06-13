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
            .find()
            .sort({ 
                todayTime: -1,
                streak: -1,
            })
            .limit(100)
            .populate("userId", "name");

        const leaderboard = topUsers.map((user, index) => ({
            rank: index + 1,
            userId: user.userId?._id,
            name: user.userId?.name,
            todayTime:
                user.lastActiveDate === today
                    ? user.todayTime
                    : 0,
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

    const user = await userModel.findOne({
        email: req.user.email
    });
    
    const usersNumber = await userModel.countDocuments();


    const today = localDateKey();

    const countdownToday = await countdownModel.findOne({
        userId: user._id,
        date: today
    });

    const stopwatchToday = await stopwatchModel.findOne({
        userId: user._id,
        date: today
    });

    const todayTime =
        (countdownToday?.totalTime || 0) +
        (stopwatchToday?.totalTime || 0);


    let me =
        await leaderboardModel.findOne({
            userId: user._id
        });


        if (!me) {
            me = await leaderboardModel.create({
                userId: user._id,
                todayTime: 0,
                streak: 0,
                lastActiveDate: localDateKey()
            });
        }


    if (me.todayTime !== todayTime) {
        me.todayTime = todayTime;
        await me.save();
    }


    const rank = await leaderboardModel.countDocuments({


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




    const totalUsers =
        await leaderboardModel.countDocuments();

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
        userId: user._id,
        name: user.name,
        rank,
        focusedMoreThan,
        percentile,
        todayTime,
        streak: me.streak
    });
});



export default leaderboardRoute
