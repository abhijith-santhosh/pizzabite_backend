const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🟢 GET products by category_id
router.get("/category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Validate category ID
    if (!categoryId || isNaN(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const query = `
      SELECT 
        p.id, 
        p.name, 
        p.description, 
        p.tag, 
        p.status,
        c.name AS category_name
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ?
      ORDER BY p.id ASC
    `;

    // Use Promise wrapper for async/await
    const products = await new Promise((resolve, reject) => {
      db.query(query, [categoryId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      category: products[0].category_name,
      data: products,
    });
  } catch (error) {
    console.error("❌ Error fetching products by category:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});
  
module.exports = router;
