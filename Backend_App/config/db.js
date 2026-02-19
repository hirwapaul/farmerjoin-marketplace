const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "project1"
});

db.connect(err => {
    if (err) {
        console.log("Database connection failed:", err);
    } else {
        console.log("Connected to project1 database");
        
        // Create photo column if it doesn't exist
        db.query("ALTER TABLE users ADD COLUMN photo VARCHAR(255) DEFAULT NULL", (err, result) => {
            if (err) {
                console.log("Photo column may already exist or table issue:", err.message);
            } else {
                console.log("Photo column added to users table");
            }
        });
    }
});

module.exports = db;