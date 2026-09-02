import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  GraduationCap,
  MessageCircle,
  LogOut,
  Search,
  Calendar,
  User,
  CheckCircle,
  ArrowRight,
  FileText
} from 'lucide-react';
import logo from '../images/logo.svg';

const AVAILABLE_COURSES = [
  {
    id: 1,
    name: 'AI and Machine Learning',
    tutor: 'Dr. Sarah Johnson',
    description: 'Build models that actually ship — from data cleaning to a working prediction API.',
    duration: '12 weeks',
    schedule: 'Mon, Wed, Fri - 6:00 PM',
    fee: '800,000 UGX',
    whatsappGroup: 'https://chat.whatsapp.com/ai-ml-class',
    enrolled: false
  },
  {
    id: 2,
    name: 'Web Design with Vite.js',
    tutor: 'Mike Chen',
    description: 'Fast, modern front ends. Component-driven builds you can deploy the same week you learn them.',
    duration: '8 weeks',
    schedule: 'Tue, Thu - 7:00 PM',
    fee: '600,000 UGX',
    whatsappGroup: 'https://chat.whatsapp.com/web-design-vite',
    enrolled: false
  },
  {
    id: 3,
    name: 'System Development with PHP Laravel',
    tutor: 'John Okello',
    description: 'Backend systems that hold up in production: auth, databases, APIs, admin dashboards.',
    duration: '10 weeks',
    schedule: 'Mon, Wed - 8:00 PM',
    fee: '700,000 UGX',
    whatsappGroup: 'https://chat.whatsapp.com/laravel-dev',
    enrolled: false
  },
  {
    id: 4,
    name: 'Digital Marketing',
    tutor: 'Grace Nakato',
    description: 'SEO, paid ads, and content strategy for businesses trying to be found online.',
    duration: '6 weeks',
    schedule: 'Sat - 3:00 PM',
    fee: '500,000 UGX',
    whatsappGroup: 'https://chat.whatsapp.com/digital-marketing',
    enrolled: false
  },
  {
    id: 5,
    name: 'Mobile App Development',
    tutor: 'David Mwesigwa',
    description: 'React Native and Flutter — one skill set, apps on both Android and iOS.',
    duration: '14 weeks',
    schedule: 'Tue, Thu, Sat - 5:00 PM',
    fee: '900,000 UGX',
    whatsappGroup: 'https://chat.whatsapp.com/mobile-dev',
    enrolled: false
  }
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('browse');
  const [courses, setCourses] = useState(AVAILABLE_COURSES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'student') {
      navigate('/');
      return;
    }
    setUser(parsedUser);

    // Load enrolled courses from localStorage
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    const updatedCourses = AVAILABLE_COURSES.map(course => ({
      ...course,
      enrolled: enrolledCourses.includes(course.id)
    }));
    setCourses(updatedCourses);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleEnroll = (courseId) => {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    
    if (!enrolledCourses.includes(courseId)) {
      enrolledCourses.push(courseId);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      
      const updatedCourses = courses.map(c =>
        c.id === courseId ? { ...c, enrolled: true } : c
      );
      setCourses(updatedCourses);
      
      alert('Successfully enrolled! Check your email for payment instructions.');
      setShowCourseDetail(false);
    }
  };

  const handleUnenroll = (courseId) => {
    if (confirm('Are you sure you want to unenroll from this course?')) {
      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      const updatedEnrolled = enrolledCourses.filter(id => id !== courseId);
      localStorage.setItem('enrolledCourses', JSON.stringify(updatedEnrolled));
      
      const updatedCourses = courses.map(c =>
        c.id === courseId ? { ...c, enrolled: false } : c
      );
      setCourses(updatedCourses);
    }
  };

  const openCourseDetail = (course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enrolledCourses = courses.filter(c => c.enrolled);
  const availableCourses = filteredCourses.filter(c => !c.enrolled);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          <h2>Student Portal</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === 'browse' ? 'active' : ''}
            onClick={() => setActiveTab('browse')}
          >
            <Search size={20} />
            Browse Courses
          </button>
          <button
            className={activeTab === 'enrolled' ? 'active' : ''}
            onClick={() => setActiveTab('enrolled')}
          >
            <GraduationCap size={20} />
            My Courses ({enrolledCourses.length})
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>
            {activeTab === 'browse' && 'Browse Available Courses'}
            {activeTab === 'enrolled' && 'My Enrolled Courses'}
          </h1>
        </header>

        <div className="dashboard-content">
          {/* Browse Courses Tab */}
          {activeTab === 'browse' && (
            <>
              <div className="content-header">
                <div className="search-bar">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search courses by name, tutor, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="course-grid">
                {availableCourses.length === 0 ? (
                  <div className="empty-state">
                    <BookOpen size={48} />
                    <p>No courses found matching your search.</p>
                  </div>
                ) : (
                  availableCourses.map(course => (
                    <div key={course.id} className="course-card-student">
                      <div className="course-card-body">
                        <h3>{course.name}</h3>
                        <p className="course-tutor">
                          <User size={16} />
                          {course.tutor}
                        </p>
                        <p className="course-description">{course.description}</p>
                        
                        <div className="course-info">
                          <div className="info-item">
                            <Calendar size={16} />
                            <span>{course.duration}</span>
                          </div>
                          <div className="info-item">
                            <FileText size={16} />
                            <span>{course.schedule}</span>
                          </div>
                        </div>

                        <div className="course-fee">{course.fee}</div>
                      </div>

                      <div className="course-card-footer">
                        <button
                          className="btn-secondary"
                          onClick={() => openCourseDetail(course)}
                        >
                          View Details
                          <ArrowRight size={16} />
                        </button>
                        <button
                          className="btn-primary"
                          onClick={() => handleEnroll(course.id)}
                        >
                          <CheckCircle size={16} />
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {/* Enrolled Courses Tab */}
          {activeTab === 'enrolled' && (
            <>
              {enrolledCourses.length === 0 ? (
                <div className="empty-state">
                  <GraduationCap size={48} />
                  <p>You haven't enrolled in any courses yet.</p>
                  <button
                    className="btn-primary"
                    onClick={() => setActiveTab('browse')}
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="enrolled-courses-list">
                  {enrolledCourses.map(course => (
                    <div key={course.id} className="enrolled-course-card">
                      <div className="enrolled-header">
                        <div>
                          <h3>{course.name}</h3>
                          <p className="course-tutor">
                            <User size={16} />
                            Tutor: {course.tutor}
                          </p>
                        </div>
                        <span className="enrolled-badge">
                          <CheckCircle size={16} />
                          Enrolled
                        </span>
                      </div>

                      <p className="course-description">{course.description}</p>

                      <div className="enrolled-info">
                        <div className="info-item">
                          <Calendar size={16} />
                          <span>Duration: {course.duration}</span>
                        </div>
                        <div className="info-item">
                          <FileText size={16} />
                          <span>Schedule: {course.schedule}</span>
                        </div>
                      </div>

                      <div className="enrolled-actions">
                        <a
                          href={course.whatsappGroup}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary"
                        >
                          <MessageCircle size={16} />
                          Join WhatsApp Class
                        </a>
                        <button
                          className="btn-secondary"
                          onClick={() => openCourseDetail(course)}
                        >
                          Course Details
                        </button>
                        <button
                          className="btn-danger-outline"
                          onClick={() => handleUnenroll(course.id)}
                        >
                          Unenroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Course Detail Modal */}
      {showCourseDetail && selectedCourse && (
        <div className="modal-overlay" onClick={() => setShowCourseDetail(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCourse.name}</h2>
              <button className="btn-icon" onClick={() => setShowCourseDetail(false)}>
                <LogOut size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="course-detail-section">
                <h3>
                  <User size={20} />
                  Instructor
                </h3>
                <p>{selectedCourse.tutor}</p>
              </div>

              <div className="course-detail-section">
                <h3>
                  <FileText size={20} />
                  Course Description
                </h3>
                <p>{selectedCourse.description}</p>
              </div>

              <div className="course-detail-grid">
                <div className="course-detail-section">
                  <h3>
                    <Calendar size={20} />
                    Duration
                  </h3>
                  <p>{selectedCourse.duration}</p>
                </div>

                <div className="course-detail-section">
                  <h3>
                    <Calendar size={20} />
                    Schedule
                  </h3>
                  <p>{selectedCourse.schedule}</p>
                </div>
              </div>

              <div className="course-detail-section">
                <h3>Course Fee</h3>
                <p className="course-fee-large">{selectedCourse.fee}</p>
              </div>

              {selectedCourse.enrolled && (
                <div className="course-detail-section whatsapp-section">
                  <h3>
                    <MessageCircle size={20} />
                    WhatsApp Class Group
                  </h3>
                  <a
                    href={selectedCourse.whatsappGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    <MessageCircle size={16} />
                    Join WhatsApp Group
                  </a>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {!selectedCourse.enrolled ? (
                <button
                  className="btn-primary btn-large"
                  onClick={() => handleEnroll(selectedCourse.id)}
                >
                  <CheckCircle size={18} />
                  Enroll in This Course
                </button>
              ) : (
                <button className="btn-secondary btn-large" onClick={() => setShowCourseDetail(false)}>
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
