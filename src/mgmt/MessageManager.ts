import { Collection } from "mongodb";
import { Attachment } from "../types/Attachment";
import { Message } from "../types/Message";
import { reflect } from 'libdd-node';
import { EntityId } from "../util/Id";
const { createShallowView } = reflect;
const config = require('../../data/config.json');

export class MessageManager {
    /**
     * The collection to use.
     */
    private col: Collection;

    /**
     * Creates a message manager.
     * @param col The collection to use.
     */
    constructor(col: Collection) {
        this.col = col;
    }

    /**
     * Retrieves old messages from storage.
     * @param channelId The ID of the channel to receive messages from.
     * @param page The page of message history.
     */
    async getMessages(channelId: string, page = 0) {
        const limit = config.limits.messaging.pagination;
        return (await this.col.find<Message>({ channelId }).skip(page * limit).limit(limit).toArray()).map(x => createShallowView(x, []));
    }

    /**
     * Places a new message for the specified channel.
     * @param authorId The author ID.
     * @param channelId The channel to place the message in.
     * @param content The content of the message.
     * @param attachments The attachments of the message.
     */
    async placeMessage(authorId: string, channelId: string, content: string, attachments: Attachment[]): Promise<Message> {
        // Check limits
        if(content.trim() == "")
            throw new Error("Message cannot be empty.");
        else if((authorId.trim() == "") || (authorId == null))
            throw new Error("The message must contain a valid author ID.");
        else if((channelId.trim() == "") || (channelId == null))
            throw new Error("The message must contain a valid channel ID.");
        else if(content.length > config.limits.messaging.contentLength)
            throw new Error("Maximum message size reached.");
        else if(attachments.length > config.limits.messaging.attachments)
            throw new Error("Attachments limit reached.");

        // Place the message
        const messageObject = {
            id: await EntityId.generate(this.col),
            authorId,
            channelId,
            content,
            attachments,
            dateSent: new Date(),
            dateEdited: null
        };

        // Insert message into DB
        await this.col.insertOne(messageObject);

        return createShallowView(messageObject, []);
    }
}