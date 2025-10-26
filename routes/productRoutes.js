const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🟢 GET products by category_id with images
router.get("/category/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

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
        c.name AS category_name,
        pi.image_url,
        pi.is_primary
      FROM products p
      INNER JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      WHERE p.category_id = ?
      ORDER BY p.id ASC, pi.is_primary DESC
    `;

    const rows = await new Promise((resolve, reject) => {
      db.query(query, [categoryId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for this category",
      });
    }

    // Group images by product
    const productsMap = {};
    rows.forEach(row => {
      if (!productsMap[row.id]) {
        productsMap[row.id] = {
          id: row.id,
          name: row.name,
          description: row.description,
          tag: row.tag,
          status: row.status,
          category: row.category_name,
          images: []
        };
      }
      if (row.image_url) {
        productsMap[row.id].images.push({
          url: row.image_url,
          is_primary: !!row.is_primary
        });
      }
    });

    const products = Object.values(productsMap);

    return res.status(200).json({
      success: true,
      count: products.length,
      category: products[0].category,
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
