# MongoDB Data Model and Initialization for Tic Tac Toe Game

This document outlines the structure of MongoDB collections and provides setup instructions for the Tic Tac Toe game application database.

---

## Collections Overview

### 1. users
Stores user accounts and statistics.

| Field         | Type               | Description                                 |
|---------------|--------------------|---------------------------------------------|
| _id           | ObjectId           | User id (MongoDB generated)                 |
| username      | String             | Unique username                             |
| password_hash | String             | Hashed password                             |
| stats         | Object             | User stats (games played, won, etc.)        |
| created_at    | Date               | When the user account was created           |

#### Example Document
```json
{
  "_id": { "$oid": "..." },
  "username": "player1",
  "password_hash": "$2b$12$...",
  "stats": {
    "games_played": 7,
    "games_won": 5,
    "games_lost": 2,
    "games_draw": 0
  },
  "created_at": { "$date": "2024-06-09T15:12:00Z" }
}
```

### 2. games
Stores each game played, its participants, moves, result, and time.

| Field        | Type             | Description                            |
|--------------|------------------|----------------------------------------|
| _id          | ObjectId         | Game id (MongoDB generated)            |
| players      | [String]         | Usernames or IDs of players            |
| moves        | [Object]         | List of move objects (see below)       |
| result       | String           | "win", "draw" or "loss"                |
| winner       | String or null   | Username or ID of winner, if any       |
| created_at   | Date             | When the game started                  |
| is_vs_ai     | Boolean          | True if vs AI, False if vs player      |

#### Move Object Example
```json
{
  "player": "player1",
  "position": 4,      // cell on the 0-8 board
  "move_num": 1,      // move sequence number
  "timestamp": { "$date": "2024-06-09T15:14:01Z" }
}
```

#### Example Document
```json
{
  "_id": { "$oid": "..." },
  "players": ["player1", "AI"],
  "moves": [
    { "player": "player1", "position": 4, "move_num": 1, "timestamp": { "$date": "2024-06-09T15:14:01Z" }},
    { "player": "AI", "position": 0, "move_num": 2, "timestamp": { "$date": "2024-06-09T15:15:21Z" }}
  ],
  "result": "win",
  "winner": "player1",
  "created_at": { "$date": "2024-06-09T15:14:00Z" },
  "is_vs_ai": true
}
```

### 3. history
References game records for the purpose of queries and tracking game history for views/leaderboards.

| Field      | Type      | Description                                   |
|------------|-----------|-----------------------------------------------|
| _id        | ObjectId  | Mongo-generated id                            |
| game_id    | ObjectId  | Reference to games._id                        |
| players    | [String]  | List of usernames/IDs                         |
| winner     | String    | Username/ID of the winner                     |
| date       | Date      | Date/time game was played (redundant, for quick search) |

#### Example Document
```json
{
  "_id": { "$oid": "..." },
  "game_id": { "$oid": "..." },
  "players": ["player1", "player2"],
  "winner": "player1",
  "date": { "$date": "2024-06-09T15:40:00Z" }
}
```

---

## Collection Index Suggestions

- users: `{ "username": 1 }` (unique index)
- games: `{ "created_at": -1 }`
- history: `{ "players": 1, "winner": 1, "date": -1 }`

---

## MongoDB Initialization Script

Below is a shell script snippet (can be run with `mongosh` or via backend on first startup):

```javascript
// Connect to database
use myapp;

// --- USERS Collection ---
db.createCollection("users");

db.users.createIndex({ "username": 1 }, { unique: true });


// --- GAMES Collection ---
db.createCollection("games");

db.games.createIndex({ "created_at": -1 });


// --- HISTORY Collection ---
db.createCollection("history");

db.history.createIndex({ "players": 1, "winner": 1, "date": -1 });

```

_Note: The backend should always enforce extra validation for types and field values!_

---

## Summary

- Use these schemas and indexes in your backend (Flask) codebase to perform queries; for ODMs like MongoEngine, Pydantic, or Marshmallow, this model can be adapted directly.
- Collections: `users`, `games`, `history`.
- Reference and copy the initialization script as your migration, database bootstrap, or seed script as needed.

