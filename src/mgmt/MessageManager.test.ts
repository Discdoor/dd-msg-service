import { MongoClient, Db, Collection, MongoClientOptions } from 'mongodb';
import { MessageManager } from './MessageManager';

// Typescript declarations
declare global {
    /**
     * Jest mongoDB library global.
     */
    var __MONGO_URI__: string;
}

describe('message manager tests', ()=> {
    /**
     * Channel manager instance.
     */
    let msgMgr: MessageManager;

    /**
     * DB connection.
     */
    let connection: MongoClient;

    // Test suite prereqs
    beforeAll(async () => {
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        connection = await MongoClient.connect(global.__MONGO_URI__ as string, options as MongoClientOptions);
        
        let db: Db = await connection.db('discdoor');
        let col: Collection = db.collection('messages');
        msgMgr = new MessageManager(col);
    });

    test('dummy', ()=>expect(1).toBe(1));

    afterAll(async () => {
        await connection.close();
    });
});