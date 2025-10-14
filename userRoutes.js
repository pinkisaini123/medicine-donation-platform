const express = require("express");
const router = express.Router();
const db = require("../db");
const userRoutes = require("./routes/userRoutes");

// Simple “login / register” by username
router.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username required" });
  }
  // Check if exists
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) {
      // user exists
      return res.json({ user: row });
    } else {
      // create new user
      db.run(
        "INSERT INTO users (username) VALUES (?)",
        [username],
        function (err2) {
          if (err2) return res.status(500).json({ error: err2.message });
          db.get(
            "SELECT * FROM users WHERE id = ?",
            [this.lastID],
            (err3, newRow) => {
              if (err3) return res.status(500).json({ error: err3.message });
              return res.json({ user: newRow });
            }
          );
        }
      );
    }
  });
});