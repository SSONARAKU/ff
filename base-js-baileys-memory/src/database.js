import { MongoClient } from 'mongodb';
import 'dotenv/config';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri); // Eliminamos las opciones obsoletas

let db;

const connectDB = async () => {
    if (!db) {
        await client.connect();
        db = client.db(process.env.DB_NAME);
    }
    return db;
};

export { connectDB, db };
