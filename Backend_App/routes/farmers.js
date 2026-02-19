const express = require('express');
const multer = require('multer');
const db = require('../config/db');
const router = express.Router();

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

module.exports = router;
