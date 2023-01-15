import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
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