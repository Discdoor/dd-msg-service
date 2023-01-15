# Messaging Service Documentation

This messaging service is responsible for providing messaging services for users.

The service is responsible for keeping track of conversations and retrieving messages that have already been made. The service also tracks created DMs, group DMs, entire guilds, and voice channels.

All messages are being stored in a MongoDB database. Message attachments are uploaded to the CDN server instead and are not held as blobs in the database.

## Further Reading
 - [Messaging](./messaging.md)
 - [API Endpoints](./endpoints.md)