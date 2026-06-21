import express from "express"
const userRouter = express.Router()
import userModel from "../model/user.js"
import stopwatchModel from "../model/stopwatch.js"
import countdownModel from "../model/countdown.js"
import { localDateKey } from "../utils/localDate.js"
import { syncLeaderboardForUser } from "../utils/leaderboardSync.js"
import { isLoggedIn } from "../middlewares/isLoggedIn.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import { OAuth2Client } from "google-auth-library"
import {
    getValidationMessage,
    loginSchema,
    signupSchema
} from "../utils/validationSchemas.js"

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
}

// Google Sign-In
userRouter.post("/google-login", async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({
                success: false,
                msg: "Google credential token is required"
            });
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({
                success: false,
                msg: "Failed to retrieve email from Google"
            });
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            // Create user with a safe random password hash to satisfy schema requirements
            const randomPassword = crypto.randomBytes(32).toString("hex");
            const hash = await bcrypt.hash(randomPassword, 10);
            user = await userModel.create({
                name,
                email,
                password: hash,
                picture
            });
        } else {
            // Update picture if it has changed or wasn't set before
            if (user.picture !== picture) {
                user.picture = picture;
                await user.save();
            }
        }

        const token = jwt.sign(
            { email: user.email, id: user._id, name: user.name, picture: user.picture },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);

        const safeUser = user.toObject();
        delete safeUser.password;

        return res.status(200).json({
            success: true,
            user: safeUser,
            token: token,
            msg: `Login successful, welcome ${user.name}`
        });

    } catch (err) {
        console.error("Error during Google OAuth login:", err);
        return res.status(500).json({
            success: false,
            msg: "Server error during Google Login",
            error: err.message || err.toString(),
            stack: err.stack
        });
    }
});

// sign up (disabled)
userRouter.post("/signup", async (req, res) => {
    return res.status(400).json({
        success: false,
        msg: "Traditional signup is disabled. Please use 'Sign in with Google'."
    });
});

// login (disabled)
userRouter.post("/login", async (req, res) => {
    return res.status(400).json({
        success: false,
        msg: "Traditional login is disabled. Please use 'Sign in with Google'."
    });
});




//logout
userRouter.post("/logout", async (req, res) => {
    res.clearCookie("token", cookieOptions)
    return res.status(200).json({
        success: true,
        msg: "Logout successful"
    })
})


// public product stats for landing page
userRouter.get("/public-stats", async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments()

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers
            }
        })
    } catch (err) {
        console.log("error fetching public stats:", err)
        return res.status(500).json({
            success: false,
            msg: "Server error"
        })
    }
})




// get user data
userRouter.get("/me", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        return res.status(401).json({
            success: false,
            msg: "Invalid token"
        });
    }
});

// GET user profile statistics and achievements
userRouter.get("/profile", isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.id;
        // Sync streak and achievements in real-time before returning details
        await syncLeaderboardForUser(userId).catch(err => {
            console.error("Error syncing user data on profile load:", err);
        });

        const user = await userModel.findById(userId).select("-password").lean();
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        // Performance Optimization: fetch only necessary fields with projections
        const [stopwatchRecords, countdownRecords] = await Promise.all([
            stopwatchModel.find({ userId }, "date totalTime").lean(),
            countdownModel.find({ userId }, "date totalTime").lean()
        ]);

        const totalSessions = stopwatchRecords.length + countdownRecords.length;

        // Calculate today's time
        const today = localDateKey();
        const stopwatchToday = stopwatchRecords.filter(r => r.date === today).reduce((sum, r) => sum + r.totalTime, 0);
        const countdownToday = countdownRecords.filter(r => r.date === today).reduce((sum, r) => sum + r.totalTime, 0);
        const todayTime = stopwatchToday + countdownToday;

        // Calculate total focus time
        const totalStopwatchTime = stopwatchRecords.reduce((sum, r) => sum + r.totalTime, 0);
        const totalCountdownTime = countdownRecords.reduce((sum, r) => sum + r.totalTime, 0);
        const totalFocusTime = totalStopwatchTime + totalCountdownTime;

        // Calculate current streak dynamically to ensure accuracy
        const dateSet = new Set([
            ...stopwatchRecords.map(r => r.date),
            ...countdownRecords.map(r => r.date)
        ]);

        let currentStreak = 0;
        if (dateSet.size > 0) {
            const todayStr = localDateKey();
            const yesterdayStr = localDateKey(new Date(Date.now() - 86400000));
            let startCheckingDate = new Date();
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
        }

        // Find Best Focus Day
        let bestFocusDay = { date: "No focus logged yet", time: 0 };
        const dailyTotals = {};
        for (const r of stopwatchRecords) dailyTotals[r.date] = (dailyTotals[r.date] || 0) + r.totalTime;
        for (const r of countdownRecords) dailyTotals[r.date] = (dailyTotals[r.date] || 0) + r.totalTime;
        for (const [date, time] of Object.entries(dailyTotals)) {
            if (time > bestFocusDay.time) {
                bestFocusDay = { date, time };
            }
        }

        return res.status(200).json({
            success: true,
            profile: {
                name: user.name,
                email: user.email,
                picture: user.picture,
                joiningDate: user.createdAt,
                todayTime,
                currentStreak,
                bestStreak: user.bestStreak || 0,
                badges: user.badges || [],
                totalSessions,
                totalFocusTime,
                bestFocusDay,
                lastNameUpdateAt: user.lastNameUpdateAt
            }
        });
    } catch (err) {
        console.error("Error fetching user profile:", err);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
});

// POST update user display name with validation, weekly limits, and duplicate checks
userRouter.post("/update-profile", isLoggedIn, async (req, res) => {
    try {
        const { name } = req.body;

        // 1. Validation: Name length (2 to 30 characters), alphanumeric + spaces
        if (!name || typeof name !== "string") {
            return res.status(400).json({ success: false, msg: "Display name is required" });
        }
        const trimmedName = name.trim().replace(/\s+/g, ' '); // collapse duplicate spaces
        if (trimmedName.length < 2 || trimmedName.length > 30) {
            return res.status(400).json({ success: false, msg: "Name must be between 2 and 30 characters" });
        }
        const alphaNumericSpacePattern = /^[a-zA-Z0-9 ]+$/;
        if (!alphaNumericSpacePattern.test(trimmedName)) {
            return res.status(400).json({ success: false, msg: "Name can only contain letters, numbers, and spaces" });
        }

        const user = await userModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, msg: "User not found" });
        }

        // 2. Week Limit Check (7 days = 604800000 ms)
        if (user.lastNameUpdateAt) {
            const msSinceLastUpdate = Date.now() - user.lastNameUpdateAt.getTime();
            const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
            if (msSinceLastUpdate < sevenDaysInMs) {
                const daysRemaining = Math.ceil((sevenDaysInMs - msSinceLastUpdate) / (24 * 60 * 60 * 1000));
                return res.status(400).json({
                    success: false,
                    msg: `You can only change your name once a week. Please wait ${daysRemaining} more day(s).`
                });
            }
        }

        // 3. Avoid Duplicate Names (case-insensitive check against other users)
        const duplicateUser = await userModel.findOne({
            _id: { $ne: user._id },
            name: { $regex: new RegExp(`^${trimmedName}$`, "i") }
        });
        if (duplicateUser) {
            return res.status(400).json({ success: false, msg: "This display name is already taken. Please choose another one." });
        }

        // 4. Update
        user.name = trimmedName;
        user.lastNameUpdateAt = new Date();
        await user.save();

        // 5. Regenerate Auth Token with the updated name
        const token = jwt.sign(
            { email: user.email, id: user._id, name: user.name, picture: user.picture },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, cookieOptions);

        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture
            },
            msg: "Profile name updated successfully"
        });
    } catch (err) {
        console.error("Error updating profile name:", err);
        return res.status(500).json({ success: false, msg: "Server error" });
    }
});

export default userRouter;
