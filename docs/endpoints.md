# API endpoint documentation

## `GET` /messages/`:channelId:`/`:page:`
Gets messages for a channel.

Parameters:
 - `:channelId:` - The ID of the channel to retrieve messages for.
 - `:page:` - The page of messages to get.

Results:
- `200` - If retrieval was successful
- `400` - If retrieval has failed.

Example Request:

`GET /messages/501023025195198/1`

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": [
        {
            "id": "1673793100208",
            "authorId": "39105203948923",
            "channelId": "501023025195198",
            "content": "my content",
            "attachments": [],
            "dateSent": "2023-01-15T14:31:40.205Z",
            "dateEdited": null
        }
    ]
}
```

----

## `POST` /messages/`:channelId:`
Places a new message.

Parameters:
 - `:channelId:` - The ID of the channel to place a message in.

Body Parameters:
 - `authorId` - The user ID of the message author.
 - `content` - The message content.
 - `attachments` - An array of optional attachments.

Results:
- `200` - If placement was successful
- `400` - If placement has failed.

Example Request:

Request: `POST /messages/501023025195198`

Body:
```json
{
    "authorId": "1237582395723",
    "content": "This is a very fancy message",
    "attachments": []
}
```

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": {
        "id": "1673793100208",
        "authorId": "1237582395723",
        "channelId": "501023025195198",
        "content": "This is a very fancy message",
        "attachments": [],
        "dateSent": "2023-01-15T14:31:40.205Z",
        "dateEdited": null
    }
}
```

-----

## `DELETE` /messages/`:channelId:`/`:messageId:`
Removes the specified message.

Parameters:
 - `:channelId:` - The ID of the channel to remove a message from.
- `:messageId:` - The ID of the message to remove.

Results:
 - `200` - If the request was successful
 - `400` - If the request has failed.

Example Request:

Request: `DELETE /messages/501023025195198/1237582395723`

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": null
}
```

----

## `GET` /channels/view/`:id:`
Gets the specified channel object.

Parameters:
 - `:id:` - The ID of the channel to retrieve.

Results:
- `200` - If retrieval was successful
- `400` - If retrieval has failed.

Example Request:

`GET /channels/501023025195198`

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": {
        "name": "",
        "type": 0,
        "createdAt": "2023-01-15T14:49:37.354Z",
        "updatedAt": "2023-01-15T14:49:37.354Z",
        "recipients": [
            "1237582395723",
            "2593059020325"
        ],
        "topic": "",
        "icon": "",
        "lastMessageId": "",
        "guildId": "",
        "id": "1673794177355"
    }
}
```

----

## `POST` /channels/dm/`:user1:`/`:user2:`
Starts a new DM between two users.

Parameters:
 - `:user1:` - The ID of the first user.
 - `:user2:` - The ID of the second user.

Results:
- `200` - If creation was successful
- `400` - If creation has failed.

Example Request:

Request: `POST /channels/dm/1237582395723/2593059020325`

Example Response:
```json
{
    "success": true,
    "message": "",
    "data": {
        "name": "",
        "type": 0,
        "createdAt": "2023-01-15T14:49:37.354Z",
        "updatedAt": "2023-01-15T14:49:37.354Z",
        "recipients": [
            "1237582395723",
            "2593059020325"
        ],
        "topic": "",
        "icon": "",
        "lastMessageId": "",
        "guildId": "",
        "id": "1673794177355"
    }
}
```