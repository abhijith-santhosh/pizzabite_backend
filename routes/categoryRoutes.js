const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all categories
router.get("/", async (req, res) => {
  try {
    const query = "SELECT id, name, description FROM categories ORDER BY id ASC";

    // Wrapping MySQL query in a Promise for async/await usage
    const results = await new Promise((resolve, reject) => {
      db.query(query, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No categories found",
      });
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
