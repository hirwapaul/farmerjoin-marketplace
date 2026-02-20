const express = require('express');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    
    const jwt = require('jsonwebtoken');
    
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

// Configure multer for profile photo uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/profiles/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + '.jpg');
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Admin endpoints
// Get all farmers (admin only)
router.get('/admin/farmers', isAdmin, (req, res) => {
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
router.post('/admin/create-farmer', isAdmin, (req, res) => {
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
                    VALUES (?, ?, ?, ?)
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
    }); // Added missing closing bracket here
});

// Get farmer by ID
router.get('/:farmerId', (req, res) => {
    const { farmerId } = req.params;
    
    const query = `
        SELECT f.*, u.full_name, u.email, u.photo as user_photo
        FROM farmers f
        JOIN users u ON f.user_id = u.user_id
        WHERE f.farmer_id = ?
    `;
    
    db.query(query, [farmerId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to fetch farmer data' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Farmer not found' });
        }
        
        const farmer = results[0];
        // Map profile photo from either farmers table or users table
        farmer.profile_photo = farmer.profile_photo || farmer.user_photo;
        
        res.json(farmer);
    });
});

// Update farmer profile
router.put('/:farmerId', upload.single('profile_photo'), (req, res) => {
    try {
        const { farmerId } = req.params;
        const { full_name, farm_name, bio, location, email, phone } = req.body;
        
        let updateFields = [];
        let values = [];
        
        // Update farmers table
        if (farm_name) {
            updateFields.push('farm_name = ?');
            values.push(farm_name);
        }
        if (bio) {
            updateFields.push('bio = ?');
            values.push(bio);
        }
        if (location) {
            updateFields.push('location = ?');
            values.push(location);
        }
        if (phone) {
            updateFields.push('phone = ?');
            values.push(phone);
        }
        
        // Handle profile photo update
        if (req.file) {
            updateFields.push('profile_photo = ?');
            values.push(`/uploads/profiles/${req.file.filename}`);
        }
        
        if (updateFields.length > 0) {
            values.push(farmerId);
            const farmerQuery = `UPDATE farmers SET ${updateFields.join(', ')} WHERE farmer_id = ?`;
            
            db.query(farmerQuery, values, (err, results) => {
                if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Failed to update farmer profile' });
                }
            });
        }
        
        // Update users table for full_name and email
        if (full_name || email) {
            let userFields = [];
            let userValues = [];
            
            if (full_name) {
                userFields.push('full_name = ?');
                userValues.push(full_name);
            }
            if (email) {
                userFields.push('email = ?');
                userValues.push(email);
            }
            
            if (userFields.length > 0) {
                userValues.push(farmerId);
                const userQuery = `
                    UPDATE users 
                    SET ${userFields.join(', ')} 
                    WHERE user_id = (SELECT user_id FROM farmers WHERE farmer_id = ?)
                `;
                
                db.query(userQuery, userValues, (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ message: 'Failed to update user data' });
                    }
                });
            }
        }
        
        res.json({ message: 'Profile updated successfully' });
        
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get farmer's products
router.get('/:farmerId/products', (req, res) => {
    const { farmerId } = req.params;
    
    const query = 'SELECT * FROM products WHERE farmer_id = ? ORDER BY created_at DESC';
    
    db.query(query, [farmerId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Failed to fetch farmer products' });
        }
        res.json(results);
    });
});

// Update farmer (admin only)
router.put('/admin/:farmerId', isAdmin, (req, res) => {
    const { farmerId } = req.params;
    const { full_name, email, phone, farm_name, bio, location } = req.body;
    
    // Start transaction for safe update
    db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        // Get farmer's user_id
        db.query('SELECT user_id FROM farmers WHERE farmer_id = ?', [farmerId], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error fetching farmer:', err);
                    res.status(500).json({ message: 'Failed to fetch farmer' });
                });
            }
            
            if (results.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: 'Farmer not found' });
                });
            }
            
            const userId = results[0].user_id;
            
            // Update users table
            const userUpdateQuery = `
                UPDATE users 
                SET full_name = ?, email = ?, phone = ?
                WHERE user_id = ?
            `;
            
            db.query(userUpdateQuery, [full_name, email, phone, userId], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error updating user:', err);
                        res.status(500).json({ message: 'Failed to update user info' });
                    });
                }
                
                // Update farmers table
                const farmerUpdateQuery = `
                    UPDATE farmers 
                    SET farm_name = ?, bio = ?, location = ?
                    WHERE farmer_id = ?
                `;
                
                db.query(farmerUpdateQuery, [farm_name, bio, location, farmerId], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error updating farmer:', err);
                            res.status(500).json({ message: 'Failed to update farmer profile' });
                        });
                    }
                    
                    // Commit transaction
                    db.commit((commitErr) => {
                        if (commitErr) {
                            return db.rollback(() => {
                                console.error('Error committing transaction:', commitErr);
                                res.status(500).json({ message: 'Failed to complete update' });
                            });
                        }
                        
                        res.json({ message: 'Farmer account updated successfully' });
                    });
                });
            });
        });
    });
});

// Delete farmer (admin only)
router.delete('/:farmerId', isAdmin, (req, res) => {
    const { farmerId } = req.params;
    
    // Start transaction for safe deletion
    db.beginTransaction((err) => {
        if (err) {
            console.error('Transaction error:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        
        // First get the user_id from farmers table
        db.query('SELECT user_id FROM farmers WHERE farmer_id = ?', [farmerId], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    console.error('Error fetching farmer:', err);
                    res.status(500).json({ message: 'Failed to fetch farmer' });
                });
            }
            
            if (results.length === 0) {
                return db.rollback(() => {
                    res.status(404).json({ message: 'Farmer not found' });
                });
            }
            
            const userId = results[0].user_id;
            
            // Delete from farmers table
            db.query('DELETE FROM farmers WHERE farmer_id = ?', [farmerId], (err) => {
                if (err) {
                    return db.rollback(() => {
                        console.error('Error deleting farmer:', err);
                        res.status(500).json({ message: 'Failed to delete farmer' });
                    });
                }
                
                // Delete from users table
                db.query('DELETE FROM users WHERE user_id = ?', [userId], (err) => {
                    if (err) {
                        return db.rollback(() => {
                            console.error('Error deleting user:', err);
                            res.status(500).json({ message: 'Failed to delete user account' });
                        });
                    }
                    
                    // Commit transaction
                    db.commit((commitErr) => {
                        if (commitErr) {
                            return db.rollback(() => {
                                console.error('Error committing transaction:', commitErr);
                                res.status(500).json({ message: 'Failed to complete deletion' });
                            });
                        }
                        
                        res.json({ message: 'Farmer account deleted successfully' });
                    });
                });
            });
        });
    });
});

module.exports = router;
