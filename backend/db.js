const Database = require("better-sqlite3");
const path = require("path");
require("dotenv").config();

const dbPath = path.resolve(__dirname, process.env.DB_PATH || "database.sqlite");

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

module.exports = db;
