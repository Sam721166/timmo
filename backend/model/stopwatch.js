import mongoose from "mongoose";

const stopwatchSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    totalTime: {
        type: Number,
        required: true
    },
    date: {
        type: String
    }
}, {timestamps: true})

stopwatchSchema.index({ userId: 1, date: 1 });

export default mongoose.model("stopwatch", stopwatchSchema)