import mongoose, { Mongoose } from 'mongoose';
import dns from 'node:dns/promises';
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const MONGODB_URI = process.env.DATABASE_URL;
let cachedInstance: Mongoose | null = null;
export const getMongoDbInstance = async () => {
    console.log('Connecting to MongoDB...')
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    if (!cachedInstance) {
        cachedInstance = await mongoose.connect(MONGODB_URI)
    }
    return cachedInstance;
}
