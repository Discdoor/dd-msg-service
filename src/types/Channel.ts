/**
 * Channel types.
 */
export enum ChannelType {
    dm = 0,
    group_dm = 1,
    guild = 2,
    voice = 3
}

/**
 * Channel interface.
 */
export interface Channel {
    /**
     * The ID of this channel.
     */
    id: string;

    /**
     * When this channel was created.
     */
    createdAt: Date;

    /**
     * When this channel was last updated.
     */
    updatedAt: Date;

    /**
     * The name of this channel.
     */
    name: string;

    /**
     * The topic of this channel.
     */
    topic: string;

    /**
     * Channel recipients (only relevant for Group DM and DM)
     */
    recipients: string[];

    /**
     * Channel icon (only relevant for group DMs).
     */
    icon: string;

    /**
     * Last message ID.
     */
    lastMessageId: string;

    /**
     * The owning guild.
     */
    guildId: string;
}

/**
 * Represents a group channel.
 */
export interface GroupChannel extends Channel {
    /**
     * Channel owner.
     */
    ownerId: string;
}

/**
 * Represents a voice channel.
 */
export interface VoiceChannel extends Channel {
    /**
     * Voice channel bitrate.
     */
    bitrate: number;
}