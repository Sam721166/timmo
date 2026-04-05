import mongoose from "mongoose";

const countdownSchema = mongoose.Schema({
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

export default mongoose.model("countdown", countdownSchema)