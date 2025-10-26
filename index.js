const express = require("express");
const cors = require("cors"); 
const app = express();
const PORT = 5000;

// Import DB connection
const db = require("./config/db");

// Import routes
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

// Middleware
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}));

// Default route
// app.get("/", (req, res) => {
//   res.send("Hello, Express Backend is running!");
// });

// Use routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes); 

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
