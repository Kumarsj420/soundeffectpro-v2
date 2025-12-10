import mongoose from "mongoose";

let isConnected = false;

export async function connectDB(){
    if(isConnected){
        console.log('MongoDB is already connected');
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!, {dbName: "soundfx"});
        isConnected = conn.connections[0].readyState === 1;
        console.log('✅ MongoDB Connected')
    } catch (error) {
        console.log('MongoDB connection error', error)
    }
}
