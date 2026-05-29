# BuildMart Setup Guide

Complete step-by-step guide to get BuildMart running on your local machine.

## 📋 Prerequisites

Before you start, make sure you have:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v12 or higher)
- Git
- A code editor (VS Code recommended)

---

## 🔧 Step-by-Step Setup

### STEP 1: Clone/Open the Project

```bash
cd C:\Users\HP\Buildmart
```

### STEP 2: Setup PostgreSQL Database

1. **Start PostgreSQL** (should run automatically after installation)
2. **Open pgAdmin** (search in your computer for "pgAdmin")
3. **Create a new database:**
   - Right-click on **Databases** → **Create** → **Database**
   - Name: `buildmart_db`
   - Click **Create**

✅ Database created!

---

### STEP 3: Install Dependencies

```bash
# Install all dependencies at once
npm run install-all
```

Or install individually:
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..

# Backend dependencies
cd backend
npm install
cd ..
```

---

### STEP 4: Configure Environment Files

#### Backend Configuration

1. Go to `backend/` folder
2. Open `.env` file (already created with defaults)
3. Update if needed:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=buildmart_db
   DB_USER=postgres
   DB_PASSWORD=postgres
   PORT=5000
   JWT_SECRET=buildmart_dev_secret_key_change_in_production_12345
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:3000
   ```

#### Frontend Configuration

1. Go to `frontend/` folder
2. Check `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

✅ Configuration complete!

---

### STEP 5: Start the Application

#### Option A: Run Both Together (Recommended)

```bash
# From root folder
npm run dev
```

This will start:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:5000`

#### Option B: Run Separately

**Terminal 1 - Frontend:**
```bash
cd frontend
npm start
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

---

### STEP 6: Verify Everything Works

1. **Open your browser:**
   ```
   http://localhost:3000
   ```
   You should see the BuildMart homepage

2. **Test the API:**
   ```
   http://localhost:5000/api/health
   ```
   You should see:
   ```json
   {
     "success": true,
     "message": "API is running",
     "timestamp": "2026-05-26T..."
   }
   ```

✅ Everything is running!

---

## 🧪 Testing the Backend

Use **Postman** or **curl** to test API endpoints.

### Download Postman
- Go to https://www.postman.com/downloads/
- Download and install

### Create a Test User

1. **In Postman:**
   - Click **+ New** → **HTTP Request**
   - Change method to **POST**
   - URL: `http://localhost:5000/api/auth/register`

2. **Click Body tab** → **raw** → **JSON**

3. **Paste this:**
   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@test.com",
     "password": "password123",
     "phone": "+1234567890"
   }
   ```

4. **Click Send**

You should get a response with a `token`.

### Login

1. **Create new request**
   - Method: **POST**
   - URL: `http://localhost:5000/api/auth/login`

2. **Body (JSON):**
   ```json
   {
     "email": "john@test.com",
     "password": "password123"
   }
   ```

3. **Click Send** → Copy the `token` from response

### Get Your Profile

1. **New request**
   - Method: **GET**
   - URL: `http://localhost:5000/api/auth/profile`

2. **Click Headers** tab
3. **Add new header:**
   - Key: `Authorization`
   - Value: `Bearer PASTE_YOUR_TOKEN_HERE`

4. **Click Send** → See your profile!

---

## 🚀 Common Commands

### Frontend
```bash
cd frontend

npm start              # Run development server
npm run build          # Build for production
npm test               # Run tests
npm test --coverage    # Test coverage
```

### Backend
```bash
cd backend

npm run dev            # Run with auto-reload
npm start              # Run server
npm test               # Run tests
```

### Root
```bash
npm run install-all    # Install everything
npm run dev            # Run frontend + backend
npm run build:frontend # Build frontend
npm run build:backend  # Build backend
```

---

## 🐛 Troubleshooting

### Problem: "PORT 3000 already in use"
```bash
# Find process using port 3000
lsof -i :3000

# Kill process (get PID from above)
kill -9 <PID>
```

### Problem: "PostgreSQL connection failed"
1. Make sure PostgreSQL is running
2. Check username/password in `.env`
3. Create database if not exists: `CREATE DATABASE buildmart_db;`

### Problem: "Module not found" errors
```bash
# Clear node_modules
rm -rf node_modules frontend/node_modules backend/node_modules

# Reinstall
npm run install-all
```

### Problem: "CORS error" in frontend console
1. Make sure backend is running on port 5000
2. Check CORS_ORIGIN in backend `.env`
3. Verify frontend `.env` points to correct API URL

### Problem: "Cannot find module 'sequelize'"
```bash
cd backend
npm install
npm run dev
```

---

## 📁 Project Structure Overview

```
BuildMart/
├── frontend/              # React app
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── styles/       # CSS files
│   │   ├── data/         # Static data
│   │   └── App.js
│   └── package.json
│
├── backend/              # Node.js API
│   ├── config/           # Database setup
│   ├── models/           # Data models
│   ├── controllers/      # Request handlers
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth, validation
│   ├── server.js         # Main server
│   └── package.json
│
├── package.json          # Root config
├── README.md             # Project docs
└── .gitignore
```

---

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Express Documentation](https://expressjs.com)
- [Sequelize Documentation](https://sequelize.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Postman Documentation](https://learning.postman.com)

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] PostgreSQL installed and running
- [ ] Database `buildmart_db` created
- [ ] Dependencies installed (`npm run install-all`)
- [ ] Environment files configured
- [ ] Frontend running on port 3000
- [ ] Backend running on port 5000
- [ ] API health check works
- [ ] Created test user account
- [ ] Can login successfully

---

## 🎉 You're Ready!

Now you have:
- ✅ Full-stack application running locally
- ✅ Database connected
- ✅ Frontend & Backend communicating
- ✅ API ready for testing

**Next Steps:**
1. Explore the frontend at http://localhost:3000
2. Test API endpoints with Postman
3. Start building features!

For more details, see:
- [Frontend README](./frontend/README.md)
- [Backend README](./backend/README.md)
