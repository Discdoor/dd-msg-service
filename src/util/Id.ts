import { Collection } from "mongodb";

/**
 * Generates a new entity ID.
 * @param col The collection to use to generate an offset from.
 */
async function generateId(col: Collection) {
    return `${new Date().getTime() + (await col.countDocuments() + 1)}`;
}

/**
 * Entity ID generator.
 */
export const EntityId = {
    generate: generateId
}