# FarmerJoin - Agricultural Marketplace

A full-stack web application connecting farmers and buyers for agricultural products.

## Project Structure

```
project/
├── Backend_App/          # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── middleware/      # Authentication middleware
│   ├── routes/          # API routes
│   ├── uploads/         # File uploads directory
│   ├── server.js        # Main server file (port 5000)
│   └── package.json     # Backend dependencies
├── my-app/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── api.jsx      # API configuration
│   └── package.json     # Frontend dependencies
└── README.md           # This file
```

## Features

- **User Authentication**: Register and login for farmers and buyers
- **Product Management**: Farmers can add, edit, and delete products
- **Order System**: Buyers can place orders and track status
- **User Profiles**: Farmer and buyer dashboards
- **Image Upload**: Product image support
- **Responsive Design**: Mobile-friendly interface

## Technology Stack

### Backend
- Node.js
- Express.js
- MySQL database
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React
- React Router
- Axios for API calls
- Tailwind CSS for styling
- Context API for state management

## Database Setup

1. Install MySQL and create a database named `project1`
2. Import the database schema from `Backend_App/project1.sql`
3. Update database credentials in `Backend_App/config/db.js` if needed

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend_App
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```
The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The frontend will run on `http://localhost:5173` (or similar)

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products/add` - Add product (farmer only)
- `PUT /api/products/:id` - Update product (farmer only)
- `DELETE /api/products/:id` - Delete product (farmer only)

### Orders
- `POST /api/orders/create` - Create order (buyer only)
- `GET /api/orders/my-orders` - Get buyer orders
- `GET /api/orders/farmer-orders` - Get farmer orders

### Users
- `GET /users` - Get all users
- `DELETE /delete/:id` - Delete user

## Default User

For testing, you can use the existing farmer account:
- Email: `bizumutimaepa@gmail.com`
- Password: Check the database or create a new account

## Deployment

### Backend Deployment
1. Set environment variables for production:
   - `NODE_ENV=production`
   - Database credentials
   - JWT secret

2. Install PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name "farmerjoin-backend"
```

### Frontend Deployment
1. Build the React app:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

### Database Deployment
- Ensure MySQL is installed and configured
- Import the database schema
- Set up proper database user permissions

## Environment Variables

Create a `.env` file in the Backend_App directory:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=project1
JWT_SECRET=your_jwt_secret
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For issues and questions, please contact the development team.

## License

This project is licensed under the MIT License.
