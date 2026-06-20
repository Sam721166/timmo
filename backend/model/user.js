import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true
    },
    lastTimerSavedAt: {
        type: Date
    },
    picture: {
        type: String
    },
    bestStreak: {
        type: Number,
        default: 0
    },
    badges: {
        type: [String],
        default: []
    },
    lastNameUpdateAt: {
        type: Date
    }
}, {timestamps: true})

export default mongoose.model("user", userSchema)