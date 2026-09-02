# Code Weave Planet

A comprehensive digital skills training platform built with React, featuring role-based authentication and full CRUD operations for courses, tutors, and students.

## 🚀 Features

### Three User Roles

#### 1. **Admin Dashboard**
- Full CRUD operations for courses (Create, Read, Update, Delete)
- Manage and approve tutors
- Monitor student enrollments
- View platform statistics
- Search and filter functionality

#### 2. **Tutor Portal**
- Create and manage courses
- Add/edit/delete lessons with ordering
- Set class schedules and WhatsApp group links
- Track student enrollment numbers
- Full course content management

#### 3. **Student Portal**
- Browse available courses
- Search courses by name, tutor, or description
- Enroll in courses
- Access WhatsApp class groups
- View enrolled courses and details

### 🔐 Authentication System
- Login with role-based access control
- Registration with validation
- Protected routes
- Persistent sessions using localStorage
- Context-based state management

## 📋 Demo Credentials

Use these credentials to test different user roles:

- **Admin**: admin@codeweave.com / admin123
- **Tutor**: tutor@codeweave.com / tutor123
- **Student**: student@codeweave.com / student123

## 🛠️ Tech Stack

- **React 19** - UI framework
- **React Router** - Navigation and routing
- **Lucide React** - Icon library
- **Vite** - Build tool
- **CSS3** - Styling (no CSS frameworks)

## 📦 Installation

Install dependencies:
```bash
npm install
```

## 🏃 Development

Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build for Production

Build the project:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## 🚀 Deploy to Vercel

### Option 1: Using Vercel CLI

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

### Option 2: Using Vercel Dashboard

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "New Project"

4. Import your repository

5. Vercel will auto-detect the Vite configuration

6. Click "Deploy"

Your app will be live in under a minute!

## 📁 Project Structure

```
Code-Weave Planet/
├── src/
│   ├── components/
│   │   ├── CodeWeavePlanetLanding.jsx  # Landing page
│   │   └── ProtectedRoute.jsx          # Route protection
│   ├── context/
│   │   └── AuthContext.jsx             # Authentication state
│   ├── images/
│   │   └── logo.svg                    # Logo
│   ├── pages/
│   │   ├── AdminDashboard.jsx          # Admin CRUD panel
│   │   ├── TutorDashboard.jsx          # Tutor course management
│   │   ├── StudentDashboard.jsx        # Student course browser
│   │   ├── Login.jsx                   # Login page
│   │   └── Register.jsx                # Registration page
│   ├── styles/
│   │   ├── auth.css                    # Auth page styles
│   │   └── dashboard.css               # Dashboard styles
│   ├── App.jsx                         # Main app with routing
│   ├── main.jsx                        # Entry point
│   └── index.css                       # Global styles
├── public/
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ✨ Key Features

### CRUD Operations
- **Create**: Add new courses, lessons, tutors, students
- **Read**: View all data in organized tables and cards
- **Update**: Edit existing courses and lessons
- **Delete**: Remove courses, lessons, or users with confirmation

### Data Persistence
- Uses localStorage for demo purposes
- All course enrollments persist across sessions
- User authentication state maintained

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interfaces

### User Experience
- Search functionality
- Filter by status
- Modal forms for data entry
- Confirmation dialogs for destructive actions
- Empty states with helpful messages

## 🎨 Courses Offered

- AI and Machine Learning
- Web Design with Vite.js
- System Development with PHP Laravel
- Digital Marketing
- Hosting Services
- Mobile App Development
- Desktop Applications

## 📞 Contact

**WhatsApp**: 0750937506

**Location**: Mbarara, Western Uganda

**WhatsApp Group**: Tech Over Ten with Polly

## 📝 License

This project is for Code Weave Planet - Digital Skills Training Platform

## 🔧 Environment Variables

No environment variables required! The app works out of the box.

## 🎯 Future Enhancements

- Backend API integration
- Real database (PostgreSQL/MongoDB)
- Payment integration
- Email notifications
- Video lesson uploads
- Progress tracking
- Certificates
- Chat system
- Mobile app (React Native)

## 🤝 Contributing

This is a training platform project. For inquiries, contact via WhatsApp.

---

Built with ❤️ by Code Weave Planet Team
