# Messaging

The messaging service orders communications as channels, which are kept in an aptly named collection named `channels`.

Any form of communication is considered a channel. Whether it be a DM between two people, a group DM, or a channel inside a guild, they all use the same underlying model.

Messages are kept in a collection called `messages`. They are related to the channels to which they belong.

## Channel types

A channel can be:
 - A DM between two people (type 0)
 - A Group DM between multiple people (type 1)
 - A guild DM (type 2)
 - A voice channel (type 3)

## Models

All models have been properly declared in typescript and have been commented.

Model list:
 - [Channel](../src/types/Channel.ts)