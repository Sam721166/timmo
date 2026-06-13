import cron from "node-cron";
import leaderboardModel from "../model/leaderboard.js";


cron.schedule("0 0 * * *", async () => {
    console.log("Resetting leaderboard");

    await leaderboardModel.updateMany(
        {},
        {
            $set: {
                todayTime: 0
            }
        }
    );

    console.log("Leaderboard reset complete");
});