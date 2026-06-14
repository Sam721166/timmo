import { ipKeyGenerator, rateLimit } from "express-rate-limit";

const fifteenMinutes = 15 * 60 * 1000;
const oneMinute = 60 * 1000;

const jsonRateLimitMessage = (message) => ({
    success: false,
    msg: message
});

const userOrIpKey = (req) => req.user?.email || ipKeyGenerator(req.ip);

export const authLimiter = rateLimit({
    windowMs: fifteenMinutes,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: jsonRateLimitMessage("Too many auth attempts. Please try again later.")
});

export const leaderboardLimiter = rateLimit({
    windowMs: oneMinute,
    limit: 60,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: userOrIpKey,
    message: jsonRateLimitMessage("Too many leaderboard requests. Please slow down.")
});

export const timerSaveLimiter = rateLimit({
    windowMs: fifteenMinutes,
    limit: 300,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    keyGenerator: userOrIpKey,
    skip: (req) => req.method !== "POST" || req.path !== "/save",
    message: jsonRateLimitMessage("Too many timer saves. Please try again later.")
});
