import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  LogOut,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Search
} from 'lucide-react';
import logo from '../images/logo.svg';

// Mock initial data
const INITIAL_COURSES = [
  { id: 1, name: 'AI and Machine Learning', tutor: 'Dr. Sarah Johnson', students: 45, status: 'active' },
  { id: 2, name: 'Web Design with Vite.js', tutor: 'Mike Chen', students: 78, status: 'active' },
  { id: 3, name: 'System Development with PHP Laravel', tutor: 'John Okello', students: 34, status: 'active' },
  { id: 4, name: 'Digital Marketing', tutor: 'Grace Nakato', students: 56, status: 'active' },
];

const INITIAL_TUTORS = [
  { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah@codeweave.com', courses: 2, status: 'approved' },
  { id: 2, name: 'Mike Chen', email: 'mike@codeweave.com', courses: 1, status: 'approved' },
  { id: 3, name: 'John Okello', email: 'john@codeweave.com', courses: 1, status: 'pending' },
];

const INITIAL_STUDENTS = [
  { id: 1, name: 'Alice Nambi', email: 'alice@student.com', enrolled: 3, joinDate: '2026-08-15' },
  { id: 2, name: 'Peter Mugisha', email: 'peter@student.com', enrolled: 2, joinDate: '2026-08-20' },
  { id: 3, name: 'Mary Akello', email: 'mary@student.com', enrolled: 4, joinDate: '2026-08-10' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [tutors, setTutors] = useState(INITIAL_TUTORS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'add-course', 'edit-course'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      navigate('/');
      return;
    }
    setUser(parsedUser);

    // Load saved data from localStorage
    const savedCourses = localStorage.getItem('courses');
    if (savedCourses) setCourses(JSON.parse(savedCourses));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  // Course CRUD operations
  const openAddCourseModal = () => {
    setModalType('add-course');
    setFormData({ name: '', tutor: '', description: '', duration: '', fee: '', status: 'active' });
    setShowModal(true);
  };

  const openEditCourseModal = (course) => {
    setModalType('edit-course');
    setSelectedItem(course);
    setFormData(course);
    setShowModal(true);
  };

  const handleSaveCourse = () => {
    if (modalType === 'add-course') {
      const newCourse = {
        ...formData,
        id: Date.now(),
        students: 0
      };
      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
    } else if (modalType === 'edit-course') {
      const updatedCourses = courses.map(c => 
        c.id === selectedItem.id ? { ...c, ...formData } : c
      );
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
    }
    setShowModal(false);
  };

  const handleDeleteCourse = (id) => {
    if (confirm('Are you sure you want to delete this course?')) {
      const updatedCourses = courses.filter(c => c.id !== id);
      setCourses(updatedCourses);
      localStorage.setItem('courses', JSON.stringify(updatedCourses));
    }
  };

  // Tutor CRUD operations
  const handleApproveTutor = (id) => {
    const updatedTutors = tutors.map(t =>
      t.id === id ? { ...t, status: 'approved' } : t
    );
    setTutors(updatedTutors);
  };

  const handleDeleteTutor = (id) => {
    if (confirm('Are you sure you want to remove this tutor?')) {
      setTutors(tutors.filter(t => t.id !== id));
    }
  };

  // Student CRUD operations
  const handleDeleteStudent = (id) => {
    if (confirm('Are you sure you want to remove this student?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tutor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTutors = tutors.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo" className="sidebar-logo" />
          <h2>Admin Panel</h2>
        </div>

        <nav className="sidebar-nav">
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={20} />
            Overview
          </button>
          <button
            className={activeTab === 'courses' ? 'active' : ''}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={20} />
            Courses
          </button>
          <button
            className={activeTab === 'tutors' ? 'active' : ''}
            onClick={() => setActiveTab('tutors')}
          >
            <UserCheck size={20} />
            Tutors
          </button>
          <button
            className={activeTab === 'students' ? 'active' : ''}
            onClick={() => setActiveTab('students')}
          >
            <Users size={20} />
            Students
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
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'courses' && 'Manage Courses'}
            {activeTab === 'tutors' && 'Manage Tutors'}
            {activeTab === 'students' && 'Manage Students'}
          </h1>
        </header>

        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-grid">
              <div className="stat-card">
                <BookOpen size={32} color="#22D3EE" />
                <h3>{courses.length}</h3>
                <p>Total Courses</p>
              </div>
              <div className="stat-card">
                <UserCheck size={32} color="#D4AF37" />
                <h3>{tutors.length}</h3>
                <p>Active Tutors</p>
              </div>
              <div className="stat-card">
                <Users size={32} color="#22D3EE" />
                <h3>{students.length}</h3>
                <p>Enrolled Students</p>
              </div>
              <div className="stat-card">
                <UserCheck size={32} color="#F59E0B" />
                <h3>{tutors.filter(t => t.status === 'pending').length}</h3>
                <p>Pending Approvals</p>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <>
              <div className="content-header">
                <div className="search-bar">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="btn-primary" onClick={openAddCourseModal}>
                  <Plus size={18} />
                  Add Course
                </button>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Tutor</th>
                      <th>Students</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map(course => (
                      <tr key={course.id}>
                        <td>{course.name}</td>
                        <td>{course.tutor}</td>
                        <td>{course.students}</td>
                        <td>
                          <span className={`status-badge ${course.status}`}>
                            {course.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => openEditCourseModal(course)}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => handleDeleteCourse(course.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Tutors Tab */}
          {activeTab === 'tutors' && (
            <>
              <div className="content-header">
                <div className="search-bar">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search tutors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Courses</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTutors.map(tutor => (
                      <tr key={tutor.id}>
                        <td>{tutor.name}</td>
                        <td>{tutor.email}</td>
                        <td>{tutor.courses}</td>
                        <td>
                          <span className={`status-badge ${tutor.status}`}>
                            {tutor.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            {tutor.status === 'pending' && (
                              <button
                                className="btn-sm success"
                                onClick={() => handleApproveTutor(tutor.id)}
                              >
                                Approve
                              </button>
                            )}
                            <button
                              className="btn-icon danger"
                              onClick={() => handleDeleteTutor(tutor.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <>
              <div className="content-header">
                <div className="search-bar">
                  <Search size={18} />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Enrolled Courses</th>
                      <th>Join Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.enrolled}</td>
                        <td>{student.joinDate}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon danger"
                              onClick={() => handleDeleteStudent(student.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modal for Add/Edit Course */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalType === 'add-course' ? 'Add New Course' : 'Edit Course'}</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
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
                <label>Tutor</label>
                <input
                  type="text"
                  value={formData.tutor || ''}
                  onChange={(e) => setFormData({ ...formData, tutor: e.target.value })}
                  placeholder="Tutor name"
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

              <div className="form-row">
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 8 weeks"
                  />
                </div>

                <div className="form-group">
                  <label>Fee (UGX)</label>
                  <input
                    type="text"
                    value={formData.fee || ''}
                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                    placeholder="e.g., 500000"
                  />
                </div>
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
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveCourse}>
                <Save size={18} />
                Save Course
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
