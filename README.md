# User Management System

A modern, secure user management system built with Angular frontend and Node.js backend with MongoDB.

## Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin/User)
- Protected routes with guards
- Session management

### 👥 User Management
- User registration and login
- Admin dashboard for user management
- Role assignment and modification
- User profile management

### 🎨 Modern UI/UX
- Responsive design with modern gradients
- Interactive animations and transitions
- Role-specific navigation
- Beautiful dashboard layouts

### 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Protected API endpoints

## Project Structure

```
├── backend/                 # Node.js + Express backend
│   ├── db/                 # Database connection
│   ├── middleware/         # Authentication & validation
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   └── server.js          # Main server file
├── reactForm/             # Angular frontend
│   ├── src/app/
│   │   ├── admin.component/    # Admin dashboard
│   │   ├── home/              # Landing page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── userlogin/         # User dashboard
│   │   ├── navbar/            # Navigation component
│   │   └── user.services.ts   # API service
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Angular CLI

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your-secret-key-here
JWT_EXPIRES=1d
PORT=5000
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd reactForm
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Usage

### For Users
1. **Register**: Create a new account with your details
2. **Login**: Sign in with your credentials
3. **Dashboard**: Access your personalized user dashboard
4. **Profile**: View and manage your account information

### For Admins
1. **Login**: Sign in with admin credentials
2. **Admin Dashboard**: Access the admin panel
3. **User Management**: View all registered users
4. **Role Management**: Change user roles between 'user' and 'admin'

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/check-username` - Check username availability
- `GET /api/auth/check-email` - Check email availability

### User Management (Admin Only)
- `GET /api/auth/users` - Get all users
- `PUT /api/auth/users/:userId/role` - Update user role

### User Profile
- `GET /api/auth/profile` - Get current user profile

## Features Implemented

### ✅ Admin Dashboard
- List all registered users
- Change user roles (user ↔ admin)
- Modern, responsive table design
- Real-time updates
- Success/error notifications

### ✅ Dynamic Navigation
- Different navbar content based on authentication status
- Role-specific navigation items
- User information display
- Logout functionality

### ✅ Modern UI/UX
- Gradient backgrounds and modern design
- Smooth animations and transitions
- Responsive layouts for all devices
- Interactive hover effects
- Professional color scheme

### ✅ Security
- JWT token authentication
- Role-based route protection
- Input validation
- Secure password handling

## Technologies Used

### Frontend
- **Angular 20** - Modern frontend framework
- **TypeScript** - Type-safe JavaScript
- **CSS3** - Modern styling with gradients and animations
- **RxJS** - Reactive programming

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

## Security Considerations

- Passwords are hashed using bcrypt
- JWT tokens for session management
- Input validation and sanitization
- Protected API endpoints
- Role-based access control
- CORS configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
