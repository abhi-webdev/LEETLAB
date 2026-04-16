# 🧠 LeetLab — Full Stack Coding Platform

LeetLab is a **full-stack coding platform** inspired by LeetCode, where users can solve problems, run code in multiple languages, and track their progress.

It supports **real-time code execution**, secure authentication, and a scalable architecture using modern web technologies.

---

# 🚀 Live Demo

- 🌐 Frontend: https://leetlab-eta.vercel.app  
- ⚙️ Backend: https://leetlab-zb7s.onrender.com  

---

# ✨ Features

## 🔐 Authentication
- Secure JWT-based authentication
- HTTP-only cookies for session management
- Signup / Login / Logout flow

## 💻 Code Execution
- Run code in multiple languages:
  - JavaScript
  - Python
  - Java
- Integrated with Judge0 API
- Real-time output display

## 📚 Problem System
- Create and manage coding problems
- Difficulty levels (Easy, Medium, Hard)
- Tags & constraints
- Example test cases

## 🧪 Submission System
- Run against multiple test cases
- Validate outputs
- Track submissions

## 📂 Playlist Feature
- Organize problems into playlists
- Structured learning paths

## 🎨 Modern UI
- Monaco Code Editor
- Responsive UI
- Clean and minimal design

---

# 🏗️ Tech Stack

## Frontend
- React (Vite)
- Axios
- Monaco Editor

## Backend
- Node.js
- Express.js
- Prisma ORM

## Database
- PostgreSQL (Neon)

## Deployment
- Frontend → Vercel  
- Backend → Render  
- Database → Neon  

## Code Execution
- Judge0 Public API

---

# 📁 Project Structure

```
LEETLAB/
│
├── frontend/
├── backend/
├── judge0/
└── README.md
```

---

# ⚙️ Environment Variables

## Backend (.env)

```
PORT=8080
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_secret_key
CLIENT_URL=https://your-frontend-url
JUDGE0_API_URL=https://ce.judge0.com
```

## Frontend (.env)

```
VITE_API_URL=https://your-backend-url
```

---

# 🛠️ Installation & Setup

## Clone Repository
```
git clone https://github.com/abhi-webdev/LEETLAB.git
cd LEETLAB
```

## Backend Setup
```
cd backend
npm install
npx prisma generate
npx prisma db push
npm start
```

## Frontend Setup
```
cd frontend
npm install
npm run dev
```

---

# 🔒 Security

- HTTP-only cookies
- CORS configured
- Environment variables for secrets
- Password hashing using bcrypt

---

# 🚧 Future Improvements

- Leaderboard system  
- Code editor themes  
- Submission history UI  
- Discussion section  

---

# 🙌 Author

**Abhimanyu Prajapati**  
GitHub: https://github.com/abhi-webdev  

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!
