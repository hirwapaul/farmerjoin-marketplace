-- Create cooperatives table if it doesn't exist
CREATE TABLE IF NOT EXISTS `cooperatives` (
  `cooperative_id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `cooperative_name` VARCHAR(150) DEFAULT NULL,
  `location` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(20) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `profile_photo` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  PRIMARY KEY (`cooperative_id`),
  KEY `fk_cooperatives_user` (`user_id`),
  CONSTRAINT `fk_cooperatives_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX `idx_cooperatives_name` ON `cooperatives` (`cooperative_name`);
CREATE INDEX `idx_cooperatives_location` ON `cooperatives` (`location`);

-- Check table structure
DESCRIBE `cooperatives`;
