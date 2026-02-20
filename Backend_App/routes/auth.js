const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  const { full_name, email, phone, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (full_name,email,phone,password,role) VALUES (?,?,?,?,?)",
    [full_name, email, phone, hashed, role],
    (err, result) => {
      if (err) return res.status(500).json(err);

      const userId = result.insertId;

      if (role === "farmer") {
        db.query("INSERT INTO farmers (user_id, farm_name, bio, location, phone) VALUES (?, ?, ?, ?, ?)", 
          [userId, full_name + "'s Farm", "Welcome to my farm!", "Location not set", phone], 
          (err, result) => {
            if (err) {
              console.error("Error creating farmer profile:", err);
              // Don't fail registration, just log the error
            }
          }
        );
      }

      if (role === "cooperative") {
        db.query("INSERT INTO cooperatives (user_id, cooperative_name, location, phone) VALUES (?, ?, ?, ?)", 
          [userId, full_name + " Cooperative", "Location not set", phone], 
          (err, result) => {
            if (err) {
              console.error("Error creating cooperative profile:", err);
              // Don't fail registration, just log the error
            }
          }
        );
      }

      if (role === "buyer") {
        db.query("INSERT INTO buyers (user_id) VALUES (?)", [userId]);
      }

      res.json({ message: "User registered successfully" });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
    if (result.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result[0];
    
    // Special handling for admin - check plain text password
    if (user.role === 'admin' && email === 'admin@farmerjoin.rw' && password === 'admin123') {
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        "secretkey"
      );

      return res.json({ 
        token,
        user: {
          user_id: user.user_id,
          role: user.role,
          full_name: user.full_name,
          email: user.email
        }
      });
    }

    // For other users, use bcrypt
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      "secretkey"
    );

    res.json({ 
      token,
      user: {
        user_id: user.user_id,
        role: user.role,
        full_name: user.full_name,
        email: user.email
      }
    });
  });
});

module.exports = router;