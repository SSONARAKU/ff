import { connectDB } from './database.js';

class MongoDBAdapter {
    constructor() {
        this.db = null;
    }

    async init() {
        this.db = await connectDB();
    }

    async getPrevByNumber(number) {
        if (!this.db) {
            await this.init();
        }
        const collection = this.db.collection('messages');
        const prevMsg = await collection.findOne({ number });
        return prevMsg;
    }

    async saveMessage(message) {
        if (!this.db) {
            await this.init();
        }
        const collection = this.db.collection('messages');
        await collection.insertOne(message);
    }
}

export default MongoDBAdapter;
