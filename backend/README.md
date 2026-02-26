# Backend - Product Management API

Node.js/Express backend with MongoDB for the Product Management System.

## Tech Stack
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary/AWS S3 for file storage
- Nodemailer for emails

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Run development server:
```bash
npm run dev
```

## Scripts
- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript
- `npm start` - Start production server
- `npm run create-admin` - Create admin user

## API Endpoints

### Auth
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration

### Products
- GET `/api/products` - Get all products
- POST `/api/products` - Create product
- PUT `/api/products/:id` - Update product
- DELETE `/api/products/:id` - Delete product

### Users
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

## Port
Default: 5000
