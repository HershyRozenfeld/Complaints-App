import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connect.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// הגשת קבצים סטטיים מהתיקיה 'public'
app.use(express.static('public'));

const start = async () => {
    try {
        await connectDB(process.env.MONGODB_URI);
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

start();