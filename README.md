# Event Management System

A complete event management application with separate frontend and backend structure.

## 📁 Project Structure

```
Eventmangementcreation/
├── frontend/          # React + Vite frontend application
│   ├── src/          # Source code (React components, pages, services)
│   ├── public/       # Static assets
│   ├── package.json  # Frontend dependencies
│   └── ...           # Configuration files (vite.config.js, tailwind.config.js, etc.)
├── backend/          # Backend API (create this folder for your backend)
│   ├── src/
│   ├── package.json
│   └── ...
└── README.md         # This file
```

## 🚀 Getting Started

### Frontend Setup

Navigate to the frontend folder and start development:

```bash
cd frontend
npm install      # Install dependencies (if needed)
npm run dev      # Start development server
```

The frontend will be available at `http://localhost:5174/`

### Backend Setup

To create the backend folder and set up your backend:

```bash
cd ..
mkdir backend
cd backend
# Initialize your backend project here
```

## 📋 Required Backend Endpoints

The frontend expects the following API endpoints at `http://localhost:5000/api`:

### Authentication
- **POST** `/auth/register` - User registration
  - Body: `{ name, email, password }`
  - Response: `{ token, user: { id, name, email } }`

- **POST** `/auth/login` - User login
  - Body: `{ email, password }`
  - Response: `{ token, user: { id, name, email } }`

### User
- **GET** `/users/profile` - Get user profile (requires Bearer token)
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ id, name, email, createdAt }`

## 🛠 Available Commands

### Frontend
```bash
cd frontend

npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 📚 Documentation

- **[Frontend Documentation](frontend/DEVELOPMENT_GUIDE.md)** - Detailed frontend setup and development guide
- **[Backend Example](frontend/BACKEND_EXAMPLE.md)** - Example backend implementation in Node.js/Python
- **[Deployment Guide](frontend/DEPLOYMENT_GUIDE.md)** - How to deploy the frontend
- **[Getting Started](frontend/GETTING_STARTED.md)** - Quick start guide

## 🔧 Technology Stack

### Frontend
- React 18.2.0
- Vite 5.0.0+
- React Router DOM 6.20.0
- Axios 1.6.2
- Tailwind CSS 3.3.6
- Context API for state management

### Backend (To be implemented)
- Node.js/Express or Python/Flask
- MongoDB/PostgreSQL
- JWT Authentication

## 📝 Notes

- Frontend environment: `.env` in the frontend folder
- Default API base URL: `http://localhost:5000/api`
- Port 5174: Frontend development server
- Port 5001: Backend API (expected)

## 📞 Support

For detailed information, check the documentation files in the `frontend/` folder.

---

**Ready to build the backend!** 🎉
