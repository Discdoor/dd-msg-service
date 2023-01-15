import { MongoClient, Db, Collection, MongoClientOptions } from 'mongodb';
import { ChannelManager } from './ChannelManager';

// Typescript declarations
declare global {
    /**
     * Jest mongoDB library global.
     */
    var __MONGO_URI__: string;
}

describe('channel manager tests', ()=> {
    /**
     * Channel manager instance.
     */
    let relMgr: ChannelManager;

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
        let col: Collection = db.collection('channels');
        relMgr = new ChannelManager(col);
    });

    test('dummy', ()=>expect(1).toBe(1));

    afterAll(async () => {
        await connection.close();
    });
});