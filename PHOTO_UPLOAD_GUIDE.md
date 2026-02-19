# Photo Upload Guide

This guide explains how to implement photo uploads for both products and profiles in your farming marketplace application.

## Features Implemented

### 1. Product Photos
- **File Upload**: Farmers can upload product images directly from their device
- **URL Support**: Alternative option to provide image URLs
- **Image Preview**: Real-time preview before submission
- **File Validation**: 
  - Only image files accepted (JPG, PNG, GIF)
  - Maximum file size: 5MB
- **Storage**: Images stored in `/uploads/products/` directory

### 2. Profile Photos
- **File Upload**: Users can upload profile photos
- **URL Support**: Alternative option to provide photo URLs
- **Image Preview**: Real-time preview before submission
- **File Validation**: Same validation as product photos
- **Storage**: Photos stored in `/uploads/profiles/` directory

## Frontend Implementation

### Product Photo Upload (AddProduct.jsx)
```jsx
// Key features:
- File input with image/* accept attribute
- FileReader API for preview
- FormData for multipart/form-data submission
- Fallback to URL input if no file selected
```

### Profile Photo Upload (EditProfile.jsx)
```jsx
// Key features:
- Circular profile photo preview
- Form validation for file type and size
- Combined file upload and URL input options
- Responsive design for mobile/desktop
```

## Backend Implementation

### Routes Created
1. **`/routes/uploads.js`** - Main upload handling
2. **`/routes/products.js`** - Product image management (already existed)
3. **`/routes/farmers.js`** - Profile photo management

### API Endpoints
- `POST /api/upload/product` - Upload product image
- `POST /api/upload/profile` - Upload profile photo
- `PUT /farmers/:id` - Update farmer profile with photo
- `POST /products/add` - Add product with image

### File Storage
- **Product Images**: `Backend_App/uploads/products/`
- **Profile Photos**: `Backend_App/uploads/profiles/`
- **Static Serving**: `/uploads/` route serves files

## Database Schema

### Products Table
```sql
- product_id (Primary Key)
- farmer_id (Foreign Key)
- product_name
- category
- price
- quantity
- image (stores file path or URL)
- created_at
```

### Farmers Table
```sql
- farmer_id (Primary Key)
- user_id (Foreign Key)
- farm_name
- bio
- location
- phone
- profile_photo (stores file path or URL)
```

## Usage Instructions

### For Product Photos
1. Navigate to "Add Product" page
2. Fill in product details
3. Either:
   - Click "Choose File" to upload an image from device, OR
   - Enter an image URL in the URL field
4. Preview will appear automatically
5. Submit the form

### For Profile Photos
1. Go to your farmer profile
2. Click "Edit Profile" button (only visible on own profile)
3. Either:
   - Upload a new photo from device, OR
   - Enter a photo URL
4. Preview will appear automatically
5. Update your profile

## File Naming Convention

- **Product Images**: `product-{timestamp}-{random}.jpg`
- **Profile Photos**: `profile-{timestamp}-{random}.jpg`

## Security Features

1. **File Type Validation**: Only image files accepted
2. **File Size Limit**: 5MB maximum
3. **Unique Filenames**: Prevents overwriting existing files
4. **Directory Separation**: Products and profiles in separate folders

## Error Handling

- Frontend validation for file type and size
- Backend validation with meaningful error messages
- Graceful fallback to URL input if upload fails
- Proper error display to users

## Future Enhancements

1. **Image Compression**: Automatically compress large images
2. **Multiple Images**: Allow multiple product photos
3. **Image Editing**: Basic crop/resize functionality
4. **Cloud Storage**: Integration with AWS S3 or similar
5. **Image Optimization**: WebP format support
6. **CDN Integration**: Faster image delivery

## Troubleshooting

### Common Issues
1. **Upload Fails**: Check file size and format
2. **Images Not Displaying**: Verify static file serving configuration
3. **Permission Errors**: Ensure upload directories have write permissions
4. **Database Errors**: Check if image column exists in tables

### Debug Steps
1. Check browser console for JavaScript errors
2. Check network tab for failed requests
3. Verify backend logs for upload errors
4. Check file permissions on upload directories

## Dependencies

### Backend
- `multer` - File upload handling
- `express` - Web framework
- `path` - File path utilities

### Frontend
- React hooks (useState, useEffect)
- FormData API
- FileReader API

This implementation provides a robust photo upload system for both products and profiles in your farming marketplace application.
