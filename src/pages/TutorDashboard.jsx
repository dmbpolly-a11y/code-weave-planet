import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  MessageCircle,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  FileText,
  Link as LinkIcon,
  Calendar
} from 'lucide-react';
import logo from '../images/logo.svg';

const INITIAL_TUTOR_COURSES = [
  {
    id: 1,
    name: 'Web Design with Vite.js',
    students: 78,
    lessons: 12,
    whatsappGroup: 'https://chat.whatsapp.com/xyz123',
    description: 'Modern web development with Vite',
    schedule: 'Mon, Wed, Fri - 7:00 PM',
    status: 'active'
  },
  {
    id: 2,
    name: 'Advanced JavaScript',
    students: 45,
    lessons: 8,
    whatsappGroup: 'https://chat.whatsapp.com/abc456',
    description: 'Deep dive into JavaScript concepts',
    schedule: 'Tue, Thu - 6:00 PM',
    status: 'active'
  }
];

const INITIAL_LESSONS = [
  { id: 1, courseId: 1, title: 'Introduction to Vite', content: 'Getting started...', order: 1 },
  { id: 2, courseId: 1, title: 'Component Basics', content: 'Building components...', order: 2 },
  { id: 3, courseId: 1, title: 'State Management', content: 'Managing state...', order: 3 },
];

export default function TutorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('courses');
  const [courses, setCourses] = useState(INITIAL_TUTOR_COURSES);
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add-course', 'edit-course', 'add-lesson', 'edit-lesson'
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'tutor') {
      navigate('/');
      return;
    }
    setUser(parsedUser);

    // Load saved data
    const savedCourses = localStorage.getItem('tutorCourses');
    if (savedCourses) setCourses(JSON.parse(savedCourses));
    
    const savedLessons = localStorage.getItem('tutorLessons');
    if (savedLessons) setLessons(JSON.parse(savedLessons));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Course CRUD
  const openAddCourseModal = () => {
    setModalType('add-course');
    setFormData({
      name: '',
      description: '',
      schedule: '',
      whatsappGroup: '',
      status: 'active'
    });
    setShowModal(true);
  };

  const openEditCourseModal = (course) => {
    setModalType('edit-course');
    setSelectedCourse(course);
    setFormData(course);
    setShowModal(true);
  };

  const handleSaveCourse = () => {
    if (modalType === 'add-course') {
      const newCourse = {
        ...formData,
        id: Date.now(),
        students: 0,
        lessons: 0
      };
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      localStorage.setItem('tutorCourses', JSON.stringify(updatedCourses));
    } else if (modalType === 'edit-course') {
      const updatedCourses = courses.map(c =>
        c.id === selectedCourse.id ? { ...c, ...formData } : c
      );
      setCourses(updatedCourses);
      localStorage.setItem('tutorCourses', JSON.stringify(updatedCourses));
    }
    setShowModal(false);
  };

  const handleDeleteCourse = (id) => {
    if (confirm('Are you sure you want to delete this course? All lessons will be removed.')) {
      const updatedCourses = courses.filter(c => c.id !== id);
      setCourses(updatedCourses);
      localStorage.setItem('tutorCourses', JSON.stringify(updatedCourses));
      
      // Remove associated lessons
      const updatedLessons = lessons.filter(l => l.courseId !== id);
      setLessons(updatedLessons);
      localStorage.setItem('tutorLessons', JSON.stringify(updatedLessons));
    }
  };

  // Lesson CRUD
  const openAddLessonModal = (course) => {
    setModalType('add-lesson');
    setSelectedCourse(course);
    const courseLessons = lessons.filter(l => l.courseId === course.id);
    setFormData({
      title: '',
      content: '',
      resources: '',
      order: courseLessons.length + 1
    });
    setShowModal(true);
  };

  const openEditLessonModal = (lesson) => {
    setModalType('edit-lesson');
    setFormData(lesson);
    setShowModal(true);
  };

  const handleSaveLesson = () => {
    if (modalType === 'add-lesson') {
      const newLesson = {
        ...formData,
        id: Date.now(),
        courseId: selectedCourse.id
      };
      const updatedLessons = [...lessons, newLesson];
      setLessons(updatedLessons);
      localStorage.setItem('tutorLessons', JSON.stringify(updatedLessons));

      // Update course lesson count
      const updatedCourses = courses.map(c =>
        c.id === selectedCourse.id ? { ...c, lessons: c.lessons + 1 } : c
      );
      setCourses(updatedCourses);
      localStorage.setItem('tutorCourses', JSON.stringify(updatedCourses));
    } else if (modalType === 'edit-lesson') {
      const updatedLessons = lessons.map(l =>
        l.id === formData.id ? { ...formData } : l
      );
      setLessons(updatedLessons);
      localStorage.setItem('tutorLessons', JSON.stringify(updatedLessons));
    }
    setShowModal(false);
  };

  const handleDeleteLesson = (lessonId, courseId) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      const updatedLessons = lessons.filter(l => l.id !== lessonId);
      setLessons(updatedLessons);
      localStorage.setItem('tutorLessons', JSON.stringify(updatedLessons));

      // Update course lesson count
      const updatedCourses = courses.map(c =>
        c.id === courseId ? { ...c, lessons: c.lessons - 1 } : c
      );
      setCourses(updatedCourses);
      localStorage.setItem('tutorCourses', JSON.stringify(updatedCourses));
    }
  };

  const getCourseLessons = (courseId) => {
    return lessons.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          <h2>Tutor Portal</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === 'courses' ? 'active' : ''}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={20} />
            My Courses
          </button>
          <button
            className={activeTab === 'lessons' ? 'active' : ''}
            onClick={() => setActiveTab('lessons')}
          >
            <FileText size={20} />
            Lessons
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
            {activeTab === 'courses' && 'My Courses'}
            {activeTab === 'lessons' && 'Course Lessons'}
          </h1>
        </header>

        <div className="dashboard-content">
          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <>
              <div className="content-header">
                <button className="btn-primary" onClick={openAddCourseModal}>
                  <Plus size={18} />
                  Add New Course
                </button>
              </div>

              <div className="course-grid">
                {courses.map(course => (
                  <div key={course.id} className="course-card-tutor">
                    <div className="course-card-header">
                      <h3>{course.name}</h3>
                      <div className="course-actions">
                        <button
                          className="btn-icon"
                          onClick={() => openEditCourseModal(course)}
                          title="Edit course"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDeleteCourse(course.id)}
                          title="Delete course"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="course-description">{course.description}</p>

                    <div className="course-stats">
                      <div className="stat-item">
                        <Users size={18} />
                        <span>{course.students} students</span>
                      </div>
                      <div className="stat-item">
                        <FileText size={18} />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="stat-item">
                        <Calendar size={18} />
                        <span>{course.schedule}</span>
                      </div>
                    </div>

                    {course.whatsappGroup && (
                      <a
                        href={course.whatsappGroup}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="whatsapp-link"
                      >
                        <MessageCircle size={16} />
                        WhatsApp Group
                      </a>
                    )}

                    <button
                      className="btn-secondary btn-block"
                      onClick={() => {
                        setSelectedCourse(course);
                        setActiveTab('lessons');
                      }}
                    >
                      <FileText size={16} />
                      Manage Lessons
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Lessons Tab */}
          {activeTab === 'lessons' && (
            <>
              <div className="content-header">
                <div className="course-selector">
                  <label>Select Course:</label>
                  <select
                    value={selectedCourse?.id || ''}
                    onChange={(e) => {
                      const course = courses.find(c => c.id === parseInt(e.target.value));
                      setSelectedCourse(course);
                    }}
                    className="form-select"
                  >
                    <option value="">Choose a course...</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                {selectedCourse && (
                  <button
                    className="btn-primary"
                    onClick={() => openAddLessonModal(selectedCourse)}
                  >
                    <Plus size={18} />
                    Add Lesson
                  </button>
                )}
              </div>

              {selectedCourse ? (
                <div className="lessons-list">
                  {getCourseLessons(selectedCourse.id).length === 0 ? (
                    <div className="empty-state">
                      <FileText size={48} />
                      <p>No lessons yet. Add your first lesson!</p>
                    </div>
                  ) : (
                    getCourseLessons(selectedCourse.id).map(lesson => (
                      <div key={lesson.id} className="lesson-card">
                        <div className="lesson-header">
                          <div className="lesson-order">#{lesson.order}</div>
                          <h3>{lesson.title}</h3>
                          <div className="lesson-actions">
                            <button
                              className="btn-icon"
                              onClick={() => openEditLessonModal(lesson)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => handleDeleteLesson(lesson.id, lesson.courseId)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="lesson-content">{lesson.content}</p>
                        {lesson.resources && (
                          <div className="lesson-resources">
                            <LinkIcon size={14} />
                            <span>Resources: {lesson.resources}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <BookOpen size={48} />
                  <p>Select a course to manage its lessons</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Modal for Course/Lesson */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === 'add-course' && 'Add New Course'}
                {modalType === 'edit-course' && 'Edit Course'}
                {modalType === 'add-lesson' && 'Add New Lesson'}
                {modalType === 'edit-lesson' && 'Edit Lesson'}
              </h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {(modalType === 'add-course' || modalType === 'edit-course') && (
                <>
                  <div className="form-group">
                    <label>Course Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Advanced React Development"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Course description..."
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label>Class Schedule</label>
                    <input
                      type="text"
                      value={formData.schedule || ''}
                      onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                      placeholder="e.g., Mon, Wed, Fri - 7:00 PM"
                    />
                  </div>

                  <div className="form-group">
                    <label>WhatsApp Group Link</label>
                    <input
                      type="url"
                      value={formData.whatsappGroup || ''}
                      onChange={(e) => setFormData({ ...formData, whatsappGroup: e.target.value })}
                      placeholder="https://chat.whatsapp.com/..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={formData.status || 'active'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="form-select"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {(modalType === 'add-lesson' || modalType === 'edit-lesson') && (
                <>
                  <div className="form-group">
                    <label>Lesson Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Introduction to Components"
                    />
                  </div>

                  <div className="form-group">
                    <label>Lesson Content</label>
                    <textarea
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Lesson content, instructions, notes..."
                      rows="6"
                    />
                  </div>

                  <div className="form-group">
                    <label>Resources (optional)</label>
                    <input
                      type="text"
                      value={formData.resources || ''}
                      onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                      placeholder="Links to materials, videos, etc."
                    />
                  </div>

                  <div className="form-group">
                    <label>Lesson Order</label>
                    <input
                      type="number"
                      value={formData.order || 1}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={modalType.includes('course') ? handleSaveCourse : handleSaveLesson}
              >
                <Save size={18} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
