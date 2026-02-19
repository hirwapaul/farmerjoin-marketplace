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
        db.query("INSERT INTO farmers (user_id) VALUES (?)", [userId]);
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

    const valid = await bcrypt.compare(password, result[0].password);
    if (!valid)
      return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { user_id: result[0].user_id, role: result[0].role },
      "secretkey"
    );

    res.json({ 
      token,
      user: {
        user_id: result[0].user_id,
        role: result[0].role,
        full_name: result[0].full_name,
        email: result[0].email
      }
    });
  });
});

module.exports = router;