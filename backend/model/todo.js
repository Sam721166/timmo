import mongoose from "mongoose";

const todoSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, {timestamps: true})

export default mongoose.model("todo", todoSchema)