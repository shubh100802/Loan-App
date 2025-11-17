# Loan Management System

A full-stack web application for managing loan applications with user and admin interfaces, built with Node.js, Express, MongoDB, and a modern frontend.

## 🚀 Features

### User Features
- User registration and authentication with JWT
- Email verification with OTP
- Secure loan application submission
- Real-time application status tracking
- Profile management
- Responsive design for all devices

### Admin Features
- Comprehensive dashboard with analytics
- User management system
- Loan application processing
- Loan type configuration
- Application status management

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript
- Tailwind CSS for modern UI
- Font Awesome for icons
- Responsive and accessible design

### Backend
- Node.js with Express.js
- MongoDB Atlas (Cloud Database)
- JWT for secure authentication
- Nodemailer for email notifications
- Environment-based configuration

## 📂 Project Structure

### Frontend (`/loan-app`)
```
loan-app/
├── admin/                  # Admin interface
│   ├── applications.html   # Manage loan applications
│   ├── index.html          # Admin dashboard
│   ├── loan-types.html     # Configure loan types
│   ├── users.html          # User management
│   └── view-user.html      # User details
├── user/                   # User interface
│   ├── application.html    # Loan application form
│   ├── applications.html   # User's applications
│   ├── dashboard.html      # User dashboard
│   ├── loan-type.html      # Browse loan types
│   └── profile.html        # User profile
├── css/                    # Stylesheets
├── js/                     # Client-side scripts
└── *.html                  # Main pages
```

### Backend (`/backend`)
```
backend/
├── config/                 # Configuration
├── controllers/            # Request handlers
├── middleware/             # Custom middleware
├── models/                 # Database models
├── routes/                 # API routes
│   └── authRoutes.js       # Authentication
├── .env                   # Environment variables
└── server.js              # Main server file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open the `loan-app` directory in your web server
2. The frontend will automatically connect to the backend API

## 🔒 Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify email with OTP
- `POST /api/auth/logout` - User logout

### User
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Applications
- `GET /api/applications` - Get all/user's applications
- `POST /api/applications` - Create new application
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id/status` - Update status (admin)

## 🔧 Development

### Running in Development
```bash
# Backend
cd backend
npm run dev

# Frontend
# Open loan-app/ in your web server
```

### Building for Production
```bash
# Install dependencies
cd backend
npm install --production

# Start production server
npm start
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For support, email [shubhamraj100802@gmail.com](mailto:shubhamraj100802@gmail.com)

---

<div align="center">
  Made with ❤️ and GPT By Shubh
</div>
