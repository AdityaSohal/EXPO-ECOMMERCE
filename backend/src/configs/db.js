import mongoose from "mongoose";
import { ENV } from "./env.js";

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;
    try {
        const conn = await mongoose.connect(ENV.DB_URL);
        isConnected = true;
        console.log(`Connected to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to database:", error.message);
        process.exit(1);
    }
};