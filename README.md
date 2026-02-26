# Product Management System

A full-stack application for managing products, users, and complaints with a modern dashboard interface.

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Radix UI** - Component library
- **React Router** - Navigation
- **Recharts** - Data visualization
- **React Hot Toast** - Notifications

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** - Authentication
- **Cloudinary/AWS S3** - File storage
- **Nodemailer** - Email service

## Project Structure

```
src/
├── apis/              # API service functions
├── components/        # React components
│   ├── customUi/     # Custom UI components
│   └── ui/           # Radix UI components
├── config/           # Configuration files
├── constants/        # App constants
├── controllers/      # Backend controllers
├── data/             # Static data
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── middleware/       # Express middleware
├── models/           # MongoDB models
├── pages/            # Page components
│   ├── Complaints/
│   ├── Login/
│   ├── Products/
│   └── User/
├── routes/           # Express routes
├── services/         # Business logic
├── types/            # TypeScript types
└── utils/            # Helper functions
```

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file with:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Run development servers:**
   ```bash
   # Frontend
   npm run dev

   # Backend
   npm run server
   ```

## Available Scripts

- `npm run dev` - Start frontend dev server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run create-admin` - Create admin user

## Features

- 🔐 Authentication & Authorization
- 📊 Interactive Dashboard with Charts
- 👥 User Management
- 📦 Product Management
- 💬 Complaints System
- 🖼️ Image Upload (Cloudinary/S3)
- 🔍 Search & Filter
- 📱 Responsive Design

## API Endpoints

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## License

ISC
