# Code Weave Planet

A modern digital skills training platform built with React and Supabase, featuring permanent user profiles, role-based dashboards, and complete workflows for Students, Tutors, and Administrators.

**Live Deployment**: [https://code-weave-planet-main.vercel.app](https://code-weave-planet-main.vercel.app)

## 🚀 Portals & Features

### 1. **Student Portal (`/student`)**
- Browse available courses
- Submit course application form (name, email, phone, motivation)
- Real-time application status tracker (`pending`, `approved`, `rejected`)
- "My Courses" area with completion indicators (`enrolled`, `completed`)
- Access study materials and resource links posted by course tutors

### 2. **Tutor Dashboard (`/tutor`)**
- Create and manage courses
- Course student roster with **live online/offline indicators**
- Filter students by `enrolled`, `completed`, and `dropped`
- Add student directly or remove/drop enrolled students
- Mark student course completion status
- Post and manage resource links for enrolled students
- Review course applications and approve/reject them

### 3. **Admin Dashboard (`/admin`)**
- Real-time platform metrics: total students, tutors, active courses, and online users count
- Full course CRUD management across the platform
- Review all course applications and enrollments
- Manage student and tutor accounts (change roles, suspend, activate, delete)
- Full visibility and control over platform resources

### 🔐 Authentication & Supabase Database
- Supabase Auth with PKCE and automatic profile generation trigger
- Row Level Security (RLS) policies protecting student, tutor, and admin data
- Role-based redirect routing via `/auth/callback`

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
