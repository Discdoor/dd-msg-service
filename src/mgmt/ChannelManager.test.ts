import { MongoClient, Db, Collection, MongoClientOptions } from 'mongodb';
import { Channel, ChannelType } from '../types/Channel';
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
    let chMgr: ChannelManager;

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
        chMgr = new ChannelManager(col);
    });

    const DMsender1 = "DM sender 1 user id";
    const DMsender2 = "DM sender 2 user id";

    let DM: Channel;

    // case 1: open new dm
    test('a DM is opened between sender 1 and sender 2', async()=>{
        DM = await chMgr.createDM(DMsender1, DMsender2);
        
        // Assert DM object
        expect(DM).toBeDefined();
        expect(DM).not.toBeNull();
        expect(DM.recipients).toContain(DMsender1);
        expect(DM.recipients).toContain(DMsender2);
        expect(DM.type).toBe(ChannelType.dm);
    });

    // case 2: reopen dm
    test('a DM is re-opened between sender 1 and sender 2', async()=>{
        const newDM = await chMgr.createDM(DMsender1, DMsender2);
        
        // Assert DM object
        expect(newDM.id).toBe(DM.id);
    });

    afterAll(async () => {
        await connection.close();
    });
});