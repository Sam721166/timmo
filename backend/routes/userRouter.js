import express from "express"
const userRouter = express.Router()
import userModel from "../model/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
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


//sign up 
userRouter.post("/signup", async (req, res) => {
    try{
        const parsed = signupSchema.safeParse(req.body)

        if(!parsed.success){
            return res.status(400).json({
                success: false,
                msg: getValidationMessage(parsed.error)
            })
        }

        const {name, email, password} = parsed.data

        const user = await userModel.findOne({email})
        if(user){
            return res.status(409).json({
                success: false,
                msg: "User already exist"
            })
        }
        const hash = await bcrypt.hash(password, 10)
        await userModel.create({
            name: name,
            email: email,
            password: hash
        })
        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        res.cookie("token", token, cookieOptions)

        return res.status(201).json({
            success: true,
            token: token, 
            msg: "Account successfully created"
        })

    } catch(err){
        console.log("error:", err);
        return res.status(500).json({
            success: false,
            msg: "Server error signup"
        });
    }
    
})



// login
userRouter.post("/login", async (req, res) => {
    try{
        const parsed = loginSchema.safeParse(req.body)

        if(!parsed.success){
            return res.status(400).json({
                success: false,
                msg: getValidationMessage(parsed.error)
            })
        }

        const {email, password} = parsed.data

        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).json({
                success: false,
                msg: "User doesn't exist"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                msg: "Wrong password"
            })
        }

        const token = jwt.sign(
            { email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        res.cookie("token", token, cookieOptions)

        const safeUser = user.toObject()
        delete safeUser.password

        return res.status(200).json({
            success: true,
            user: safeUser,
            token: token, 
            msg: `Login successful, welcome back ${user.name}`
        })

    } catch(err){
        console.log("error:", err);
        return res.status(500).json({
            success: false,
            msg: "Server error login"
        });
    }
})




//logout
userRouter.post("/logout", async (req, res) => {
    res.clearCookie("token", cookieOptions)
    return res.status(200).json({
        success: true,
        msg: "Logout successful"
    })
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
