const express = require("express");
const cors = require("cors");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./config/db");
const connection = require("./dbConnection");
const multer = require('multer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
    secret: 'student',
    resave: false,
    saveUninitialized: false
}));

// Static files
app.use("/uploads", express.static("uploads"));
app.use("/images", express.static("uploads/images"));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    try {
        // Verify JWT token
        const decoded = jwt.verify(token, 'secretkey');
        
        // Check if user is admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        
        // Add user info to request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

// ============= AUTHENTICATION ROUTES =============

// REGISTER
app.post("/auth/register", async (req, res) => {
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

// LOGIN (JWT)
app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    db.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
        if (err) {
            console.error('query error', err);
            return res.status(500).json({ message: 'Database error' });
        }
        else if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        else { 
            const user = result[0];
            
            try {
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    return res.status(401).json({ message: 'Invalid password' });
                }
                
                const token = jwt.sign(
                    { user_id: user.user_id, role: user.role },
                    'secretkey'
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
            } catch (compareError) {
                console.error('Password comparison error:', compareError);
                return res.status(500).json({ message: 'Authentication error' });
            }
        }
    });
});

// ============= ADMIN ROUTES =============

// Get all farmers (admin only)
app.get('/farmers/admin/farmers', isAdmin, (req, res) => {
    const query = `
        SELECT f.*, u.full_name, u.email, u.phone, u.created_at
        FROM farmers f
        JOIN users u ON f.user_id = u.user_id
        WHERE u.role = 'farmer'
        ORDER BY u.created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to fetch farmers' });
        }
        
        res.json(results);
    });
});

// Create new farmer account (admin only)
app.post('/farmers/admin/create-farmer', isAdmin, (req, res) => {
    const { full_name, email, phone, cooperative_name, location } = req.body;
    
    // Generate a simple password
    const password = Math.random().toString(36).slice(-8);
    
    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Password hashing error:', err);
            return res.status(500).json({ message: 'Password hashing failed' });
        }
        
        // Start transaction
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            
            // Insert into users table
            const userQuery = `
                INSERT INTO users (full_name, email, phone, password, role, created_at)
                VALUES (?, ?, ?, ?, 'farmer', NOW())
            `;
            
            db.query(userQuery, [full_name, email, phone, hashedPassword], (err, userResult) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error creating user:', err);
                        res.status(500).json({ message: 'Failed to create user account' });
                    });
                }
                
                const userId = userResult.insertId;
                
                // Insert into farmers table
                const farmerQuery = `
                    INSERT INTO farmers (user_id, location, farm_type, description)
                    VALUES (?, ?, ?)
                `;
                
                db.query(farmerQuery, [userId, location, cooperative_name, 'Cooperative Farmer'], (err, farmerResult) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error creating farmer:', err);
                            res.status(500).json({ message: 'Failed to create farmer profile' });
                        });
                    }
                    
                    db.commit((commitErr) => {
                        if (commitErr) {
                            return db.rollback(() => {
                                console.error('Error committing transaction:', commitErr);
                                res.status(500).json({ message: 'Failed to complete farmer creation' });
                            });
                        }
                        
                        res.json({ 
                            message: 'Farmer account created successfully',
                            password: password,
                            userId: userId,
                            farmerId: farmerResult.insertId
                        });
                    });
                });
            });
        });
    });
});

// ============= LEGACY ROUTES (for compatibility) =============

// Legacy login (session-based)
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    connection.query("SELECT * FROM users WHERE email=?", [email], async (err, result) => {
        if (err) {
            console.error('query error', err);
            return res.status(500).json({ message: 'Database error' });
        }
        else if (result.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        else { 
            const user = result[0];
            
            try {
                const validPassword = await bcrypt.compare(password, user.password);
                if (!validPassword) {
                    return res.status(401).json({ message: 'Invalid password' });
                }
                
                // Create session
                req.session.user = {
                    user_id: user.user_id,
                    role: user.role,
                    full_name: user.full_name,
                    email: user.email
                };
                
                res.json({ 
                    message: 'Login successful',
                    user: {
                        user_id: user.user_id,
                        role: user.role,
                        full_name: user.full_name,
                        email: user.email
                    }
                });
            } catch (compareError) {
                console.error('Password comparison error:', compareError);
                return res.status(500).json({ message: 'Authentication error' });
            }
        }
    });
});

// Legacy create account (username-based)
app.post('/create_account', (req, res) => {
    const { username } = req.body;
    connection.query('SELECT * FROM users WHERE username=?', [username], (err, results) => {
        if (err) {
            console.error('query error', err);
        }
        else if (results.length > 0) {
            res.json({ msg: ' already exist! try another!' });
        }
        else {
            const { username, password } = req.body;
            if (!username || !password) {
                res.json({ msg: 'username and password is required!' });
            } else {
                bcrypt.hash(password, 10, (err, hashedpassword) => {
                    if (err) throw err;
                    else {
                        connection.query('INSERT INTO users (username,password) VALUES(?,?)', [username, hashedpassword], (err, results) => {
                            if (err) {
                                console.error('queryerror', err);
                            }
                            else {
                                res.json({ msg: 'welcome! your account created succesfuly!' });
                            }
                        });
                    }
                });
            }
        }
    });
});

// Get all users
app.get('/users', (req, res) => {
    connection.query("SELECT * FROM users", (err, results) => {
        if (err) console.error(err);
        return res.json(results);
    });
});

// Delete user
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM users WHERE id=?', [id], (err, result) => {
        if (err) throw err;
        else {
            res.json({ message: 'deleted succseful!' })
        }
    });
});

// ============= PRODUCT ROUTES =============

// Get farmer's products
app.get('/farmer/products', (req, res) => {
    // This would need farmer authentication middleware
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to fetch products' });
        }
        res.json(results);
    });
});

// Get farmer's orders
app.get('/farmer/orders', (req, res) => {
    // This would need farmer authentication middleware
    const query = 'SELECT * FROM orders ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to fetch orders' });
        }
        res.json(results);
    });
});

// Get farmer profile
app.get('/farmer/profile', (req, res) => {
    // This would need farmer authentication middleware
    const query = `
        SELECT f.*, u.full_name, u.email, u.phone, u.photo as profile_photo
        FROM farmers f
        JOIN users u ON f.user_id = u.user_id
        WHERE u.role = 'farmer'
        LIMIT 1
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to fetch profile' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Farmer profile not found' });
        }
        res.json(results[0]);
    });
});

// Upload profile photo
app.post('/farmer/upload-profile-photo', upload.single('photo'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No photo uploaded' });
    }
    
    const photoUrl = `/uploads/${req.file.filename}`;
    
    // Update user's photo in database
    const query = 'UPDATE users SET photo = ? WHERE user_id = ?';
    // This would need farmer authentication middleware to get user_id
    
    res.json({ 
        message: 'Profile photo uploaded successfully',
        url: photoUrl
    });
});

// ============= ERROR HANDLING =============

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// ============= START SERVER =============

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 FarmerJoin Server running on port ${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}`);
    console.log(`👤 Admin: hirwa@farmerjoin.com / hirwa`);
    console.log(`🌾 Farmers can login and access their dashboards`);
});
