const fs = require("fs");
const path = require("path");
require("dotenv").config();

const db = require("./db");

const schemaPath = path.join(__dirname, "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema);

const result = db.prepare("SELECT COUNT(*) AS total FROM products").get();

console.log("Database initialized successfully!");
console.log("Total products:", result.total);

db.close();