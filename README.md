# AttendEase 🎓  
A full-stack Attendance Management System built using the **MERN stack**.

AttendEase allows teachers to create subjects and mark attendance, while students can securely log in and track their attendance subject-wise with percentages — all in a modern, Spotify-themed UI.

---

## 🚀 Live Demo

- **Frontend (Vercel):**  
  https://attendace-tracker-kappa-two.vercel.app/

- **Backend (Render):**  
  https://attendease-backend-riez.onrender.com/

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication

### Deployment
- Frontend: **Vercel**
- Backend: **Render**
- Database: **MongoDB Atlas**

---

## ✨ Features

### 👨‍🏫 Teacher
- Secure login & registration
- Create subjects (batch & semester specific)
- View assigned subjects
- Mark attendance for students
- Prevent duplicate attendance for the same subject on the same day
- Spotify-themed dark UI

### 👨‍🎓 Student
- Secure login & registration
- View subject-wise attendance
- Attendance percentage calculation
- Present dates tracking
- Clean and responsive dashboard

### 🔐 Authentication
- JWT-based authentication
- Role-based access (Teacher / Student)
- Protected routes

---

## 🧪 API Endpoints (Sample)

# Auth
-POST /api/auth/register

-POST /api/auth/login

# Subjects
-POST /api/subjects

-GET /api/subjects/teacher

# Attendance
-POST /api/attendance/mark

-GET /api/attendance/student

## 👨‍💻 Author

# Sanoj Shreyas Deo
# Final-year B.Tech (CSE)
# SOA University
