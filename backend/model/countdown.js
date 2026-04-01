import mongoose from "mongoose";

const countdownSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    initialDurationSec: {
        type: Number,
        default: 0
    },
    remainingTimeSec: {
        type: Number,
        default: 0
    },
    isRunning: {
        type: Boolean,
        default: false
    },
    lastStartTime: {
        type: Number // Date.now()
    }
    
}, {timestamps: true})

export default mongoose.model("countdown", countdownSchema)