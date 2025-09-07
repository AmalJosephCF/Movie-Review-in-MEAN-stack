# 🎬 Movie Review in MEAN Stack (Angular + Node.js + MongoDB)

A full-stack web application built using the **MEAN stack** (MongoDB, Express.js, Angular, Node.js).  
This system allows users to **register, log in, submit movie posters/reviews**, and includes an **Admin Dashboard** for poster approvals and user management.  

---

## 📂 Project Structure

```bash
Form/                          # Root folder
├── backend/                   # Node.js + Express server
│   ├── db/                    # Database connection/config
│   ├── middleware/            # Custom middlewares
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── .env                   # Environment variables (ignored in Git)
│   ├── package.json           # Backend dependencies & scripts
│   └── server.js              # Main server entry point
│
├── frontend/ (Angular app)    # Angular frontend
│   └── src/app/               # Application modules & components
│       ├── admin-dashboard-navbar/
│       ├── admin.component/
│       ├── create-poster/
│       ├── forget-pass/       # OTP-based password reset
│       ├── home/
│       ├── login/
│       ├── navbar/
│       ├── register/
│       ├── user-dashboard-navbar/
│       ├── userlogin/
│       └── view-poster/
│
├── README.md                  # Documentation
└── .gitignore                 # Ignored files (node_modules, build, env, etc.)
```

---

## 🚀 Features

- 🔐 **Authentication & Authorization**
  - User registration & login  
  - Secure JWT-based authentication  
  - Role-based access control (Admin/User)  
  - OTP-based password reset  

- 🎭 **User Dashboard**
  - Create and manage movie posters/reviews  
  - View **only admin-approved posters**  
  - Profile management  

- 🎬 **Admin Dashboard**
  - Approve/Reject posters before publishing  
  - Manage registered users  
  - Change user roles (User ↔ Admin)  

- 🎨 **Modern Angular UI**
  - Responsive design  
  - Gradient backgrounds  
  - Role-specific navigation  
  - Smooth animations and transitions  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/AmalJosephCF/Movie-Review-in-MEAN-stack.git
cd Movie-Review-in-MEAN-stack
```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside **backend/** with:
```bash
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRES=1d
```

Run backend:
```bash
npm start
```

Backend will run on 👉 `http://localhost:5000`

---

### 3️⃣ Setup Angular Frontend
```bash
cd frontend
npm install
ng serve
```

Frontend will run on 👉 `http://localhost:4200`

---

## 📖 Usage

### 👤 For Users
1. Register a new account  
2. Login with your credentials  
3. Browse **admin-approved** movie posters  
4. Submit your own posters/reviews  
5. Reset password using OTP if needed  

### 🛡️ For Admins
1. Login with admin credentials  
2. Access the **Admin Dashboard**  
3. Approve/reject user-submitted posters  
4. Manage all registered users  
5. Change user roles (User ↔ Admin)  

---

## 🛠️ Tech Stack

- **Frontend:** Angular 20 / TypeScript / RxJS / CSS3  
- **Backend:** Node.js / Express.js  
- **Database:** MongoDB + Mongoose  
- **Authentication:** JWT & OTP (bcryptjs for password hashing)  
- **Validation:** express-validator  
- **Version Control:** Git + GitHub  

---

## 🔒 Security Features

- Password hashing with **bcrypt**  
- JWT token authentication  
- OTP verification for password reset  
- Role-based route protection  
- Input validation and sanitization  
- Protected API endpoints  

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Make your changes  
4. Test thoroughly  
5. Submit a pull request  

---

## 📜 License

This project is licensed under the **MIT License**.
