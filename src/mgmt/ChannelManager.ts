import { Channel, ChannelType } from "../types/Channel";
import { Collection } from "mongodb";
import { EntityId } from "../util/Id";
import { reflect } from 'libdd-node';
const { createShallowView } = reflect;

export class ChannelManager {
    /**
     * The collection to use.
     */
    private col: Collection;

    /**
     * Creates a channel manager.
     * @param col The collection to use.
     */
    constructor(col: Collection) {
        this.col = col;
    }

    /**
     * Finds a DM.
     * @param senderId The user ID of the sender.
     * @param receiverId The user ID of the receiver.
     */
    async findDM(senderId: string, receiverId: string): Promise<Channel|null> {
        let dm = await this.col.findOne<Channel>({ type: ChannelType.dm, recipients: [senderId, receiverId] });

        if(!dm)
            dm = await this.col.findOne<Channel>({ type: ChannelType.dm, recipients: [receiverId, senderId] });
        
        return dm;
    }

    /**
     * Creates a channel DM.
     * @param senderId The ID of the sender.
     * @param receiverId The ID of the receiver.
     */
    async createDM(senderId: string, receiverId: string): Promise<Channel> {
        // Check if DM already exists
        const prevDM = await this.findDM(senderId, receiverId);

        if(prevDM)
            return prevDM;
        
        // Create a new DM
        const channelObject = {
            name: "",
            type: ChannelType.dm,
            createdAt: new Date(),
            updatedAt: new Date(),
            recipients: [senderId, receiverId],
            topic: "",
            icon: "",
            lastMessageId: "",
            guildId: "",
            id: await EntityId.generate(this.col)
        };

        // Add it
        await this.col.insertOne(channelObject);

        // Ensure DB id is removed
        return createShallowView(channelObject, []);
    }
}