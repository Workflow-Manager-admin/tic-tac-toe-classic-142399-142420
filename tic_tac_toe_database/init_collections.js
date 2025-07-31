//
// MongoDB Initialization Script for Tic Tac Toe Game
// Usage: mongosh --port 5000 init_collections.js  OR run from backend
//

db = db.getSiblingDB('myapp');

// --- USERS Collection ---
if (!db.getCollectionNames().includes('users')) {
    db.createCollection('users');
}
db.users.createIndex({ "username": 1 }, { unique: true });

// --- GAMES Collection ---
if (!db.getCollectionNames().includes('games')) {
    db.createCollection('games');
}
db.games.createIndex({ "created_at": -1 });

// --- HISTORY Collection ---
if (!db.getCollectionNames().includes('history')) {
    db.createCollection('history');
}
db.history.createIndex({ "players": 1, "winner": 1, "date": -1 });

print("Collections and indexes successfully initialized!");
