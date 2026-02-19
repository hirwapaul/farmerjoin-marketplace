const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../config/db");
const auth = require("../middleware/auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/products/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });


// Add product
router.post("/add", auth, upload.single("image"), async (req, res) => {
  const { product_name, category, price, quantity} = req.body;
  const image = req.file ? `uploads/products/${req.file.filename}` : null;

  db.query(
    "SELECT farmer_id FROM farmers WHERE user_id=?",
    [req.user.user_id],
    (err, farmer) => {
      if (farmer.length === 0)
        return res.status(403).json({ message: "Not a farmer" });

      db.query(
        "INSERT INTO products (farmer_id,product_name,category,price,quantity,image) VALUES (?,?,?,?,?,?)",
        [
          farmer[0].farmer_id,
          product_name,
          category,
          price,
          quantity,
          image
        ],
        err => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Product added" });
        }
      );
    }
  );
});

// Get products
router.get("/", (req, res) => {
  db.query(
    `SELECT products.*, users.full_name, users.photo
     FROM products
     JOIN farmers ON products.farmer_id=farmers.farmer_id
     JOIN users ON farmers.user_id=users.user_id`,
    (err, result) => {
      res.json(result);
    }
  );
});

// Get single product
router.get("/:id", (req, res) => {
  const productId = req.params.id;
  db.query(
    `SELECT products.*, users.full_name, users.photo
     FROM products
     JOIN farmers ON products.farmer_id=farmers.farmer_id
     JOIN users ON farmers.user_id=users.user_id
     WHERE products.product_id = ?`,
    [productId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0) return res.status(404).json({ message: "Product not found" });
      res.json(result[0]);
    }
  );
});

// Update product
router.put("/:id", auth, upload.single("image"), (req, res) => {
  const { product_name, category, price, quantity } = req.body;
  const productId = req.params.id;
  const image = req.file ? `uploads/products/${req.file.filename}` : null;

  // First check if the product belongs to the farmer
  db.query(
    `SELECT products.farmer_id FROM products
     JOIN farmers ON products.farmer_id = farmers.farmer_id
     WHERE products.product_id = ? AND farmers.user_id = ?`,
    [productId, req.user.user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0) return res.status(403).json({ message: "Not authorized to update this product" });

      let query, params;
      if (image) {
        query = "UPDATE products SET product_name=?, category=?, price=?, quantity=?, image=? WHERE product_id=?";
        params = [product_name, category, price, quantity, image, productId];
      } else {
        query = "UPDATE products SET product_name=?, category=?, price=?, quantity=? WHERE product_id=?";
        params = [product_name, category, price, quantity, productId];
      }

      db.query(query, params, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product updated successfully" });
      });
    }
  );
});

// Delete product
router.delete("/:id", auth, (req, res) => {
  const productId = req.params.id;

  // First check if the product belongs to the farmer
  db.query(
    `SELECT products.farmer_id FROM products
     JOIN farmers ON products.farmer_id = farmers.farmer_id
     WHERE products.product_id = ? AND farmers.user_id = ?`,
    [productId, req.user.user_id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0) return res.status(403).json({ message: "Not authorized to delete this product" });

      db.query("DELETE FROM products WHERE product_id=?", [productId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Product deleted successfully" });
      });
    }
  );
});

module.exports = router;