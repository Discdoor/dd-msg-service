import { Collection } from "mongodb";
import { Attachment, AttachmentType, FileAttachment, EmbedAttachment } from "../types/Attachment";
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
     * Gets a message by ID.
     * @param id The ID of the message to get.
     */
    async getMessage(id: string): Promise<Message | null> {
        return await this.col.findOne<Message>({ id });
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
     * Removes the specified message.
     * @param id The ID of the message to remove.
     */
    async removeMessage(id: string) {
        const message = await this.getMessage(id);

        if(!message)
            throw new Error("Message not found.");

        const deleteResult = await this.col.deleteOne({ id });
        return deleteResult.acknowledged;
    }

    /**
     * Edits a message.
     * @param id The ID of the message to edit.
     * @param content The new content to set.
     */
    async editMessage(id: string, content: string): Promise<Message|null> {
        const message = await this.getMessage(id);

        if(!message)
            throw new Error("Message not found.");

        await this.col.updateOne({ id }, { $set: { content, dateEdited: new Date() } })
        return await this.getMessage(id);
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

        // Check attachments
        for(let a of attachments) {
            switch(a.type) {
                default:
                    throw new Error("Invalid attachment type");
                case AttachmentType.embed:
                    throw new Error("TODO implement.");
                    break;
                case AttachmentType.file:
                    let fileAttachment = a as FileAttachment;

                    if((typeof fileAttachment.size !== 'number') || (fileAttachment.size < 0) || (fileAttachment.size == null))
                        throw new Error("Invalid size.");

                    if((typeof fileAttachment.location !== 'string') || (fileAttachment.location.trim() == ""))
                        throw new Error("File must have a source.");

                    break;
            }
        }

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