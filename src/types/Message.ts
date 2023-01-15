import { Attachment } from "./Attachment";

/**
 * Represents a message.
 */
export interface Message {
    /**
     * The ID of the message.
     */
    id: string;

    /**
     * Author of the message.
     */
    authorId: string;

    /**
     * The text content of this message
     */
    content: string;

    /**
     * The channel ID to which this message belongs.
     */
    channelId: string;

    /**
     * When this message was sent.
     */
    dateSent: Date;

    /**
     * When this message was last edited.
     */
    dateEdited?: Date | null;

    /**
     * Message attachments.
     */
    attachments: Attachment[];
}