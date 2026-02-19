-- ========================================
-- Database Updates for Photo Upload Feature
-- ========================================

-- 1. Add profile photo and additional fields to farmers table
ALTER TABLE `farmers` 
ADD COLUMN `profile_photo` VARCHAR(255) DEFAULT NULL COMMENT 'Path to profile photo file or URL',
ADD COLUMN `farm_name` VARCHAR(150) DEFAULT NULL COMMENT 'Display name for the farm',
ADD COLUMN `bio` TEXT DEFAULT NULL COMMENT 'Farmer/farm biography',
ADD COLUMN `phone` VARCHAR(20) DEFAULT NULL COMMENT 'Contact phone number';

-- 2. Add photo column to users table (for general user profiles)
ALTER TABLE `users` 
ADD COLUMN `photo` VARCHAR(255) DEFAULT NULL COMMENT 'Path to user profile photo file or URL';

-- 3. Update existing products table structure (if needed)
-- Note: Your products table already has an 'image' column, so this is just for reference
-- ALTER TABLE `products` ADD COLUMN `image` VARCHAR(255) DEFAULT NULL;

-- 4. Create indexes for better performance on new columns
CREATE INDEX `idx_farmers_farm_name` ON `farmers` (`farm_name`);
CREATE INDEX `idx_farmers_location` ON `farmers` (`location`);

-- 5. Add reviews table for farmer ratings (optional but recommended)
CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` INT(11) NOT NULL AUTO_INCREMENT,
  `farmer_id` INT(11) NOT NULL,
  `buyer_id` INT(11) NOT NULL,
  `product_id` INT(11) DEFAULT NULL,
  `rating` INT(1) NOT NULL CHECK (`rating` BETWEEN 1 AND 5),
  `comment` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`review_id`),
  KEY `fk_reviews_farmer` (`farmer_id`),
  KEY `fk_reviews_buyer` (`buyer_id`),
  KEY `fk_reviews_product` (`product_id`),
  CONSTRAINT `fk_reviews_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`farmer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_buyer` FOREIGN KEY (`buyer_id`) REFERENCES `buyers` (`buyer_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE SET NULL
);

-- 6. Add certifications table for farmers (optional but recommended)
CREATE TABLE IF NOT EXISTS `farmer_certifications` (
  `cert_id` INT(11) NOT NULL AUTO_INCREMENT,
  `farmer_id` INT(11) NOT NULL,
  `certification_name` VARCHAR(100) NOT NULL,
  `certification_body` VARCHAR(100) DEFAULT NULL,
  `issue_date` DATE DEFAULT NULL,
  `expiry_date` DATE DEFAULT NULL,
  `certificate_file` VARCHAR(255) DEFAULT NULL COMMENT 'Path to certificate file',
  PRIMARY KEY (`cert_id`),
  KEY `fk_certifications_farmer` (`farmer_id`),
  CONSTRAINT `fk_certifications_farmer` FOREIGN KEY (`farmer_id`) REFERENCES `farmers` (`farmer_id`) ON DELETE CASCADE
);

-- 7. Update sample data (optional)
-- Update existing farmer with sample data
UPDATE `farmers` 
SET 
  `farm_name` = 'Green Valley Farm',
  `bio` = 'Family-owned farm specializing in organic vegetables and fruits. We believe in sustainable farming practices and providing fresh, high-quality produce to our local community.',
  `phone` = '0785018691'
WHERE `farmer_id` = 4;

-- Update existing user with sample photo
UPDATE `users` 
SET `photo` = 'images/default-profile.jpg'
WHERE `user_id` = 23;

-- ========================================
-- Verification Queries
-- ========================================

-- Check farmers table structure
DESCRIBE `farmers`;

-- Check users table structure  
DESCRIBE `users`;

-- Check products table structure
DESCRIBE `products`;

-- Sample queries to test the new structure
SELECT 
  f.farmer_id,
  u.full_name,
  f.farm_name,
  f.profile_photo,
  f.bio,
  f.location,
  f.phone
FROM farmers f
JOIN users u ON f.user_id = u.user_id
WHERE f.farmer_id = 4;

-- Select products with images
SELECT 
  p.product_id,
  p.product_name,
  p.image,
  p.price,
  f.farm_name
FROM products p
JOIN farmers f ON p.farmer_id = f.farmer_id
WHERE p.image IS NOT NULL;
