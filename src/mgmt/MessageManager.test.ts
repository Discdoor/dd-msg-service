import { MongoClient, Db, Collection, MongoClientOptions } from 'mongodb';
import { Attachment } from '../types/Attachment';
import { Message } from '../types/Message';
import { MessageManager } from './MessageManager';
const config = require('../../data/config.json');

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

    let sampleMessage: Message;
    const sampleChannelId = "sample channel ID";
    const sampleAuthorId = "sample author ID";

    // test 1: placing messages
    test('place message', async ()=>{
        const messageContent = "Message content";
        
        sampleMessage = await msgMgr.placeMessage(sampleAuthorId, sampleChannelId, messageContent, []);
        expect(sampleMessage).toBeDefined();
        expect(sampleMessage).not.toBeNull();
        expect(sampleMessage.authorId).toBe(sampleAuthorId);
        expect(sampleMessage.channelId).toBe(sampleChannelId);
        expect(sampleMessage.content).toBe(messageContent);
    });

    // test 2: place message with content over limit
    test('place message with content over limit', async() => {
        let messageContent = "";

        for(let x = 0; x < config.limits.messaging.contentLength * 2; x++)
            messageContent += "A";

        let message;
        
        try {
            message = await msgMgr.placeMessage(sampleAuthorId, sampleChannelId, messageContent, []);
        } catch(e) {
            let exMessage = (e as Error).message;
            expect(exMessage).toBeDefined();
            expect(exMessage).toBe("Maximum message size reached.");
        }

        expect(message).toBeUndefined();
    });

    // test 3: place message with attachment limits reached
    test('place message with attachments limit reached', async() =>{
        const attachments: Attachment[] = [];

        // Add too many attachments
        for(let x = 0; x < config.limits.messaging.attachments * 2; x++)
            attachments.push({} as Attachment);

        let message;
        
        try {
            message = await msgMgr.placeMessage(sampleAuthorId, sampleChannelId, "test content", attachments);
        } catch(e) {
            let exMessage = (e as Error).message;
            expect(exMessage).toBeDefined();
            expect(exMessage).toBe("Attachments limit reached.");
        }

        expect(message).toBeUndefined();
    });

    // test 4: place message with invalid author
    test('place message with invalid author', async() =>{
        let message;
        
        try {
            message = await msgMgr.placeMessage("", sampleChannelId, "test content", []);
        } catch(e) {
            let exMessage = (e as Error).message;
            expect(exMessage).toBeDefined();
            expect(exMessage).toBe("The message must contain a valid author ID.");
        }

        expect(message).toBeUndefined();
    });

    // test 5: place message with invalid channel ID
    test('place message with invalid channel ID', async() =>{
        let message;
        
        try {
            message = await msgMgr.placeMessage(sampleAuthorId, "", "test content", []);
        } catch(e) {
            let exMessage = (e as Error).message;
            expect(exMessage).toBeDefined();
            expect(exMessage).toBe("The message must contain a valid channel ID.");
        }

        expect(message).toBeUndefined();
    });

    // test 6: get messages.
    test('get messages', async ()=>{
        // push a message and retrieve it
        await msgMgr.placeMessage(sampleAuthorId, "testchannel2", `test message`, []);
        const messages = await msgMgr.getMessages("testchannel2");
        expect(messages.length).toBe(1);
    });

    // test 7: get messages.
    test('ensure message retrieval follows pagination limit', async ()=>{
        // Push some sample messages 3.5x over the pagination limit
        for(let x = 0; x < ((config.limits.messaging.pagination * 3.5) | 0); x++)
            await msgMgr.placeMessage(sampleAuthorId, sampleChannelId, `test message ${x}`, []);

        // Only the page maximum should be retrieved now
        const messages = await msgMgr.getMessages(sampleChannelId);
        expect(messages.length).toBe(config.limits.messaging.pagination);
    });

    // test 8: edit message
    test('edit message', async ()=>{
        // push a message and retrieve it
        let originalMessage = await msgMgr.placeMessage(sampleAuthorId, "testchannel2", `test message`, []);
        let newMessage = await msgMgr.editMessage(originalMessage.id, "edited content");
        expect(newMessage).toBeDefined();
        expect(newMessage).not.toBeNull();
        expect(newMessage?.content).toBe("edited content");
    });

    // test 9: remove message
    test('remove message', async ()=>{
        // push a message and retrieve it
        let message = await msgMgr.placeMessage(sampleAuthorId, "testchannel2", `test message`, []);
        await msgMgr.removeMessage(message.id);
        let message2 = await msgMgr.getMessage(message.id);
        expect(message2).toBe(null);
        expect(message2?.content).not.toBe("edited content");
    });

    afterAll(async () => {
        await connection.close();
    });
});