import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
        unique: true
    },
    timerType: {
        type: String,
        enum: ["stopwatch", "countdown"],
        required: true
    },
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    }
}, { timestamps: true });

// Automatically expire sessions older than 12 hours
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 43200 });

export default mongoose.model("session", sessionSchema);
