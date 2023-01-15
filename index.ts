import express, { Express, Request, Response } from 'express';
import dotenv, { config } from 'dotenv';
import { MongoClient, Db } from 'mongodb';
import { api, schema } from "libdd-node";
import { MessageManager } from './src/mgmt/MessageManager';
import { ChannelManager } from './src/mgmt/ChannelManager';
const { sendResponseObject, constructResponseObject } = api;
const { validateSchema } = schema;

// Read .env file
dotenv.config();

const app: Express = express();
let msgMgr: MessageManager;
let chMgr: ChannelManager;

// Use json
app.use(express.json());

// Routes
/*
Gets messages for the specified channel.
*/
app.get('/messages/:channelId/:page', async (req: Request, res: Response) => {
    try {
        // Get messages
        validateSchema({
            channelId: { type: "string" },
            page: { type: "string" }
        }, req.params);

        const pageNo = parseInt(req.params.page);
        sendResponseObject(res, 200, constructResponseObject(true, "", await msgMgr.getMessages(req.params.channelId, pageNo)));
    } catch(e: Error | any) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
});

/*
Places a message for the specified channel
*/
app.post('/messages/:channelId', async (req: Request, res: Response) => {
    try {
        // Place a message
        validateSchema({
            channelId: { type: "string" },
        }, req.params);

        validateSchema({
            authorId: { type: "string" },
            content: { type: "string" }, // Length is enforced by message manager
            attachments: { type: 'object', optional: true }
        }, req.body);

        sendResponseObject(res, 200, constructResponseObject(true, "", await msgMgr.placeMessage(req.body.authorId, req.params.channelId, req.body.content, req.body.attachments ?? [])));
    } catch(e: Error | any) {
        sendResponseObject(res, 400, constructResponseObject(false, e.message || ""));
    }
});

/**
 * Program entry point.
 */
async function main() {
    // Setup and connect to db
    let mclient = new MongoClient(process.env.DB_URL as string);
    
    try {
        console.log(`Connecting to database at ${process.env.DB_URL}...`);
        await mclient.connect();
        console.log("Database connection successful!");
    } catch(e) {
        console.error("Error: cannot connect to database!");
        process.exit(1);
    }

    let db = mclient.db(process.env.DB_NAME);
    msgMgr = new MessageManager(db.collection('messages'));
    chMgr = new ChannelManager(db.collection('channels'));

    // Listen app
    app.listen(process.env.PORT, () => {
        console.log(`Messaging service available at :${process.env.PORT}`);
    });
}

main();