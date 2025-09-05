import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            // These options ensure robustness
            serverSelectionTimeoutMS: 10000, // Timeout after 10s instead of 30s
        });
        
        console.log('MongoDB connected: ' + conn.connection.host);
        return conn;
    } catch (error) {
        console.error('MongoDB connection error: ', error.message);
        
        // Log helpful information for debugging
        if (error.name === 'MongooseServerSelectionError') {
            console.error('This could be due to:');
            console.error('1. Network connectivity issues');
            console.error('2. MongoDB Atlas IP whitelist restrictions');
            console.error('3. Incorrect MongoDB URI or credentials');
        }
        
        // Exit with failure in production for container restarts
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        
        throw error;
    }
}