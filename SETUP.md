# Setup Instructions

## Project Structure
Your project is now organized into:
- `backend/` - Node.js/Express API server
- `frontend/` - React + Vite application

## Installation

### Option 1: Install Both at Once
```bash
npm run install:all
```

### Option 2: Install Separately

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

## Configuration

### Backend (.env)
```bash
cd backend
cp .env.example .env
```
Edit `backend/.env` with your:
- MongoDB URI
- JWT Secret
- Cloudinary credentials
- Email settings

### Frontend (.env)
```bash
cd frontend
cp .env.example .env
```
Edit `frontend/.env` with:
- API URL (default: http://localhost:5000/api)
- EmailJS credentials

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App runs on: http://localhost:5173

### Using Root Scripts
From the root directory:
```bash
npm run dev:backend    # Start backend
npm run dev:frontend   # Start frontend
```

## Create Admin User
```bash
cd backend
npm run create-admin
```

## Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Next Steps
1. Configure environment variables in both `.env` files
2. Start MongoDB
3. Run backend server
4. Run frontend dev server
5. Create admin user
6. Access app at http://localhost:5173

## Troubleshooting
- Ensure MongoDB is running
- Check port 5000 is available for backend
- Check port 5173 is available for frontend
- Verify all environment variables are set correctly
