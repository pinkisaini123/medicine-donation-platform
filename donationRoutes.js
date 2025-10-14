const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all donations
router.get("/", (req, res) => {
  db.all("SELECT * FROM donations", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ donations: rows });
  });
});

// Add donation
router.post("/", (req, res) => {
  const { medName, dosage, quantity, expiry, location, timestamp } = req.body;
  const sql =
    "INSERT INTO donations (medName, dosage, quantity, expiry, location, timestamp) VALUES (?, ?, ?, ?, ?, ?)";
  const params = [medName, dosage, quantity, expiry, location, timestamp];
  db.run(sql, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get(
      "SELECT * FROM donations WHERE id = ?",
      [this.lastID],
      (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ donation: row });
      }
    );
  });
});

// Claim donation
router.put("/claim/:id", (req, res) => {
  const donationId = req.params.id;
  const { userId } = req.body;
  const sql = "UPDATE donations SET claimedBy = ? WHERE id = ?";
  db.run(sql, [userId, donationId], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    db.get(
      "SELECT * FROM donations WHERE id = ?",
      [donationId],
      (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ donation: row });
      }
    );
  });
});

module.exports = router;
