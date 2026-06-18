import mongoose from "mongoose";

const ConectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB is connected");
        
        // Drop the old 6-hour TTL index if it exists, so Mongoose can recreate it with 12 hours
        try {
            await mongoose.connection.db.collection("sessions").dropIndex("createdAt_1");
            console.log("Old sessions TTL index dropped successfully");
        } catch (indexErr) {
            // Index doesn't exist, which is expected on new setups or if already dropped
        }
    
    } catch(err){
        console.log("error while connecting mongoDB: ", err);
    }
}

export {ConectDB}