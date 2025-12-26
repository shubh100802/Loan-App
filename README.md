# Loan Management System

A comprehensive full-stack web application for managing loan applications with user and admin interfaces, built with Node.js, Express, MongoDB, and a modern frontend. Now featuring an intelligent chatbot assistant and enhanced security features.

## 🚀 Features

### User Features
- 🔒 Secure user registration and authentication with JWT
- ✉️ Email verification with OTP (One-Time Password)
- 🤖 AI-powered chatbot for instant support
- 📝 Secure loan application submission
- 🔄 Real-time application status tracking
- 👤 Profile management with document upload
- 📱 Responsive design for all devices
- 💬 In-app notifications
- 📊 Interactive EMI calculator

### Admin Features
- 📊 Comprehensive dashboard with real-time analytics
- 👥 Advanced user management system
- 📑 Loan application processing with document verification
- ⚙️ Loan type configuration and management
- 🔄 Application status management with audit trail
- 📈 Performance metrics and reporting
- 📧 Bulk email notifications
- 🔒 Role-based access control

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
│   ├── business-application.html # Business loan application
│   ├── dashboard.html      # User dashboard
│   ├── loan-type.html      # Browse loan types
│   └── profile.html        # User profile
├── chatbot/                # AI Chatbot
│   ├── chatbot.html        # Chatbot interface
│   ├── chatbot.js          # Chatbot logic
│   └── chatbot.css         # Chatbot styles
├── css/                    # Stylesheets
├── js/                     # Client-side scripts
│   └── api-fix.js          # API utilities and fixes
├── t&c/                    # Legal pages
│   ├── privacy-policy.html
│   └── terms-and-conditions.html
└── *.html                  # Main pages
```

### Backend (`/backend`)
```
backend/
├── config/                 # Configuration
│   └── db.js              # Database configuration
├── controllers/            # Request handlers
│   ├── adminController.js  # Admin operations
│   ├── applicationController.js # Application handling
│   ├── authController.js   # Authentication logic
│   ├── loanController.js   # Loan operations
│   └── userController.js   # User management
├── middleware/            # Custom middleware
│   ├── auth.js            # Authentication
│   ├── error.js           # Error handling
│   └── upload.js          # File uploads
├── models/                # Database models
│   ├── Application.js     # Loan applications
│   ├── Loan.js           # Loan types
│   ├── User.js           # User accounts
│   └── index.js          # Model exports
├── routes/                # API routes
│   ├── adminRoutes.js     # Admin endpoints
│   ├── applicationRoutes.js # Application endpoints
│   ├── authRoutes.js      # Authentication endpoints
│   ├── loanRoutes.js      # Loan endpoints
│   └── userRoutes.js      # User endpoints
├── seed/                  # Database seeders
│   └── seed.js           # Initial data
├── utils/                 # Utility functions
│   └── emailService.js    # Email handling
├── .env                  # Environment variables
└── server.js             # Main server file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm (v8+) or yarn
- MongoDB Atlas account (or local MongoDB v5+)
- SMTP server credentials (for email verification)
- Google reCAPTCHA v3 keys (for security)

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
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
EMAIL_FROM=your_email@gmail.com

# Security
RATE_LIMIT_WINDOW_MS=15*60*1000  # 15 minutes
RATE_LIMIT_MAX=100

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your_recaptcha_secret
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user with email verification
- `POST /api/auth/login` - User login with JWT
- `POST /api/auth/verify-otp` - Verify email with OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - User logout

### User
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile
- `POST /api/users/upload-document` - Upload user documents
- `GET /api/users/documents` - Get user documents

### Applications
- `GET /api/applications` - Get all/user's applications
- `POST /api/applications` - Create new application
- `GET /api/applications/:id` - Get application details
- `PUT /api/applications/:id` - Update application
- `PUT /api/applications/:id/status` - Update status (admin)
- `POST /api/applications/:id/documents` - Upload application documents

### Chatbot
- `POST /api/chat` - Process chatbot messages
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/rate` - Rate chatbot response

### Admin
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/analytics` - Get analytics data

## 🔧 Development

### Running in Development
```bash
# Install dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Frontend
# Open loan-app/ in your web server or use Live Server in VSCode
```

### Environment Setup
1. Create a `.env` file in the backend directory
2. Copy the environment variables from `.env.example`
3. Update with your configuration
4. For production, set `NODE_ENV=production`

### Building for Production
```bash
# Install production dependencies
cd backend
npm ci --only=production

# Set environment to production
export NODE_ENV=production

# Start production server
npm start

# For PM2 (recommended for production)
npm install -g pm2
pm2 start server.js --name "loan-app"

# Enable auto-restart on reboot
pm2 startup
pm2 save
```

## 🤖 Chatbot Features
- Natural language processing for user queries
- Context-aware responses
- Support for multiple languages
- Integration with loan application process
- FAQ and help documentation access
- Sentiment analysis for better support
- Conversation history tracking

## 🔒 Security Features
- Rate limiting
- Helmet.js for secure headers
- Data sanitization
- XSS protection
- CSRF protection
- Secure HTTP headers
- Input validation
- Session management
- Password hashing with bcrypt

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For support, email [shubhamraj100802@gmail.com](mailto:shubhamraj100802@gmail.com)

---

<div align="center">
  Made with ❤️ and GPT By Shubh
</div>
