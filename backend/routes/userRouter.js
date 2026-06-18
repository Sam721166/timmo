import express from "express"
const userRouter = express.Router()
import userModel from "../model/user.js"
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
            msg: "Server error during Google Login"
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




export default userRouter
