import { Collection } from "mongodb";

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
    
}