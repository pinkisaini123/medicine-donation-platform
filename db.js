const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Database file
const db_name = path.join(__dirname, "med_donation.db");

const db = new sqlite3.Database(db_name, (err) => {
  if (err) {
    console.error("Error opening db", err.message);
  } else {
    console.log("Connected to SQLite database.");
    // Create tables if not exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS donations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      medName TEXT,
      dosage TEXT,
      quantity INTEGER,
      expiry TEXT,
      location TEXT,
      claimedBy INTEGER,
      timestamp TEXT,
      FOREIGN KEY(claimedBy) REFERENCES users(id)
    )`);
  }
});

module.exports = db;
