import { Collection } from "mongodb";

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
    
}