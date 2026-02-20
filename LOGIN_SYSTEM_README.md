# Login System with Role-Based Access

## Features

- **Login Form**: Secure authentication with email/password
- **Dashboard**: Connected to user management system
- **Role-Based Access**: 
  - **Admin**: Can access all features including user management
  - **User**: Can access dashboard and products, but not user management
- **User Management**: Admins can add, edit, and delete users

## Setup Instructions

1. **Start the backend server**:
   ```bash
   npm run server
   # or
   yarn server
   ```

2. **Create admin and test users**:
   ```bash
   npm run create-admin
   # or
   yarn create-admin
   ```

3. **Start the frontend**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Test Accounts

After running the `create-admin` script, you'll have these test accounts:

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123
- **Access**: Full access to all features including user management

### Regular User Account
- **Email**: user@example.com
- **Password**: user123
- **Access**: Dashboard and products only (no user management)

## How to Use

1. **Login**: Use one of the test accounts above
2. **Dashboard**: View system statistics and data
3. **User Management** (Admin only): 
   - Add new users with different roles
   - Edit existing users
   - Delete users
4. **Products**: View and manage products
5. **Logout**: Click on your profile in the top-right corner

## Role-Based Features

### Admin Users Can:
- Access all dashboard features
- View and manage users
- Add new users with admin or user roles
- Edit and delete existing users
- Access all product features

### Regular Users Can:
- Access dashboard
- View products
- Cannot access user management (will see "Access Denied" message)

## Database Schema

The User model includes:
- firstName, lastName
- age, gender
- email, phone, username
- password (hashed)
- **role**: 'admin' | 'user' (new field)

## Security Features

- Password hashing with bcrypt
- Role-based route protection
- Session management with localStorage
- Input validation
- Error handling