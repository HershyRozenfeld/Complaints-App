import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        await MongoClient.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

export default connectDB;