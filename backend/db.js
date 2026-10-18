const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const dbPath = path.resolve(
    __dirname,
    process.env.DB_PATH || "database.sqlite"
);

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

const schema = fs.readFileSync(
    path.join(__dirname, "schema.sql"),
    "utf8"
);

db.exec(schema);

module.exports = db;