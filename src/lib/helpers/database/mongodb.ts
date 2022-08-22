import { env } from '$env/dynamic/private';
import mongoose from 'mongoose';
var db = null;

const { APP_MONGO_URI } = env;

export const connectMongoDB = async () => {
    try {
        if (!db) {
            db = await mongoose.connect(APP_MONGO_URI);
            console.log('Connected to MongoDB');
        }
    } catch (error) {
        console.error(error);
    }
};
