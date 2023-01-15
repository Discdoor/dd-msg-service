/**
 * Attachment type.
 */
export enum AttachmentType {
    file = 0,
    embed = 1
}

/**
 * Represents a message attachment.
 */
export interface Attachment {
    /**
     * The type of attachment.
     */
    type: AttachmentType;
}

/**
 * Represents a file attachment.
 */
export interface FileAttachment extends Attachment {
    /**
     * The location of the file.
     */
    location: string;

    /**
     * The last known size of the file.
     */
    size: number;
}

/**
 * Represents an embed.
 */
export interface EmbedAttachment extends Attachment {
    /**
     * Embed title.
     */
    title: string;

    /**
     * Embed description.
     */
    description: string;

    /**
     * Embed image URL.
     */
    image: string;
}