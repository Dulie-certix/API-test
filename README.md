# Product Management System

Full-stack application with separate backend and frontend.

## Project Structure

```
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   └── package.json
│
└── frontend/         # React + Vite
    ├── src/
    │   ├── apis/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── types/
    │   ├── utils/
    │   └── App.tsx
    └── package.json
```

## Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

Backend runs on: http://localhost:5000

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with API URL
npm run dev
```

Frontend runs on: http://localhost:5173

## Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary/AWS S3
- Nodemailer

### Frontend
- React 19 + TypeScript
- Vite
- TailwindCSS
- Radix UI
- React Router
- Recharts

## Features
- 🔐 Authentication & Authorization
- 📊 Dashboard with Analytics
- 👥 User Management
- 📦 Product Management
- 💬 Complaints System
- 🖼️ Image Upload
- 🔍 Search & Filter
- 📱 Responsive Design

## License
ISC
